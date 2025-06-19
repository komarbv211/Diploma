using Core.DTOs.PaginationDTOs;
using Core.DTOs.UsersDTO;
using Core.DTOs.UsersDTOs;
using Core.Models.Authentication;

namespace Core.Interfaces
{
    public interface IUserService
    {

        Task<PagedResultDto<UserDTO>> GetAllAsync(PagedRequestDto request);
        Task<UserDTO> GetByIdAsync(long id);
        Task CreateUserAsync(UserCreateDTO dto);
        Task<AuthResponse> UpdateUserAsync(UserUpdateDTO dto);
        Task DeleteUserAsync(long id);
        Task<UserDTO?> GetByEmailAsync(string email);

        //Task<IEnumerable<UserDTO>> Get(bool isAdmin = false);
        //Task<IEnumerable<UserDTO>> GetLocked();
        //Task<UserDTO> Get(int id, bool isAdmin = false);
        //Task<PageResponse<UserDTO>> Get(UserPageRequest userPageRequest);
    }
}
