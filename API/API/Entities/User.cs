using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int> //membuat primary key atau Id pada IdentityUser menjadi integer 
    {
        public UserAddress Address { get; set; }
    }
}
