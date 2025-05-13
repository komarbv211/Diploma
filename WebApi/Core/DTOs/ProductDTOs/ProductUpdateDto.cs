using Core.DTOs.ProductDTOs;

namespace Core.DTOs.ProductsDTO
{   
    public class ProductUpdateDto : ProductCreateDto
    {
        public long Id { get; set; }
    }
}
