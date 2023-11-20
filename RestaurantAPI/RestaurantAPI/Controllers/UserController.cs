using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantAPI.CustomExceptions;
using RestaurantAPI.Dto;
using RestaurantAPI.Interfaces;
using System.Net.Http.Headers;

namespace RestaurantAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegistrationDto u)
        {
            try
            {
                return Ok(_userService.Registration(u));
            }
            catch (InvalidUserDataException iud)
            {
                return BadRequest(iud.Message);
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDto u)
        {
            try
            {
                return Ok(_userService.Login(u));
            }
            catch (UserNotFoundException unf)
            {
                return NotFound(unf.Message);
            }
            catch (InvalidUserDataException iud)
            {
                return BadRequest(iud.Message);
            }
            catch (InvalidUserStatusException ius)
            {
                return Unauthorized(ius.Message);
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpPost("external-login")]
        public IActionResult ExternalLogin([FromBody] UserExternalLoginDto u)
        {
            try
            {
                return Ok(_userService.SocialLogin(u).Result);
            }
            catch (AggregateException ae)
            {
                return BadRequest(ae.InnerException.Message);
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpGet("{email}")]
        [Authorize]
        public IActionResult GetUserByEmail(string email)
        {
            try
            {
                return Ok(_userService.GetUserByEmail(email));
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpPut("update")]
        [Authorize]
        public IActionResult UpdateUser([FromBody] UserRegistrationDto u)
        {
            try
            {
                return Ok(_userService.UpdateUser(u));
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpPut("password")]
        [Authorize]
        public IActionResult ChangePassword([FromBody] UserPasswordChangeDto u)
        {
            try
            {
                return Ok(_userService.ChangePassword(u));
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpGet("deliverers")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public IActionResult GetDeliverers()
        {
            try
            {
                return Ok(_userService.GetDeliverers());
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpPut("verification")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public IActionResult Verify([FromBody] UserApprovementDto u)
        {
            try
            {
                _userService.Verify(u);
                return Ok();
            }
            catch
            {
                return StatusCode(500, "Some unknown error occured.");
            }
        }

        [HttpPost("upload-picture"), DisableRequestSizeLimit]
        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                string dbPath = _userService.Upload(file);
                return Ok(new { dbPath });
            }
            catch (InvalidUserDataException iud)
            {
                return BadRequest(iud.Message);
            }
            catch
            {
                return StatusCode(500, "Some unknown erorr occured.");
            }
        }


    }
}
