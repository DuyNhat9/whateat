using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Product
    {
        public Product()
        {
            Cartdetails = new HashSet<Cartdetail>();
            Lovedproducts = new HashSet<Lovedproduct>();
            Orderdetails = new HashSet<Orderdetail>();
            Productimages = new HashSet<Productimage>();
            Productreviews = new HashSet<Productreview>();
            Productviewhistories = new HashSet<Productviewhistory>();
        }

        public int ProductId { get; set; }
        public string? Name { get; set; }
        public int InStock { get; set; }
        public int? ProductCategoryId { get; set; }
        public string? Description { get; set; }
        public int? BasePrice { get; set; }
        public int? StoreId { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? PhotoJson { get; set; }
        public int TotalSell { get; set; }
        public string? WeightServing { get; set; }
        public int ProductNo { get; set; }
        public bool Status { get; set; }

        public virtual Productcategory? ProductCategory { get; set; }
        public virtual Store? Store { get; set; }
        public virtual ICollection<Cartdetail> Cartdetails { get; set; }
        public virtual ICollection<Lovedproduct> Lovedproducts { get; set; }
        public virtual ICollection<Orderdetail> Orderdetails { get; set; }
        public virtual ICollection<Productimage> Productimages { get; set; }
        public virtual ICollection<Productreview> Productreviews { get; set; }
        public virtual ICollection<Productviewhistory> Productviewhistories { get; set; }
    }
}
