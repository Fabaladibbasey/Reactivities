using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServices
    {
        public static void AddApplicationServices(this WebApplicationBuilder builder)
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
            });
            builder.Services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .WithOrigins("http://localhost:3000");
                });
            });
            builder.Services.AddMediatR(typeof(List.Handler).Assembly);
            builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
            builder.Services.AddScoped<IUserAccessor, UserAccessor>();
            builder.Services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinaryConfig"));
            builder.Services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
            });
        }
    }
}