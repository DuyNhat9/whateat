namespace whatseat_server.Models.DTOs.Requests;

public class ShippingInfoRequest
{
  public string Name { get; set; }
  public string PhoneNumber { get; set; }
  public int ProvinceCode { get; set; }
  public int DistrictCode { get; set; }
  public int WardCode { get; set; }
  public string Address { get; set; }
}