namespace whatseat_server.Models.DTOs.Requests;

public class PagedRecipeRequest : PagedRequest
{
    public int RecipeId { get; set; }
}