namespace whatseat_server.Models.DTOs.Responses;

public class RecipeResponse
{
    public int RecipeId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int Serving { get; set; }
    public DateTime CreatedOn { get; set; }
    public Customer Creator { get; set; }
    public int TotalTime { get; set; }
    public float AvgRating { get; set; }
    public int TotalRating { get; set; }
    public int TotalView { get; set; }
    public int totalLike { get; set; }
	public float Calories { get; set; }
	public string videoUrl { get; set; }
    public List<RecipeRecipeType> RecipeTypes { get; set; }
    public string Level { get; set; }
    public List<Photo> Images { get; set; }
    public bool Status { get; internal set; } = true;
	
}