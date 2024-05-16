using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using whatseat_server.Data;
using whatseat_server.Models;
using whatseat_server.Models.DTOs.Requests;
using whatseat_server.Models.DTOs.Responses;
using whatseat_server.Services;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace whatseat_server.Controllers;
[ApiController]
[Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
public class RecipeController : ControllerBase
{
    private readonly RecipeService _recipeService;
    private readonly CustomerService _customerService;
    private readonly WhatsEatContext _context;

    public RecipeController(
        RecipeService recipeService,
        WhatsEatContext context,
        CustomerService customerService
        )
    {
        _context = context;
        _recipeService = recipeService;
        _customerService = customerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRecipes()
    {
        return Ok(await _recipeService.FindAllRecipes());
    }

    [HttpGet]
    [Route("{recipeId}", Name = "recipeId")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [AllowAnonymous]
    public async Task<IActionResult> GetRecipeDetails(int recipeId)
    {
        Customer customer = null;
        if (User.FindFirst("Id") is not null)
        {
            Guid userId = new Guid(User.FindFirst("Id")?.Value);
            customer = await _customerService.FindCustomerByIdAsync(userId);
        }
        var item = await _recipeService.FindRecipeById(recipeId);
        await _recipeService.AddRecipeHistory(customer, item);
        return item is not null ? Ok(new RecipeDetailResponse
        {
            RecipeId = item.RecipeId,
            Name = item.Name,
            Description = item.Description,
            Serving = item.Serving,
            CreatedOn = item.CreatedOn,
            Creator = item.Creator,
            TotalTime = item.TotalTime,
            AvgRating = item.AvgRating,
            TotalRating = item.TotalRating,
            TotalView = item.TotalView,
            totalLike = item.totalLike,
            videoUrl = item.videoUrl,
            RecipeTypes = await _context.RecipeRecipeTypes.Where(rrt => rrt.RecipeId == item.RecipeId).ToListAsync(),
            Level = item.Level,
            Images = _recipeService.ConvertJsonToPhotos(item.ThumbnailUrl),
            Ingredients = _recipeService.ConvertJsonToIngredients(item.Ingredients),
            Steps = _recipeService.ConvertJsonToSteps(item.Steps)

        }) : NotFound(new { message = "recipe not found" });
    }

    [HttpGet]
    [Route("search")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [AllowAnonymous]
    public async Task<IActionResult> SearchRecipes([FromQuery] RecipeFilter recipeFilter)
    {
        var recipes = await _recipeService.SearchRecipeFullText(recipeFilter);

        var recipeRes = new List<RecipeResponse>();

        foreach (var item in recipes)
        {
            recipeRes.Add(new RecipeResponse
            {
                RecipeId = item.RecipeId,
                Name = item.Name,
                Description = item.Description,
                Serving = item.Serving,
                CreatedOn = item.CreatedOn,
                Creator = item.Creator,
                TotalTime = item.TotalTime,
                AvgRating = item.AvgRating,
                TotalRating = item.TotalRating,
                TotalView = item.TotalView,
                totalLike = item.totalLike,
				Calories = item.Calories,
				videoUrl = item.videoUrl,
                RecipeTypes = await _context.RecipeRecipeTypes.Where(rrt => rrt.RecipeId == item.RecipeId).ToListAsync(),
                Level = item.Level,
                Images = _recipeService.ConvertJsonToPhotos(item.ThumbnailUrl),
                Status = item.Status
            });
        }

        var metadata = new
        {
            recipes.TotalCount,
            recipes.PageSize,
            recipes.CurrentPage,
            recipes.TotalPages,
            recipes.HasNext,
            recipes.HasPrevious
        };

        Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

        return Ok(recipeRes);
    }
	[HttpGet]
	[Route("listre")]
	[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[AllowAnonymous]
	public async Task<IActionResult> ListRe([FromQuery] RecipeFilter recipeFilter)
	{
		var recipes = await _recipeService.SearchRecipeFullText(recipeFilter);

		var recipeRes = new List<RecipeResponse>();

		foreach (var item in recipes)
		{
			recipeRes.Add(new RecipeResponse
			{
				RecipeId = item.RecipeId,
				Name = item.Name,
				Description = item.Description,
				Serving = item.Serving,
				CreatedOn = item.CreatedOn,
				Creator = item.Creator,
				TotalTime = item.TotalTime,
				AvgRating = item.AvgRating,
				TotalRating = item.TotalRating,
				TotalView = item.TotalView,
				totalLike = item.totalLike,
				videoUrl = item.videoUrl,
				RecipeTypes = await _context.RecipeRecipeTypes.Where(rrt => rrt.RecipeId == item.RecipeId).ToListAsync(),
				Level = item.Level,
				Images = _recipeService.ConvertJsonToPhotos(item.ThumbnailUrl),
				Status = item.Status,
                Calories = item.Calories,
			});
		}

		var metadata = new
		{
			recipes.TotalCount,
			recipes.PageSize,
			recipes.CurrentPage,
			recipes.TotalPages,
			recipes.HasNext,
			recipes.HasPrevious
		};

		Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

		return Ok(recipeRes);
	}

	[HttpGet]
    [Route("top-eight")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [AllowAnonymous]
    public async Task<IActionResult> GetTopEight()
    {
        RecipeFilter recipeFilter = new RecipeFilter
        {
            PageSize = 8,
            sortAvgRating = "desc"
        };
        var recipes = await _recipeService.SearchRecipeFullText(recipeFilter);

        var recipeRes = new List<RecipeResponse>();

        foreach (var item in recipes)
        {
            recipeRes.Add(new RecipeResponse
            {
                RecipeId = item.RecipeId,
                Name = item.Name,
                Description = item.Description,
                Serving = item.Serving,
                CreatedOn = item.CreatedOn,
                Creator = item.Creator,
                TotalTime = item.TotalTime,
                AvgRating = item.AvgRating,
                TotalRating = item.TotalRating,
                TotalView = item.TotalView,
                totalLike = item.totalLike,
                videoUrl = item.videoUrl,
                RecipeTypes = await _context.RecipeRecipeTypes.Where(rrt => rrt.RecipeId == item.RecipeId).ToListAsync(),
                Level = item.Level,
                Images = _recipeService.ConvertJsonToPhotos(item.ThumbnailUrl),
                Status = item.Status
            });
        }

        return Ok(recipeRes);

    }

    [HttpGet("reviews")]
    public async Task<IActionResult> GetReviews([FromQuery] PagedRecipeRequest request)
    {
        var reviews = await _recipeService.GetAllRecipeReviews(request);

        var metadata = new
        {
            reviews.TotalCount,
            reviews.PageSize,
            reviews.CurrentPage,
            reviews.TotalPages,
            reviews.HasNext,
            reviews.HasPrevious
        };

        Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

        return Ok(reviews);
    }

    [HttpPost]
    [Route("reviews")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> PostReview([FromBody] RecipeReviewRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customer = await _customerService.FindCustomerByIdAsync(userId);
        var recipe = await _recipeService.FindRecipeById(request.RecipeId);
        RecipeReview recipeReview = new RecipeReview
        {
            Rating = request.Rating,
            Comment = request.Comment,
            CreatedOn = DateTime.UtcNow,
            Recipe = recipe,
            Customer = customer
        };

        var addRes = await _context.RecipeReviews.AddAsync(recipeReview);

        recipe.AvgRating = (recipe.AvgRating * recipe.TotalRating + recipeReview.Rating) / (recipe.TotalRating + 1);
        recipe.TotalRating++;

        var changRes = await _context.SaveChangesAsync();

        return Ok(new { message = "Success" });
    }

    [HttpGet]
    [Route("love")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> GetLovedRecipes([FromQuery] PagedRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customer = await _customerService.FindCustomerByIdAsync(userId);

        PagedList<LovedRecipe> lovedRecipes = await _recipeService.GetLovedRecipes(request, customer);

        List<LovedRecipeResponse> recipeResponses = new List<LovedRecipeResponse>();
        foreach (var lovedRecipe in lovedRecipes)
        {
            Recipe recipe = lovedRecipe.Recipe;
            if (recipe is not null)
            {
                recipeResponses.Add(new LovedRecipeResponse
                {
                    RecipeId = recipe.RecipeId,
                    Name = recipe.Name,
                    Description = recipe.Description,
                    Serving = recipe.Serving,
                    CreatedOn = recipe.CreatedOn,
                    Creator = recipe.Creator,
                    TotalTime = recipe.TotalTime,
                    AvgRating = recipe.AvgRating,
                    TotalRating = recipe.TotalRating,
                    TotalView = recipe.TotalView,
                    totalLike = recipe.totalLike,
                    videoUrl = recipe.videoUrl,
                    RecipeTypes = await _context.RecipeRecipeTypes.Where(rrt => rrt.RecipeId == recipe.RecipeId).ToListAsync(),
                    Level = recipe.Level,
                    Images = _recipeService.ConvertJsonToPhotos(recipe.ThumbnailUrl),
                    LovedOn = lovedRecipe.CreatedOn
                });
            }
        }
        return Ok(recipeResponses);
    }

    [HttpPost]
    [Route("love/{recipeId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> LoveRecipe(int recipeId)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customer = await _customerService.FindCustomerByIdAsync(userId);
        var recipe = await _recipeService.FindRecipeById(recipeId);
        await _recipeService.AddLoveHistory(customer, recipe);
        return Ok();
    }
	[HttpDelete]
    [Route("love/{recipeId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> UnLoveRecipe(int recipeId)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customer = await _customerService.FindCustomerByIdAsync(userId);
        var recipe = await _recipeService.FindRecipeById(recipeId);
        return Ok(await _recipeService.RemoveLoveHistory(customer, recipe));
    }

    [HttpGet]
    [Route("love/total/{recipeId}")]
    public async Task<IActionResult> GetTotalLove(int recipeId)
    {
        return Ok(await _recipeService.GetTotalLove(recipeId));
    }

    [HttpGet]
    [Route("love/isLoved/{recipeId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    [AllowAnonymous]
    public async Task<IActionResult> CheckLove(int recipeId)
    {
        if (User.FindFirst("Id") is null)
        {
            return Ok(false);
        }
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        return Ok(await _recipeService.CheckLove(recipeId, userId));
    }

    [HttpPost]
    [Route("recipe")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> AddRecipe([FromBody] AddRecipeRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customer = await _customerService.FindCustomerByIdAsync(userId);

        List<RecipeRecipeType> recipeTypes = new List<RecipeRecipeType>();

        Recipe recipe = new Recipe
        {
            Name = request.Name,
            Description = request.Description,
            Serving = request.Serving,
            TotalTime = request.TotalTime,
            ThumbnailUrl = request.ThumbnailUrl,
            AvgRating = 0,
            TotalRating = 0,
            TotalView = 0,
            totalLike = 0,
            videoUrl = request.videoUrl,
            Creator = customer,
            Ingredients = request.Ingredients,
            Steps = request.Steps,
            Level = request.Level,
            RecipeRecipeTypes = recipeTypes,
            CreatedOn = DateTime.UtcNow,
            Status = true
        };

        foreach (var item in request.RecipeTypeIds)
        {
            var recipeType = await _context.RecipeTypes
            .FirstOrDefaultAsync(pc => pc.RecipeTypeId == item);

            RecipeRecipeType recipeRecipeType = new RecipeRecipeType
            {
                RecipeType = recipeType,
                Recipe = recipe
            };

            if (recipeType is not null)
            {
                recipeTypes.Add(recipeRecipeType);
            }
        }
        await _context.RecipeRecipeTypes.AddRangeAsync(recipeTypes);
        await _context.Recipes.AddAsync(recipe);
        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = "Success"
        });
    }

    [HttpDelete]
    [Route("{recipeId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> DeleteRecipe(int recipeId)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customer = await _customerService.FindCustomerByIdAsync(userId);
        var recipe = await _recipeService.FindRecipeById(recipeId);

        if (recipe.Creator == customer)
        {
            recipe.Status = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        else
        {
            return Forbid();
        }
    }
}