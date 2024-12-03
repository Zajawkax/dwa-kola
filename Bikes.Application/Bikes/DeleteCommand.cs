using MediatR;
using Bikes.Application.Core;

namespace Bikes.Application.Bikes
{
    public class DeleteCommand : IRequest<Result<Unit>>
    {
        public int BikeId { get; set; }
    }
}
