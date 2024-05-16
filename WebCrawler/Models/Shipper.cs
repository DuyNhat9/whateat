using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Shipper
    {
        public Shipper()
        {
            Orders = new HashSet<Order>();
        }

        public int ShipperId { get; set; }
        public string? Name { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public int ProvinceCode { get; set; }
        public int DistrictCode { get; set; }
        public int WardCode { get; set; }
        public string? UserId { get; set; }

        public virtual Aspnetuser? User { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
