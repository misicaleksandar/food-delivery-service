using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Ocsp;
using RestaurantAPI.CustomExceptions;
using RestaurantAPI.Dto;
using RestaurantAPI.Infrastructure;
using RestaurantAPI.Interfaces;
using RestaurantAPI.Models;
using System.Runtime;

namespace RestaurantAPI.Services
{
    public class OrderService : IOrderService
    {
        private readonly IMapper _mapper;
        private readonly RestaurantDbContext _dbContext;

        public OrderService(IMapper mapper, RestaurantDbContext dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public OrderDto? CustomerHasAnActiveOrder(string email)
        {
            Customer? c = _dbContext.Customers.FirstOrDefault(x => x.Email == email);
            Order? lastOrder = _dbContext.Orders.Where(x => x.CustomerId == c.Id).Where(x => x.AcceptedTime == null).FirstOrDefault();

            lastOrder ??= _dbContext.Orders.Where(x => x.CustomerId == c.Id).OrderByDescending(x => x.AcceptedTime).FirstOrDefault();

            if (lastOrder == null)
            {
                return null;
            }

            if (lastOrder.AcceptedTime?.AddMinutes(1) < DateTime.Now)
            {
                return null;
            }

            _dbContext.Entry(lastOrder).Collection(order => order.OrderItems!).Query().Include(oi => oi.Product).Load();

            OrderDto ret = _mapper.Map<OrderDto>(lastOrder);
            ret.Year = ret.AcceptedTime.Year;
            ret.Month = ret.AcceptedTime.Month;
            ret.Day = ret.AcceptedTime.Day;
            ret.Hours = ret.AcceptedTime.Hour;
            ret.Minutes = ret.AcceptedTime.Minute;
            ret.Seconds = ret.AcceptedTime.Second;
            ret.Miliseconds = ret.AcceptedTime.Millisecond;

            ret.CustomerEmail = c.Email;

            ret.Products = new List<ProductDto>();

            foreach (OrderItem oi in lastOrder.OrderItems)
            {
                ret.Products.Add(_mapper.Map<ProductDto>(oi.Product));
            }

            return ret;
        }

        public OrderCreatedDto CreateOrder(OrderCreatedDto o)
        {
            long customerId = _dbContext.Customers.First(x => x.Email == o.Email).Id;

            double totalPrice = 0;
            foreach (OrderItemDto oi in o.OrderItems)
            {
                totalPrice += (oi.Price * oi.Amount);
            }
            totalPrice = Math.Round(totalPrice, 2);

            bool paymentCompleted = o.PaymentMethod == "Cash on delivery";

            Order order = new()
            {
                Address = o.Address,
                Lat = o.Lat,
                Lon = o.Lon,
                TotalPrice = totalPrice,
                PaymentMethod = o.PaymentMethod,
                PaymentCompleted = paymentCompleted,
                Completed = false,
                CustomerId = customerId
            };

            _dbContext.Orders.Add(order);
            _dbContext.SaveChanges();

            List<OrderItem> orderItems = new();
            foreach (OrderItemDto oi in o.OrderItems)
            {
                long productId = _dbContext.Products.FirstOrDefault(x => x.Name == oi.Name)!.Id;
                OrderItem orderItem = new() { OrderId = order.Id, ProductId = productId, Amount = oi.Amount };
                _dbContext.OrderItems.Add(orderItem);
            }

            _dbContext.SaveChanges();
            return o;
        }

        public OrderDto PayForTheOrder(OrderDto o)
        {
            Order order = _dbContext.Orders.First(x => x.Id == o.Id);
            order.PaymentCompleted = true;
            _dbContext.SaveChanges();

            return _mapper.Map<OrderDto>(order);
        }

        public List<OrderDto> GetPreviousOrders(string email)
        {
            Customer? c = _dbContext.Customers.FirstOrDefault(x => x.Email == email);

            List<Order> previousOrders = _dbContext.Orders.Where(x => x.CustomerId == c.Id).ToList();

            List<Order> finished = new();

            foreach (Order o in previousOrders)
            {
                if (o.AcceptedTime?.AddMinutes(1) < DateTime.Now)
                {
                    finished.Add(o);
                }
            }

            return _mapper.Map<List<OrderDto>>(finished);
        }

        public List<OrderDto> GetNewOrders()
        {
            List<Order> newOrders = _dbContext.Orders.Where(x => x.DelivererId == null).ToList();

            List<OrderDto> ret = _mapper.Map<List<OrderDto>>(newOrders);

            foreach (OrderDto o in ret)
            {
                Customer? c = _dbContext.Customers.Find(o.CustomerId);
                o.CustomerEmail = c.Email;
            }

            return ret;
        }

        public OrderDto? DelivererHasAnActiveOrder(string email)
        {
            Deliverer? d = _dbContext.Deliverers.FirstOrDefault(x => x.Email == email);
            Order? lastOrder = _dbContext.Orders.Where(x => x.DelivererId == d.Id).Where(x => x.AcceptedTime == null).FirstOrDefault();

            lastOrder ??= _dbContext.Orders.Where(x => x.DelivererId == d.Id).OrderByDescending(x => x.AcceptedTime).FirstOrDefault();

            if (lastOrder == null)
            {
                return null;
            }

            if (lastOrder.AcceptedTime?.AddMinutes(1) < DateTime.Now)
            {
                return null;
            }

            _dbContext.Entry(lastOrder).Collection(order => order.OrderItems!).Query().Include(oi => oi.Product).Load();

            OrderDto ret = _mapper.Map<OrderDto>(lastOrder);
            ret.Year = ret.AcceptedTime.Year;
            ret.Month = ret.AcceptedTime.Month;
            ret.Day = ret.AcceptedTime.Day;
            ret.Hours = ret.AcceptedTime.Hour;
            ret.Minutes = ret.AcceptedTime.Minute;
            ret.Seconds = ret.AcceptedTime.Second;
            ret.Miliseconds = ret.AcceptedTime.Millisecond;

            Customer? c = _dbContext.Customers.Find(ret.CustomerId);
            ret.CustomerEmail = c.Email;

            ret.Products = new List<ProductDto>();

            foreach (OrderItem oi in lastOrder.OrderItems)
            {
                ret.Products.Add(_mapper.Map<ProductDto>(oi.Product));
            }

            return ret;
        }

        public OrderDto AcceptOrder(OrderAcceptanceDto a)
        {
            Order? order = _dbContext.Orders.Find(a.OrderId);

            if (order.PaymentCompleted == false)
            {
                throw new PaymentNotCompletedException("Payment is not completed.");
            }

            Deliverer? deliverer = _dbContext.Deliverers.First(x => x.Email == a.DelivererEmail);

            order.DelivererId = deliverer.Id;
            order.AcceptedTime = DateTime.Now;

            _dbContext.SaveChanges();

            return _mapper.Map<OrderDto>(order);
        }

        public List<OrderDto> GetMyOrders(string email)
        {
            Deliverer? d = _dbContext.Deliverers.FirstOrDefault(x => x.Email == email);

            List<Order> myOrders = _dbContext.Orders.Where(x => x.DelivererId == d.Id).ToList();

            List<Order> finished = new();

            foreach (Order o in myOrders)
            {
                if (o.AcceptedTime?.AddMinutes(1) < DateTime.Now)
                {
                    finished.Add(o);
                }
            }

            return _mapper.Map<List<OrderDto>>(finished);
        }

        public List<OrderDto> GetAllOrders()
        {
            List<Order> allOrders = _dbContext.Orders.ToList();

            List<OrderDto> allOrdersDto = _mapper.Map<List<OrderDto>>(allOrders);

            foreach (OrderDto o in allOrdersDto)
            {
                Customer? c = _dbContext.Customers.Find(o.CustomerId);
                o.CustomerEmail = c.Email;
            }

            return allOrdersDto;
        }


    }
}
