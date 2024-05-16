using Microsoft.EntityFrameworkCore; // 🔥 Import EntityFrameworkCore
using whatseat_server.Data; // 🔥 Import WhatsEatContext
using whatseat_server.Models; // 🔥 Import Customer, ShippingInfo

namespace whatseat_server.Services; // 🔥 Import namespace

public class CustomerService // 🔥 Define CustomerService class
{
    private readonly WhatsEatContext _context; // 🔥 Define private field for WhatsEatContext
    public CustomerService(WhatsEatContext context) // 🔥 Define constructor for CustomerService
    {
        _context = context; // 🔥 Define private field for WhatsEatContext
    }

    public async Task<Customer> FindCustomerByIdAsync(Guid userId) // 🔥 Define method to find customer by ID
    {
        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.CustomerId == userId); // 🔥 Fetch customer by ID
        return customer; // 🔥 Return customer to the caller
    }

    public async Task<List<ShippingInfo>> GetCustomerShippingInfos(Customer customer) // 🔥 Define method to get customer shipping infos
    {
        return await _context.ShippingInfos.AsNoTracking().Where(s => (s.Customer == customer && s.Status == true)).ToListAsync(); // 🔥 Fetch customer shipping infos
    }

    public async Task<ShippingInfo> GetCustomerShippingInfosById(Customer customer, int shippingId) // 🔥 Define method to get customer shipping infos by ID
    {
        return await _context.ShippingInfos.FirstOrDefaultAsync(s => s.Customer == customer && s.Status == true); // 🔥 Fetch customer shipping info by ID
    }
}