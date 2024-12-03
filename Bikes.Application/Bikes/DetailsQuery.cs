using MediatR;
using Bikes.Application.Core;
using Bikes.Domain;

namespace Bikes.Application.Bikes
{
    public class DetailsQuery : IRequest<Result<Bike>>
    {
        public int BikeId { get; set; }
    }
}
