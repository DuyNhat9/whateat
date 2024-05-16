using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models;

public class ProductCategory
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProductCategoryId { get; set; }
    [Required]
    public string Name { get; set; }
    public string Images { get; set; }
}