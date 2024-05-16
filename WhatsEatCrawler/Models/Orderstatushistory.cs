using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Orderstatushistory
    {
        public int OrderStatusHistoryId { get; set; }
        public int? OrderStatusId { get; set; }
        public int? OrderId { get; set; }
        public string? Message { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool ByUser { get; set; }

        public virtual Order? Order { get; set; }
        public virtual Orderstatus? OrderStatus { get; set; }
    }
}
