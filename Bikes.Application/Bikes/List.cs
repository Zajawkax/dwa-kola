using MediatR;
using Bikes.Application.Core;
using Bikes.Domain;
using Bikes.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Bikes.Application.Bikes
{
    public class ListQuery : IRequest<Result<List<Bike>>> { }

    public class ListHandler : IRequestHandler<ListQuery, Result<List<Bike>>>
    {
        private readonly DataContext _context;

        public ListHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<List<Bike>>> Handle(ListQuery request, CancellationToken cancellationToken)
        {
            var bikes = await _context.Bikes.ToListAsync(cancellationToken);
            return Result<List<Bike>>.Success(bikes);
        }
    }
}
