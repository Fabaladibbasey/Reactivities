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

//security headers
app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());
app.UseCsp(opt => opt
    .BlockAllMixedContent()
    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com", "https://cdn.jsdelivr.net"))
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "data:"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com", "blob:", "data:"))
    .ScriptSources(s => s.Self().CustomSources("sha256-qgWkIiUZ8sH5O3daGyxJbVYyDRopNx6ICWmw5nTei8M=")));


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // app.UseHsts(); but not working with heroku

    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
        await next(); // or next.Invoke();
    });
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
