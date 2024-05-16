using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace whatseat_server.Models;

public class RecipeRecipeType
{
    [Key]
    public int RecipeId { get; set; }
    [JsonIgnore]
    public Recipe Recipe { get; set; }
    [Key]
    public int RecipeTypeId { get; set; }
    [JsonIgnore]
    public RecipeType RecipeType { get; set; }
}