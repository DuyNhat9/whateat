namespace whatseat_server.Models.DTOs.Responses;

public class MenuRecipeResponse
{
    public int RecipeId { get; set; }
    public string RecipeName { get; set; }
    public int RecipeType { get; set; }
    public string RecipeTypeName { get; set; }
    public List<Photo> Images { get; set; }
}