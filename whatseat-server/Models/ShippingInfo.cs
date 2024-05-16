using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace whatseat_server.Models;

public class ShippingInfo
{
  [Key, Column(Order = 0)]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public int ShippingInfoId { get; set; }
  public string Name { get; set; }
  public string PhoneNumber { get; set; }
  public int ProvinceCode { get; set; }
  public int DistrictCode { get; set; }
  public int WardCode { get; set; }
  public string Address { get; set; }
  [JsonIgnore]
  public Customer Customer { get; set; }
  public bool Status { get; set; }
}