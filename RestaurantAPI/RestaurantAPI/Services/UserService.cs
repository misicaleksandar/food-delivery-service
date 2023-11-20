using AutoMapper;
using Google.Apis.Auth;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using RestaurantAPI.CustomExceptions;
using RestaurantAPI.Dto;
using RestaurantAPI.Infrastructure;
using RestaurantAPI.Interfaces;
using RestaurantAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;

namespace RestaurantAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly RestaurantDbContext _dbContext;
        private readonly IConfiguration _config;
        private readonly IConfigurationSection _secretKey;
        private readonly IConfigurationSection _googleSettings;

        public UserService(IMapper mapper, RestaurantDbContext dbContext, IConfiguration config)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _config = config;
            _secretKey = config.GetSection("SecretKey");
            _googleSettings = config.GetSection("GoogleAuthSettings");
        }

        public UserRegistrationDto Registration(UserRegistrationDto u)
        {
            if (_dbContext.Customers.FirstOrDefault(x => x.Email == u.Email) != null ||
                _dbContext.Deliverers.FirstOrDefault(x => x.Email == u.Email) != null ||
                _dbContext.Administrators.FirstOrDefault(x => x.Email == u.Email) != null)
            {
                throw new InvalidUserDataException($"Email '{u.Email}' is already in use.");
            }

            if (u.Password != null)
            {
                u.Password = BCrypt.Net.BCrypt.HashPassword(u.Password);
            }
            
            switch(u.Type)
            {
                case "Customer":
                    _dbContext.Customers.Add(_mapper.Map<Customer>(u));
                    break;
                case "Deliverer":
                    _dbContext.Deliverers.Add(_mapper.Map<Deliverer>(u));
                    break;
            }
                
            _dbContext.SaveChanges();
            return u;
        }

        public UserLoggedInDto Login(UserLoginDto u)
        {
            User? user = _dbContext.Customers.FirstOrDefault(x => x.Email == u.Email);
            user ??= _dbContext.Deliverers.FirstOrDefault(x => x.Email == u.Email);
            user ??= _dbContext.Administrators.FirstOrDefault(x => x.Email == u.Email);

            if (user == null)
            {
                throw new UserNotFoundException($"User with email '{u.Email}' does not exist.");
            }
            
            if (user.Type == "Deliverer" && (user as Deliverer).Verified == false)
            {
                throw new InvalidUserStatusException("Your request has not been approved by the administrator.");
            }

            if (!BCrypt.Net.BCrypt.Verify(u.Password, user.Password))
            {
                throw new InvalidUserDataException("Incorrect password.");
            }
            else
            {
                List<Claim> claims = new();

                switch (user.Type)
                {
                    case "Customer":
                        claims.Add(new Claim(ClaimTypes.Role, "CUSTOMER"));
                        break;
                    case "Deliverer":
                        claims.Add(new Claim(ClaimTypes.Role, "DELIVERER"));
                        break;
                    case "Administrator":
                        claims.Add(new Claim(ClaimTypes.Role, "ADMINISTRATOR"));
                        break;
                }

                SymmetricSecurityKey secretKey = new(Encoding.UTF8.GetBytes(_secretKey.Value));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokeOptions = new JwtSecurityToken(
                    issuer: "http://localhost:7024",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(20),
                    signingCredentials: signinCredentials
                );
                string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

                return new UserLoggedInDto { Email = user.Email, Type = user.Type, Token = tokenString };
            }
        }

        public async Task<UserLoggedInDto> SocialLogin(UserExternalLoginDto u)
        {
            var payload = await VerifyGoogleToken(u);

            if (_dbContext.Customers.FirstOrDefault(x => x.Email == payload.Email) == null)
            {
                UserRegistrationDto newUser = new UserRegistrationDto() { Email = payload.Email, FirstName = payload.GivenName, LastName = payload.FamilyName, Type = "Customer" };
                Registration(newUser);
            }

            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.Role, "Customer")
            };

            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokeOptions = new JwtSecurityToken(
                issuer: "http://localhost:7024",
                claims: claims,
                expires: DateTime.Now.AddMinutes(20),
                signingCredentials: signinCredentials
            );
            string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            return new UserLoggedInDto { Email = payload.Email, Type = "SocialCustomer", Token = tokenString };
        }

        public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(UserExternalLoginDto u)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _googleSettings.GetSection("clientId").Value }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(u.IdToken, settings);
                return payload;
            }
            catch (Exception e)
            {
                throw new InvalidExternalAuthenticationException(e.Message);
            }
        }

        public UserDto GetUserByEmail(string email)
        {
            User? user = _dbContext.Customers.FirstOrDefault(x => x.Email == email);
            user ??= _dbContext.Deliverers.FirstOrDefault(x => x.Email == email);
            user ??= _dbContext.Administrators.FirstOrDefault(x => x.Email == email);

            return _mapper.Map<UserDto>(user);
        }

        public UserRegistrationDto UpdateUser(UserRegistrationDto u)
        {
            User? user = _dbContext.Customers.FirstOrDefault(x => x.Email == u.Email);
            user ??= _dbContext.Deliverers.FirstOrDefault(x => x.Email == u.Email);
            user ??= _dbContext.Administrators.FirstOrDefault(x => x.Email == u.Email);

            user.Username = u.Username;
            user.Email = u.Email;
            user.FirstName = u.FirstName;
            user.LastName = u.LastName;
            user.DateOfBirth = u.DateOfBirth;
            user.Address = u.Address;
            user.Image = u.Image;

            _dbContext.SaveChanges();
            return u;
        }

        public UserPasswordChangeDto ChangePassword(UserPasswordChangeDto u)
        {
            User? user = _dbContext.Customers.FirstOrDefault(x => x.Email == u.Email);
            user ??= _dbContext.Deliverers.FirstOrDefault(x => x.Email == u.Email);
            user ??= _dbContext.Administrators.FirstOrDefault(x => x.Email == u.Email);

            user.Password = BCrypt.Net.BCrypt.HashPassword(u.Password);

            _dbContext.SaveChanges();
            return u;
        }

        public List<UserDto> GetDeliverers()
        {
            return _mapper.Map<List<UserDto>>(_dbContext.Deliverers.ToList());
        }

        public void Verify(UserApprovementDto u)
        {
            Deliverer? d = _dbContext.Deliverers.FirstOrDefault(x => x.Email == u.Email);

            if (u.Approve)
            {
                d.Verified = true;
                SendEmail(d.Email, "Restaurant verification approved", "Your request has been approved by the administrator.");
            }
            else
            {
                d.Verified = false;
                SendEmail(d.Email, "Restaurant verification disapproved", "Your request has been disapproved by the administrator.");
            }

            _dbContext.SaveChanges();
        }

        private void SendEmail(string to, string subject, string message)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config.GetSection("EmailUsername").Value));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(MimeKit.Text.TextFormat.Text) { Text = message };

            using var smtp = new SmtpClient();
            smtp.Connect(_config.GetSection("EmailHost").Value, 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(_config.GetSection("EmailUsername").Value, _config.GetSection("EmailPassword").Value);
            smtp.Send(email);
            smtp.Disconnect(true);
        }

        public string Upload(IFormFile file)
        {
            var folderName = Path.Combine("Resources", "Images");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            if (file.Length > 0)
            {
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var fullPath = Path.Combine(pathToSave, fileName);
                var dbPath = Path.Combine(folderName, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                return dbPath;
            }
            else
            {
                throw new InvalidUserDataException("Bad request.");
            }
        }

    }
}
