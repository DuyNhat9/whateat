using whatseat_server.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using whatseat_server.Data;

namespace whatseat_server.Controllers;
[Route("api/auth")]
[ApiController]
public class ManagerController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    // private readonly TokenValidationParameters _tokenValidationParameters;
    private readonly WhatsEatContext _context;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<AuthManagementController> _logger;

    public ManagerController(
        UserManager<IdentityUser> userManager,
        // TokenValidationParameters tokenValidationParameters,
        WhatsEatContext context,
        RoleManager<IdentityRole> roleManager,
        ILogger<AuthManagementController> logger)
    {
        _userManager = userManager;
        // _tokenValidationParameters = tokenValidationParameters;
        _context = context;
        _roleManager = roleManager;
        _logger = logger;
    }

    [HttpGet]
    [Route("waiting-stores")]
    public async Task<IActionResult> GetWaitingStore()
    {
        var storeList = await _context.Stores.AsNoTracking().Where(s => s.IsActive == false).ToListAsync();
        return Ok(storeList);
    }

    [HttpPost]
    [Route("grant-store")]
    public async Task<IActionResult> GrantStore([FromBody] int storeId)
    {
        var store = await _context.Stores.FirstOrDefaultAsync(s => s.StoreId == storeId);
        store.IsActive = true;
        await _context.SaveChangesAsync();

        var user = await _userManager.FindByIdAsync(store.UserId.ToString());
        await _userManager.AddToRoleAsync(user, RoleConstants.Store);
        return Ok(new
        {
            message = "success"
        });
    }
}