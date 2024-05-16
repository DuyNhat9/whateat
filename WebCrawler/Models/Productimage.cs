using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Productimage
    {
        public int ProductImageId { get; set; }
        public string? ImageUrl { get; set; }
        public int? ProductId { get; set; }

        public virtual Product? Product { get; set; }
    }
}
