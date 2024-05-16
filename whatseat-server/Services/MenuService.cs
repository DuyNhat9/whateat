using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using whatseat_server.Data;
using whatseat_server.Models;
using whatseat_server.Models.DTOs.Requests;
using whatseat_server.Models.DTOs.Responses;

namespace whatseat_server.Services;

public class MenuService
{
    private readonly WhatsEatContext _context;
    public MenuService(WhatsEatContext context)
    {
        _context = context;
    }
    public async Task<Menu> AddMenu(Customer customer, MenuRequest request)
    {
        Menu menu = new Menu
        {
            ModifiedOn = DateTime.UtcNow,
            MenuName = request.MenuName,
            MenuDetails = new List<MenuDetail>(),
            Customer = customer
        };

        foreach (var recipeId in request.RecipeIds)
        {
            Recipe recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.RecipeId == recipeId);
            if (recipe is not null)
            {
                menu.MenuDetails.Add(new MenuDetail
                {
                    Recipe = recipe
                });
            }
        }
        var menuRes = await _context.Menus.AddAsync(menu);
        await _context.SaveChangesAsync();
        return menuRes.Entity;
    }

    public async Task<Menu> findMenuById(int menuId)
    {
        return await _context.Menus.AsNoTracking().Include(m => m.MenuDetails)
            .Include(m => m.Customer).FirstOrDefaultAsync(m => m.MenuId == menuId);
    }

    public async Task<List<Menu>> GetMenusByCustomer(Customer customer)
    {
        return await _context.Menus.Where(m => m.Customer == customer).ToListAsync();
    }

    public async Task<Menu> GetMenuById(Customer customer, int menuId)
    {
        return await _context.Menus.FirstOrDefaultAsync(m => m.Customer == customer && m.MenuId == menuId);
    }

    public async Task<List<MenuDetail>> GetMenuDetails(int menuId)
    {
        return await _context.MenuDetails.Include(m => m.Recipe).Where(m => m.MenuId == menuId).ToListAsync();
    }
	public List<Photo> ConvertJsonToPhotos(string jsonPhotos)
	{
		jsonPhotos = jsonPhotos.Substring(1, jsonPhotos.Length - 2);
		List<Photo> result = new List<Photo>();
		try
		{
			result = JsonConvert.DeserializeObject<List<Photo>>(jsonPhotos);
			return result;
		}
		catch (Exception) { return null; }
	}

	public List<IngredientRes> ConvertJsonToIngredients(string jsonIngredient)
	{
		return JsonConvert.DeserializeObject<List<IngredientRes>>(jsonIngredient);
	}

	public List<Step> ConvertJsonToSteps(string jsonSteps)
	{
		return JsonConvert.DeserializeObject<List<Step>>(jsonSteps);
	}
}