using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using whatseat_server.Models;

namespace whatseat_server.Data;

public class WhatsEatContext : IdentityDbContext
{
    public WhatsEatContext(DbContextOptions<WhatsEatContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrderDetail>().HasKey(od => new { od.OrderId, od.ProductId });
        modelBuilder.Entity<CartDetail>().HasKey(cd => new { cd.ProductId, cd.CustomerId });
        modelBuilder.Entity<CustomerStore>().HasKey(cs => new { cs.CustomerId, cs.StoreId });
        modelBuilder.Entity<RecipeRecipeType>().HasKey(rrt => new { rrt.RecipeId, rrt.RecipeTypeId });
        modelBuilder.Entity<LovedProduct>().HasKey(rrt => new { rrt.ProductId, rrt.CustomerId });
        modelBuilder.Entity<LovedRecipe>().HasKey(rrt => new { rrt.RecipeId, rrt.CustomerId });
        modelBuilder.Entity<LovedRecipe>().HasKey(rrt => new { rrt.RecipeId, rrt.CustomerId });
        modelBuilder.Entity<MenuDetail>().HasKey(mt => new { mt.RecipeId, mt.MenuId });
        // modelBuilder.Entity<Product>().Property(p => p.ProductNo).ValueGeneratedOnAdd();
        modelBuilder.Entity<RecipeRecipeType>()
            .HasOne<Recipe>(rrt => rrt.Recipe)
            .WithMany(r => r.RecipeRecipeTypes)
            .HasForeignKey(rrt => rrt.RecipeId);
        modelBuilder.Entity<RecipeRecipeType>()
            .HasOne<RecipeType>(rrt => rrt.RecipeType)
            .WithMany(rt => rt.RecipeRecipeTypes)
            .HasForeignKey(rrt => rrt.RecipeTypeId);

        base.OnModelCreating(modelBuilder);
    }

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<CartDetail> CartDetails => Set<CartDetail>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<CustomerStore> CustomerStores => Set<CustomerStore>();
    public DbSet<Ingredient> Ingredients => Set<Ingredient>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
    public DbSet<OrderStatus> OrderStatuses => Set<OrderStatus>();
    public DbSet<OrderStatusHistory> OrderStatusHistories => Set<OrderStatusHistory>();
    public DbSet<PaymentMethod> PaymentMethods => Set<PaymentMethod>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductReview> ProductReviews => Set<ProductReview>();
    public DbSet<ProductViewHistory> ProductViewHistories => Set<ProductViewHistory>();
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<RecipeRating> RecipeRatings => Set<RecipeRating>();
    public DbSet<RecipeStepImage> RecipeStepImages => Set<RecipeStepImage>();
    public DbSet<RecipeType> RecipeTypes => Set<RecipeType>();
    public DbSet<RecipeViewHistory> RecipeViewHistories => Set<RecipeViewHistory>();
    public DbSet<Shipper> Shippers => Set<Shipper>();
    public DbSet<ShippingInfo> ShippingInfos => Set<ShippingInfo>();
    public DbSet<Store> Stores => Set<Store>();
    public DbSet<Unit> Units => Set<Unit>();
    public DbSet<RecipeStep> RecipeSteps => Set<RecipeStep>();
    public DbSet<RecipeRecipeType> RecipeRecipeTypes => Set<RecipeRecipeType>();
    public DbSet<RecipeReview> RecipeReviews => Set<RecipeReview>();
    public DbSet<LovedProduct> LovedProducts => Set<LovedProduct>();
    public DbSet<LovedRecipe> LovedRecipes => Set<LovedRecipe>();
    public DbSet<Menu> Menus => Set<Menu>();
    public DbSet<MenuDetail> MenuDetails => Set<MenuDetail>();
    public DbSet<KcalReference> KcalReferences => Set<KcalReference>();
    public DbSet<StoreReview> StoreReviews => Set<StoreReview>();
    public DbSet<PaymentSession> PaymentSessions => Set<PaymentSession>();

}