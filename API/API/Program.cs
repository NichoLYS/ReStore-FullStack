using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    //membuat authorization pada swagger
    //agar dapat mengirim token untuk autentikasi di swagger
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + your token in the box below",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };
    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme, Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();
// service identitycore
builder.Services.AddIdentityCore<User>(opt =>
{
    //membuat agar email tidak boleh duplikat(Unique)
    opt.User.RequireUniqueEmail = true;
})
    .AddRoles<Role>()
    //service ini ditambahkan agar dapat mengintegrasikan IdentityCore dengan database yg di konfigurasi pada StoreContext
    .AddEntityFrameworkStores<StoreContext>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
   .AddJwtBearer(opt =>
   {
       opt.TokenValidationParameters = new TokenValidationParameters
       {
           ValidateIssuer = false,
           ValidateAudience = false,
           ValidateLifetime = true,
           ValidateIssuerSigningKey = true,
           IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
           .GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
       };
   }) ;
builder.Services.AddAuthorization();
//menambah service TokenService buatan sendiri
//agar dapat dipakai di class accountController
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<PaymentService>();  

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseDeveloperExceptionPage();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        //config agar setiap kali browser direfresh tidak perlu membuat token baru lagi
        //Mempertahankan token
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });
}

//app.UseHttpsRedirection();
app.UseMiddleware<ExceptionMiddleware>();

// ALlowAnyHeader() mengizinkan mengirim response dan request header dari domain berbeda
// AllowAnyMethod() mengizinkan method http dari domain yang berbeda
// AllowCredentials() mengizinkan cookies untuk dikirim ke api dari domain berbeda
// pada kasus ini localhost:3000 adalah domainnya dan itu adalah frontendnya
app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});

//authentication harus duluan sebelum authoriaztion, karena sebelum kita
//memberi atuhorisasi kepada user, kita perlu tahu dulu siapa user tersebut melalui
//authentication
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
// service userManager ini yang akan melakukan operasi ke database
// mengenai user login, register, role, dll sesuai dengan database yg didaftarkan oleh AddEntityFrameworkStores
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    await context.Database.MigrateAsync();
    await DbInitializer.Initialize(context, userManager);
} catch(Exception ex)
{
    logger.LogError(ex, "A Problem occur during migration");
}
app.Run();
