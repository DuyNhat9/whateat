using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using whatseat_server.Data;

namespace whatseat_server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SetupController : ControllerBase
{
    private readonly WhatsEatContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<SetupController> _logger;
    public SetupController(
        WhatsEatContext context,
        UserManager<IdentityUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ILogger<SetupController> logger)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
    }
    [HttpGet]
    public IActionResult GetAllRoles()
    {
        var roles = _roleManager.Roles.ToList();
        return Ok(roles);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRole(string name)
    {
        var roleExist = await _roleManager.RoleExistsAsync(name);

        if (!roleExist)
        {
            var roleResult = await _roleManager.CreateAsync(new IdentityRole(name));

            if (roleResult.Succeeded)
            {
                _logger.LogInformation($"The role {name} has been successfully added");
                return Ok(new
                {
                    result = $"The role {name} has been successfully added"
                });
            }
            else
            {
                _logger.LogInformation($"The role {name} has not been added");
                return BadRequest(new
                {
                    result = $"The role {name} has not been added"
                });
            }
        }

        return BadRequest(new { error = "Role already exist" });
    }

    [HttpGet]
    [Route("GetAllUsers")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        return Ok(users);
    }

    [HttpPost]
    [Route("AddUserToRole")]
    public async Task<IActionResult> AddUserToRole(string email, string role)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
        {
            _logger.LogInformation($"User with {email}  does not exist");
            return BadRequest(new
            {
                error = "User does not exist"
            });
        }

        var roleExist = await _roleManager.RoleExistsAsync(role);

        if (!roleExist)
        {
            _logger.LogInformation($"User with {role}  does not exist");
            return BadRequest(new
            {
                error = "Role does not exist"
            });
        }

        var result = await _userManager.AddToRoleAsync(user, role);
        if (result.Succeeded)
        {
            return Ok(new
            {
                result = "Success"
            });
        }
        else
        {
            _logger.LogInformation($"The user could not be added to the role");
            return BadRequest(new
            {
                error = "The user could not be added to the role"
            });
        }
    }
}