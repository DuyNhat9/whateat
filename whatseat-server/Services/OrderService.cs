using System;
using System.Linq;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using whatseat_server.Constants;
using whatseat_server.Data;
using whatseat_server.Libraries;
using whatseat_server.Models;
using whatseat_server.Models.DTOs.Requests;
using whatseat_server.Models.DTOs.Responses;

namespace whatseat_server.Services;

public class OrderService
{
    private readonly WhatsEatContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ProductService _productService;

    public static TreeNode<string> statusRoot = new TreeNode<string>("root");
    // TreeNode<string> ship_cod = statusRoot.AddChild("ship_cod");
    public static TreeNode<string> paid = statusRoot.AddChild("paid");
    public static TreeNode<string> delivering = paid.AddChild("delivering");
    public static TreeNode<string> cancelled = paid.AddChild("cancelled");
    public static TreeNode<string> deliveredSuccessfully = delivering.AddChild("delivering successfully");
    public static TreeNode<string> pendingForConfirmation = delivering.AddChild("pending for confirmation");
    public static TreeNode<string> refundedSuccessfully = pendingForConfirmation.AddChild("refunded successfully");
    public static TreeNode<string> deliveredSuccessfully1 = pendingForConfirmation.AddChild("delivering successfully");


    public OrderService(WhatsEatContext context, IHttpClientFactory httpClientFactory, ProductService productService)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _productService = productService;
    }

    public async Task<PagedList<Order>> GetUserPagedOrders(Customer customer, OrderPagedRequest request)
    {
        var orders = _context.Orders.AsNoTracking().Include(o => o.Customer).Include(o => o.PaymentMethod)
        .Include(o => o.ShippingInfo).Include(o => o.OrderStatusHistories)
        .ThenInclude(o => o.OrderStatus)
        .Include(o => o.Store).Include(o => o.OrderDetails).Where(o => (o.Customer == customer));

        var orderList = await PagedList<Order>.ToPagedList(orders, request.PageNumber, request.PageSize);

        return orderList;
    }

    public async Task<Order> getOrderDetails(Customer customer, int orderId)
    {
        var order = await _context.Orders.Include(o => o.OrderDetails).Include(o => o.OrderStatusHistories).ThenInclude(h => h.OrderStatus)
        .Include(od => od.Customer).Include(od => od.Shipper).Include(od => od.ShippingInfo).Include(od => od.PaymentMethod)
            .FirstOrDefaultAsync(o => o.Customer == customer && o.OrderId == orderId);
        return order;
    }

    public async Task<Order> CancelOrder(Customer customer, Order order, string message)
    {
        OrderStatus canceledStatus = await GetOrderStatusByName(OrderStatusConstant.Canceled);
        OrderStatusHistory orderStatusHistory = new OrderStatusHistory
        {
            OrderStatus = canceledStatus,
            Order = order,
            Message = message,
            CreatedOn = DateTime.UtcNow,
            ByUser = true
        };
        await _context.OrderStatusHistories.AddAsync(orderStatusHistory);
        await _context.SaveChangesAsync();
        var res = await getOrderDetails(customer, order.OrderId);
        return res;
    }

    public async Task<List<OrderDetail>> getOrderDetails(Order order)
    {
        return await _context.OrderDetails.Include(od => od.Product).Where(od => od.Order == order).ToListAsync();
    }

    public async Task<Order> PayOrder(Order order)
    {
        var resOrder = await _context.Orders.FirstOrDefaultAsync(o => o == order);
        resOrder.IsPaid = true;
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task<Order> FindOrderBySessionId(string id)
    {
        var res = await _context.PaymentSessions.Include(pm => pm.Order).FirstOrDefaultAsync(pm => pm.SessionId == id);
        return res.Order;
    }

    public async Task<Order> GetOrderByOrderIdAndCustomerId(int orderId, Guid userId)
    {
        return await _context.Orders.Include(o => o.Customer).Include(o => o.OrderDetails)
            .FirstOrDefaultAsync(o => o.OrderId == orderId && o.Customer!.CustomerId == userId);
    }

    public async Task<OrderStatusHistory> StoreAcceptOrder(Order order, string message)
    {
        OrderStatus acceptStatus = await GetOrderStatusByName(OrderStatusConstant.Delivering);
        OrderStatusHistory orderStatusHistory = new OrderStatusHistory
        {
            OrderStatus = acceptStatus,
            Order = order,
            Message = message,
            CreatedOn = DateTime.UtcNow,
            ByUser = false
        };

        await _context.OrderStatusHistories.AddAsync(orderStatusHistory);

        await _context.SaveChangesAsync();
        return orderStatusHistory;
    }

    public async Task<OrderStatus> GetOrderStatusByName(string status)
    {
        OrderStatus orderStatus = await _context.OrderStatuses
            .FirstOrDefaultAsync(os => os.Value.Equals(status));
        if (orderStatus is null)
        {
            OrderStatus orderStatusNew = new OrderStatus
            {
                Value = status
            };

            await _context.OrderStatuses.AddAsync(orderStatusNew);
            await _context.SaveChangesAsync();

            return orderStatusNew;
        }
        return orderStatus;
    }

    public async Task<OrderStatusHistory> GetLatestOrderStatus(Order order)
    {
        OrderStatusHistory latestStatus = await _context.OrderStatusHistories
            .Where(osh => osh.Order == order).OrderByDescending(osh => osh.CreatedOn)
            .FirstAsync();

        return latestStatus;
    }

    public bool IsCancelable(string status)
    {
        if (status.Equals(OrderStatusConstant.Canceled) || status.Equals(OrderStatusConstant.Delivering))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    public async Task<Order> getOrderOrderId(int orderId)
    {
        return await _context.Orders.Include(o => o.Store).Include(o => o.OrderDetails).ThenInclude(od => od.Product).FirstOrDefaultAsync(o => o.OrderId == orderId);

    }

    public async Task<OrderStatusHistory> StoreCancelOrder(Order order, string message)
    {
        OrderStatus acceptStatus = await GetOrderStatusByName(OrderStatusConstant.Canceled);
        OrderStatusHistory orderStatusHistory = new OrderStatusHistory
        {
            OrderStatus = acceptStatus,
            Order = order,
            Message = message,
            CreatedOn = DateTime.UtcNow,
            ByUser = false
        };

        foreach (var orderDetail in order.OrderDetails)
        {
            orderDetail.Product.InStock += orderDetail.Quantity;
            await _context.SaveChangesAsync();
        }
        await _context.OrderStatusHistories.AddAsync(orderStatusHistory);

        await _context.SaveChangesAsync();
        return orderStatusHistory;
    }

    public async Task<OrderStatusHistory> OrderWaitAccept(Order order)
    {
        OrderStatus waitingStatus = await GetOrderStatusByName(OrderStatusConstant.Waiting);
        OrderStatusHistory orderStatusHistory = new OrderStatusHistory
        {
            OrderStatus = waitingStatus,
            Order = order,
            CreatedOn = DateTime.UtcNow,
            ByUser = false
        };

        await _context.OrderStatusHistories.AddAsync(orderStatusHistory);

        await _context.SaveChangesAsync();
        return orderStatusHistory;
    }

    public async Task<OrderStatusHistory> UpdateStatus(Order order, string status, bool byUser = false)
    {
        OrderStatus orderStatus = await GetOrderStatusByName(status);
        OrderStatusHistory orderStatusHistory = new OrderStatusHistory
        {
            OrderStatus = orderStatus,
            Order = order,
            CreatedOn = DateTime.UtcNow,
            ByUser = byUser
        };

        await _context.OrderStatusHistories.AddAsync(orderStatusHistory);

        await _context.SaveChangesAsync();
        return orderStatusHistory;
    }

    public async Task<PaymentSession> SavePaymentSession(int OrderId, string sessionId)
    {
        PaymentSession paymentSession = new PaymentSession
        {
            OrderId = OrderId,
            SessionId = sessionId
        };

        var res = await _context.PaymentSessions.AddAsync(paymentSession);
        await _context.SaveChangesAsync();

        return res.Entity;
    }

    public async Task<long> CalculateFee(OrderShippingFeeRequest request)
    {
        CalculateShippingFeeRequest shippingFeeRequest = new CalculateShippingFeeRequest
        {
            ServiceId = request.ServiceId,
            InsuranceValue = 50000,
            Coupon = null,
            FromDistrictId = request.FromDistrictId,
            ToDistrictId = request.ToDistrictId,
            ToWardCode = request.ToWardCode.ToString(),
            Height = 15,
            Length = 15,
            Weight = 200,
            Width = 15
        };

        var httpRequestMessage = new HttpRequestMessage(
            HttpMethod.Get,
            "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee")
        {
            Headers = {
                    // { HeaderNames.AcceptEncoding, "gzip, deflate, br"},
                    {HeaderNames.Accept, "*/*"},
                    {"Token", "a56ffb3c-e407-11ec-a1f9-5689a5719baa"}
                },
            Content = new StringContent(JsonConvert.SerializeObject(shippingFeeRequest), Encoding.UTF8, "application/json")
        };


        var httpClient = _httpClientFactory.CreateClient();

        var HttpResponseMessage = await httpClient.SendAsync(httpRequestMessage);

        if (HttpResponseMessage.IsSuccessStatusCode)
        {
            var contentStream = await HttpResponseMessage.Content.ReadAsStringAsync();
            CalculateShippingFeeResponse feeRes = JsonConvert.DeserializeObject<CalculateShippingFeeResponse>(contentStream);
            return feeRes.Data.Total;
        }

        return -1;

    }

}