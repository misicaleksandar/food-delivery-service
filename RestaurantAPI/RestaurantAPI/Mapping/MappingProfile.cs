using AutoMapper;
using RestaurantAPI.Dto;
using RestaurantAPI.Models;

namespace RestaurantAPI.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Customer, UserRegistrationDto>().ReverseMap();
            CreateMap<Deliverer, UserRegistrationDto>().ReverseMap();
            CreateMap<Customer, UserDto>().ReverseMap();
            CreateMap<Deliverer, UserDto>().ReverseMap();
            CreateMap<Administrator, UserDto>().ReverseMap();
            CreateMap<Order, OrderDto>().ReverseMap();
            CreateMap<Product, ProductDto>().ReverseMap();
        }
    }
}
