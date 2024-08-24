using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
      public BasketController(StoreContext context)
        {
            _context = context;
        }

        // mengambil basket dengan menggunakan method retrieveBasket
        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null) return NotFound();
            return basket.MapBasketToDto();
        }

      


        [HttpPost] //api/basket?productId=3&quantity=2
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            // get basket || create basket
            var basket = await RetrieveBasket(GetBuyerId());

            if (basket == null) basket = CreateBasket();

            // get product
            var product = await _context.Products.FindAsync(productId);
            
            if(product == null) return BadRequest(new ProblemDetails {Title = "Product Not Found"});

            // add item
            basket.AddItem(product, quantity);

            // save changes
            var result = await _context.SaveChangesAsync() > 0;

            // statuscode 201 berarti suatu resource telah dibuat
            // mengembalikan darimana untuk basketItem itu bisa didapatkan yaitu dari Route GetBasket
            // dan mengembalikan response bodynya yang berisi objek yang ditambahkan
            if(result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

     

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            // get basket
            var basket = await RetrieveBasket(GetBuyerId());
            if(basket == null) return NotFound();
            // remove item or reduce quantity
           basket.RemoveItem(productId, quantity);
            // save changes
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();
            return BadRequest(new ProblemDetails { Title = "Problem removing item in the basket" });
        }

        //Mengambil basket beserta informasi list basketitem yang ada dibasket
        // dan informasi mengenai product pada basket item
        // yang sesuai dengan cookies di browser
        //private async Task<Basket?> RetrieveBasket()
        //{
        //    return await _context.Baskets
        //        .Include(i => i.Items)
        //        .ThenInclude(p => p.Product)
        //        .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        //}

        private async Task<Basket?> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        //ketika membuat object basket baru hanya perlu membuat buyerId nya saja
        // karena Id nya sudah otomatis di buat oleh EF core 
        // dan list items nya udah berisi list kosong karena di inisalisasi new() pada variablenya
        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if(string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }

            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket);
            return basket;
        }

      
    }
}
