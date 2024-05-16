using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace whatseat_server.Models;

public class Recipe
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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
    public string videoUrl { get; set; }
    public string Level { get; set; }
    public string ThumbnailUrl { get; set; }
    public string Ingredients { get; set; }
    public string Steps { get; set; }
    public int RecipeNo { get; set; }
    public float Calories { get; set; }
    public bool Status { get; set; }

    [JsonIgnore]
    public List<RecipeRecipeType> RecipeRecipeTypes { get; set; }
    public string RecipeTypeId { get; set; }
    [JsonIgnore]
    public ICollection<LovedRecipe> LovedRecipes { get; set; }
    [JsonIgnore]
    public ICollection<MenuDetail> MenuDetails { get; set; }
}