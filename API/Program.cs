using Application.Activities;

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

// var appContext = builder.Services.BuildServiceProvider().GetRequiredService<DataContext>();
// var userManager = builder.Services.BuildServiceProvider().GetRequiredService<UserManager<AppUser>>();
// await appContext.Database.MigrateAsync();
// await Seed.SeedData(appContext, userManager);


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

//security headers
app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.StrictOriginWhenCrossOrigin());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());

app.UseCspReportOnly(opt => opt
    .BlockAllMixedContent()
    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com", "https://cdn.jsdelivr.net",
    "sha256-lmto2U1o7YINyHPg9TOCjIt+o5pSFNU/T2oLxDPF+uw=",
    "sha256-DpOoqibK/BsYhobWHnU38Pyzt5SjDZuR/mFsAiVN7kk=",
    "https://accounts.google.com/",
    "sha256-VdJLYZrBOhBJj2L4/+iZupDWpR1sppzSbgJzXdO/Oss=",
    "sha256-e6v1SBY0/nWORF0cSCN2iKUc90hYDPlQUe8okJKLZcY="
    ))
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "data:"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com",
    "https://www.facebook.com",
    "https://platform-lookaside.fbsbx.com",
    "https://lh3.googleusercontent.com",
     "blob:", "data:"))
    .ScriptSources(s => s.Self().CustomSources("sha256-qgWkIiUZ8sH5O3daGyxJbVYyDRopNx6ICWmw5nTei8M=",
    "sha256-ywU5ZDlnzR9r0MIEJ2UaLr3QWAKrpnMi0JVVxc0e33A=",
    "sha256-ZcCjBteNbNJkdEAqr4WEU8gQ2tx/ihmfS2jrWd0UPD8=",
    "sha256-ZcCjBteNbNJkdEAqr4WEU8gQ2tx/ihmfS2jrWd0UPD8=",
    "https://connect.facebook.net/en_US/sdk.js",
    "https://connect.facebook.net/en_US/bundle/sdk.js/",
    "https://accounts.google.com/gsi/client",
    "sha256-dAMs3/Yp2SSUrhzjwbwLmPPB0soj/thHemUrM4u00O8=")));


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

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}


await app.RunAsync();
