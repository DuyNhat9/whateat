using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Recipetype
    {
        public Recipetype()
        {
            Recipes = new HashSet<Recipe>();
        }

        public int RecipeTypeId { get; set; }
        public string? Name { get; set; }

        public virtual ICollection<Recipe> Recipes { get; set; }
    }
}
