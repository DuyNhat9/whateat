using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Recipe
    {
        public Recipe()
        {
            IngredientsNavigation = new HashSet<Ingredient>();
            Lovedrecipes = new HashSet<Lovedrecipe>();
            Reciperatings = new HashSet<Reciperating>();
            Recipereviews = new HashSet<Recipereview>();
            Recipeviewhistories = new HashSet<Recipeviewhistory>();
            Menus = new HashSet<Menu>();
            RecipeTypes = new HashSet<Recipetype>();
        }

        public int RecipeId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int Serving { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? CreatorCustomerId { get; set; }
        public int TotalTime { get; set; }
        public float AvgRating { get; set; }
        public int TotalRating { get; set; }
        public int TotalView { get; set; }
        public int TotalLike { get; set; }
        public string? VideoUrl { get; set; }
        public string? Level { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? Ingredients { get; set; }
        public string? Steps { get; set; }
        public string? RecipeTypeId { get; set; }
        public int RecipeNo { get; set; }
        public float Calories { get; set; }
        public bool Status { get; set; }

        public virtual Customer? CreatorCustomer { get; set; }
        public virtual ICollection<Ingredient> IngredientsNavigation { get; set; }
        public virtual ICollection<Lovedrecipe> Lovedrecipes { get; set; }
        public virtual ICollection<Reciperating> Reciperatings { get; set; }
        public virtual ICollection<Recipereview> Recipereviews { get; set; }
        public virtual ICollection<Recipeviewhistory> Recipeviewhistories { get; set; }

        public virtual ICollection<Menu> Menus { get; set; }
        public virtual ICollection<Recipetype> RecipeTypes { get; set; }
    }
}
