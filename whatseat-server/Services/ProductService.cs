using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using whatseat_server.Data;
using whatseat_server.Models;
using whatseat_server.Models.DTOs.Requests;
using whatseat_server.Models.DTOs.Responses;

namespace whatseat_server.Services;

public class ProductService
{
    private readonly WhatsEatContext _context;
    public ProductService(WhatsEatContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> FindAllProducts()
    {
        // TODO: sort, paginate
        return await _context.Products.Include(p => p.ProductImages).AsNoTracking().ToListAsync();
    }

    public async Task<Product> FindProductById(int productId)
    {
        return await _context.Products.Include(p => p.ProductImages).Include(p => p.Store).Include(p => p.Store).FirstOrDefaultAsync(p => p.ProductId == productId && p.Status != false);
    }

    public async Task<List<SimpleProductResponse>> FindProductByCategoryId(int categoryId)
    {
        return await _context.Products.Include(p => p.ProductImages).Include(p => p.Store).Include(p => p.Store).Include(p => p.ProductCategory).Where(p => p.ProductCategory.ProductCategoryId == categoryId).Select(x => new SimpleProductResponse
        {
            ProductId = x.ProductId,
            Name = x.Name,
            BasePrice = x.BasePrice,
            TotalSell = x.TotalSell,
            WeightServing = x.WeightServing,
            Images = ConvertJsonStaticToPhotos(x.PhotoJson)
        }).ToListAsync();
    }

    public async Task<PagedList<Product>> FullTextSearchProduct(ProductFilter productFilter)
    {
        IQueryable<Product> products = _context.Products.AsQueryable();
        if (!String.IsNullOrEmpty(productFilter.searchTerm))
        {
            products = _context.Products.FromSqlInterpolated($"select * from products where MATCH(name) against ({productFilter.searchTerm})").Where(p => p.Status != false);
        }

        if (productFilter.byShopProductRating)
        {
            products = products.Include(p => p.Store).OrderByDescending(p => p.Store.AvgRating).ThenBy(p => p.BasePrice);
        }

        switch (productFilter.sortDate)
        {
            case "asc":
                products = products.OrderBy(r => r.CreatedOn);
                break;
            case "desc":
                products = products.OrderByDescending(r => r.CreatedOn);
                break;
            default:
                break;
        }

        switch (productFilter.sortTotalSell)
        {
            case "asc":
                products = products.OrderBy(r => r.TotalSell);
                break;
            case "desc":
                products = products.OrderByDescending(r => r.TotalSell);
                break;
            default:
                break;
        }

        switch (productFilter.sortPrice)
        {
            case "asc":
                products = products.OrderBy(r => r.BasePrice);
                break;
            case "desc":
                products = products.OrderByDescending(r => r.BasePrice);
                break;
            default:
                break;
        }

        if (productFilter.productCategories != null && productFilter.productCategories.Length > 0)
        {
            products = products.Where(p => productFilter.productCategories.Contains(p.ProductCategory.ProductCategoryId));
        }
        if (productFilter.productStores != null && productFilter.productStores.Length > 0)
        {
            var listStore = await _context.Stores.Where(p => productFilter.productStores.Contains(p.StoreId)).ToListAsync();
            products = products.Where(p => (p.Store != null && listStore.Contains(p.Store)));
        }
        products = productFilter.MinPrice > 0 ? products.Where(p => p.BasePrice >= productFilter.MinPrice) : products;
        products = productFilter.MaxPrice > 0 ? products.Where(p => p.BasePrice <= productFilter.MaxPrice) : products;



        if (productFilter.inStockOnly)
        {
            products = products.Where(p => p.InStock > 0);
        }

        var res = await PagedList<Product>.ToPagedList(products.Include(p => p.ProductCategory).Include(p => p.Store), productFilter.PageNumber, productFilter.PageSize);

        return res;
    }

    public async Task<PagedList<Product>> Get8BestSellerProduct()
    {
        ProductFilter filter = new ProductFilter
        {
            sortTotalSell = "desc",
            PageNumber = 1,
            PageSize = 8
        };
        var products = await this.FullTextSearchProduct(filter);

        return products;
    }

    public List<List<Photo>> ConvertJsonToPhotos(string jsonPhotos)
    {
        List<List<Photo>> result = JsonConvert.DeserializeObject<List<List<Photo>>>(jsonPhotos);
        return result;
    }

    public static List<List<Photo>> ConvertJsonStaticToPhotos(string jsonPhotos)
    {
        List<List<Photo>> result = JsonConvert.DeserializeObject<List<List<Photo>>>(jsonPhotos);
        return result;
    }

    public async Task<PagedList<ProductReview>> GetAllProductReviews(PagedProductReviewRequest pagedRequest)
    {

        var product = _context.Products.FirstOrDefault(r => r.ProductId == pagedRequest.ProductId);
        var productReviews = _context.ProductReviews.AsNoTracking()
            .OrderByDescending(rr => rr.CreatedOn)
            .Include(rv => rv.Customer)
            .Where(rr => rr.Product == product);

        var res = await PagedList<ProductReview>.ToPagedList(productReviews, pagedRequest.PageNumber, pagedRequest.PageSize);
        return res;
    }

    public async Task<int> AddProductHistory(Customer customer, Product product)
    {
        var res = await _context.ProductViewHistories.AddAsync(new ProductViewHistory
        {
            CreatedOn = DateTime.UtcNow,
            Customer = customer,
            Product = product
        });
        return await _context.SaveChangesAsync();
    }

    public async Task<int> GetProductViews(Product product)
    {
        return await _context.ProductViewHistories.AsNoTracking().CountAsync(p => p.Product == product);
    }

    public async Task<ProductCategory> FindProductCategoryByProductCategoryId(int productCategoryId)
    {
        return await _context.ProductCategories.FirstOrDefaultAsync(pc => pc.ProductCategoryId == productCategoryId);
    }
}