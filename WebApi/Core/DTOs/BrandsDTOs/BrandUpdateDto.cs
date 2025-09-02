using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.BrandsDTOs
{
    public class BrandUpdateDto: BrandCreateDto
    {
        public long Id { get; set; }
    }
}
