using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Store
    {
        public Store()
        {
            Customerstores = new HashSet<Customerstore>();
            Orders = new HashSet<Order>();
            Products = new HashSet<Product>();
            Storereviews = new HashSet<Storereview>();
        }

        public int StoreId { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public int ProvinceCode { get; set; }
        public int DistrictCode { get; set; }
        public int WardCode { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public string? AvatarUrl { get; set; }
        public string? UserId { get; set; }
        public string? Email { get; set; }
        public string? ShopName { get; set; }
        public float AvgRating { get; set; }

        public virtual Aspnetuser? User { get; set; }
        public virtual ICollection<Customerstore> Customerstores { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Product> Products { get; set; }
        public virtual ICollection<Storereview> Storereviews { get; set; }
    }
}
