using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestaurantAPI.CustomExceptions;
using RestaurantAPI.Dto;
using RestaurantAPI.Interfaces;

namespace RestaurantAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("active-order/{email}")]
        [Authorize(Roles = "CUSTOMER")]
        public IActionResult CustomerHasAnActiveOrder(string email)
        {
            try
            {
                return Ok(_orderService.CustomerHasAnActiveOrder(email));
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpPost("create")]
        [Authorize(Roles = "CUSTOMER")]
        public IActionResult CreateOrder([FromBody] OrderCreatedDto order)
        {
            try
            {
                return Ok(_orderService.CreateOrder(order));
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpPut("pay")]
        [Authorize(Roles = "CUSTOMER")]
        public IActionResult PayForTheOrder([FromBody] OrderDto order)
        {
            try
            {
                return Ok(_orderService.PayForTheOrder(order));
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpGet("previous-orders/{email}")]
        [Authorize(Roles = "CUSTOMER")]
        public IActionResult GetPreviousOrders(string email)
        {
            try
            {
                return Ok(_orderService.GetPreviousOrders(email));
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpGet("new-orders")]
        [Authorize(Roles = "DELIVERER")]
        public IActionResult GetNewOrders()
        {
            try
            {
                return Ok(_orderService.GetNewOrders());
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpGet("has-active-order/{email}")]
        [Authorize(Roles = "DELIVERER")]
        public IActionResult DelivererHasAnActiveOrder(string email)
        {
            try
            {
                return Ok(_orderService.DelivererHasAnActiveOrder(email));
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpPut("accept")]
        [Authorize(Roles = "DELIVERER")]
        public IActionResult AcceptOrder([FromBody]OrderAcceptanceDto a)
        {
            try
            {
                return Ok(_orderService.AcceptOrder(a));
            }
            catch (PaymentNotCompletedException pnc)
            {
                return BadRequest(pnc.Message);
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpGet("my-orders/{email}")]
        [Authorize(Roles = "DELIVERER")]
        public IActionResult GetMyOrders(string email)
        {
            try
            {
                return Ok(_orderService.GetMyOrders(email));
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpGet("all")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public IActionResult GetAllOrders()
        {
            try
            {
                return Ok(_orderService.GetAllOrders());
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }


    }
}
