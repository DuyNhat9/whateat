using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Customer
    {
        public Customer()
        {
            Cartdetails = new HashSet<Cartdetail>();
            Customerstores = new HashSet<Customerstore>();
            Lovedproducts = new HashSet<Lovedproduct>();
            Lovedrecipes = new HashSet<Lovedrecipe>();
            Menus = new HashSet<Menu>();
            Orders = new HashSet<Order>();
            Productreviews = new HashSet<Productreview>();
            Productviewhistories = new HashSet<Productviewhistory>();
            Reciperatings = new HashSet<Reciperating>();
            Recipereviews = new HashSet<Recipereview>();
            Recipes = new HashSet<Recipe>();
            Recipeviewhistories = new HashSet<Recipeviewhistory>();
            Shippinginfos = new HashSet<Shippinginfo>();
            Storereviews = new HashSet<Storereview>();
        }

        public Guid CustomerId { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Idcard { get; set; }
        public string? AvatarUrl { get; set; }
        public float KcalPerDay { get; set; }
        public string? Allergy { get; set; }

        public virtual ICollection<Cartdetail> Cartdetails { get; set; }
        public virtual ICollection<Customerstore> Customerstores { get; set; }
        public virtual ICollection<Lovedproduct> Lovedproducts { get; set; }
        public virtual ICollection<Lovedrecipe> Lovedrecipes { get; set; }
        public virtual ICollection<Menu> Menus { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Productreview> Productreviews { get; set; }
        public virtual ICollection<Productviewhistory> Productviewhistories { get; set; }
        public virtual ICollection<Reciperating> Reciperatings { get; set; }
        public virtual ICollection<Recipereview> Recipereviews { get; set; }
        public virtual ICollection<Recipe> Recipes { get; set; }
        public virtual ICollection<Recipeviewhistory> Recipeviewhistories { get; set; }
        public virtual ICollection<Shippinginfo> Shippinginfos { get; set; }
        public virtual ICollection<Storereview> Storereviews { get; set; }
    }
}
