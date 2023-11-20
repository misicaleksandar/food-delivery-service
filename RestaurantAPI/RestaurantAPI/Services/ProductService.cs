using AutoMapper;
using RestaurantAPI.Dto;
using RestaurantAPI.Infrastructure;
using RestaurantAPI.Interfaces;
using RestaurantAPI.Models;

namespace RestaurantAPI.Services
{
    public class ProductService : IProductService
    {
        private readonly IMapper _mapper;
        private readonly RestaurantDbContext _dbContext;

        public ProductService(IMapper mapper, RestaurantDbContext dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public ProductDto AddProduct(ProductDto p)
        {
            Product product = _mapper.Map<Product>(p);
            product.Price = Math.Round(product.Price, 2);
            _dbContext.Products.Add(product);
            _dbContext.SaveChanges();

            return _mapper.Map<ProductDto>(p);
        }

        public List<ProductDto> GetProducts()
        {
            return _mapper.Map<List<ProductDto>>(_dbContext.Products.ToList());
        }
    }
}
