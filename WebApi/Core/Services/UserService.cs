using AutoMapper;
using Core.DTOs.PaginationDTOs;
using Core.DTOs.UsersDTO;
using Core.DTOs.UsersDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Infrastructure.Entities;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Net;
using WebApiDiploma.Pagination;

namespace Core.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<UserEntity> _repository;
        private readonly IMapper _mapper;
        private readonly IImageService _imageService;
        public UserService(IRepository<UserEntity> repository, IMapper mapper, IImageService imageService)
        {
            _repository = repository;
            _mapper = mapper;
            _imageService = imageService;
        }


        //public async Task CreateUserAsync(UserCreateDTO dto)
        //{
        //    var user = _mapper.Map<UserEntity>(dto);
        //    user.UserName = user.Email;
        //    await _repository.Insert(user);
        //    await _repository.SaveAsync();
        //}

        public async Task CreateUserAsync(UserCreateDTO dto)
        {
            try
            {
                var user = _mapper.Map<UserEntity>(dto);

                await _repository.Insert(user);
                await _repository.SaveAsync(); // Зберігаємо, щоб отримати UserId

                // Збереження одного зображення, якщо воно є
                if (dto.Image is not null)
                {
                    user.Image = await _imageService.SaveImageAsync(dto.Image); // Зберігаємо назву прямо в `UserEntity`
                    await _repository.SaveAsync(); // Додаткове збереження після оновлення користувача
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
        }


        //public async Task DeleteUserAsync(long id)
        //{
        //    await _repository.DeleteAsync(id);
        //    await _repository.SaveAsync();
        //}

        public async Task DeleteUserAsync(long id)
        {
            try
            {
                // Отримуємо користувача з його зображенням
                var user = await _repository.GetByIdAsync(id);

                if (user == null)
                {
                    throw new HttpException("Користувача не знайдено для видалення", HttpStatusCode.NotFound);
                }

                // Перевіряємо, чи є зображення у користувача
                if (!string.IsNullOrEmpty(user.ImageName))
                {
                    _imageService.DeleteImageIfExists(user.ImageName); // Видаляємо зображення, якщо воно є
                }

                // Видаляємо користувача
                await _repository.DeleteAsync(id);
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
            var users = _repository.GetAllQueryable();
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
            return _mapper.Map<UserDTO>(user);
        }

        // Оновлення існуючої сутності
        public async Task UpdateUserAsync(UserUpdateDTO dto)
        {
            var user = await _repository.GetByID(dto.Id);
            if (user != null)
            {
                _mapper.Map(dto, user);
                await _repository.Update(user);
                await _repository.SaveAsync();
            }
        }
        public async Task<UserDTO?> GetByEmailAsync(string email)
        {
            var spec = new Core.Specifications.UserSpecs.ByEmailSpec(email);
            var user = await _repository.FirstOrDefaultAsync(spec);

            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

    }
}
