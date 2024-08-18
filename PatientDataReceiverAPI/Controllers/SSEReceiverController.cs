using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;


[Route("api/[controller]")]
[ApiController]
public class SSEReceiverController : ControllerBase
{
    private readonly PatientDataContext _context;

    public SSEReceiverController(PatientDataContext context)
    {
        _context = context;
    }

    [HttpGet("start")]
    public async Task<IActionResult> StartReceivingData()
    {
        using (var client = new HttpClient())
        {
            client.BaseAddress = new Uri("http://localhost:5216"); // URL of the first application
            client.Timeout = TimeSpan.FromMinutes(10);

            using (var response = await client.GetAsync("/api/PatientData/stream", HttpCompletionOption.ResponseHeadersRead))
            {
                response.EnsureSuccessStatusCode();

                var stream = await response.Content.ReadAsStreamAsync();
                using (var reader = new StreamReader(stream))
                {
                    while (!reader.EndOfStream)
                    {
                        var line = await reader.ReadLineAsync();
                        if (!string.IsNullOrWhiteSpace(line) && line.StartsWith("data: "))
                        {
                            var json = line.Substring(6);
                            var patients = JsonSerializer.Deserialize<List<Patient>>(json);

                            foreach (var patient in patients)
                            {
                                _context.Patients.Add(patient);
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                }
            }
        }
        return Ok("Data reception started");
    }
}
