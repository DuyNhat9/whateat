using Newtonsoft.Json;

namespace whatseat_server.Models.DTOs.Responses;

public class CalculateShippingFeeResponse
{
    [JsonProperty("code")]
    public long Code { get; set; }

    [JsonProperty("message")]
    public string Message { get; set; }

    [JsonProperty("data")]
    public Data Data { get; set; }
}

public partial class Data
{
    [JsonProperty("total")]
    public long Total { get; set; }

    [JsonProperty("service_fee")]
    public long ServiceFee { get; set; }

    [JsonProperty("insurance_fee")]
    public long InsuranceFee { get; set; }

    [JsonProperty("pick_station_fee")]
    public long PickStationFee { get; set; }

    [JsonProperty("coupon_value")]
    public long CouponValue { get; set; }

    [JsonProperty("r2s_fee")]
    public long R2SFee { get; set; }
}