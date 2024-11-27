using Cars.Domain;
using Cars.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options) { }
        public DbSet<Car> Cars { get; set; }
    }
}
