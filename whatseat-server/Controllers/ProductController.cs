using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using whatseat_server.Data;
using whatseat_server.Models;
using whatseat_server.Models.DTOs.Requests;
using whatseat_server.Models.DTOs.Responses;
using whatseat_server.Services;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace whatseat_server.Controllers;
[ApiController]
[Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ProductService _productService;
    private readonly CustomerService _customerService;
    private readonly WhatsEatContext _context;

    public ProductController(
        ProductService productService,
        WhatsEatContext context,
        CustomerService customerService
        )
    {
        _context = context;
        _productService = productService;
        _customerService = customerService;
    }

    [HttpGet]
    public async Task<IActionResult> SearchProduct([FromQuery] ProductFilter searchParams)
    {
        var products = await _productService.FullTextSearchProduct(searchParams);

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
                Status = item.Status,
                TotalView = await _productService.GetProductViews(item)
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

    [HttpGet]
    [Route("top-8")]
    public async Task<IActionResult> GetBestSellers()
    {
        var products = await _productService.Get8BestSellerProduct();

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
                Status = item.Status,
                TotalView = await _productService.GetProductViews(item)
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

    [HttpGet] // 🔍 Define this method as a HTTP GET endpoint
[Route("{productId}", Name = "productId")] // 🚏 Set the route for this endpoint, with a productId parameter
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] // 🔐 Require the user to be authorized
[AllowAnonymous] // 👥 Allow anonymous users
public async Task<IActionResult> GetProductDetails(int productId) // 🚀 Define an asynchronous method that returns an IActionResult
{
    Customer customer = null; // 🆔 Initialize a Customer object to null
    
    if (User.FindFirst("Id") is not null) // 🧐 If the user is authenticated
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value); // 🎫 Get the user's ID
        customer = await _customerService.FindCustomerByIdAsync(userId); // 📚 Fetch the customer details
    }
    var item = await _productService.FindProductById(productId); // 📚 Fetch the product details
    await _productService.AddProductHistory(customer, item); // 📝 Add this product view to the history

    // 🔄 If the product exists, return it, otherwise return a not found message
    return item is not null ? Ok(new ProductResponse
    {
        Images = _productService.ConvertJsonToPhotos(item.PhotoJson), // 🖼️ Convert the product's photos from JSON
        ProductId = item.ProductId, // 🆔 Set the product's ID
        Name = item.Name, // 📛 Set the product's name
        InStock = item.InStock, // 📦 Set the product's stock status
        BasePrice = item.BasePrice, // 💲 Set the product's base price
        Description = item.Description, // 📝 Set the product's description
        WeightServing = item.WeightServing, // ⚖️ Set the product's serving weight
        TotalSell = item.TotalSell, // 📈 Set the product's total sell count
        ProductCategoryId = item.ProductCategory is not null ? item.ProductCategory.ProductCategoryId : -1, // 🏷️ Set the product's category ID
        StoreName = item.Store.ShopName, // 🏪 Set the store's name
        StoreId = item.Store.StoreId, // 🆔 Set the store's ID
        CreatedOn = item.CreatedOn, // 📅 Set the product's creation date
        Status = item.Status, // 🚦 Set the product's status
        TotalView = await _productService.GetProductViews(item) // 👀 Set the product's total view count
    }) : NotFound(new { message = "product not found" }); // 🚫 Return a not found message if the product doesn't exist
}

    [HttpGet("reviews")]
    public async Task<IActionResult> GetReviews([FromQuery] PagedProductReviewRequest request)
    {
        var reviews = await _productService.GetAllProductReviews(request);

        var metadata = new
        {
            reviews.TotalCount,
            reviews.PageSize,
            reviews.CurrentPage,
            reviews.TotalPages,
            reviews.HasNext,
            reviews.HasPrevious
        };

        Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

        return Ok(reviews);
    }

    [HttpPost]
    [Route("review")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> PostReview([FromBody] ProductReviewRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var customer = await _customerService.FindCustomerByIdAsync(userId);
        var product = await _productService.FindProductById(request.ProductId);
        ProductReview productReview = new ProductReview
        {
            Rating = request.Rating,
            Comment = request.Comment,
            CreatedOn = DateTime.UtcNow,
            Product = product,
            Customer = customer
        };

        var addRes = await _context.ProductReviews.AddAsync(productReview);
        var changRes = await _context.SaveChangesAsync();

        return Ok(new { message = "Success" });
    }

    [HttpGet] 
    [Route("categories")]
    public async Task<IActionResult> GetCategories()
    {
        return Ok(await _context.ProductCategories.AsNoTracking().ToListAsync());
    }

    [HttpGet]
    [Route("categories/{categoryId}", Name = "categoryId")]
    public async Task<IActionResult> GetProductByCategories(int categoryId)
    {
        return Ok(await _productService.FindProductByCategoryId(categoryId));
    }

    [HttpGet]
    [Route("payment-method")]
    public async Task<IActionResult> GetPaymentMethods()
    {
        return Ok(await _context.PaymentMethods.AsNoTracking().ToListAsync());
    }
}