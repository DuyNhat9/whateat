using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Storereview
    {
        public int StoreReviewId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? StoreId { get; set; }
        public Guid? CustomerId { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual Store? Store { get; set; }
    }
}
