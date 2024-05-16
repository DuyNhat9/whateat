using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Productviewhistory
    {
        public int ProductViewHistoryId { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? CustomerId { get; set; }
        public int? ProductId { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual Product? Product { get; set; }
    }
}
