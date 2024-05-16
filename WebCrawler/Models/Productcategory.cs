using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Productcategory
    {
        public Productcategory()
        {
            Products = new HashSet<Product>();
        }

        public int ProductCategoryId { get; set; }
        public string Name { get; set; } = null!;
        public string? Images { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}
