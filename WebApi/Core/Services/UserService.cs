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
using Microsoft.Graph.Models.Security;
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
        private readonly IEmailService _emailService;
        public UserService(UserManager<UserEntity> userManager,
            IAccountService accountService,

            IRepository<UserEntity> repository, IMapper mapper, IImageService imageService, IEmailService emailService)
        {
            _repository = repository;
            _mapper = mapper;
            _imageService = imageService;
            _userManager = userManager;
            _accountService = accountService;
            _emailService = emailService;
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
                var user = await _repository.GetByID(id);

                if (user == null)
                {
                    throw new HttpException("Користувача не знайдено для видалення", HttpStatusCode.NotFound);
                }

                // М’яке видалення
                user.IsRemove = true;

                // Надсилаємо листа про видалення акаунта
                await SendAccountDeletionEmailAsync(user);

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
        public async Task ConfirmDeleteUserAsync(long id)
        {
            var user = await _repository.GetByID(id);
            if (user == null)
                throw new HttpException("Користувача не знайдено", HttpStatusCode.NotFound);

            if (!user.IsRemove)
                throw new HttpException("Користувач не подавав запит на видалення", HttpStatusCode.BadRequest);

            _repository.Delete(user.Id); 
            await _repository.SaveAsync();
        }

        public async Task SendAccountDeletionEmailAsync(UserEntity user)
        {
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "AccountDeleted.html");
            var template = await File.ReadAllTextAsync(templatePath);

            var body = template.Replace("{{username}}", user.UserName ?? "Користувач");

            try
            {
                await _emailService.SendEmailAsync(
                    user.Email!,
                    "Видалення облікового запису",
                    body
                );
            }
            catch (Exception ex)
            {
                throw new HttpException("Не вдалося надіслати лист про видалення акаунта.", HttpStatusCode.InternalServerError, ex);
            }
        }
        public async Task RestoreUserAsync(long id)
        {
            try
            {
                var user = await _repository.GetByID(id);

                if (user == null)
                {
                    throw new HttpException("Користувача не знайдено для відновлення", HttpStatusCode.NotFound);
                }

                if (!user.IsRemove && user.LockoutEnd == null)
                {
                    throw new HttpException("Користувач вже активний", HttpStatusCode.BadRequest);
                }

                // Відновлюємо акаунт
                user.IsRemove = false;

                await _repository.SaveAsync();

                // (опційно) Надсилаємо лист про відновлення акаунта
                await SendAccountRestoreEmailAsync(user);
            }
            catch (DbUpdateException dbEx)
            {
                throw new HttpException("Помилка при відновленні користувача в базі даних", HttpStatusCode.InternalServerError, dbEx);
            }
            catch (Exception ex)
            {
                throw new HttpException("Невідома помилка при відновленні користувача", HttpStatusCode.InternalServerError, ex);
            }
        }

        public async Task SendAccountRestoreEmailAsync(UserEntity user)
        {
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "AccountRestored.html");
            var template = await File.ReadAllTextAsync(templatePath);

            var body = template.Replace("{{username}}", user.UserName ?? "Користувач");

            try
            {
                await _emailService.SendEmailAsync(
                    user.Email!,
                    "Ваш акаунт відновлено",
                    body
                );
            }
            catch (Exception ex)
            {
                throw new HttpException("Не вдалося надіслати лист про відновлення акаунта.", HttpStatusCode.InternalServerError, ex);
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

            // ==========================
            // Відправка email
            // ==========================
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "AccountBlocked.html");
            string body;

            if (File.Exists(templatePath))
            {
                body = await File.ReadAllTextAsync(templatePath);

                // Замінюємо ім'я користувача
                body = body.Replace("{{username}}", user.FirstName ?? "Користувач");

                // Формуємо повідомлення про блокування
                string blockedMessage;
                if (lockoutEnd == DateTimeOffset.MaxValue)
                {
                    blockedMessage = "Акаунт заблоковано назавжди.";
                }
                else
                {
                    blockedMessage = $"Блокування діє до: {lockoutEnd.UtcDateTime:dd.MM.yyyy}";
                }

                body = body.Replace("{{blockedMessage}}", blockedMessage);
            }
            else
            {
                // fallback — простий текст
                body = lockoutEnd == DateTimeOffset.MaxValue
                    ? "Ваш акаунт було заблоковано назавжди."
                    : $"Ваш акаунт було заблоковано до {lockoutEnd.UtcDateTime:dd.MM.yyyy}.";
            }

            // Виклик сервісу відправки пошти
            await _emailService.SendEmailAsync(user.Email, "Акаунт заблоковано", body);

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

            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "AccountUnblocked.html");
            string body;

            if (File.Exists(templatePath))
            {
                body = await File.ReadAllTextAsync(templatePath);
                body = body.Replace("{{username}}", user.FirstName ?? "Користувач");

            }
            else
            {
                // fallback — простий текст
                body = "Ваш акаунт було розблоковано.";
            }

            await _emailService.SendEmailAsync(user.Email, "Акаунт розблоковано", body);
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
            }
            else
            {
                query = query.OrderBy(u => u.Id); // default
            }

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
