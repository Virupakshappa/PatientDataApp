using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("patients", Schema = "patient")]
public class Patient
{
    [Key]
    [Column("id")]
    public int Id { get; set; }  // Primary Key, auto-incremented

    [Column("patientid")]
    public int PatientId { get; set; }  // Foreign key, can have duplicates

    [Column("firstname")]
    public string? FirstName { get; set; }

    [Column("lastname")]
    public string? LastName { get; set; }

    [Column("heartrate")]
    public int HeartRate { get; set; }
}
