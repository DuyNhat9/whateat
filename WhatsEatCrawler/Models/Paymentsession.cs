using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Paymentsession
    {
        public int PaymentSessionId { get; set; }
        public string? SessionId { get; set; }
        public int OrderId { get; set; }

        public virtual Order Order { get; set; } = null!;
    }
}
