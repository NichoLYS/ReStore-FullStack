using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T> 
    {
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new MetaData
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                //Math.Ceiling() berfungsi membulatkan ke bilangan bulat terdekat yang lebih besar dari nilai yang diberikan
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };
            // menambahkan seluruh list items ke objek atau class PagedList<T>
            // Karena class PagedList<T> mewarisi List<T> maka ia dapat menggunakan function addRange untuk menambahkan list items dari constructor
            AddRange(items);
        }

        public MetaData MetaData { get; set; }

        //tipe data query disni adala IQueryable agar query tersebut dapat di eksekusi pada method ini
        //yaitu bsa menggunakan CountAsync(), Skip(), ToListASync(), dll
        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, 
            int pageNumber, int pageSize)
        {
            var count = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}
