using Core.DTOs.UsersDTOs;
using Infrastructure.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.UsersDTO;

public class UserUpdateDTO : UserCreateDTO
{
    public long Id { get; set; }
   

   
}
