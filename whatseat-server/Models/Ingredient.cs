using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models;

public class Ingredient
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IngredientId { get; set; }
    public int Quantity { get; set; }
    public Unit Unit { get; set; }
    public bool IsMainIngredient { get; set; }
    public Recipe Recipe { get; set; }
}