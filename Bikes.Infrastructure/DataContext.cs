using Bikes.Domain;
using Bikes.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Bikes.Infrastructure
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options) { }
        public DbSet<Bike> Bikes { get; set; }
    }
}
