namespace Core.DTOs.PaginationDTOs
{
    public class PagedResultDto<TEntityDto>
    {
        public PagedResultDto(int page, int pageSize, int totalCount, List<TEntityDto> items)
        {
            CurrentPage = page;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            PageSize = pageSize;
            TotalCount = totalCount;
            Items = items;
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public List<TEntityDto> Items { get; set; }
    }
}
