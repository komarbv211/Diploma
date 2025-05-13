using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.ProductDTOs
{
    public class ProductImageDto
    {
        public long Id { get; set; }
        public string Name { get; set; }        
        public short Priority { get; set; }       
        public long ProductId { get; set; }
    }
}
