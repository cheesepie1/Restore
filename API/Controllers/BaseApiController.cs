using Microsoft.AspNetCore.Mvc;

// As the project is simple, I keep all controllers under one namespace for easier management.
namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
    }
}
