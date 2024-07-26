using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("BasketItems")]
    public class BasketItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }   

        //navigation properties
        //reference to Product entitiy
        public int ProductId { get; set; }
        public Product Product { get; set; }

        //reference to Basket entity
        public int BasketId { get; set; }   
        public Basket Basket { get; set; }
    }
}