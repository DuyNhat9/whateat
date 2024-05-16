using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models;

public class RecipeStep
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RecipeStepId { get; set; }
    public int Step { get; set; }
    public string Content { get; set; }
    public ICollection<RecipeStepImage> RecipeStepImages { get; set; }
}