namespace whatseat_server.Models.DTOs.Requests;

public class OrderShippingFeeRequest
{
    public int ServiceId { get; set; }
    public readonly int FromDistrictId = 1463;
    public int ToDistrictId { get; set; }
    public int ToWardCode { get; set; }
}