using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Cars.Application.Core;
using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars
{
    public class ListQuery : IRequest<Result<List<Car>>> { }

    public class ListHandler : IRequestHandler<ListQuery, Result<List<Car>>>
    {
        private readonly DataContext _context;

        public ListHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<List<Car>>> Handle(ListQuery request, CancellationToken cancellationToken)
        {
            var cars = await _context.Cars.ToListAsync(cancellationToken);

            return Result<List<Car>>.Success(cars);
        }
    }
}