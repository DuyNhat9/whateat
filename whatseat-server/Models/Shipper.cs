using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace whatseat_server.Models;
public class Shipper
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ShipperId { get; set; }
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public int ProvinceCode { get; set; }
    public int DistrictCode { get; set; }
    public int WardCode { get; set; }
    public string UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public IdentityUser User { get; set; }
}