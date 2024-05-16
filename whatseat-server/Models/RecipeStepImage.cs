using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models;

public class RecipeStepImage
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RecipeStepImageId { get; set; }
    public string ImageUrl { get; set; }
}