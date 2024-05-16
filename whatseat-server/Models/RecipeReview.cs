using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models;
public class RecipeReview
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RecipeReviewId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public DateTime CreatedOn { get; set; }
    public Recipe Recipe { get; set; }
    public Customer Customer { get; set; }
}