using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using whatseat_server.Data;
using whatseat_server.Models;
using whatseat_server.Models.DTOs.Requests;
using whatseat_server.Models.DTOs.Responses;

namespace whatseat_server.Services;

public class StoreService
{
    private readonly WhatsEatContext _context;
    public StoreService(WhatsEatContext context)
    {
        _context = context;
    }

    public async Task<bool> IsLikeByUser(int storeId, Guid userId)
    {
        var customer = await _context.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.CustomerId.Equals(userId));
        var store = await _context.Stores.AsNoTracking().FirstOrDefaultAsync(s => s.StoreId == storeId);
        var customerStore = await _context.CustomerStores.AsNoTracking().FirstOrDefaultAsync(cs => cs.Customer == customer && cs.Store == store);

        return customerStore is not null;
    }

    public async Task<CustomerStore> GetCustomerStoreAsync(int storeId, Guid userId)
    {
        var customer = await _context.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.CustomerId.Equals(userId));
        var store = await _context.Stores.AsNoTracking().FirstOrDefaultAsync(s => s.StoreId == storeId);
        var customerStore = await _context.CustomerStores.AsNoTracking().FirstOrDefaultAsync(cs => cs.Customer == customer && cs.Store == store);

        return customerStore;
    }

    public async Task<Store> FindStoreByUserIdAndStoreIdAsync(Guid userId, int storeId)
    {
        return await _context.Stores.FirstOrDefaultAsync(
            (s) =>
                 s.StoreId == storeId && s.UserId == userId.ToString()
        );
    }

    public async Task<List<CustomerStore>> GetStoreList(PagedRequest pagedRequest, Guid userId)
    {
        var stores = _context.CustomerStores.AsNoTracking().Where(cs => cs.CustomerId == userId).AsQueryable();
        var res = await PagedList<CustomerStore>.ToPagedList(stores.Include(cs => cs.Store), pagedRequest.PageNumber, pagedRequest.PageSize);

        return res;
    }

    public List<Photo> ConvertJsonToPhotos(string jsonPhotos)
    {
        jsonPhotos = jsonPhotos.Substring(1, jsonPhotos.Length - 2);
        List<Photo> result = JsonConvert.DeserializeObject<List<Photo>>(jsonPhotos);
        return result;
    }

    public async Task<Store> FindStoreByStoreIdAsync(int storeId)
    {
        return await _context.Stores.Include(s => s.User).Include(s => s.Products).FirstOrDefaultAsync(s => s.StoreId == storeId);
    }

    internal async Task<StoreReview> storeReview(StoreReviewRequest reviewRequest, Customer customer)
    {
        Store store = await FindStoreByStoreIdAsync(reviewRequest.StoreId);
        StoreReview review = new StoreReview
        {
            Rating = reviewRequest.Rating,
            CreatedOn = DateTime.UtcNow,
            Customer = customer,
            Store = store,
            Comment = reviewRequest.Comment
        };

        var addRes = await _context.StoreReviews.AddAsync(review);

        int reviewNum = await _context.StoreReviews
            .CountAsync(sr => reviewRequest.StoreId == sr.Store!.StoreId);
        int reviewSum = await _context.StoreReviews.Where(sr => reviewRequest.StoreId == sr.Store!.StoreId).SumAsync(sr => sr.Rating);

        store.AvgRating = (1f * reviewSum) / reviewNum;

        var changRes = await _context.SaveChangesAsync();


        return review;
    }

    public async Task<PagedList<StoreReview>> GetPagedStoreReview(PagedStoreReviewRequest reviewRequest)
    {
        Store store = await this.FindStoreByStoreIdAsync(reviewRequest.StoreId);

        var storeReviews = _context.StoreReviews.AsNoTracking().Include(sr => sr.Customer)
            .Where(sr => sr.Store!.StoreId == reviewRequest.StoreId).AsQueryable();

        return await PagedList<StoreReview>.ToPagedList(storeReviews, reviewRequest.PageNumber, reviewRequest.PageSize);
    }

    public async Task<PagedList<ProductReview>> GetPagedAllProductReview(PagedRequest reviewRequest)
    {
        var storeReviews = _context.ProductReviews.AsNoTracking().Include(sr => sr.Customer).Include(p => p.Product).AsQueryable();

        return await PagedList<ProductReview>.ToPagedList(storeReviews, reviewRequest.PageNumber, reviewRequest.PageSize);
    }

    public bool UserIsStore(IdentityUser user, Store store)
    {
        return store.User == user;
    }

    public bool StoreContainsProduct(Product product, Store store)
    {
        return store.Products.Contains(product);
    }

    public async Task<List<ProductCategory>> GetStoreProductCategories(int storeId)
    {
        List<ProductCategory> categories = await _context.ProductCategories
            .FromSqlInterpolated($"select distinct pc.* from productcategories pc left join products p on pc.ProductCategoryId = p.ProductCategoryId join stores s on p.StoreId = s.StoreId where p.StoreId = {storeId}")
            .ToListAsync();
        return categories;
    }

    public async Task<List<TotalIncomeByMonthResponse>> GetIncomeByDay()
    {
        var currentYear = DateTime.Now.Year;
        var currentMonth = DateTime.Now.Month;
        var orders = await _context.Orders.Include(x => x.OrderDetails).Select(o => new
        {
            OrderId = o.OrderId,
            CreatedOn = o.CreatedOn,
            TotalCharge = o.OrderDetails.Sum(x => x.Quantity * x.Price)
        }).Select(k => new { k.CreatedOn.Year, k.CreatedOn.Month, k.CreatedOn.Day, k.TotalCharge }).Where(k => k.Year == currentYear && k.Month == currentMonth).GroupBy(x => new { x.Year, x.Month, x.Day }, (key, group) => new TotalIncomeByMonthResponse
        {
            Year = key.Year,
            Month = key.Month,
            Day = key.Day,
            Total = group.Sum(k => k.TotalCharge)
        }).ToListAsync();

        return orders;
    }

    public async Task<List<OrderStatusCountResponse>> GetNumberOrderByStatus()
    {
        var orders = await _context.OrderStatusHistories.Include(x => x.OrderStatus).GroupBy(p => p.Order.OrderId).Select(x => new
        {
            OrderId = x.Key,
            OrderStatusId = x.First(y => y.CreatedOn == x.Select(z => z.CreatedOn).Max()).OrderStatus.OrderStatusId,
            OrderStatusName = x.First(y => y.CreatedOn == x.Select(z => z.CreatedOn).Max()).OrderStatus.Value,
            Lastest = x.First(y => y.CreatedOn == x.Select(z => z.CreatedOn).Max()).CreatedOn
        }).ToListAsync();

        var orderStatusCount = orders.GroupBy(o => o.OrderStatusId).Select(n => new OrderStatusCountResponse
        {
            OrderStatusId = n.Key,
            OrderStatusName = n.First(pn => pn.OrderStatusId == n.Key).OrderStatusName,
            Count = n.Count()
        }).ToList();

        return orderStatusCount;
    }

    public async Task<List<GetBestSellerOfMonth>> GetBestSallerOfMonth()
    {

        var currentMonth = DateTime.Now.Month;
        var orderIds = await _context.Orders.Where(ods => ods.CreatedOn.Month == currentMonth).Select(x => x.OrderId).ToListAsync();

        var orderDetails = await _context.OrderDetails.Include(x => x.Product).Where(x => orderIds.Contains(x.OrderId)).Select(x => new
        {
            ProductId = x.ProductId,
            Quantity = x.Quantity,
            ProductName = x.Product.Name,
        }).ToListAsync();
        var result = orderDetails.GroupBy(od => od.ProductId).Select(x => new GetBestSellerOfMonth
        {
            ProductId = x.Key,
            Amount = x.Sum(a => a.Quantity),
            ProductName = x.First(pn => pn.ProductId == x.Key).ProductName,
        }).OrderBy(x => x.Amount).Take(10).ToList();

        return result;
    }

    public async Task<List<GetBestCategoryOfMonthResponse>> GetCategorySallerOfMonth()
    {

        var currentMonth = DateTime.Now.Month;
        var orderIds = await _context.Orders.Where(ods => ods.CreatedOn.Month == currentMonth).Select(x => x.OrderId).ToListAsync();

        var orderDetails = await _context.OrderDetails.Include(x => x.Product.ProductCategory).Where(x => orderIds.Contains(x.OrderId)).Select(x => new
        {
            CategoryId = x.Product.ProductCategory.ProductCategoryId,
            ProductCategoryName = x.Product.ProductCategory.Name
        }).ToListAsync();
        var result = orderDetails.GroupBy(od => od.CategoryId).Select(x => new GetBestCategoryOfMonthResponse
        {
            ProductCategoryId = x.Key,
            Amount = x.Count(),
            ProductCategoryName = x.First(pn => pn.CategoryId == x.Key).ProductCategoryName,

        }).ToList();

        return result;
    }
}