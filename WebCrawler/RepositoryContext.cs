using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WebCrawler.Models;

namespace WebCrawler
{
    public partial class RepositoryContext : DbContext
    {
        public RepositoryContext()
        {
        }

        public RepositoryContext(DbContextOptions<RepositoryContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Aspnetrole> Aspnetroles { get; set; } = null!;
        public virtual DbSet<Aspnetroleclaim> Aspnetroleclaims { get; set; } = null!;
        public virtual DbSet<Aspnetuser> Aspnetusers { get; set; } = null!;
        public virtual DbSet<Aspnetuserclaim> Aspnetuserclaims { get; set; } = null!;
        public virtual DbSet<Aspnetuserlogin> Aspnetuserlogins { get; set; } = null!;
        public virtual DbSet<Aspnetusertoken> Aspnetusertokens { get; set; } = null!;
        public virtual DbSet<Cartdetail> Cartdetails { get; set; } = null!;
        public virtual DbSet<Customer> Customers { get; set; } = null!;
        public virtual DbSet<Customerstore> Customerstores { get; set; } = null!;
        public virtual DbSet<Efmigrationshistory> Efmigrationshistories { get; set; } = null!;
        public virtual DbSet<Ingredient> Ingredients { get; set; } = null!;
        public virtual DbSet<Kcalreference> Kcalreferences { get; set; } = null!;
        public virtual DbSet<Lovedproduct> Lovedproducts { get; set; } = null!;
        public virtual DbSet<Lovedrecipe> Lovedrecipes { get; set; } = null!;
        public virtual DbSet<Menu> Menus { get; set; } = null!;
        public virtual DbSet<Order> Orders { get; set; } = null!;
        public virtual DbSet<Orderdetail> Orderdetails { get; set; } = null!;
        public virtual DbSet<Orderstatus> Orderstatuses { get; set; } = null!;
        public virtual DbSet<Orderstatushistory> Orderstatushistories { get; set; } = null!;
        public virtual DbSet<Paymentmethod> Paymentmethods { get; set; } = null!;
        public virtual DbSet<Paymentsession> Paymentsessions { get; set; } = null!;
        public virtual DbSet<Product> Products { get; set; } = null!;
        public virtual DbSet<Productcategory> Productcategories { get; set; } = null!;
        public virtual DbSet<Productimage> Productimages { get; set; } = null!;
        public virtual DbSet<Productreview> Productreviews { get; set; } = null!;
        public virtual DbSet<Productviewhistory> Productviewhistories { get; set; } = null!;
        public virtual DbSet<Recipe> Recipes { get; set; } = null!;
        public virtual DbSet<Reciperating> Reciperatings { get; set; } = null!;
        public virtual DbSet<Recipereview> Recipereviews { get; set; } = null!;
        public virtual DbSet<Recipestep> Recipesteps { get; set; } = null!;
        public virtual DbSet<Recipestepimage> Recipestepimages { get; set; } = null!;
        public virtual DbSet<Recipetype> Recipetypes { get; set; } = null!;
        public virtual DbSet<Recipeviewhistory> Recipeviewhistories { get; set; } = null!;
        public virtual DbSet<Refreshtoken> Refreshtokens { get; set; } = null!;
        public virtual DbSet<Shipper> Shippers { get; set; } = null!;
        public virtual DbSet<Shippinginfo> Shippinginfos { get; set; } = null!;
        public virtual DbSet<Store> Stores { get; set; } = null!;
        public virtual DbSet<Storereview> Storereviews { get; set; } = null!;
        public virtual DbSet<Unit> Units { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySql("server=localhost;database=whatseat;user=root;default command timeout=0", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.29-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("utf8mb4_0900_ai_ci")
                .HasCharSet("utf8mb4");

            modelBuilder.Entity<Aspnetrole>(entity =>
            {
                entity.ToTable("aspnetroles");

                entity.HasIndex(e => e.NormalizedName, "RoleNameIndex")
                    .IsUnique();

                entity.Property(e => e.Id).HasMaxLength(95);

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });

            modelBuilder.Entity<Aspnetroleclaim>(entity =>
            {
                entity.ToTable("aspnetroleclaims");

                entity.HasIndex(e => e.RoleId, "IX_AspNetRoleClaims_RoleId");

                entity.Property(e => e.RoleId).HasMaxLength(95);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Aspnetroleclaims)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_AspNetRoleClaims_AspNetRoles_RoleId");
            });

            modelBuilder.Entity<Aspnetuser>(entity =>
            {
                entity.ToTable("aspnetusers");

                entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex")
                    .IsUnique();

                entity.Property(e => e.Id).HasMaxLength(95);

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.LockoutEnd).HasColumnType("datetime");

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.UserName).HasMaxLength(256);

                entity.HasMany(d => d.Roles)
                    .WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "Aspnetuserrole",
                        l => l.HasOne<Aspnetrole>().WithMany().HasForeignKey("RoleId").HasConstraintName("FK_AspNetUserRoles_AspNetRoles_RoleId"),
                        r => r.HasOne<Aspnetuser>().WithMany().HasForeignKey("UserId").HasConstraintName("FK_AspNetUserRoles_AspNetUsers_UserId"),
                        j =>
                        {
                            j.HasKey("UserId", "RoleId").HasName("PRIMARY").HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                            j.ToTable("aspnetuserroles");

                            j.HasIndex(new[] { "RoleId" }, "IX_AspNetUserRoles_RoleId");

                            j.IndexerProperty<string>("UserId").HasMaxLength(95);

                            j.IndexerProperty<string>("RoleId").HasMaxLength(95);
                        });
            });

            modelBuilder.Entity<Aspnetuserclaim>(entity =>
            {
                entity.ToTable("aspnetuserclaims");

                entity.HasIndex(e => e.UserId, "IX_AspNetUserClaims_UserId");

                entity.Property(e => e.UserId).HasMaxLength(95);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Aspnetuserclaims)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_AspNetUserClaims_AspNetUsers_UserId");
            });

            modelBuilder.Entity<Aspnetuserlogin>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("aspnetuserlogins");

                entity.HasIndex(e => e.UserId, "IX_AspNetUserLogins_UserId");

                entity.Property(e => e.LoginProvider).HasMaxLength(95);

                entity.Property(e => e.ProviderKey).HasMaxLength(95);

                entity.Property(e => e.UserId).HasMaxLength(95);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Aspnetuserlogins)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_AspNetUserLogins_AspNetUsers_UserId");
            });

            modelBuilder.Entity<Aspnetusertoken>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0, 0 });

                entity.ToTable("aspnetusertokens");

                entity.Property(e => e.UserId).HasMaxLength(95);

                entity.Property(e => e.LoginProvider).HasMaxLength(95);

                entity.Property(e => e.Name).HasMaxLength(95);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Aspnetusertokens)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_AspNetUserTokens_AspNetUsers_UserId");
            });

            modelBuilder.Entity<Cartdetail>(entity =>
            {
                entity.HasKey(e => new { e.ProductId, e.CustomerId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("cartdetails");

                entity.HasIndex(e => e.CustomerId, "IX_CartDetails_CustomerId");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Cartdetails)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_CartDetails_Customers_CustomerId");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Cartdetails)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_CartDetails_Products_ProductId");
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable("customers");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.Property(e => e.Idcard).HasColumnName("IDCard");
            });

            modelBuilder.Entity<Customerstore>(entity =>
            {
                entity.HasKey(e => new { e.CustomerId, e.StoreId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("customerstores");

                entity.HasIndex(e => e.StoreId, "IX_CustomerStores_StoreId");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Customerstores)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_CustomerStores_Customers_CustomerId");

                entity.HasOne(d => d.Store)
                    .WithMany(p => p.Customerstores)
                    .HasForeignKey(d => d.StoreId)
                    .HasConstraintName("FK_CustomerStores_Stores_StoreId");
            });

            modelBuilder.Entity<Efmigrationshistory>(entity =>
            {
                entity.HasKey(e => e.MigrationId)
                    .HasName("PRIMARY");

                entity.ToTable("__efmigrationshistory");

                entity.Property(e => e.MigrationId).HasMaxLength(150);

                entity.Property(e => e.ProductVersion).HasMaxLength(32);
            });

            modelBuilder.Entity<Ingredient>(entity =>
            {
                entity.ToTable("ingredients");

                entity.HasIndex(e => e.RecipeId, "IX_Ingredients_RecipeId");

                entity.HasIndex(e => e.UnitId, "IX_Ingredients_UnitId");

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.IngredientsNavigation)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_Ingredients_Recipes_RecipeId");

                entity.HasOne(d => d.Unit)
                    .WithMany(p => p.Ingredients)
                    .HasForeignKey(d => d.UnitId)
                    .HasConstraintName("FK_Ingredients_Units_UnitId");
            });

            modelBuilder.Entity<Kcalreference>(entity =>
            {
                entity.HasKey(e => e.KcalId)
                    .HasName("PRIMARY");

                entity.ToTable("kcalreferences");

                entity.Property(e => e.Pal).HasColumnName("PAL");
            });

            modelBuilder.Entity<Lovedproduct>(entity =>
            {
                entity.HasKey(e => new { e.ProductId, e.CustomerId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("lovedproducts");

                entity.HasIndex(e => e.CustomerId, "IX_LovedProducts_CustomerId");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Lovedproducts)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_LovedProducts_Customers_CustomerId");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Lovedproducts)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_LovedProducts_Products_ProductId");
            });

            modelBuilder.Entity<Lovedrecipe>(entity =>
            {
                entity.HasKey(e => new { e.RecipeId, e.CustomerId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("lovedrecipes");

                entity.HasIndex(e => e.CustomerId, "IX_LovedRecipes_CustomerId");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Lovedrecipes)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_LovedRecipes_Customers_CustomerId");

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.Lovedrecipes)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_LovedRecipes_Recipes_RecipeId");
            });

            modelBuilder.Entity<Menu>(entity =>
            {
                entity.ToTable("menus");

                entity.HasIndex(e => e.CustomerId, "IX_Menus_CustomerId");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Menus)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_Menus_Customers_CustomerId");
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("orders");

                entity.HasIndex(e => e.CustomerId, "IX_Orders_CustomerId");

                entity.HasIndex(e => e.PaymentMethodId, "IX_Orders_PaymentMethodId");

                entity.HasIndex(e => e.ShipperId, "IX_Orders_ShipperId");

                entity.HasIndex(e => e.ShippingInfoId, "IX_Orders_ShippingInfoId");

                entity.HasIndex(e => e.StoreId, "IX_Orders_StoreId");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_Orders_Customers_CustomerId");

                entity.HasOne(d => d.PaymentMethod)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.PaymentMethodId)
                    .HasConstraintName("FK_Orders_PaymentMethods_PaymentMethodId");

                entity.HasOne(d => d.Shipper)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.ShipperId)
                    .HasConstraintName("FK_Orders_Shippers_ShipperId");

                entity.HasOne(d => d.ShippingInfo)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.ShippingInfoId)
                    .HasConstraintName("FK_Orders_ShippingInfos_ShippingInfoId");

                entity.HasOne(d => d.Store)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.StoreId)
                    .HasConstraintName("FK_Orders_Stores_StoreId");
            });

            modelBuilder.Entity<Orderdetail>(entity =>
            {
                entity.HasKey(e => new { e.OrderId, e.ProductId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("orderdetails");

                entity.HasIndex(e => e.ProductId, "IX_OrderDetails_ProductId");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.Orderdetails)
                    .HasForeignKey(d => d.OrderId)
                    .HasConstraintName("FK_OrderDetails_Orders_OrderId");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Orderdetails)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_OrderDetails_Products_ProductId");
            });

            modelBuilder.Entity<Orderstatus>(entity =>
            {
                entity.ToTable("orderstatuses");
            });

            modelBuilder.Entity<Orderstatushistory>(entity =>
            {
                entity.ToTable("orderstatushistories");

                entity.HasIndex(e => e.OrderId, "IX_OrderStatusHistories_OrderId");

                entity.HasIndex(e => e.OrderStatusId, "IX_OrderStatusHistories_OrderStatusId");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.Orderstatushistories)
                    .HasForeignKey(d => d.OrderId)
                    .HasConstraintName("FK_OrderStatusHistories_Orders_OrderId");

                entity.HasOne(d => d.OrderStatus)
                    .WithMany(p => p.Orderstatushistories)
                    .HasForeignKey(d => d.OrderStatusId)
                    .HasConstraintName("FK_OrderStatusHistories_OrderStatuses_OrderStatusId");
            });

            modelBuilder.Entity<Paymentmethod>(entity =>
            {
                entity.ToTable("paymentmethods");
            });

            modelBuilder.Entity<Paymentsession>(entity =>
            {
                entity.ToTable("paymentsessions");

                entity.HasIndex(e => e.OrderId, "IX_PaymentSessions_OrderId");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.Paymentsessions)
                    .HasForeignKey(d => d.OrderId)
                    .HasConstraintName("FK_PaymentSessions_Orders_OrderId");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("products");

                entity.HasIndex(e => e.ProductCategoryId, "IX_Products_ProductCategoryId");

                entity.HasIndex(e => e.StoreId, "IX_Products_StoreId");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.HasOne(d => d.ProductCategory)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.ProductCategoryId)
                    .HasConstraintName("FK_Products_ProductCategories_ProductCategoryId");

                entity.HasOne(d => d.Store)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.StoreId)
                    .HasConstraintName("FK_Products_Stores_StoreId");
            });

            modelBuilder.Entity<Productcategory>(entity =>
            {
                entity.ToTable("productcategories");
            });

            modelBuilder.Entity<Productimage>(entity =>
            {
                entity.ToTable("productimages");

                entity.HasIndex(e => e.ProductId, "IX_ProductImages_ProductId");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Productimages)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_ProductImages_Products_ProductId");
            });

            modelBuilder.Entity<Productreview>(entity =>
            {
                entity.ToTable("productreviews");

                entity.HasIndex(e => e.CustomerId, "IX_ProductReviews_CustomerId");

                entity.HasIndex(e => e.ProductId, "IX_ProductReviews_ProductId");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Productreviews)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_ProductReviews_Customers_CustomerId");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Productreviews)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_ProductReviews_Products_ProductId");
            });

            modelBuilder.Entity<Productviewhistory>(entity =>
            {
                entity.ToTable("productviewhistories");

                entity.HasIndex(e => e.CustomerId, "IX_ProductViewHistories_CustomerId");

                entity.HasIndex(e => e.ProductId, "IX_ProductViewHistories_ProductId");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Productviewhistories)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_ProductViewHistories_Customers_CustomerId");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Productviewhistories)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_ProductViewHistories_Products_ProductId");
            });

            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.ToTable("recipes");

                entity.HasIndex(e => e.CreatorCustomerId, "IX_Recipes_CreatorCustomerId");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.CreatorCustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.Property(e => e.TotalLike).HasColumnName("totalLike");

                entity.Property(e => e.VideoUrl).HasColumnName("videoUrl");

                entity.HasOne(d => d.CreatorCustomer)
                    .WithMany(p => p.Recipes)
                    .HasForeignKey(d => d.CreatorCustomerId)
                    .HasConstraintName("FK_Recipes_Customers_CreatorCustomerId");

                entity.HasMany(d => d.Menus)
                    .WithMany(p => p.Recipes)
                    .UsingEntity<Dictionary<string, object>>(
                        "Menudetail",
                        l => l.HasOne<Menu>().WithMany().HasForeignKey("MenuId").HasConstraintName("FK_MenuDetails_Menus_MenuId"),
                        r => r.HasOne<Recipe>().WithMany().HasForeignKey("RecipeId").HasConstraintName("FK_MenuDetails_Recipes_RecipeId"),
                        j =>
                        {
                            j.HasKey("RecipeId", "MenuId").HasName("PRIMARY").HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                            j.ToTable("menudetails");

                            j.HasIndex(new[] { "MenuId" }, "IX_MenuDetails_MenuId");
                        });

                entity.HasMany(d => d.RecipeTypes)
                    .WithMany(p => p.Recipes)
                    .UsingEntity<Dictionary<string, object>>(
                        "Reciperecipetype",
                        l => l.HasOne<Recipetype>().WithMany().HasForeignKey("RecipeTypeId").HasConstraintName("FK_RecipeRecipeTypes_RecipeTypes_RecipeTypeId"),
                        r => r.HasOne<Recipe>().WithMany().HasForeignKey("RecipeId").HasConstraintName("FK_RecipeRecipeTypes_Recipes_RecipeId"),
                        j =>
                        {
                            j.HasKey("RecipeId", "RecipeTypeId").HasName("PRIMARY").HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                            j.ToTable("reciperecipetypes");

                            j.HasIndex(new[] { "RecipeTypeId" }, "IX_RecipeRecipeTypes_RecipeTypeId");
                        });
            });

            modelBuilder.Entity<Reciperating>(entity =>
            {
                entity.ToTable("reciperatings");

                entity.HasIndex(e => e.CustomerId, "IX_RecipeRatings_CustomerId");

                entity.HasIndex(e => e.RecipeId, "IX_RecipeRatings_RecipeId");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Reciperatings)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_RecipeRatings_Customers_CustomerId");

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.Reciperatings)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_RecipeRatings_Recipes_RecipeId");
            });

            modelBuilder.Entity<Recipereview>(entity =>
            {
                entity.ToTable("recipereviews");

                entity.HasIndex(e => e.CustomerId, "IX_RecipeReviews_CustomerId");

                entity.HasIndex(e => e.RecipeId, "IX_RecipeReviews_RecipeId");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Recipereviews)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_RecipeReviews_Customers_CustomerId");

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.Recipereviews)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_RecipeReviews_Recipes_RecipeId");
            });

            modelBuilder.Entity<Recipestep>(entity =>
            {
                entity.ToTable("recipesteps");
            });

            modelBuilder.Entity<Recipestepimage>(entity =>
            {
                entity.ToTable("recipestepimages");

                entity.HasIndex(e => e.RecipeStepId, "IX_RecipeStepImages_RecipeStepId");

                entity.HasOne(d => d.RecipeStep)
                    .WithMany(p => p.Recipestepimages)
                    .HasForeignKey(d => d.RecipeStepId)
                    .HasConstraintName("FK_RecipeStepImages_RecipeSteps_RecipeStepId");
            });

            modelBuilder.Entity<Recipetype>(entity =>
            {
                entity.ToTable("recipetypes");
            });

            modelBuilder.Entity<Recipeviewhistory>(entity =>
            {
                entity.ToTable("recipeviewhistories");

                entity.HasIndex(e => e.CustomerId, "IX_RecipeViewHistories_CustomerId");

                entity.HasIndex(e => e.RecipeId, "IX_RecipeViewHistories_RecipeId");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Recipeviewhistories)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_RecipeViewHistories_Customers_CustomerId");

                entity.HasOne(d => d.Recipe)
                    .WithMany(p => p.Recipeviewhistories)
                    .HasForeignKey(d => d.RecipeId)
                    .HasConstraintName("FK_RecipeViewHistories_Recipes_RecipeId");
            });

            modelBuilder.Entity<Refreshtoken>(entity =>
            {
                entity.ToTable("refreshtokens");

                entity.HasIndex(e => e.UserId, "IX_RefreshTokens_UserId");

                entity.Property(e => e.Id)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.Property(e => e.AddedDate).HasColumnType("datetime");

                entity.Property(e => e.ExpiryDate).HasColumnType("datetime");

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");

                entity.Property(e => e.UserId).HasMaxLength(95);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Refreshtokens)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_RefreshTokens_AspNetUsers_UserId");
            });

            modelBuilder.Entity<Shipper>(entity =>
            {
                entity.ToTable("shippers");

                entity.HasIndex(e => e.UserId, "IX_Shippers_UserId");

                entity.Property(e => e.UserId).HasMaxLength(95);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Shippers)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Shippers_AspNetUsers_UserId");
            });

            modelBuilder.Entity<Shippinginfo>(entity =>
            {
                entity.ToTable("shippinginfos");

                entity.HasIndex(e => e.CustomerId, "IX_ShippingInfos_CustomerId");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Shippinginfos)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_ShippingInfos_Customers_CustomerId");
            });

            modelBuilder.Entity<Store>(entity =>
            {
                entity.ToTable("stores");

                entity.HasIndex(e => e.UserId, "IX_Stores_UserId");

                entity.Property(e => e.UserId).HasMaxLength(95);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Stores)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Stores_AspNetUsers_UserId");
            });

            modelBuilder.Entity<Storereview>(entity =>
            {
                entity.ToTable("storereviews");

                entity.HasIndex(e => e.CustomerId, "IX_StoreReviews_CustomerId");

                entity.HasIndex(e => e.StoreId, "IX_StoreReviews_StoreId");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.CustomerId)
                    .UseCollation("ascii_general_ci")
                    .HasCharSet("ascii");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Storereviews)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_StoreReviews_Customers_CustomerId");

                entity.HasOne(d => d.Store)
                    .WithMany(p => p.Storereviews)
                    .HasForeignKey(d => d.StoreId)
                    .HasConstraintName("FK_StoreReviews_Stores_StoreId");
            });

            modelBuilder.Entity<Unit>(entity =>
            {
                entity.ToTable("units");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
