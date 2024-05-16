namespace whatseat_server.Models.DTOs.Requests;

public class RecipeReviewRequest
{
    public int RecipeId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
}