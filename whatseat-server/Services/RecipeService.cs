using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using whatseat_server.Data;
using whatseat_server.Models;
using whatseat_server.Models.DTOs.Requests;
using whatseat_server.Models.DTOs.Responses;

namespace whatseat_server.Services;

public class RecipeService
{
    private readonly WhatsEatContext _context;
    public RecipeService(WhatsEatContext context)
    {
        _context = context;
    }
    public async Task<List<Recipe>> FindAllRecipes()
    {
        // TODO: sort, paginate
        return await _context.Recipes.AsNoTracking().ToListAsync();
    }

    public async Task<Recipe> FindRecipeById(int recipeId)
    {
        return await _context.Recipes.Include(r => r.Creator).FirstOrDefaultAsync(p => p.RecipeId == recipeId);
    }
	public async Task<List<Recipe>> FindRecipeByCreator(Customer customer)
    {
        return await _context.Recipes.Where(p => p.Creator.CustomerId == customer.CustomerId).Where(x => x.Status == true).ToListAsync();
    }


    public async Task<PagedList<Recipe>> SearchRecipeFullText(RecipeFilter recipeFilter)
    {
        IQueryable<Recipe> recipes = _context.Recipes.AsQueryable();
        if (!String.IsNullOrEmpty(recipeFilter.searchTerm))
        {
            recipes = _context.Recipes.FromSqlInterpolated($"select * from recipes where MATCH(name) against ({recipeFilter.searchTerm}) ORDER BY avgRating DESC ");
        }

        recipes = recipes.Where(r => r.Status == true);

        if (!String.IsNullOrEmpty(recipeFilter.level))
        {
            recipes = recipes.Where(r => r.Level == recipeFilter.level);
        }

        switch (recipeFilter.sortDate)
        {
            case "asc":
                recipes = recipes.OrderBy(r => r.CreatedOn);
                break;
            case "desc":
                recipes = recipes.OrderByDescending(r => r.CreatedOn);
                break;
            default:
                break;
        }

        switch (recipeFilter.sortAvgRating)
        {
            case "asc":
                recipes = recipes.OrderBy(r => r.AvgRating);
                break;
            case "desc":
                recipes = recipes.OrderByDescending(r => r.AvgRating);
                break;
            default:
                break;
        }

        switch (recipeFilter.sortTotalView)
        {
            case "asc":
                recipes = recipes.OrderBy(r => r.TotalView);
                break;
            case "desc":
                recipes = recipes.OrderByDescending(r => r.TotalView);
                break;
            default:
                break;
        }

        if (recipeFilter.MinTotalTime > 0)
        {
            recipes = recipes.Where(r => r.TotalTime >= recipeFilter.MinTotalTime);
        }

        if (recipeFilter.MaxTotalTime > 0)
        {
            recipes = recipes.Where(r => r.TotalTime <= recipeFilter.MaxTotalTime);
        }

        if (recipeFilter.recipeTypes != null && recipeFilter.recipeTypes.Length > 0)
        {
            recipes = recipes
                .Where(r => r.RecipeRecipeTypes
                    .Any(rrt => rrt.RecipeType != null && recipeFilter.recipeTypes.Contains(rrt.RecipeTypeId)));
        }

        var res = await PagedList<Recipe>.ToPagedList(recipes, recipeFilter.PageNumber, recipeFilter.PageSize);

        return res;
    }


    public async Task<PagedList<RecipeReview>> GetAllRecipeReviews(PagedRecipeRequest pagedRequest)
    {

        var recipe = _context.Recipes.FirstOrDefault(r => r.RecipeId == pagedRequest.RecipeId);
        var recipeReviews = _context.RecipeReviews.AsNoTracking()
            .OrderByDescending(rr => rr.CreatedOn)
            .Include(rv => rv.Customer)
            .Where(rr => rr.Recipe == recipe);

        var res = await PagedList<RecipeReview>.ToPagedList(recipeReviews, pagedRequest.PageNumber, pagedRequest.PageSize);
        return res;
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

    public async Task<int> AddRecipeHistory(Customer customer, Recipe recipe)
    {
        var res = await _context.RecipeViewHistories.AddAsync(new RecipeViewHistory
        {
            CreatedOn = DateTime.UtcNow,
            Customer = customer,
            Recipe = recipe
        });

        recipe.TotalView += 1;

        return await _context.SaveChangesAsync();
    }

    public async Task<int> AddLoveHistory(Customer customer, Recipe recipe)
    {
        var res = await _context.LovedRecipes.AddAsync(new LovedRecipe
        {
            CreatedOn = DateTime.UtcNow,
            Customer = customer,
            Recipe = recipe
        });
        return await _context.SaveChangesAsync();
    }

    public async Task<LovedRecipe> GetLovedRecipe(Customer customer, Recipe recipe)
    {
        return await _context.LovedRecipes.FirstOrDefaultAsync(r => r.Recipe == recipe && r.Customer == customer);
    }

    public async Task<LovedRecipe> RemoveLoveHistory(Customer customer, Recipe recipe)
    {
        var lovedRecipe = await this.GetLovedRecipe(customer, recipe);
        var res = _context.LovedRecipes.Remove(lovedRecipe).Entity;
        await _context.SaveChangesAsync();
        return res;
    }

    public async Task<PagedList<LovedRecipe>> GetLovedRecipes(PagedRequest request, Customer customer)
    {
        var recipes = _context.LovedRecipes.Where(l => l.Customer == customer).OrderByDescending(l => l.CreatedOn).AsQueryable();
        var res = await PagedList<LovedRecipe>.ToPagedList(recipes.Include(s => s.Recipe), request.PageNumber, request.PageSize);
        return res;
    }

    public async Task<int> GetTotalLove(int recipeId)
    {
        var totalLike = await _context.Recipes.AsNoTracking().FirstOrDefaultAsync(r => r.RecipeId == recipeId);
        int totalLove = await _context.LovedRecipes.AsNoTracking().CountAsync(l => l.RecipeId == recipeId);
        return totalLike.totalLike + totalLove;
    }

    public async Task<Boolean> CheckLove(int recipeId, Guid userId)
    {
        return await _context.LovedRecipes.AsNoTracking().AnyAsync(s => s.RecipeId == recipeId && s.CustomerId == s.CustomerId);
    }
}