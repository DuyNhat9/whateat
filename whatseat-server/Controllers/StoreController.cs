using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using whatseat_server.Constants;
using whatseat_server.Data;
using whatseat_server.Models;
using whatseat_server.Models.DTOs.Requests;
using whatseat_server.Models.DTOs.Responses;
using whatseat_server.Services;

namespace whatseat_server.Controllers;
[ApiController]
[Route("api/[controller]")]
public class StoreController : ControllerBase
{
    private readonly WhatsEatContext _context;
    private readonly StoreService _storeService;
    private readonly ProductService _productService;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly CustomerService _customerService;
    private readonly OrderService _orderService;

    public StoreController(
        WhatsEatContext context,
        StoreService storeService,
        UserManager<IdentityUser> userManager,
        ProductService productService,
        CustomerService customerService,
        OrderService orderService
    )
    {
        _context = context;
        _storeService = storeService;
        _userManager = userManager;
        _productService = productService;
        _customerService = customerService;
        _orderService = orderService;
    }

    [HttpGet]
    [Route("{storeId}")]
    public async Task<IActionResult> GetStoreInfo(int storeId)
    {
        return Ok(await _context.Stores.AsNoTracking().FirstOrDefaultAsync(s => s.StoreId == storeId));
    }

    [HttpGet]
    [Route("is-like/{storeId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> GetUserStoreLiking(int storeId)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        return Ok(await _storeService.IsLikeByUser(storeId, userId));
    }

    [HttpPost]
    [Route("like/{storeId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> LikeStore(int storeId)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        bool isLike = await _storeService.IsLikeByUser(storeId, userId);

        if (isLike)
        {
            return BadRequest(new { message = "Already like this store" });
        }
        else
        {
            var addRes = _context.CustomerStores.AddAsync(new CustomerStore
            {
                CustomerId = userId,
                StoreId = storeId,
                CreatedOn = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
            return Ok(new { message = "Success" });
        }
    }

    [HttpDelete]
    [Route("dislike/{storeId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> DislikeStore(int storeId)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customerStore = await _storeService.GetCustomerStoreAsync(storeId, userId);

        if (customerStore is not null)
        {
            _context.CustomerStores.Remove(customerStore);
            _context.SaveChanges();
            return Ok(new { message = "Success" });
        }
        else
        {
            return BadRequest(new { message = "Error" });
        }
    }

    [HttpGet]
    [Route("followings")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> GetFollowingStores([FromQuery] PagedRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);

        List<CustomerStore> stores = await _storeService.GetStoreList(request, userId);

        List<SimpleStoreResponse> simpleStoreResponses = new List<SimpleStoreResponse>();

        foreach (var item in stores)
        {
            simpleStoreResponses.Add(
                new SimpleStoreResponse
                {
                    ShopName = item.Store is not null ? item.Store.ShopName : null,
                    StoreId = item.StoreId,
                    AvatarUrl = item.Store is not null ? item.Store.AvatarUrl : null,
                    CreatedOn = item.CreatedOn
                }
            );
        }

        return Ok(simpleStoreResponses);
    }

    [HttpPost]
    [Route("register")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> StoreRegistration([FromBody] StoreRegistrationRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        Store newStore = new Store
        {
            Email = request.Email,
            ShopName = request.ShopName,
            PhoneNumber = request.PhoneNumber,
            Address = request.Address,
            ProvinceCode = request.ProvinceCode,
            DistrictCode = request.DistrictCode,
            WardCode = request.WardCode,
            Description = request.Description,
            UserId = userId.ToString()
        };

        await _context.Stores.AddAsync(newStore);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Success" });
    }

    [HttpPut]
    [Route("info")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Store)]
    public async Task<IActionResult> changeInfoStore([FromBody] StoreChangeInfoRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        Store store = await _context.Stores.FirstOrDefaultAsync(s => s.StoreId == request.StoreId && s.UserId == userId.ToString());
        if (store is null)
        {
            return Forbid();
        }

        store.StoreId = request.StoreId;
        store.Email = request.Email;
        store.ShopName = request.ShopName;
        store.PhoneNumber = request.PhoneNumber;
        store.Address = request.Address;
        store.ProvinceCode = request.ProvinceCode;
        store.DistrictCode = request.DistrictCode;
        store.WardCode = request.WardCode;
        store.Description = request.Description;


        await _context.SaveChangesAsync();

        return Ok(new { message = "Success" });
    }

    [HttpPost]
    [Route("add-product")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Store)]
    public async Task<IActionResult> StoreAddProduct([FromBody] AddProductRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var store = await _storeService.FindStoreByUserIdAndStoreIdAsync(userId, request.StoreId);

        var productCategory = await _context.ProductCategories
            .FirstOrDefaultAsync(pc => pc.ProductCategoryId == request.ProductCategoryId);


        Product product = new Product
        {
            Name = request.Name,
            InStock = request.InStock,
            BasePrice = request.BasePrice,
            CreatedOn = DateTime.UtcNow,
            Store = store,
            ProductCategory = productCategory,
            Description = request.Description,
            PhotoJson = request.ImageUrl
        };

        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Success {userId}" });
    }

    [HttpGet]
    [Route("{storeId}/orders")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Store)]
    public async Task<IActionResult> TrackOrders(int storeId)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);

        Store store = await _storeService.FindStoreByStoreIdAsync(storeId);

        if (store.UserId != userId.ToString())
        {
            return Forbid();
        }
        var orderList = await _context.Orders.AsNoTracking().Include(o => o.Customer)
        .Include(o => o.PaymentMethod).Include(o => o.OrderDetails).Include(o => o.ShippingInfo).Include(o => o.OrderStatusHistories)
        .ThenInclude(h => h.OrderStatus)
            .Where(od => od.Store == od.Store).OrderByDescending(od => od.CreatedOn).ToListAsync();

        return Ok(orderList);

    }

    [HttpPost]
    [Route("{storeId}/orders/accept")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Store)]
    public async Task<IActionResult> AcceptOrder(int storeId, [FromBody] OrderStatusRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        IdentityUser user = await _userManager.FindByIdAsync(userId.ToString());

        Store store = await _storeService.FindStoreByStoreIdAsync(storeId);
        try
        {
            if (!_storeService.UserIsStore(user, store))
            {
                return Forbid();
            }
            var order = await _orderService.getOrderOrderId(request.OrderId);

            if (store != order.Store)
            {
                return Forbid();
            }

            var status = await _orderService.StoreAcceptOrder(order, request.Message);

            return Ok(status);
        }
        catch (NullReferenceException)
        {
            return BadRequest();
        }
    }

    [HttpPost]
    [Route("{storeId}/orders/cancel")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Store)]
    public async Task<IActionResult> CancelOrder(int storeId, [FromBody] OrderStatusRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        IdentityUser user = await _userManager.FindByIdAsync(userId.ToString());

        Store store = await _storeService.FindStoreByStoreIdAsync(storeId);
        try
        {
            if (!_storeService.UserIsStore(user, store))
            {
                return Forbid();
            }
            var order = await _orderService.getOrderOrderId(request.OrderId);

            if (store != order.Store)
            {
                return Forbid();
            }

            OrderStatusHistory status = await _orderService.StoreCancelOrder(order, request.Message);

            return Ok(status);
        }
        catch (NullReferenceException)
        {
            return BadRequest();
        }
    }

    [HttpPost]
    [Route("{storeId}/orders/complete")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Store)]
    public async Task<IActionResult> CompleteOrder(int storeId, [FromBody] OrderStatusRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        IdentityUser user = await _userManager.FindByIdAsync(userId.ToString());

        Store store = await _storeService.FindStoreByStoreIdAsync(storeId);

        try
        {
            if (!_storeService.UserIsStore(user, store))
            {
                return Forbid();
            }
            var order = await _orderService.getOrderOrderId(request.OrderId);

            if (store != order.Store)
            {
                return Forbid();
            }

            order.IsPaid = true;
            OrderStatusHistory status = await _orderService.UpdateStatus(order, OrderStatusConstant.Delivered);

            return Ok(status);
        }
        catch (NullReferenceException)
        {
            return BadRequest();
        }
    }


    [HttpGet]
    [Route("{storeId}/products")]
    public async Task<IActionResult> GetProductList(int storeId, [FromQuery] PagedRequest query)
    {
        ProductFilter filter = new ProductFilter
        {
            productStores = new int[] { storeId },
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };

        var products = await _productService.FullTextSearchProduct(filter);

        var productRes = new List<ProductResponse>();
        foreach (var item in products)
        {
            productRes.Add(new ProductResponse
            {
                Images = _productService.ConvertJsonToPhotos(item.PhotoJson),
                ProductId = item.ProductId,
                Name = item.Name,
                InStock = item.InStock,
                BasePrice = item.BasePrice,
                Description = item.Description,
                WeightServing = item.WeightServing,
                TotalSell = item.TotalSell,
                ProductCategoryId = item.ProductCategory.ProductCategoryId,
                StoreName = item.Store.ShopName,
                StoreId = item.Store.StoreId,
                CreatedOn = item.CreatedOn,
                TotalView = await _productService.GetProductViews(item),
                Status = item.Status
            });
        }
        var metadata = new
        {
            products.TotalCount,
            products.PageSize,
            products.CurrentPage,
            products.TotalPages,
            products.HasNext,
            products.HasPrevious
        };

        Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));
        return Ok(productRes);
    }

    [HttpPost]
    [Route("review")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Customer)]
    public async Task<IActionResult> ReviewStore([FromBody] StoreReviewRequest reviewRequest)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        if (reviewRequest.Rating > 5 || reviewRequest.Rating < 0)
        {
            return BadRequest(new { message = "Rating must be between 0 and 5" });
        }
        var customer = await _customerService.FindCustomerByIdAsync(userId);
        StoreReview res = await _storeService.storeReview(reviewRequest, customer);

        return Ok(res);
    }

    [HttpGet]
    [Route("review")]
    public async Task<IActionResult> GetStoreReviews([FromQuery] PagedStoreReviewRequest reviewRequest)
    {
        PagedList<StoreReview> storeReviews = await _storeService.GetPagedStoreReview(reviewRequest);
        var metadata = new
        {
            storeReviews.TotalCount,
            storeReviews.PageSize,
            storeReviews.CurrentPage,
            storeReviews.TotalPages,
            storeReviews.HasNext,
            storeReviews.HasPrevious
        };

        List<StoreReviewResponse> reviewResponses = new List<StoreReviewResponse>();
        foreach (var item in storeReviews)
        {
            reviewResponses.Add(new StoreReviewResponse
            {
                Comment = item.Comment,
                CreatedOn = item.CreatedOn,
                Rating = item.Rating,
                StoreReviewId = item.StoreReviewId,
                CustomerId = item.Customer!.CustomerId,
                CustomerName = item.Customer!.Name
            });
        }

        Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));
        return Ok(reviewResponses);
    }

    [HttpGet]
    [Route("product-reviews")]
    public async Task<IActionResult> GetProductReviews([FromQuery] PagedRequest reviewRequest)
    {
        PagedList<ProductReview> productReviews = await _storeService.GetPagedAllProductReview(reviewRequest);
        var metadata = new
        {
            productReviews.TotalCount,
            productReviews.PageSize,
            productReviews.CurrentPage,
            productReviews.TotalPages,
            productReviews.HasNext,
            productReviews.HasPrevious
        };

        Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

        return Ok(productReviews);
    }

    [HttpDelete]
    [Route("{storeId}/product/{productId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Store)]
    public async Task<IActionResult> DeleteProduct(int storeId, int productId)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        IdentityUser user = await _userManager.FindByIdAsync(userId.ToString());

        Store store = await _storeService.FindStoreByStoreIdAsync(storeId);

        if (!_storeService.UserIsStore(user, store))
        {
            return Forbid();
        }

        Product product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);

        if (!_storeService.StoreContainsProduct(product, store))
        {
            return Forbid();
        }

        product.Status = false;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost]
    [Route("{storeId}/product")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Store)]
    public async Task<IActionResult> CreateProduct(int storeId, [FromBody] ProductRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        IdentityUser user = await _userManager.FindByIdAsync(userId.ToString());

        Store store = await _storeService.FindStoreByStoreIdAsync(storeId);

        if (!_storeService.UserIsStore(user, store))
        {
            return Forbid();
        }

        Product newProduct = new Product
        {
            PhotoJson = request.PhotoJson,
            Name = request.Name,
            Description = request.Description,
            BasePrice = request.BasePrice,
            InStock = request.InStock,
            WeightServing = request.WeightServing,
            Store = store,
            Status = true,
            ProductCategory = await _productService.FindProductCategoryByProductCategoryId(request.ProductCategoryId),
            CreatedOn = DateTime.UtcNow
        };

        await _context.Products.AddAsync(newProduct);
        await _context.SaveChangesAsync();

        return Ok(new ProductResponse
        {
            Images = _productService.ConvertJsonToPhotos(newProduct.PhotoJson),
            ProductId = newProduct.ProductId,
            Name = newProduct.Name,
            InStock = newProduct.InStock,
            BasePrice = newProduct.BasePrice,
            Description = newProduct.Description,
            WeightServing = newProduct.WeightServing,
            TotalSell = newProduct.TotalSell,
            ProductCategoryId = newProduct.ProductCategory.ProductCategoryId,
            StoreName = newProduct.Store.ShopName,
            StoreId = newProduct.Store.StoreId,
            CreatedOn = newProduct.CreatedOn,
            TotalView = await _productService.GetProductViews(newProduct),
            Status = newProduct.Status
        });
    }

    [HttpPut]
    [Route("{storeId}/product/{productId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Store)]
    public async Task<IActionResult> UpdatePRoduct(int storeId, int productId, [FromBody] ProductRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        IdentityUser user = await _userManager.FindByIdAsync(userId.ToString());

        Store store = await _storeService.FindStoreByStoreIdAsync(storeId);

        if (!_storeService.UserIsStore(user, store))
        {
            return Forbid();
        }

        Product product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);

        if (!_storeService.StoreContainsProduct(product, store))
        {
            return Forbid();
        }

        product.PhotoJson = request.PhotoJson;
        product.Name = request.Name;
        product.Description = request.Description;
        product.BasePrice = request.BasePrice;
        product.InStock = request.InStock;
        product.WeightServing = request.WeightServing;
        product.Store = store;
        product.ProductCategory = await _productService.FindProductCategoryByProductCategoryId(request.ProductCategoryId);

        await _context.SaveChangesAsync();

        return Ok(new ProductResponse
        {
            Images = _productService.ConvertJsonToPhotos(product.PhotoJson),
            ProductId = product.ProductId,
            Name = product.Name,
            InStock = product.InStock,
            BasePrice = product.BasePrice,
            Description = product.Description,
            WeightServing = product.WeightServing,
            TotalSell = product.TotalSell,
            ProductCategoryId = product.ProductCategory.ProductCategoryId,
            StoreName = product.Store.ShopName,
            StoreId = product.Store.StoreId,
            CreatedOn = product.CreatedOn,
            Status = product.Status,
            TotalView = await _productService.GetProductViews(product)
        });
    }

    [HttpGet]
    [Route("myStores")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> GetMyStores()
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        List<Store> stores = await _context.Stores.AsNoTracking().ToListAsync();
        var StoreRes = new List<MyStoresResponse>();
        foreach (var item in stores)
        {
            if (item.UserId == userId.ToString())
            {
                StoreRes.Add(new MyStoresResponse
                {
                    StoreId = item.StoreId,
                    IsActive = item.IsActive,
                    ShopName = item.ShopName,
                    AvatarUrl = item.AvatarUrl
                });
            }
        }
        return Ok(StoreRes);
    }

    [HttpGet]
    [Route("storeCategories/{storeId}")]
    public async Task<IActionResult> GetStoreProductCategories(int storeId)
    {
        List<ProductCategory> productCategories = await _storeService.GetStoreProductCategories(storeId);
        return Ok(productCategories);
    }

    [HttpGet]
    [Route("income-by-day")]
    public async Task<IActionResult> GetIncomeByDayAsync()
    {
        var totalIncome = await _storeService.GetIncomeByDay();
        return Ok(totalIncome);
    }

    [HttpGet]
    [Route("number-order-by-statuses")]
    public async Task<IActionResult> GetNumberOrderByStatusAsync()
    {
        var orderByStatuses = await _storeService.GetNumberOrderByStatus();
        return Ok(orderByStatuses);
    }

    [HttpGet]
    [Route("best-seller-of-months")]
    public async Task<IActionResult> GetBestSallerOfMonthAsync()
    {
        var orderByBestSales = await _storeService.GetBestSallerOfMonth();
        return Ok(orderByBestSales);
    }

    [HttpGet]
    [Route("best-category-of-months")]
    public async Task<IActionResult> GetBestCategoryOfMonthAsync()
    {
        var orderByCategories = await _storeService.GetCategorySallerOfMonth();
        return Ok(orderByCategories);
    }
}