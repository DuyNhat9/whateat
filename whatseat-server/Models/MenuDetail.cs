using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace whatseat_server.Models;

public class MenuDetail
{
    public int MenuId { get; set; }
    [JsonIgnore]
    public Menu Menu { get; set; }
	[NotMapped]
	public int RecipeId { get; set; }
    [JsonIgnore]
    public Recipe Recipe { get; set; }
}
