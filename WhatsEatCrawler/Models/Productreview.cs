using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Productreview
    {
        public int ProductReviewId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ProductId { get; set; }
        public Guid? CustomerId { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual Product? Product { get; set; }
    }
}
