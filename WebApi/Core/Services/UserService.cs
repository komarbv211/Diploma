using AutoMapper;
using Core.DTOs.PaginationDTOs;
using Core.DTOs.ProductsDTO;
using Core.DTOs.UsersDTO;
using Core.DTOs.UsersDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Core.Models.Authentication;
using Infrastructure.Entities;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.Models;
using System.Net;
using System.Security.Claims;
using WebApiDiploma.Pagination;

namespace Core.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<UserEntity> _repository;
        private readonly IMapper _mapper;
        private readonly IJwtService _jwtService;
        private readonly IImageService _imageService;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IAccountService _accountService;
        public UserService(UserManager<UserEntity> userManager,
            IAccountService accountService,

            IRepository<UserEntity> repository, IMapper mapper, IImageService imageService)
        {
            _repository = repository;
            _mapper = mapper;
            _imageService = imageService;
            _userManager = userManager;
            _accountService = accountService;
        }


        public async Task CreateUserAsync(UserCreateDTO dto)
        {
            try
            {
                var user = _mapper.Map<UserEntity>(dto);

                user.UserName = user.Email;
                // Збереження одного зображення, якщо воно є
                if (dto.Image is not null)
                {
                    user.Image = await _imageService.SaveImageAsync(dto.Image); // Зберігаємо назву прямо в `UserEntity`
                    //await _repository.SaveAsync(); // Додаткове збереження після оновлення користувача
                }

                var result = await _userManager.CreateAsync(user, dto.Password);
                if (result.Succeeded)
                {

                }


            }
            catch (DbUpdateException dbEx)
            {
                throw new HttpException("Помилка при збереженні користувача в базі даних", HttpStatusCode.InternalServerError, dbEx);
            }
            catch (Exception ex)
            {
                throw new HttpException("Невідома помилка при створенні користувача", HttpStatusCode.InternalServerError, ex);
            }
            await _repository.SaveAsync(); // Зберігаємо, щоб отримати UserId
        }


        public async Task DeleteUserAsync(long id)
        {
            try
            {
                // Отримуємо користувача з його зображенням
                var user = await _repository.GetByID(id);

                if (user == null)
                {
                    throw new HttpException("Користувача не знайдено для видалення", HttpStatusCode.NotFound);
                }

                //// Перевіряємо, чи є зображення у користувача
                //if (!string.IsNullOrEmpty(user.Image))
                //{
                //    _imageService.DeleteImageIfExists(user.Image); // Видаляємо зображення, якщо воно є
                //}

                //// Видаляємо користувача
                //await _repository.DeleteAsync(id);
                user.IsRemove = true;
                await _repository.SaveAsync();
            }
            catch (DbUpdateException dbEx)
            {
                throw new HttpException("Помилка при видаленні користувача з бази даних", HttpStatusCode.InternalServerError, dbEx);
            }
            catch (Exception ex)
            {
                throw new HttpException("Невідома помилка при видаленні користувача", HttpStatusCode.InternalServerError, ex);
            }
        }





        public async Task<PagedResultDto<UserDTO>> GetAllAsync(PagedRequestDto request)
        {
            var users = _repository.GetAllQueryable()
                .Where(x => !x.IsRemove);
            var builder = new PaginationBuilder<UserEntity>(users);
            var pagedResult = await builder.GetPageAsync(request.Page, request.PageSize);

            var mappedItems = _mapper.Map<List<UserDTO>>(pagedResult.Items);

            return new PagedResultDto<UserDTO>(
                pagedResult.CurrentPage,
                pagedResult.PageSize,
                pagedResult.TotalCount,
                mappedItems
            );
        }

        public async Task<UserDTO> GetByIdAsync(long id)
        {

            var user = await _repository.GetByID(id);
            if (user.IsRemove)
                user = null;
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<AuthResponse> UpdateUserAsync(UserUpdateDTO dto)
        {
            var user = await _repository.GetByID(dto.Id);
            if (user.IsRemove)
                user = null;

            if (user == null)
                throw new HttpException("Користувача не знайдено", HttpStatusCode.NotFound);

            string imagName = user.Image;
            // Мапимо основні дані
            _mapper.Map(dto, user);

            // Якщо є нове зображення
            if (dto.Image != null && dto.Image.Length > 0)
            {
                // Видаляємо старе, якщо воно є
                if (!string.IsNullOrEmpty(imagName))
                {
                    _imageService.DeleteImageIfExists(imagName);
                }

                // Зберігаємо нове
                var fileName = await _imageService.SaveImageAsync(dto.Image);
                user.Image = fileName;
            }


            await _repository.Update(user);
            await _repository.SaveAsync();

            var result = await _accountService.GenerateTokensAsync(user);
            return result;
        }




        public async Task<UserDTO?> GetByEmailAsync(string email)
        {

            var spec = new Core.Specifications.UserSpecs.ByEmailSpec(email);
            var user = await _repository.FirstOrDefaultAsync(spec);
            if (user.IsRemove)
                user = null;
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

    }
}
