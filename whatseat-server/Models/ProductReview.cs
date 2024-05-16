using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models;
public class ProductReview
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProductReviewId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public DateTime CreatedOn { get; set; }
    public Product Product { get; set; }
    public Customer Customer { get; set; }
}