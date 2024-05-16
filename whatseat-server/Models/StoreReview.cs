using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace whatseat_server.Models;

public class StoreReview
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int StoreReviewId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public DateTime CreatedOn { get; set; }
    [JsonIgnore]
    public Store Store { get; set; }
    [JsonIgnore]
    public Customer Customer { get; set; }
}