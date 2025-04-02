﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class RoleEntity :BaseEntity<long>
    {
         [Required, StringLength(255)]
        public string Name { get; set; }
        public virtual ICollection<UserRoleEntity> UserRoles { get; set; }
    }
}
