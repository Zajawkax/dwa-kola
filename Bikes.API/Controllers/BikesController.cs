using System;
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
        public async Task<IActionResult> GetBike(Guid id)
        {
            return HandleResult(await Mediator.Send(new DetailsQuery { Id = id }));
        }

        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> CreateBike([FromBody] CreateCommand command)
        {
            return HandleResult(await Mediator.Send(command));
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBike(Guid id, [FromBody] EditCommand command)
        {
            command.Id = id;
            return HandleResult(await Mediator.Send(command));
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBike(Guid id)
        {
            return HandleResult(await Mediator.Send(new DeleteCommand { Id = id }));
        }
    }
}