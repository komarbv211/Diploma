using Core.DTOs.UsersDTO;
using Core.DTOs.UsersDTOs;

namespace Core.Interfaces
{
    public interface IUserService
    {

        Task<IEnumerable<UserDTO>> GetAllAsync();
        Task<UserDTO> GetByIdAsync(long id);
        Task CreateUserAsync(UserCreateDTO dto);
        Task UpdateUserAsync(UserUpdateDTO dto);
        Task DeleteUserAsync(long id);
        Task<UserDTO?> GetByEmailAsync(string email);

        //Task<IEnumerable<UserDTO>> Get(bool isAdmin = false);
        //Task<IEnumerable<UserDTO>> GetLocked();
        //Task<UserDTO> Get(int id, bool isAdmin = false);
        //Task<PageResponse<UserDTO>> Get(UserPageRequest userPageRequest);
    }
}
