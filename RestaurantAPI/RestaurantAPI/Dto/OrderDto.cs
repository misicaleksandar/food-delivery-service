using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Models;

namespace RestaurantAPI.Dto
{
    public class OrderDto
    {
        public long Id { get; set; }
        public string Address { get; set; }
        public double Lat { get; set; }
        public double Lon { get; set; }
        public string Comment { get; set; }
        public double TotalPrice { get; set; }
        public string PaymentMethod { get; set; }
        public bool PaymentCompleted { get; set; }
        public List<ProductDto> Products { get; set; }
        public DateTime AcceptedTime { get; set; }
        public double Year { get; set; }
        public double Month { get; set; }
        public double Day { get; set; }
        public double Hours { get; set; }
        public double Minutes { get; set; }
        public double Seconds { get; set; }
        public double Miliseconds { get; set; }
        public long DelivererId { get; set; }
        public long CustomerId { get; set; }
        public string CustomerEmail { get; set; }
    }
}