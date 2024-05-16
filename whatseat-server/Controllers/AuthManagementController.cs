using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using whatseat_server.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using whatseat_server.Configuration;
using whatseat_server.Data;
using whatseat_server.Models;
using whatseat_server.Models.DTOs.Requests;
using whatseat_server.Models.DTOs.Responses;

namespace whatseat_server.Controllers;
[Route("api/auth")]
[ApiController]
public class AuthManagementController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly JwtConfig _jwtConfig;
    // private readonly TokenValidationParameters _tokenValidationParameters;
    private readonly WhatsEatContext _context;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<AuthManagementController> _logger;
    private readonly IOptionsMonitor<JwtConfig> _optionsMonitor;

    public AuthManagementController(
        UserManager<IdentityUser> userManager,
        IOptionsMonitor<JwtConfig> optionsMonitor,
        // TokenValidationParameters tokenValidationParameters,
        WhatsEatContext context,
        RoleManager<IdentityRole> roleManager,
        ILogger<AuthManagementController> logger)
    {
        _userManager = userManager;
        _jwtConfig = optionsMonitor.CurrentValue;
        // _tokenValidationParameters = tokenValidationParameters;
        _context = context;
        _roleManager = roleManager;
        _logger = logger;
        _optionsMonitor = optionsMonitor;
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrationDto user)
    {
        if (ModelState.IsValid)
        {
            var existingUser = await _userManager.FindByEmailAsync(user.Email);

            if (existingUser is not null)
            {
                return BadRequest(new RegistrationResponseDto()
                {
                    Errors = new List<string>() {
                        "Email already in use"
                    },
                    Success = false
                });
            }

            var newUser = new IdentityUser()
            {
                Email = user.Email,
                UserName = user.UserName
            };
            var isCreated = await _userManager.CreateAsync(newUser, user.Password);

            if (isCreated.Succeeded)
            {
                //Create Roles
                if (!await _roleManager.RoleExistsAsync(RoleConstants.Admin))
                {
                    await _roleManager.CreateAsync(new IdentityRole(RoleConstants.Admin));
                }
                if (!await _roleManager.RoleExistsAsync(RoleConstants.Customer))
                {
                    await _roleManager.CreateAsync(new IdentityRole(RoleConstants.Customer));
                }
                if (!await _roleManager.RoleExistsAsync(RoleConstants.Shipper))
                {
                    await _roleManager.CreateAsync(new IdentityRole(RoleConstants.Shipper));
                }
                if (!await _roleManager.RoleExistsAsync(RoleConstants.Store))
                {
                    await _roleManager.CreateAsync(new IdentityRole(RoleConstants.Store));
                }

                if (await _roleManager.RoleExistsAsync(RoleConstants.Customer))
                {
                    await _userManager.AddToRoleAsync(newUser, RoleConstants.Customer);
                }

                var newCustomer = new Customer
                {
                    CustomerId = new Guid(newUser.Id)
                };
                await _context.Customers.AddAsync(newCustomer);
                await _context.SaveChangesAsync();
                var jwtToken = await GenerateJwtToken(newUser);
                return Ok(new RegistrationResponseDto()
                {
                    Success = true,
                    Token = jwtToken
                });
            }
            else
            {
                return BadRequest(new RegistrationResponseDto()
                {
                    Errors = isCreated.Errors.Select(x => x.Description).ToList(),
                    Success = false
                });
            }
        }
        return BadRequest(new RegistrationResponseDto()
        {
            Errors = new List<string>() {
                "Invalid payload"
            },
            Success = false
        });
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto user)
    {
        if (ModelState.IsValid)
        {
            var existingUser = await _userManager.FindByEmailAsync(user.Email);

            if (existingUser is null)
            {
                return BadRequest(new RegistrationResponseDto()
                {
                    Errors = new List<string>() {
                        "Invalid login request"
                    },
                    Success = false
                });
            }

            var isCorrect = await _userManager.CheckPasswordAsync(existingUser, user.Password);
            if (!isCorrect)
            {
                return BadRequest(new RegistrationResponseDto()
                {
                    Errors = new List<string>() {
                        "Invalid login request"
                    },
                    Success = false
                });
            }

            var jwtToken = await GenerateJwtToken(existingUser);
            return Ok(new RegistrationResponseDto()
            {
                Success = true,
                Token = jwtToken,
                UserName = existingUser.UserName,
                UserId = existingUser.Id
            });
        }
        return BadRequest(new RegistrationResponseDto()
        {
            Errors = new List<string>() {
                "Invalid payload"
            },
            Success = false
        });
    }

    private async Task<List<Claim>> GetAllValidClaims(IdentityUser user)
    {
        var _options = new IdentityOptions();

        var claims = new List<Claim> {
            new Claim("Id", user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var userClaims = await _userManager.GetClaimsAsync(user);
        claims.AddRange(userClaims);

        var userRoles = await _userManager.GetRolesAsync(user);

        foreach (var userRole in userRoles)
        {
            var role = await _roleManager.FindByNameAsync(userRole);
            if (role is not null)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole));

                var roleClaims = await _roleManager.GetClaimsAsync(role);
                foreach (var roleClaim in roleClaims)
                {
                    claims.Add(roleClaim);
                }
            }
        }
        return claims;
    }

    private async Task<string> GenerateJwtToken(IdentityUser user)
    {
        var jwtTokenHandler = new JwtSecurityTokenHandler();

        var key = Encoding.ASCII.GetBytes(_jwtConfig.Secret);

        var claims = await GetAllValidClaims(user);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.Add(_jwtConfig.ExpiryTimeFrame),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = jwtTokenHandler.CreateToken(tokenDescriptor);
        var jwtToken = jwtTokenHandler.WriteToken(token);

        return jwtToken;
    }
}