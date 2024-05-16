using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace whatseat_server.Models;

public class Menu
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int MenuId { get; set; }
    public string MenuName { get; set; }
    public DateTime ModifiedOn { get; set; }
    [JsonIgnore]
    public ICollection<MenuDetail> MenuDetails { get; set; }
    [JsonIgnore]
    public Customer Customer { get; set; }
}