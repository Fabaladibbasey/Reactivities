using API.Extensions;
using API.MiddleWare;
using API.SignalR;
using Application.Activities;
using Domain;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));

})
.AddFluentValidation(config =>
{
    config.RegisterValidatorsFromAssemblyContaining<Create>();
});


builder.AddApplicationServices();
builder.AddIdentityServices();
var appContext = builder.Services.BuildServiceProvider().GetRequiredService<DataContext>();
var userManager = builder.Services.BuildServiceProvider().GetRequiredService<UserManager<AppUser>>();
await appContext.Database.MigrateAsync();
await Seed.SeedData(appContext, userManager);


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index", "Fallback");

app.Run();
