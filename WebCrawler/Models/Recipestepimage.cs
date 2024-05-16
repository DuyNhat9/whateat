using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Recipestepimage
    {
        public int RecipeStepImageId { get; set; }
        public string? ImageUrl { get; set; }
        public int? RecipeStepId { get; set; }

        public virtual Recipestep? RecipeStep { get; set; }
    }
}
