using RestaurantAPI.Dto;

namespace RestaurantAPI.Interfaces
{
    public interface IProductService
    {
        ProductDto AddProduct(ProductDto p);
        List<ProductDto> GetProducts();
    }
}
