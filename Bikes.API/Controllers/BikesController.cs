using System.Threading.Tasks;
using Bikes.Application.Bikes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bikes.API.Controllers
{
    [Authorize] // Domyślnie autoryzacja wymagana dla wszystkich metod
    [ApiController]
    [Route("api/[controller]")]
    public class BikesController : BaseApiController
    {
        [HttpGet]
        [AllowAnonymous] // Pozwala pobrać listę rowerów bez autoryzacji
        public async Task<IActionResult> GetBikes()
        {
            return HandleResult(await Mediator.Send(new ListQuery()));
        }

        [HttpGet("{id}")]
        [AllowAnonymous] // Pozwala pobrać szczegóły roweru bez autoryzacji
        public async Task<IActionResult> GetBike(int id)
        {
            return HandleResult(await Mediator.Send(new DetailsQuery { BikeId = id }));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] // Tylko administrator może dodawać rowery
        public async Task<IActionResult> CreateBike([FromBody] CreateCommand command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Tylko administrator może edytować rowery
        public async Task<IActionResult> UpdateBike(int id, [FromBody] EditCommand command)
        {
            command.BikeId = id;
            return HandleResult(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Tylko administrator może usuwać rowery
        public async Task<IActionResult> DeleteBike(int id)
        {
            return HandleResult(await Mediator.Send(new DeleteCommand { BikeId = id }));
        }
    }
}
