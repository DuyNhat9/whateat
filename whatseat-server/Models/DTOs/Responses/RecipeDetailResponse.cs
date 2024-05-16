namespace whatseat_server.Models.DTOs.Responses;

public class RecipeDetailResponse : RecipeResponse
{
    public List<IngredientRes> Ingredients { get; set; }
    public List<Step> Steps { get; set; }
}