using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class PatientDataController : ControllerBase
{
    private static readonly List<Patient> _patients = new List<Patient>
    {
        new Patient { PatientId = 1, FirstName = "John", LastName = "Doe", HeartRate = 72 },
        new Patient { PatientId = 2, FirstName = "Jane", LastName = "Doe", HeartRate = 80 }
    };

    [HttpGet("stream")]
    public async Task<IActionResult> Stream([FromQuery] string token)
    {
        if (string.IsNullOrEmpty(token) || !ValidateToken(token))
        {
            return Unauthorized();
        }

        Response.ContentType = "text/event-stream";

        try
        {
            while (!HttpContext.RequestAborted.IsCancellationRequested)
            {
                var json = JsonSerializer.Serialize(_patients);

                await Response.WriteAsync($"data: {json}\n\n");
                await Response.Body.FlushAsync();

                // Simulate real-time data change
                _patients[0].HeartRate = new Random().Next(50, 110);
                _patients[1].HeartRate = new Random().Next(50, 110);

                await Task.Delay(5000); // Send data every 5 seconds
            }
        }
        catch (Exception ex)
        {
            // Handle exception (optional logging)
            Console.WriteLine($"An error occurred: {ex.Message}");
        }

        return new EmptyResult(); // Return an empty result when the connection is closed
    }

    private bool ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("Your32ByteSuperSecretKey1234567890");

        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return true;
        }
        catch (Exception ex)
        {
            // Optionally log the exception
            Console.WriteLine($"Token validation failed: {ex.Message}");
            return false;
        }
    }
}
