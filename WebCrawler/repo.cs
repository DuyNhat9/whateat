using System;
using System.Text.Json.Serialization;

namespace WebCrawler
{
    public class Repository
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
    }
}