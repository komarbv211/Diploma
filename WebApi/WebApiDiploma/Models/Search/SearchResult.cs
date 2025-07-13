namespace WebApiDiploma.Models.Search
{
    public class SearchResult<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        //public PaginationModel Pagination { get; set; } = new PaginationModel();
    }
}
