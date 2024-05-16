namespace WhatsEatCrawler.DTOs.Responses;
using System;
using System.Collections.Generic;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
public class ProductIdList
{
    [JsonProperty("code")]
    public long Code { get; set; }

    [JsonProperty("data")]
    public List<Datum> Data { get; set; }

    [JsonProperty("message")]
    public string Message { get; set; }

    [JsonProperty("checksum")]
    public string Checksum { get; set; }
}

public class Datum
{
    [JsonProperty("productKindId")]
    public long ProductKindId { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("displayOrder")]
    public long DisplayOrder { get; set; }

    [JsonProperty("productIds")]
    public List<long> ProductIds { get; set; }
}