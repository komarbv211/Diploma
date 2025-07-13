using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.PaginationDTOs
{
    public class SearchResult<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public PagedResultDto<T> Pagination { get; set; } = new PagedResultDto<T>();
    }
}
