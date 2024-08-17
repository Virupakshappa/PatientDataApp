using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class PatientDataController : ControllerBase
{
    private static readonly List<Patient> _patients = new List<Patient>
    {
        new Patient { PatientId = 1, FirstName = "John", LastName = "Doe", AdmittedDate = DateTime.Now, HeartRate = 72, DataStoredDateTime = DateTime.Now },
        new Patient { PatientId = 2, FirstName = "Jane", LastName = "Doe", AdmittedDate = DateTime.Now.AddHours(-1), HeartRate = 80, DataStoredDateTime = DateTime.Now }
    };

    [HttpGet("stream")]
    public async Task StreamPatientData()
    {
        Response.ContentType = "text/event-stream";

        while (true)
        {
            var json = JsonSerializer.Serialize(_patients);

            await Response.WriteAsync($"data: {json}\n\n");
            await Response.Body.FlushAsync();

            // Simulate real-time data change
            _patients[0].HeartRate = new Random().Next(60, 100);
            _patients[0].DataStoredDateTime = DateTime.Now;

            await Task.Delay(5000); // Send data every 5 seconds
        }
    }
}
