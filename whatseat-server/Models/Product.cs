using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace whatseat_server.Models;

public class Product
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProductId { get; set; }
    public string Name { get; set; }
    public int InStock { get; set; }
    public int BasePrice { get; set; }
    public string PhotoJson { get; set; }
    public string Description { get; set; }
    public string WeightServing { get; set; }
    public int TotalSell { get; set; }
    public bool Status { get; set; } = true;
    public ProductCategory ProductCategory { get; set; }
    [JsonIgnore]
    public Store Store { get; set; }
    public int ProductNo { get; set; }
    public DateTime CreatedOn { get; set; }
    [JsonIgnore]
    public ICollection<OrderDetail> OrderDetails { get; set; }
    [JsonIgnore]
    public ICollection<ProductImage> ProductImages { get; set; }
    [JsonIgnore]
    public ICollection<CartDetail> CartDetails { get; set; }
    [JsonIgnore]
    public ICollection<LovedProduct> LovedProducts { get; set; }

}