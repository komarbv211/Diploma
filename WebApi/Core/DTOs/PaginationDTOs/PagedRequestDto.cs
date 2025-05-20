namespace Core.DTOs.PaginationDTOs
{
    public class PagedRequestDto
    {
        private int _page = 1;
        public int Page
        {
            get => _page > 0 ? _page : 1;
            set => _page = value;
        }

        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize > 0 ? _pageSize : 10;
            set => _pageSize = value;
        }
    }
}
