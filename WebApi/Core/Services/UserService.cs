using AutoMapper;
using Core.DTOs.PaginationDTOs;
using Core.DTOs.ProductsDTO;
using Core.DTOs.UsersDTO;
using Core.DTOs.UsersDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Infrastructure.Entities;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.Models;
using System.Net;
using WebApiDiploma.Pagination;

namespace Core.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<UserEntity> _repository;
        private readonly IMapper _mapper;
        private readonly IImageService _imageService;
        private readonly UserManager<UserEntity> _userManager;
        public UserService(UserManager<UserEntity> userManager, IRepository<UserEntity> repository, IMapper mapper, IImageService imageService)
        {
            _repository = repository;
            _mapper = mapper;
            _imageService = imageService;
            _userManager = userManager;
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

                // Збереження одного зображення, якщо воно є
                if (dto.Image is not null)
                {
                    user.Image = await _imageService.SaveImageAsync(dto.Image); // Зберігаємо назву прямо в `UserEntity`
                    await _repository.SaveAsync(); // Додаткове збереження після оновлення користувача
                }

                var result = await _userManager.CreateAsync(user, dto.Password);
                if (result.Succeeded) {

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
                var user = await _repository.GetByID(id);
                //var user = await _userManager.FindByIdAsync(id.ToString());

                //var user = await _userManager.Users.AnyAsync(u => u.Id == id);

                //var userId = _userManager.GetUserId(User);
                //var user = await _userManager.FindByIdAsync(userId);

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


        //public async Task DeleteUserAsync(long id)
        //{
        //    try
        //    {

        //        // Отримуємо користувача за його ID через UserManager
        //        var user = await _userManager.FindByIdAsync(id.ToString());

        //        if (user == null)
        //        {
        //            throw new HttpException("Користувача не знайдено для видалення", HttpStatusCode.NotFound);
        //        }

        //        // Перевіряємо, чи є у користувача зображення та видаляємо його
        //        if (!string.IsNullOrEmpty(user.Image))
        //        {
        //            _imageService.DeleteImageIfExists(user.Image);
        //        }

        //        // Видаляємо користувача через UserManager
        //        var result = await _userManager.DeleteAsync(user);

        //        if (!result.Succeeded)
        //        {
        //            throw new HttpException("Помилка при видаленні користувача", HttpStatusCode.InternalServerError);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new HttpException("Невідома помилка при видаленні користувача", HttpStatusCode.InternalServerError, ex);
        //    }
        //}


        public async Task<PagedResultDto<UserDTO>> GetAllAsync(PagedRequestDto request)
        {
            var users = _repository.GetAllQueryable()
                .Where(x=>!x.IsRemove);
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
            if(user.IsRemove)
                user=null;
            return _mapper.Map<UserDTO>(user);
        }

        // public async Task<UserDTO?> GetByIdAsync(long id)
        //{
        //    try
        //    {
        //         var user = await _repository.GetByID(id);
        //            //.Include(p => p.Images)
        //            //.FirstOrDefaultAsync(p => p.Id == id);

        //        if (user == null)
        //        {
        //            throw new HttpException("Продукт не знайдений", HttpStatusCode.NotFound);
        //        }

        //        return _mapper.Map<UserDTO>(user);
        //    }
        //    catch (HttpException ex)
        //    {
        //        throw ex;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new HttpException("Помилка при отриманні продукту", HttpStatusCode.InternalServerError, ex);
        //    }
        //}


        // Оновлення існуючої сутності
        //public async Task UpdateUserAsync(UserUpdateDTO dto)
        //{
        //    var user = await _repository.GetByID(dto.Id);
        //    if (user != null)
        //    {
        //        _mapper.Map(dto, user);
        //        await _repository.Update(user);
        //        await _repository.SaveAsync();
        //    }
        //}

        public async Task UpdateUserAsync(UserUpdateDTO dto)
          {
              var user = await _repository.GetByID(dto.Id);
              if(user.IsRemove)
                user=null;

              if (user == null)
                  throw new HttpException("Користувача не знайдено", HttpStatusCode.NotFound);
          
              // Мапимо основні дані
              _mapper.Map(dto, user);
          
              // Якщо є нове зображення
              if (dto.Image != null && dto.Image.Length > 0)
              {
                  // Видаляємо старе, якщо воно є
                  if (!string.IsNullOrEmpty(user.Image))
                  {
                      _imageService.DeleteImageIfExists(user.Image);
                  }
          
                  // Зберігаємо нове
                  var fileName = await _imageService.SaveImageAsync(dto.Image);
                  user.Image = fileName;
              }
          
              await _repository.Update(user);
              await _repository.SaveAsync();
          }




        public async Task<UserDTO?> GetByEmailAsync(string email)
        {

            var spec = new Core.Specifications.UserSpecs.ByEmailSpec(email);
            var user = await _repository.FirstOrDefaultAsync(spec);
            if(user.IsRemove)
                user=null;
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

    }
}
