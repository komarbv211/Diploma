﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.CartDTOs;

public class CartCreateUpdateDTO
{
    public long ProductId { get; set; }
    public int Quantity { get; set; } = 1;
}
