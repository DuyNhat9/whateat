using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using whatseat_server.Data;
using whatseat_server.Models;
using whatseat_server.Models.DTOs.Requests;
using whatseat_server.Services;

namespace whatseat_server.Controllers;
[ApiController]
[Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly MenuService _menuService;
    private readonly CustomerService _customerService;
    private readonly WhatsEatContext _context;

    public MenuController(MenuService menuService, CustomerService customerService, WhatsEatContext context)
    {
        _menuService = menuService;
        _customerService = customerService;
        _context = context;
    }

    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> PostMenu([FromBody] MenuRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customer = await _customerService.FindCustomerByIdAsync(userId);
        Menu menu = await _menuService.AddMenu(customer, request);
        return Ok(menu);
    }
    [HttpGet]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> GetMyMenus()
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customer = await _customerService.FindCustomerByIdAsync(userId);
        List<Menu> menu = await _menuService.GetMenusByCustomer(customer);
        return Ok(menu);
    }
    [HttpGet]
    [Route("{menuId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> GetMyMenu(int menuId)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customer = await _customerService.FindCustomerByIdAsync(userId);
        Menu menu = await _menuService.GetMenuById(customer, menuId);
        var tablejoin = _context.Recipes.FromSqlInterpolated($"SELECT Recipes.RecipeId,Recipes.Name, Recipes.Description, Recipes.Serving, Recipes.CreatedOn, Recipes.CreatorCustomerId, Recipes.TotalTime, Recipes.AvgRating, Recipes.TotalRating, Recipes.TotalView, Recipes.totalLike, Recipes.videoUrl, Recipes.Level, Recipes.ThumbnailUrl, Recipes.Ingredients, Recipes.Steps, Recipes.RecipeTypeId, Recipes.Fake, Recipes.Calo, Recipes.RecipeNo, Recipes.Calories, Recipes.Status FROM Recipes INNER JOIN MenuDetails ON Recipes.RecipeId= MenuDetails.RecipeId Where MenuDetails.MenuID = {(menuId)}");

		if (menu is null)
        {
            return Forbid();
        }
		return Ok(tablejoin);
    }

    [HttpDelete]
    [Route("{menuId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> DeleteMyMenu(int menuId)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customer = await _customerService.FindCustomerByIdAsync(userId);
        Menu menu = await _menuService.GetMenuById(customer, menuId);
        if (menu is null)
        {
            return Forbid();
        }

        _context.Remove(menu);

        await _context.SaveChangesAsync();

        return NoContent();
    }
    // [HttpGet]
    // [Route("/{menuId}")]
    // public async Task<IActionResult> GetMenuDetail(int menuId) {

    // }
}