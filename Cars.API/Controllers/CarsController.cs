using System;
using System.Threading.Tasks;
using Cars.Application.Cars;
using Microsoft.AspNetCore.Mvc;

namespace Cars.API.Controllers
{
    public class CarsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetCars()
        {
            return HandleResult(await Mediator.Send(new ListQuery()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCar(Guid id)
        {
            return HandleResult(await Mediator.Send(new DetailsQuery { Id = id }));
        }

        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> CreateCar([FromBody] CreateCommand command)
        {
            return HandleResult(await Mediator.Send(command));
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(Guid id, [FromBody] EditCommand command)
        {
            command.Id = id;
            return HandleResult(await Mediator.Send(command));
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(Guid id)
        {
            return HandleResult(await Mediator.Send(new DeleteCommand { Id = id }));
        }
    }
}