using System.Threading.Tasks;
using Bikes.Application.Bikes;
using Microsoft.AspNetCore.Mvc;

namespace Bikes.API.Controllers
{
    public class BikesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetBikes()
        {
            return HandleResult(await Mediator.Send(new ListQuery()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBike(int id)
        {
            return HandleResult(await Mediator.Send(new DetailsQuery { BikeId = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateBike([FromBody] CreateCommand command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBike(int id, [FromBody] EditCommand command)
        {
            command.BikeId = id;
            return HandleResult(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBike(int id)
        {
            return HandleResult(await Mediator.Send(new DeleteCommand { BikeId = id }));
        }
    }
}
