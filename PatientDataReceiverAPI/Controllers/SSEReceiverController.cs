using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

[Route("api/[controller]")]
[ApiController]
public class SSEReceiverController : ControllerBase
{
    private readonly PatientDataContext _context;
    private static bool _isStoringData = false; // Static flag to track storing state

    public SSEReceiverController(PatientDataContext context)
    {
        _context = context;
    }

    [HttpGet("start")]
    public async Task<IActionResult> StartReceivingData([FromHeader] string Authorization)
    {
        if (_isStoringData)
        {
            return BadRequest("Data storage is already in progress.");
        }

        // Start storing data
        _isStoringData = true;

        if (string.IsNullOrEmpty(Authorization) || !Authorization.StartsWith("Bearer "))
        {
            return Unauthorized("Authorization header is missing or invalid.");
        }

        var token = Authorization.Split(" ").Last();
        if (string.IsNullOrEmpty(token) || !ValidateToken(token))
        {
            return Unauthorized("Token validation failed.");
        }

        using (var client = new HttpClient())
        {
            client.BaseAddress = new Uri("http://localhost:5216");
            client.Timeout = TimeSpan.FromMinutes(10);

            using (var response = await client.GetAsync($"/api/PatientData/stream?token={token}", HttpCompletionOption.ResponseHeadersRead))
            {
                response.EnsureSuccessStatusCode();

                var stream = await response.Content.ReadAsStreamAsync();
                using (var reader = new StreamReader(stream))
                {
                    while (_isStoringData && !reader.EndOfStream)
                    {
                        var line = await reader.ReadLineAsync();
                        if (!string.IsNullOrWhiteSpace(line) && line.StartsWith("data: "))
                        {
                            var json = line.Substring(6);
                            var patients = JsonSerializer.Deserialize<List<Patient>>(json);

                            foreach (var patient in patients)
                            {
                                var existingPatient = await _context.Patients
                                    .FirstOrDefaultAsync(p => p.PatientId == patient.PatientId);

                                if (existingPatient != null)
                                {
                                    existingPatient.HeartRate = patient.HeartRate;
                                    existingPatient.FirstName = patient.FirstName;
                                    existingPatient.LastName = patient.LastName;
                                }
                                else
                                {
                                    _context.Patients.Add(patient);
                                }
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                }
            }
        }
        return Ok("Data reception started");
    }

    [HttpGet("stop")]
    public IActionResult StopReceivingData([FromHeader] string Authorization)
    {
        if (string.IsNullOrEmpty(Authorization) || !Authorization.StartsWith("Bearer "))
        {
            return Unauthorized("Authorization header is missing or invalid.");
        }

        var token = Authorization.Split(" ").Last();
        if (string.IsNullOrEmpty(token) || !ValidateToken(token))
        {
            return Unauthorized("Token validation failed.");
        }

        if (!_isStoringData)
        {
            return BadRequest("No data storage in progress.");
        }

        _isStoringData = false;
        return Ok("Data reception stopped");
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
        catch
        {
            return false;
        }
    }
}
