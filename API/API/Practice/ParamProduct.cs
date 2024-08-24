namespace API.Practice
{
    public class ParamProduct : ParamPagination
    {
        public string? OrderBy { get; set; }
        public string? SearchTerm { get; set; }
        public string? Types { get; set; }
        public string? Brands { get; set; }
    }
}
