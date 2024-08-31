using Microsoft.EntityFrameworkCore;
using chatsystem.Models;

namespace chatsystem.Database
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Register> Registers { get; set; }
        public DbSet<MessageDto> Messages { get; set; }
    }
}
