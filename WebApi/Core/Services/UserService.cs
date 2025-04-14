using AutoMapper;
using Core.DTOs.UsersDTOs;
using Core.Interfaces;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<UserEntity> _repository;
        private readonly IMapper _mapper;

        public UserService(IRepository<UserEntity> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }


        public async Task CreateUserAsync(UserDTO dto)
        {
            var user = _mapper.Map<UserEntity>(dto);
            await _repository.Insert(user);
            await _repository.SaveAsync();
        }

        public async Task DeleteUserAsync(long id)
        {
            await _repository.DeleteAsync(id);
            await _repository.SaveAsync();
        }

        public async Task<IEnumerable<UserDTO>> GetAllAsync()
        {
            var users = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDTO>>(users);
        }

        public async Task<UserDTO> GetByIdAsync(long id)
        {
            var user = await _repository.GetByID(id);
            return _mapper.Map<UserDTO>(user);
        }
       
        // Оновлення існуючої сутності
        public async Task UpdateUserAsync(long id, UserDTO dto)
        {
            var user = await _repository.GetByID(id);
            if (user != null)
            {
                _mapper.Map(dto, user);
                await _repository.Update(user);
                await _repository.SaveAsync();
            }
        }
    }
}
