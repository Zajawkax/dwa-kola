using Bikes.Application.Core;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bikes.Domain;
using Bikes.Infrastructure;
using Microsoft.EntityFrameworkCore;


namespace Bikes.Application.Reservations
{
    public class GetReservationsForBikeQuery : IRequest<Result<List<ReservationDatesDto>>>
    {
        public int BikeId { get; set; }
    }


    public class GetReservationsForBikeHander : IRequestHandler<GetReservationsForBikeQuery, Result<List<ReservationDatesDto>>>
    {
        private readonly DataContext _context;

        public GetReservationsForBikeHander(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<List<ReservationDatesDto>>> Handle(GetReservationsForBikeQuery request, CancellationToken cancellationToken)
        {
            // Filtrowanie rezerwacji po bikeId i pobieranie tylko dat
            var reservations = await _context.Reservations
                .Where(r => r.BikeId == request.BikeId) // Filtrowanie po BikeId
                .Select(r => new ReservationDatesDto
                {
                    StartDate = r.StartDate,
                    EndDate = r.EndDate
                })
                .ToListAsync(cancellationToken);

            // Jeśli brak rezerwacji, uznajemy rower za dostępny
            if (reservations == null || reservations.Count == 0)
            {
                return Result<List<ReservationDatesDto>>.Success(new List<ReservationDatesDto>());
            }

            return Result<List<ReservationDatesDto>>.Success(reservations);
        }


    }
}

