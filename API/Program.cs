using API;
using API.MiddleWare;
using Application.Activities;
using FluentValidation.AspNetCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddFluentValidation(cfg =>
{
    cfg.RegisterValidatorsFromAssemblyContaining<Create>();
});
builder.AddApplicationServices();

Seed.SeedData(builder.Services.BuildServiceProvider().GetService<DataContext>());
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthorization();

app.MapControllers();

app.Run();
