using System.Text.Json.Serialization;

namespace WhatsEatCrawler;
public class Repository
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
}
