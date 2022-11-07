using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly HttpClient _httpClient;

        private readonly IConfiguration _config;

        public AccountController(UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager, TokenService tokenService,
        IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _config = config;
            _httpClient = new HttpClient()
            {
                BaseAddress = new System.Uri("https://graph.facebook.com")
            };
            // _httpClient.BaseAddress = new Uri(config["ExternalAuthUrl"]);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == loginDto.Email);
            if (user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {
                await SetRefreshTokenCookie(user);

                return CreateUserObject(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email is taken");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("username", "Username is taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.UserName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await SetRefreshTokenCookie(user);

                return CreateUserObject(user);
            }

            return BadRequest("Problem registering user");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
            if (user == null) return NotFound();

            await SetRefreshTokenCookie(user); // you not need to call this method here, because you already have a token in the cookie

            return CreateUserObject(user);
        }

        [AllowAnonymous]
        [HttpPost("fbLogin")]
        public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
        {
            var verifyToken = await _httpClient.GetAsync($"debug_token?input_token={accessToken}&access_token={_config["Facebook:AppId"]}|{_config["Facebook:AppSecret"]}");
            if (!verifyToken.IsSuccessStatusCode)
            {
                return Unauthorized();
            }

            var result = await _httpClient.GetAsync($"me?fields=id,name,email,picture.width(100).height(100)&access_token={accessToken}");
            if (!result.IsSuccessStatusCode)
            {
                return Unauthorized();
            }

            var userInfo = await result.Content.ReadAsStringAsync();
            var fbUser = JsonConvert.DeserializeObject<dynamic>(userInfo);

            var userName = (string)fbUser.id;
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == userName);

            if (user == null)
            {

                user = new AppUser
                {
                    DisplayName = (string)fbUser.name,
                    Email = (string)fbUser.email,
                    UserName = (string)fbUser.id,
                    Photos = new List<Photo>
                    {
                        new Photo
                        {
                            Id = Guid.NewGuid(),
                            PublicId = "fb_" + fbUser.id,
                            Url = (string)fbUser.picture.data.url,
                            IsMain = true
                        }
                    }
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    return BadRequest("Problem creating user");
                }

            }

            await SetRefreshTokenCookie(user);

            return CreateUserObject(user);
        }

        //google login
        [AllowAnonymous]
        [HttpPost("googleLogin")]
        public async Task<ActionResult<UserDto>> GoogleLogin(string accessToken)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(accessToken, new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string> { _config["Google:ClientId"] }
            });
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == payload.Email);

            if (user == null)
            {
                user = new AppUser
                {
                    DisplayName = payload.Name,
                    Email = payload.Email,
                    UserName = payload.Email,
                    Photos = new List<Photo>
                    {
                        new Photo
                        {
                            Id = Guid.NewGuid(),
                            PublicId = "google_" + payload.Email,
                            Url = payload.Picture,
                            IsMain = true
                        }
                    }
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    return BadRequest("Problem creating user");
                }
            }

            await SetRefreshTokenCookie(user);
            return CreateUserObject(user);
        }

        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users
            .Include(r => r.RefreshTokens)
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));
            if (user == null) return Unauthorized();

            var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);
            if (oldToken != null && !oldToken.IsActive) return Unauthorized();

            return CreateUserObject(user);
        }

        private async Task SetRefreshTokenCookie(AppUser user)
        {
            var refreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            });
        }


        private UserDto CreateUserObject(AppUser user)
        {

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Token = _tokenService.CreateToken(user),
                UserName = user.UserName,
                Image = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url
            };
        }


        //One easiest way, but I'm not using it
        [Authorize]
        [HttpPut]
        public async Task<ActionResult> EditUser(EditDto editDto)
        {
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
            if (user == null) return NotFound();

            user.DisplayName = editDto.DisplayName;
            user.Bio = editDto.Bio;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) return NoContent();

            return BadRequest("Problem updating user");
        }

    }
}