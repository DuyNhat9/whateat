using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace whatseat_server.Models.DTOs.Requests
{
    public class CalculateShippingFeeRequest
    {
        [JsonProperty("service_id")]
        public long ServiceId { get; set; }

        [JsonProperty("insurance_value")]
        public long InsuranceValue { get; set; }

        [JsonProperty("coupon")]
        public object Coupon { get; set; }

        [JsonProperty("from_district_id")]
        public long FromDistrictId { get; set; }

        [JsonProperty("to_district_id")]
        public long ToDistrictId { get; set; }

        [JsonProperty("to_ward_code")]
        public string ToWardCode { get; set; }

        [JsonProperty("height")]
        public long Height { get; set; }

        [JsonProperty("length")]
        public long Length { get; set; }

        [JsonProperty("weight")]
        public long Weight { get; set; }

        [JsonProperty("width")]
        public long Width { get; set; }
    }
}