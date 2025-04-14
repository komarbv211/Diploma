﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Page
{
    public class PageRequest
    {
        public int Size { get; init; }
        public int Page { get; init; }
        public string? SortKey { get; init; } = string.Empty;
        public bool IsDescending { get; init; }
    }
}
