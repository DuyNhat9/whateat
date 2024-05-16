using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
public class CustomerController : ControllerBase
{
    private readonly CustomerService _customerService;
    private readonly ProductService _productService;
    private readonly CartService _cartService;
    private readonly WhatsEatContext _context;
    private readonly OrderService _orderService;
    private readonly RecipeService _recipeService;
    private readonly ILogger<CustomerController> _logger;
    public CustomerController(CustomerService customerService,
        ProductService productService,
        CartService cartService,
        OrderService orderService,
        ILogger<CustomerController> logger,
        WhatsEatContext context,
        RecipeService recipeService
    )
    {
        _orderService = orderService;
        _customerService = customerService;
        _productService = productService;
        _cartService = cartService;
        _context = context;
        _logger = logger;
        _recipeService = recipeService;
    }

    [HttpGet]
    [Route("cart")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> GetCartDetails()
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var carts = await _cartService.GetPagedCartDetails(userId);
        return Ok(carts);
    }


    [HttpPut]
    [Route("cart")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> UpdateProductCart([FromBody] CartDetailRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var addResult = await _cartService.AddProductToCart(request.ProductId, userId, request.Quantity);
        return addResult.Success ? Ok(addResult) : BadRequest(addResult);
    }

    [HttpPost]
    [Route("cart")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> AddProductToCart([FromBody] CartDetailRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var addResult = await _cartService.AddProductToCart(request.ProductId, userId, request.Quantity);
        return addResult.Success ? Ok(addResult) : BadRequest(addResult);
    }

    [HttpDelete]
    [Route("cart/{productId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> DeleteProductFromCart(int productId)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);
        var deleteRes = await _cartService.RemoveById(userId, productId);
        if (deleteRes)
        {
            return Ok(
                new
                {
                    message = $"{productId} has been removed from your cart"
                }
            );
        }
        else
        {
            return BadRequest(

                new
                {
                    message = "Delete failed"
                }
            );
        }
    }

    [HttpPost]  // I/O: Receives HTTP POST request -> Next: Checks route and authorization
[Route("order")]  // Route: Defines URL endpoint /api/customer/order -> Next: Authorization check
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]  // Security: Ensures only authenticated 'customer' role users can access -> Next: Method execution

public async Task<IActionResult> AddOrder([FromBody] OrderCreateRequest request)
{
    Guid userId = new Guid(User.FindFirst("Id")?.Value);  // User Identification: Extracts user ID from JWT token -> Next: Initializes classifiedOrders dictionary

    Dictionary<int, Order> classifiedOrders = new Dictionary<int, Order>();  // Data Structure: Initializes dictionary to manage orders by store ID -> Next: Loops through product requests

    foreach (var productReq in request.ProductList)  // Loop: Iterates over each product in the request -> Next: Fetch product details
    {
        var product = await _productService.FindProductById(productReq.ProductId);  // Database Access: Fetches product by ID -> Next: Check product stock

        if (product.InStock < productReq.Quantity)  // Condition: Checks if requested quantity is available -> Next: Return BadRequest or continue
        {
            return BadRequest(new  // Response: Sends error if insufficient stock -> Ends method execution
            {
                productId = product.ProductId,
                message = $"Insufficient quantity of in store {product.Name}"
            });
        }
        try  // Error Handling: Starts try block to handle exceptions -> Next: Order processing logic
        {
            // The actual order processing logic would continue here...
                int storeId = product.Store.StoreId; // 🆔 Fetch Store ID -> 🔜 Next: Check if order for store exists
                Order currentOrder;// 📦 Initialize order variable
                if (classifiedOrders.ContainsKey(storeId)) // 🔄 Check: If order for this store already started
                {
                     // 🔄 Use existing order -> 🔜 Next: Add product to order
                    currentOrder = classifiedOrders[storeId];
                }
                else// 🆕 Create new order if none exists for this store
                {
                    // 📦 Create new Order object
                    currentOrder = new Order
                    {
                        // 🧑 Link customer to order
                        Customer = await _customerService.FindCustomerByIdAsync(userId),
                        Store = product.Store,// 🏪 Link store to order
                        OrderDetails = new List<OrderDetail>(),// 📦 Initialize order details list
                        CreatedOn = DateTime.UtcNow,// 📅 Set order creation date
                        ShippingInfo = _context.ShippingInfos.FirstOrDefault(si => si.ShippingInfoId == request.ShippingInfoId),// 📦 Link shipping info to order
                        PaymentMethod = _context.PaymentMethods.FirstOrDefault(pm => pm.PaymentMethodId == request.PaymentMethodId),// 📦 Link payment method to order
                    };

                    currentOrder.ShippingFee = await _orderService.CalculateFee(new OrderShippingFeeRequest // 🔄 Calculate shipping fee
                    {
                        // FromDistrictId = product.Store.DistrictCode,
                        ToDistrictId = currentOrder.ShippingInfo.DistrictCode,// 📦 Link shipping info to order
                        ToWardCode = currentOrder.ShippingInfo.DistrictCode,// 📦 Link shipping info to order
                        ServiceId = request.ServiceId// 📦 Link shipping info to order
                    });

                    if (currentOrder.ShippingFee < 0)// ❌ Check if shipping fee calculation failed
                    {
                        return BadRequest(new { Message = "Cannot calculate shipping fee" });// 🚫 Return error if shipping fee calculation failed
                    }
                    classifiedOrders.Add(storeId, currentOrder);// ➕ Add new order to dictionary
                }

                product.InStock -= productReq.Quantity;// 📉 Decrease stock count
               // ➕ Add product to order details
                currentOrder.OrderDetails.Add(new OrderDetail 
                {
                    ProductId = productReq.ProductId,// 🆔 Product ID
                    Quantity = productReq.Quantity, // 📊 Quantity
                    Price = product.BasePrice// 💸 Price
                });

            }
            catch (NullReferenceException ex)// 🚨 Handle null reference exception
            {
                // 🚨 Return error if null reference exception occurs
                return this.StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        foreach (var order in classifiedOrders)// 🔄 Loop through classified orders
        {
            _logger.LogInformation($"{order.Key}");// 🔥 Log store ID
        }
        // 📝 Initialize list to store orders.
        List<Order> orders = new List<Order>();
        // 🔥 Fetch all orders from dictionary
        Dictionary<int, Order>.ValueCollection values = classifiedOrders.Values;
        // 🔥 Fetch all orders from dictionary
        using (var dbContextTransaction = await _context.Database.BeginTransactionAsync())
        {
            foreach (var val in values)// 🔥 Fetch all orders from dictionary
            {
                // 🔥 Add order to orders list
                orders.Add(val);
                // 🔥 Update order status to waiting
                OrderStatusHistory orderStatusWaiting = await _orderService.UpdateStatus(val, OrderStatusConstant.Waiting);
            }
            await dbContextTransaction.CommitAsync();// ✔️ Commit the transaction to the database.
        }

        // await _context.Orders.AddRangeAsync(orders);
        // await _context.SaveChangesAsync();


        return Ok(orders);
    }

    [HttpPost]  // 📝 Add shipping info to customer 
    [Route("shippingInfos")]  // 📌 Route: /api/customer/shippingInfos
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]  // 🔑 Authorization: Only customers can add shipping info
    public async Task<IActionResult> AddShippingInfo([FromBody] ShippingInfoRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);

        var customer = await _customerService.FindCustomerByIdAsync(userId);
        if (customer.ShippingInfos is null)
        {
            customer.ShippingInfos = new List<ShippingInfo>();
        }

        customer.ShippingInfos.Add(new ShippingInfo
        {
            Name = request.Name,
            WardCode = request.WardCode,
            PhoneNumber = request.PhoneNumber,
            DistrictCode = request.DistrictCode,
            Address = request.Address,
            ProvinceCode = request.ProvinceCode,
            Status = true
        });
        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = "Success"
        });
    }

    [HttpGet]
    [Route("shippingInfos")]
    // 🔑 Authorization: Only customers can add shipping infow
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> GetShippingInfo() // 🔥 Fetch all shipping info of customer
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value); // 🔥 Fetch user ID from JWT token

        var customer = await _customerService.FindCustomerByIdAsync(userId);// 🔥 Fetch customer by ID
     // 🔥 Fetch all shipping info of customer
        List<ShippingInfo> shippingInfos = await _customerService.GetCustomerShippingInfos(customer);
        return Ok(shippingInfos);// 🔥 Return shipping info to the client
    }

    [HttpDelete]
    [Route("shippingInfos/{shippingId}")] // 📌 Route: /api/customer/shippingInfos/{shippingId}
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")] // 🔑 Authorization: Only customers can delete shipping info
    public async Task<IActionResult> DeleteShippingInfo(int shippingId) // 🔥 Delete shipping info by ID
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value); // 🔥 Fetch user ID from JWT token

        var customer = await _customerService.FindCustomerByIdAsync(userId);// 🔥 Fetch customer by ID

        ShippingInfo shippingInfo = await _customerService.GetCustomerShippingInfosById(customer, shippingId);// 🔥 Fetch shipping info by ID

        if (shippingInfo is null) return Forbid();// 🚫 Return error if shipping info is null

        shippingInfo.Status = false;// 🔥 Set shipping info status to false

        await _context.SaveChangesAsync();// 🔥 Save changes to the database
        return NoContent();
    }
    
    [HttpPut]
    [Route("shippingInfos/{shippingId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> EditShippingInfo(int shippingId, [FromBody] ShippingInfoRequest request)
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);

        var customer = await _customerService.FindCustomerByIdAsync(userId); // 🔥 Fetch customer by ID

        ShippingInfo shippingInfo = await _customerService.GetCustomerShippingInfosById(customer, shippingId);// 🔥 Fetch shipping info by ID

        if (shippingInfo is null) return Forbid();// 🚫 Return error if shipping info is null

        shippingInfo.Name = request.Name;// 🔥 Update shipping info name
        shippingInfo.WardCode = request.WardCode; // 🔥 Update shipping info ward code
        shippingInfo.PhoneNumber = request.PhoneNumber;// 🔥 Update shipping info phone number
        shippingInfo.DistrictCode = request.DistrictCode;// 🔥 Update shipping info district code
        shippingInfo.Address = request.Address;// 🔥 Update shipping info address
        shippingInfo.ProvinceCode = request.ProvinceCode;// 🔥 Update shipping info province code
        await _context.SaveChangesAsync();// 🔥 Save changes to the database
        return Ok(shippingInfo);// 🔥 Return shipping info to the client
    }

    [HttpPost]
    [Route("add-recipe")] // 📌 Route: /api/customer/add-recipe
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")] // 🔑 Authorization: Only customers can add recipe
    public async Task<IActionResult> AddRecipe([FromBody] AddRecipeRequest request) // 🔥 Add recipe to customer
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value); // 🔥 Fetch user ID from JWT token

        var customer = await _customerService.FindCustomerByIdAsync(userId);// 🔥 Fetch customer by ID

        List<RecipeRecipeType> recipeTypes = new List<RecipeRecipeType>(); // 🔥 Initialize list to store recipe types

        Recipe recipe = new Recipe // 🔥 Initialize recipe
        {
            Name = request.Name, // 🔥 Update recipe name
            Description = request.Description,// 🔥 Update recipe description
            Serving = request.Serving,// 🔥 Update recipe serving
            TotalTime = request.TotalTime,
            ThumbnailUrl = request.ThumbnailUrl,// 🔥 Update recipe thumbnail URL
            AvgRating = 0,// 🔥 Update recipe average rating
            TotalRating = 0,// 🔥 Update recipe total rating
            TotalView = 0,// 🔥 Update recipe total view
            totalLike = 0,// 🔥 Update recipe total like
            videoUrl = request.videoUrl,// 🔥 Update recipe video URL
            Creator = customer// 🔥 Update recipe creator
        };

        foreach (var item in request.RecipeTypeIds) // 🔥 Fetch all recipe types from request
        {
            var recipeType = await _context.RecipeTypes // 🔥 Fetch recipe type by ID
            .FirstOrDefaultAsync(pc => pc.RecipeTypeId == item); // 🔥 Fetch recipe type by ID

            RecipeRecipeType recipeRecipeType = new RecipeRecipeType // 🔥 Initialize recipe recipe type
            {
                RecipeType = recipeType,// 🔥 Update recipe type
                Recipe = recipe // 🔥 Update recipe
            };        

            if (recipeType is not null) // 🔥 Check if recipe type is not null
            {
                recipeTypes.Add(recipeRecipeType);// 🔥 Add recipe recipe type to list
            }
        }

        await _context.RecipeRecipeTypes.AddRangeAsync(recipeTypes); // 🔥 Add recipe recipe types to database
        await _context.Recipes.AddAsync(recipe);// 🔥 Add recipe to database
        await _context.SaveChangesAsync();// 🔥 Save changes to the database
        return Ok(new 
        {
            message = "Success"
        });
    }
    [HttpGet] // 📌 Route: /api/customer/orders-list
    [Route("orders-list")] // 📌 Route: /api/customer/orders-list
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")] // 🔑 Authorization: Only customers can fetch orders
    public async Task<IActionResult> GetOrders([FromQuery] OrderPagedRequest request) // 🔥 Fetch orders for customer
    {
        try
        {
            Guid userId = new Guid(User.FindFirst("Id")?.Value); // 🔥 Fetch user ID from JWT token

            var customer = await _customerService.FindCustomerByIdAsync(userId);// 🔥 Fetch customer by ID

            var orderList = await _orderService.GetUserPagedOrders(customer, request); // 🔥 Fetch orders for customer

            return Ok(orderList);// 🔥 Return orders to the client
        }
        catch (Exception e) // 🚫 Return error if exception is thrown
        {
            _logger.LogInformation(e.Message); // 🔥 Log error message
            return Forbid();// 🚫 Return error if exception is thrown
            
        }
    }

    [HttpGet]
    [Route("order/{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")]
    public async Task<IActionResult> GetOrderDetails(int id)
    {
        try
        {
            Guid userId = new Guid(User.FindFirst("Id")?.Value);
            var customer = await _customerService.FindCustomerByIdAsync(userId);

            var order = await _orderService.getOrderDetails(customer, id);

            return Ok(order);
        }
        catch (Exception e)
        {
            _logger.LogInformation(e.Message);
            return Forbid();
        }
    }
    // TODO:
    [HttpPut]
    [Route("order")] // 📌 Route: /api/customer/order
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")] // 🔑 Authorization: Only customers can cancel orders
    public async Task<IActionResult> CancelOrder([FromBody] OrderStatusRequest request) // 🔥 Cancel order
    {
        try // 🔥 Try to cancel order
        {
            Guid userId = new Guid(User.FindFirst("Id")?.Value);// 🔥 Fetch user ID from JWT token
            var customer = await _customerService.FindCustomerByIdAsync(userId);// 🔥 Fetch customer by ID

            var order = await _orderService.getOrderDetails(customer, request.OrderId);// 🔥 Fetch order by ID

            var OrderStatusHistory = await _orderService.GetLatestOrderStatus(order);// 🔥 Fetch order status history

            // if (_orderService.IsCancelable(OrderStatusHistory.OrderStatus.Value))
            // { 
            await _orderService.CancelOrder(customer, order, request.Message);// 🔥 Cancel order
            var orderRes = await _orderService.getOrderDetails(customer, request.OrderId);// 🔥 Fetch order by ID
            return Ok(orderRes);// 🔥 Return order to the client
            // }
            // else
            // {
            //     return BadRequest(
            //         new
            //         {
            //             message = "Order cancellation failed"
            //         }
            //     );
            // }
        }
        catch (Exception e) // 🚫 Return error if exception is thrown
        {
            _logger.LogInformation(e.Message);// 🔥 Log error message
            return Forbid();// 🚫 Return error if exception is thrown
        } 
    }

    [HttpGet] // 📌 Route: /api/customer/get-calo-per-day
    [Route("get-calo-per-day")] // 📌 Route: /api/customer/get-calo-per-day
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")] // 🔑 Authorization: Only customers can fetch calo per day
    public async Task<IActionResult> AddCaloPerDay() // 🔥 Fetch calo per day
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);// 🔥 Fetch user ID from JWT token
        var customer = await _customerService.FindCustomerByIdAsync(userId);// 🔥 Fetch customer by ID

        return Ok(new UpdateCaloResponse(customer.KcalPerDay, customer.Allergy));// 🔥 Return calo per day to the client
    }

    [HttpPut] // 📌 Route: /api/customer/update-calo-per-day
    [Route("update-calo-per-day")] // 📌 Route: /api/customer/update-calo-per-day
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "customer")] // 🔑 Authorization: Only customers can update calo per day
    public async Task<IActionResult> UpdateCaloPerDay([FromBody] AddCaloRequest request) // 🔥 Update calo per day
    {
        var now = DateTime.Now;// 🔥 Fetch current date time
        var birthDay = Int32.Parse(request.Year);// 🔥 Fetch birth day from request
        var age = now.Year - birthDay;// 🔥 Calculate age
        Guid userId = new Guid(User.FindFirst("Id")?.Value);// 🔥 Fetch user ID from JWT token

        var brm = request.Gender == "male" ? // 🔥 Calculate BMR
            66 + (6.3 * request.Weight * 2.20462262) + (12.9 * request.Height * 0.393700787) + (6.8 * age) : // 🔥 Calculate BMR for male
            66.5 + (4.3 * request.Weight * 2.20462262) + (4.7 * request.Height * 0.393700787) + (4.7 * age); // 🔥 Calculate BMR for female

        var calorie = (float)Math.Round(brm * float.Parse(request.PAL), 2); // 🔥 Calculate calorie
        var customer = await _customerService.FindCustomerByIdAsync(userId);// 🔥 Fetch customer by ID
        customer.KcalPerDay = calorie * request.Person;// 🔥 Update calo per day
        customer.Allergy = request.Allergy;// 🔥 Update allergy
        await _context.SaveChangesAsync();// 🔥 Save changes to the database

        return Ok(new UpdateCaloResponse(customer.KcalPerDay, customer.Allergy));// 🔥 Return calo per day to the client
    }


    [HttpGet] // 📌 Route: /api/customer/get-customer-info
    [Route("get-customer-info")] // 📌 Route: /api/customer/get-customer-info
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Customer)] // 🔑 Authorization: Only customers can fetch customer info
    public async Task<IActionResult> GetCustomerInfo() // 🔥 Fetch customer info
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);// 🔥 Fetch user ID from JWT token
        var customer = await _customerService.FindCustomerByIdAsync(userId);// 🔥 Fetch customer by ID
        return Ok(customer);// 🔥 Return customer info to the client
    }

    [HttpPut] // 📌 Route: /api/customer/edit-customer-info
    [Route("edit-customer-info")] // 📌 Route: /api/customer/edit-customer-info
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Customer)] // 🔑 Authorization: Only customers can edit customer info
    public async Task<IActionResult> EditCustomerInfo([FromBody] CustomerInfoRequest request) // 🔥 Edit customer info
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);// 🔥 Fetch user ID from JWT token
        var customer = await _customerService.FindCustomerByIdAsync(userId);// 🔥 Fetch customer by ID
        customer.AvatarUrl = request.AvatarUrl;// 🔥 Update avatar url
        customer.Email = request.Email; // 🔥 Update email
        customer.IDCard = request.IdCard;// 🔥 Update ID card
        customer.Name = request.Name;// 🔥 Update name

        await _context.SaveChangesAsync();// 🔥 Save changes to the database
        return Ok(customer);// 🔥 Return customer info to the client
    }

    [HttpGet] // 📌 Route: /api/customer/{userId}
    [Route("{userId}")] // 📌 Route: /api/customer/{userId}
    public async Task<IActionResult> GetCustomerInfo(string userId) // 🔥 Fetch customer info by user ID
    {
        try // 🔥 Try to fetch customer info by user ID
        {
            Guid userIdNew = new Guid(userId);// 🔥 Convert user ID to Guid
            var customer = await _customerService.FindCustomerByIdAsync(userIdNew);// 🔥 Fetch customer by ID
            return Ok(customer);// 🔥 Return customer info to the client
        }
        catch (FormatException ex)// 🚫 Return error if exception is thrown
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet] // 📌 Route: /api/customer/shipping-fee
    [Route("shipping-fee")] // 📌 Route: /api/customer/shipping-fee
    public async Task<IActionResult> CalculateFee([FromQuery] OrderShippingFeeRequest request) // 🔥 Calculate shipping fee
    {
        var shippingFee = await _orderService.CalculateFee(request);// 🔥 Calculate shipping fee

        if (shippingFee < 0)// 🚫 Return error if exception is thrown
        {
            return BadRequest(new { Message = "Calculate shipping fee failed", ShippingFee = -1 });// 🚫 Return error if exception is thrown
        }
        else// 🔥 Return shipping fee to the client
        {
            return Ok(new { Message = "Success", ShippingFee = shippingFee });
        }
    }

    [HttpGet] // 📌 Route: /api/customer/own-recipes
    [Route("own-recipes")] // 📌 Route: /api/customer/own-recipes
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Customer)] // 🔑 Authorization: Only customers can fetch own recipes
    public async Task<ActionResult> GetOwnRecipeAsync() // 🔥 Fetch own recipes
    {
        Guid userId = new Guid(User.FindFirst("Id")?.Value);// 🔥 Fetch user ID from JWT token
        var customer = await _customerService.FindCustomerByIdAsync(userId);// 🔥 Fetch customer by ID
        var recipesByCreator = await _recipeService.FindRecipeByCreator(customer);// 🔥 Fetch recipes by creator

        var recipeRes = new List<RecipeResponse>(); // 🔥 Initialize recipe response

        foreach (var item in recipesByCreator)// 🔥 Loop through recipes by creator
        {
            recipeRes.Add(new RecipeResponse // 🔥 Add recipe response
            {
                RecipeId = item.RecipeId, // 🔥 Fetch recipe ID
                Name = item.Name, // 🔥 Fetch recipe name
                Description = item.Description, // 🔥 Fetch recipe description
                Serving = item.Serving, // 🔥 Fetch recipe serving
                CreatedOn = item.CreatedOn, // 🔥 Fetch recipe created on
                Creator = item.Creator, // 🔥 Fetch recipe creator
                TotalTime = item.TotalTime, // 🔥 Fetch recipe total time
                AvgRating = item.AvgRating, // 🔥 Fetch recipe average rating
                TotalRating = item.TotalRating, // 🔥 Fetch recipe total rating
                TotalView = item.TotalView, // 🔥 Fetch recipe total view
                totalLike = item.totalLike, // 🔥 Fetch recipe total like
                videoUrl = item.videoUrl, // 🔥 Fetch recipe video url
                RecipeTypes = await _context.RecipeRecipeTypes.Where(rrt => rrt.RecipeId == item.RecipeId).ToListAsync(), // 🔥 Fetch recipe types
                Level = item.Level, // 🔥 Fetch recipe level
                Images = _recipeService.ConvertJsonToPhotos(item.ThumbnailUrl) // 🔥 Fetch recipe images
            });
        }

        return Ok(recipeRes);// 🔥 Return recipe response to the client 
    }

    [HttpDelete] // 📌 Route: /api/customer/recipe/{recipeId}
    [Route("recipe/{recipeId}")] // 📌 Route: /api/customer/recipe/{recipeId}
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = RoleConstants.Customer)] // 🔑 Authorization: Only customers can delete recipe
    public async Task<IActionResult> DeleteProduct(int recipeId) // 🔥 Delete recipe
    {
        var recipesByCreator = await _recipeService.FindRecipeById(recipeId);// 🔥 Fetch recipe by ID

        recipesByCreator.Status = false; // 🔥 Update recipe status to false

        await _context.SaveChangesAsync();// 🔥 Save changes to the database

        return NoContent();// 🔥 Return no content to the client
    } // 🔥 Delete recipe
}

