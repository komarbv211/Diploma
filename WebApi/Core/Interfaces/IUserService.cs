using Core.DTOs.UsersDTOs;
using Core.Models.Page;
using Core.Models.User.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IUserService
    {

        Task<IEnumerable<UserDTO>> GetAllAsync();
        Task<UserDTO> GetByIdAsync(long id);
        Task CreateUserAsync(UserDTO dto);
        Task UpdateUserAsync(long id, UserDTO dto);
        Task DeleteUserAsync(long id);


        //Task<IEnumerable<UserDTO>> Get(bool isAdmin = false);
        //Task<IEnumerable<UserDTO>> GetLocked();
        //Task<UserDTO> Get(int id, bool isAdmin = false);
        //Task<PageResponse<UserDTO>> Get(UserPageRequest userPageRequest);
    }
}
