using RestaurantAPI.Dto;

namespace RestaurantAPI.Interfaces
{
    public interface IOrderService
    {
        OrderDto? CustomerHasAnActiveOrder(string customer);
        OrderCreatedDto CreateOrder(OrderCreatedDto o);
        OrderDto PayForTheOrder(OrderDto o);
        List<OrderDto> GetPreviousOrders(string email);
        List<OrderDto> GetNewOrders();
        OrderDto? DelivererHasAnActiveOrder(string email);
        OrderDto AcceptOrder(OrderAcceptanceDto a);
        List<OrderDto> GetMyOrders(string email);
        List<OrderDto> GetAllOrders();
    }
}
