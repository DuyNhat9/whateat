using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Ingredient
    {
        public int IngredientId { get; set; }
        public int Quantity { get; set; }
        public int? UnitId { get; set; }
        public bool IsMainIngredient { get; set; }
        public int? RecipeId { get; set; }

        public virtual Recipe? Recipe { get; set; }
        public virtual Unit? Unit { get; set; }
    }
}
