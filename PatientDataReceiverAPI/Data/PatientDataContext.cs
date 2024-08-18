using Microsoft.EntityFrameworkCore;

public class PatientDataContext : DbContext
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Patient>()
            .ToTable("patients", schema: "patient");
    }
    public PatientDataContext(DbContextOptions<PatientDataContext> options) : base(options) { }

    public DbSet<Patient> Patients { get; set; }
}






