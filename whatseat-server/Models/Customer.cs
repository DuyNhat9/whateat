using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace whatseat_server.Models;

public class Customer
{
    public Guid CustomerId { get; set; }
    public string Name { get; set; }
    [EmailAddress]
    public string Email { get; set; }
    public string IDCard { get; set; }
    public string AvatarUrl { get; set; }
    public float KcalPerDay { get; set; }
    public string Allergy { get; set; }
    // [JsonIgnore]
    // public ShippingInfo DefaultShippingInfo { get; set; }
    [JsonIgnore]
    public ICollection<CartDetail> CartDetails { get; set; }
    [JsonIgnore]
    public ICollection<ShippingInfo> ShippingInfos { get; set; }
    [JsonIgnore]
    public ICollection<Recipe> Recipes { get; set; }
    [JsonIgnore]
    public ICollection<Order> Orders { get; set; }
    [JsonIgnore]
    public ICollection<LovedProduct> LovedProducts { get; set; }
    [JsonIgnore]
    public ICollection<LovedRecipe> LovedRecipes { get; set; }
    [JsonIgnore]
    public ICollection<StoreReview> storeReviews { get; set; }

    [JsonIgnore]
    public ICollection<Menu> Menus { get; set; }
}