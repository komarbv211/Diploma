using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.DTOs.PaginationDTOs;
using Core.DTOs.UsersDTO;
using Core.DTOs.UsersDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Core.Models.AdminUser;
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

        public async Task BlockUserAsync(UserBlockDTO dto)
        {
            var user = await _userManager.FindByIdAsync(dto.Id.ToString());
            if (user == null || user.IsRemove)
            {
                throw new HttpException("Користувача не знайдено", HttpStatusCode.NotFound);
            }

            // Перевірка ролі користувача
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("Admin"))
            {
                throw new HttpException("Неможливо заблокувати користувача з роллю Адміністратор", HttpStatusCode.Forbidden);
            }

            // Якщо дата не передана — блокуємо "назавжди"
            var lockoutEnd = dto.Until ?? DateTimeOffset.MaxValue;

            var result = await _userManager.SetLockoutEndDateAsync(user, lockoutEnd);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new HttpException($"Не вдалося заблокувати користувача: {errors}", HttpStatusCode.BadRequest);
            }
        }


        public async Task UnblockUserAsync(long userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || user.IsRemove)
            {
                throw new HttpException("Користувача не знайдено", HttpStatusCode.NotFound);
            }

            // ❌ обнуляємо LockoutEnd → користувач знову активний
            var result = await _userManager.SetLockoutEndDateAsync(user, null);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new HttpException($"Не вдалося розблокувати користувача: {errors}", HttpStatusCode.BadRequest);
            }
        }

        public async Task PromoteUserToAdminAsync(long userId)
        {
            // Знаходимо користувача
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || user.IsRemove)
            {
                throw new HttpException("Користувача не знайдено", HttpStatusCode.NotFound);
            }

            // Отримуємо всі ролі користувача
            var roles = await _userManager.GetRolesAsync(user);

            // Якщо користувач вже має роль Admin, нічого не робимо
            if (roles.Contains("Admin"))
            {
                throw new HttpException("Користувач вже є адміністратором", HttpStatusCode.BadRequest);
            }

            // Видаляємо роль User, якщо вона є
            if (roles.Contains("User"))
            {
                var removeResult = await _userManager.RemoveFromRoleAsync(user, "User");
                if (!removeResult.Succeeded)
                {
                    var errors = string.Join(", ", removeResult.Errors.Select(e => e.Description));
                    throw new HttpException($"Не вдалося видалити роль User: {errors}", HttpStatusCode.BadRequest);
                }
            }

            // Додаємо роль Admin
            var addResult = await _userManager.AddToRoleAsync(user, "Admin");
            if (!addResult.Succeeded)
            {
                var errors = string.Join(", ", addResult.Errors.Select(e => e.Description));
                throw new HttpException($"Не вдалося додати роль Admin користувачу: {errors}", HttpStatusCode.BadRequest);
            }
        }




        public async Task<SearchResult<AdminUserItemModel>> SearchUsersAsync(UserSearchModel model)
        {
            var query = _userManager.Users
              //.Include(u => u.UserRoles)
              //.ThenInclude(ur => ur.Role)
              .AsQueryable();
        

            //var query = _userManager.Users.AsQueryable();

            // 🔍 Фільтрація по імені
            if (!string.IsNullOrWhiteSpace(model.Name))
            {
                string nameFilter = model.Name.Trim().ToLower().Normalize();

                query = query.Where(u =>
                    (u.FirstName + " " + u.LastName).ToLower().Contains(nameFilter) ||
                    u.FirstName.ToLower().Contains(nameFilter) ||
                    u.LastName.ToLower().Contains(nameFilter));
            }


            //📅 Фільтрація по датах
            //if (model?.StartDate != null)
            //{
            //    query = query.Where(u => u.CreatedDate >= model.GetParsedStartDate());
            //}

            //if (model?.EndDate != null)
            //{
            //    query = query.Where(u => u.LastActivity <= model.GetParsedEndDate());
            //}

            if (model?.StartDate != null && model.DateField == "CreatedDate")
            {
                query = query.Where(u => u.CreatedDate >= model.GetParsedStartDate());
            }
            else if (model?.StartDate != null && model.DateField == "LastActivity")
            {
                query = query.Where(u => u.LastActivity >= model.GetParsedStartDate());
            }

            if (model?.EndDate != null && model.DateField == "CreatedDate")
            {
                query = query.Where(u => u.CreatedDate <= model.GetParsedEndDate());
            }
            else if (model?.EndDate != null && model.DateField == "LastActivity")
            {
                query = query.Where(u => u.LastActivity <= model.GetParsedEndDate());
            }






            // 🧑‍⚖️ Фільтрація по ролях
            if (model?.Roles != null && model.Roles.Any())
            {
                query = query.Where(u => u.UserRoles.Any(ur => model.Roles.Contains(ur.Role.Name)));
            }



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
                //string nameFilter = model.Name.Trim().ToLower().Normalize();

                //query = query.Where(u =>
                //    (u.FirstName + " " + u.LastName).ToLower().Contains(nameFilter) ||
                //    u.FirstName.ToLower().Contains(nameFilter) ||
                //    u.LastName.ToLower().Contains(nameFilter) ||
                //     u.UserRoles.Any(ur => ur.Role != null && ur.Role.Name != null && ur.Role.Name.ToLower().Contains(nameFilter)) // ✅ перевірка на null
                //);
            }
            else
            {
                query = query.OrderBy(u => u.Id); // default
            }


            // ↕️ Сортування
            //if (!string.IsNullOrWhiteSpace(model.SortBy))
            //{
            //    bool desc = model.SortDesc;
            //    query = model.SortBy switch
            //    {
            //        "FirstName" => desc ? query.OrderByDescending(u => u.FirstName) : query.OrderBy(u => u.FirstName),
            //        "LastName" => desc ? query.OrderByDescending(u => u.LastName) : query.OrderBy(u => u.LastName),
            //        "Email" => desc ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
            //        "CreatedDate" => desc ? query.OrderByDescending(u => u.CreatedDate) : query.OrderBy(u => u.CreatedDate),
            //        "LastActivity" => desc ? query.OrderByDescending(u => u.LastActivity) : query.OrderBy(u => u.LastActivity),
            //        "Role" => desc
            //            ? query.OrderByDescending(u => u.UserRoles.Select(ur => ur.Role.Name).FirstOrDefault())
            //            : query.OrderBy(u => u.UserRoles.Select(ur => ur.Role.Name).FirstOrDefault()),
            //        _ => query.OrderBy(u => u.Id)
            //    };
            //}
            //else
            //{
            //    query = query.OrderBy(u => u.Id); // default
            //}






            //// 📄 Безпечна пагінація
            //var safeItemsPerPage = model.ItemPerPAge < 1 ? 10 : model.ItemPerPAge;
            //var totalPages = (int)Math.Ceiling(totalCount / (double)safeItemsPerPage);
            //var safePage = Math.Min(Math.Max(1, model.Page), Math.Max(1, totalPages));

            //// ↕️ Сортування (динамічне через EF.Property)
            //var allowedSortFields = new[] { "Id", "Email", "Name", "Role", "CreatedAt" };

            //if (!string.IsNullOrWhiteSpace(model.SortBy) && allowedSortFields.Contains(model.SortBy))
            //{
            //    query = model.SortDesc
            //        ? query.OrderByDescending(u => EF.Property<object>(u, model.SortBy))
            //        : query.OrderBy(u => EF.Property<object>(u, model.SortBy));
            //}
            //else
            //{
            //    query = query.OrderBy(u => u.Id); // default
            //}





            // 🔄 Завантаження користувачів з пагінацією
            var users = await query
                .Skip((safePage - 1) * safeItemsPerPage)
                .Take(safeItemsPerPage)
                .ProjectTo<AdminUserItemModel>(_mapper.ConfigurationProvider)
                .ToListAsync();

            // 📦 Результат
            return new SearchResult<AdminUserItemModel>
            {
                Items = users,
                Pagination = new PagedResultDto<AdminUserItemModel>
                {
                    CurrentPage = safePage,
                    PageSize = safeItemsPerPage,
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    //Items = users
                }
            };
        }
    }
}
