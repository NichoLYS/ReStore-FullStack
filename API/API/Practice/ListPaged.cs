using Microsoft.EntityFrameworkCore;

namespace API.Practice
{
    public class ListPaged<T> : List<T>
    {
        public ListPaged(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new MetaData
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPage = (int)Math.Ceiling((double)count / pageSize)
            };
            AddRange(items);
        }

        public MetaData MetaData { get; set; }

        public static async Task<ListPaged<T>> ToListPaged(IQueryable<T> query, int pageNumber, int pageSize)
        {
            var count = await query.CountAsync();
            var items = await query.Skip((pageNumber-1) * pageSize).Take(pageSize).ToListAsync();

            return new ListPaged<T>(items, count, pageNumber, pageSize);
        }
    }
}
