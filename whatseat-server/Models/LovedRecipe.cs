using Newtonsoft.Json;

namespace whatseat_server.Models;

public class LovedRecipe
{
    public Guid CustomerId { get; set; }
    [JsonIgnore]
    public Customer Customer { get; set; }
    public int RecipeId { get; set; }
    [JsonIgnore]
    public Recipe Recipe { get; set; }
    public DateTime CreatedOn { get; set; }
}