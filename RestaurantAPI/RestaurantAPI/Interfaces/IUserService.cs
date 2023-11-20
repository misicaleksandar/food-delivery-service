using RestaurantAPI.Dto;

namespace RestaurantAPI.Interfaces
{
    public interface IUserService
    {
        UserRegistrationDto Registration(UserRegistrationDto u);
        UserLoggedInDto Login(UserLoginDto u);
        Task<UserLoggedInDto> SocialLogin(UserExternalLoginDto u);
        UserDto GetUserByEmail(string email);
        UserRegistrationDto UpdateUser(UserRegistrationDto u);
        UserPasswordChangeDto ChangePassword(UserPasswordChangeDto u);
        List<UserDto> GetDeliverers();
        void Verify(UserApprovementDto u);
        string Upload(IFormFile file);
    }
}
