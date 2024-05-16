namespace whatseat_server.Models.DTOs.Requests;

public class RecipeFilter : PagedRequest
{
    public string searchTerm { get; set; }
    public string sortDate { get; set; }
    public string sortAvgRating { get; set; }
    public string sortTotalView { get; set; }
    public int MinTotalTime { get; set; }
    public int MaxTotalTime { get; set; }
    public int[] recipeTypes { get; set; }
    public string level { get; set; }
}