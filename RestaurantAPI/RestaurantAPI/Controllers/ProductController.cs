using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestaurantAPI.Dto;
using RestaurantAPI.Interfaces;

namespace RestaurantAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        [Authorize(Roles = "ADMINISTRATOR")]
        public IActionResult AddProduct([FromBody] ProductDto product)
        {
            try
            {
                return Ok(_productService.AddProduct(product));
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpGet("all")]
        [Authorize(Roles = "CUSTOMER")]
        public IActionResult GetProducts()
        {
            try
            {
                return Ok(_productService.GetProducts());
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }
    }
}
