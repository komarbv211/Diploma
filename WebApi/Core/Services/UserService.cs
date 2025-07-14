using AutoMapper;
using Core.DTOs.PaginationDTOs;
using Core.DTOs.UsersDTO;
using Core.DTOs.UsersDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Core.Models.Authentication;
using Core.Models.Search;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;
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

        /* public async Task<AuthResponse> UpdateUserAsync(UserUpdateDTO dto)
         {
             var user = await _repository.GetByID(dto.Id);
             if (user.IsRemove)
                 user = null;

             if (user == null)
                 throw new HttpException("Користувача не знайдено", HttpStatusCode.NotFound);

             string imagName = user.Image;
             string dataName = user.BirthDate.ToString();
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
             else {
                 user.Image = imagName;
             };


             await _repository.Update(user);
             await _repository.SaveAsync();

             var result = await _accountService.GenerateTokensAsync(user);
             return result;
         }*/

        public async Task<AuthResponse> UpdateUserAsync(UserUpdateDTO dto)
        {
            var user = await _repository.GetByID(dto.Id);
            if (user.IsRemove)
                user = null;

            if (user == null)
                throw new HttpException("Користувача не знайдено", HttpStatusCode.NotFound);

            string imagName = user.Image;
            //DateTime oldBirthDate = (DateTime)user.BirthDate;
            //if (user.BirthDate.HasValue)
            //{
            //    user.BirthDate = DateTime.SpecifyKind(user.BirthDate.Value, DateTimeKind.Local);
            //}
            // Мапимо основні дані
            _mapper.Map(dto, user);

            //// Якщо дата не змінена (null або така сама), залишаємо стару
            //if (dto.BirthDate == null || dto.BirthDate == oldBirthDate)
            //{
            //    user.BirthDate = oldBirthDate;
            //}

            // Якщо є нове зображення
            if (dto.Image != null && dto.Image.Length > 0)
            {
                if (!string.IsNullOrEmpty(imagName))
                {
                    _imageService.DeleteImageIfExists(imagName);
                }

                var fileName = await _imageService.SaveImageAsync(dto.Image);
                user.Image = fileName;
            }
            else
            {
                user.Image = imagName;
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

        public async Task<SearchResult<UserEntity>> SearchUsersAsync(UserSearchModel model)
        {
           var query = _userManager.Users
             .Include(u => u.UserRoles)
             .ThenInclude(ur => ur.Role)
             .AsQueryable();

            // 🔍 Фільтрація по імені
            if (!string.IsNullOrWhiteSpace(model.Name))
            {
                string nameFilter = model.Name.Trim().ToLower().Normalize();

                query = query.Where(u =>
                    (u.FirstName + " " + u.LastName).ToLower().Contains(nameFilter) ||
                    u.FirstName.ToLower().Contains(nameFilter) ||
                    u.LastName.ToLower().Contains(nameFilter));
            }

            // 📅 Фільтрація по датах
            if (model?.StartDate != null)
            {
                query = query.Where(u => u.CreatedDate >= model.GetParsedStartDate());
            }

            if (model?.EndDate != null)
            {
                query = query.Where(u => u.LastActivity <= model.GetParsedEndDate());
            }

                    if (model.Roles != null && model.Roles.Any())
        {
            var roles = model.Roles.Where(x=>!string.IsNullOrEmpty(x));
            if(roles.Count() > 0)
                query = query.Where(user => roles.Any(role => user.UserRoles.Select(x=>x.Role.Name).Contains(role)));
        }
            // 🧑‍⚖️ Фільтрація по ролях
            //if (model.Roles != null && model.Roles.Any())
            //{
            //    var roles = model.Roles.Where(x => !string.IsNullOrWhiteSpace(x)).ToList();

            //    if (roles.Count > 0)
            //    {
            //        query = query.Where(user =>
            //            user.UserRoles.Any(ur => roles.Contains(ur.Role.Name)));
            //    }
            //}

            // 🔢 Загальна кількість
            var totalCount = await query.CountAsync();

            // 📄 Пейджинг
            var safeItemsPerPage = model.ItemPerPAge < 1 ? 10 : model.ItemPerPAge;
            var totalPages = (int)Math.Ceiling(totalCount / (double)safeItemsPerPage);
            var safePage = Math.Min(Math.Max(1, model.Page), Math.Max(1, totalPages));

            // ↕️ Сортування
            if (!string.IsNullOrWhiteSpace(model.SortBy))
            {
                bool desc = model.SortDesc;
                query = model.SortBy switch
                {
                    "FirstName" => desc ? query.OrderByDescending(u => u.FirstName) : query.OrderBy(u => u.FirstName),
                    "LastName" => desc ? query.OrderByDescending(u => u.LastName) : query.OrderBy(u => u.LastName),
                    "Email" => desc ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
                    _ => query.OrderBy(u => u.Id)
                };
            }
            else
            {
                query = query.OrderBy(u => u.Id); // default
            }

            // 🔄 Завантаження користувачів з пагінацією
            var users = await query
                .Skip((safePage - 1) * safeItemsPerPage)
                .Take(safeItemsPerPage)
                .ToListAsync();

            // 📦 Результат
            //return new SearchResult<UserEntity>
            //{
            //    Items = users,
            //    Pagination = new PaginationModel
            //    {
            //        TotalCount = totalCount,
            //        TotalPages = totalPages,
            //        ItemsPerPage = safeItemsPerPage,
            //        CurrentPage = safePage
            //    }
            //};

            return new SearchResult<UserEntity>
            {
                Items = users,
                Pagination = new PagedResultDto<UserEntity>
                {
                    CurrentPage = safePage,
                    PageSize = safeItemsPerPage,
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    Items = users
                }
            };
        }
    }
}
