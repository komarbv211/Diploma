using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Page
{
    public class PageResponse<TResult> where TResult : class
    {
        public int Total { get; init; }
        public IEnumerable<TResult> Items { get; init; } = [];
    }
}
