using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    //fungsi owned berguna agar induk entity yg nenggunakan class ini sebagai property,
    //juga menyimpan data2 dari class properti tersebut (single table)
    [Owned]
    public class ProductItemOrdered
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
    }
}
