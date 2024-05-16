using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace whatseat_server.Models;

public class Store
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int StoreId { get; set; }
    [Phone]
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public int ProvinceCode { get; set; }
    public int DistrictCode { get; set; }
    public int WardCode { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; } = false;
    public string AvatarUrl { get; set; }
    public float AvgRating { get; set; }
    public String UserId { get; set; }
    [EmailAddress]
    public string Email { get; set; }
    public string ShopName { get; set; }
    [ForeignKey(nameof(UserId))]
    public IdentityUser User { get; set; }
    [JsonIgnore]
    public ICollection<Order> Order { get; set; }
    [JsonIgnore]
    public ICollection<StoreReview> storeReviews { get; set; }
    [JsonIgnore]
    public ICollection<Product> Products { get; set; }


}