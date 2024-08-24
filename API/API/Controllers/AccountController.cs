using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {   
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context) 
        {
            _context = context;
            _userManager = userManager;
            _tokenService = tokenService;
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            //mencari apkah loginDto.Username ada di database
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            //mencheck  apakah username null dan mencheck apakah loginDto.Password sesuai dengan yg di database 
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                return Unauthorized();
            }

            var userBasket = await RetrieveBasket(loginDto.Username);
            var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            //mengganti buyerId dari anonBasket menjadi username user yang login
            // setelah diganti itu menghapus anonBasket tersebut dari cookies
            // dan menyimpan anonBasket yang diganti tersebut ke DB
            // sehingga ketika direturn anonBasket tersebut tidak null
            if (anonBasket != null)
            {
                if (userBasket != null) _context.Baskets.Remove(userBasket);
                anonBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }


            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                //userBasket dibuat nullabel agar ketika anonBasket nya null, maka dia dapat mereturn userBasket yang null tanpa ada error
                Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User { UserName = registerDto.Username, Email = registerDto.Email };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    //modelState itu berasal dari class ControlerBase
                    //yang diwariskan ke BaseApiController
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }
            await _userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201);
        }

        //atribut Authorize untuk melindungi endpoint agar tidak dihit jika bearer tokennya belum dikirim
        //dan mencheck autentikasi melalui token yang digenerate
        //value yg hrs dikirim supaya authorize [Bearer tokennya]
        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            //mencari nama yang sesuai yang ada pada claim di token
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var userBasket = await RetrieveBasket(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto()
            };
        }
        [Authorize]
        [HttpGet("saveAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            //mengakses table user dari userManager, sama seperti memakai context
            return await _userManager.Users
                .Where(x => x.UserName == User.Identity.Name)
                .Select(user => user.Address)
                .FirstOrDefaultAsync();
        }

        private async Task<Basket?> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }


    }
}
