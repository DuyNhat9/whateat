using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models;
public class RecipeRating
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RecipeRatingId { get; set; }
    public int Rating { get; set; }
    public DateTime CreatedOn { get; set; }
    public Customer Customer { get; set; }
    public Recipe Recipe { get; set; }

}