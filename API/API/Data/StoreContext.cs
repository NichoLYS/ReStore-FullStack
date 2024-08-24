using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User, Role, int>
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }    
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<Order> Orders {  get; set; } 
        //Method yang dipanggil dari class IdentityDbContext(overriding)//
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
                .HasOne(a => a.Address)
                .WithOne() // menandakan one to one relationship dengan Address
                .HasForeignKey<UserAddress>(a => a.Id) // mempunyai foreignkey dengan Id di userAddress
                .OnDelete(DeleteBehavior.Cascade); // jika user didelete maka UserAddress juga akan hilang

            //MENGINSERT DATA ROLE PADA tabel IdentityRole(AspNetRoles)
            builder.Entity<Role>()
                .HasData(
                    new Role { Id = 1, Name = "Member", NormalizedName = "MEMBER" },
                    new Role { Id = 2, Name = "Admin", NormalizedName = "ADMIN" }
                );
        }

    }
}
