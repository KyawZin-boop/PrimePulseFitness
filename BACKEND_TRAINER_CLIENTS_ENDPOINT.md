# Backend Implementation Guide: Trainer Clients Endpoint

## ASP.NET Core Implementation

### 1. Create TrainerController.cs

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Trainer")]
    public class TrainerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TrainerController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all clients assigned to the authenticated trainer
        /// </summary>
        /// <returns>List of clients with basic information</returns>
        [HttpGet("clients")]
        public async Task<ActionResult<IEnumerable<ClientDto>>> GetMyClients()
        {
            // Get trainer ID from JWT token
            var trainerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(trainerIdClaim))
            {
                return Unauthorized(new { message = "Trainer ID not found in token" });
            }

            try
            {
                // Option 1: Get clients who have active bookings with this trainer
                var clientsFromBookings = await _context.Bookings
                    .Where(b => b.TrainerId == trainerIdClaim && b.Status == "Confirmed")
                    .Select(b => b.User)
                    .Distinct()
                    .Select(u => new ClientDto
                    {
                        UserID = u.Id,
                        Name = u.Name,
                        Email = u.Email,
                        Role = u.Role,
                        ProfilePicture = u.ProfilePicture,
                        PhoneNumber = u.PhoneNumber
                    })
                    .ToListAsync();

                // Option 2: Also include clients who have messaged this trainer
                var clientsFromMessages = await _context.ChatMessages
                    .Where(m => m.ReceiverId == trainerIdClaim)
                    .Select(m => m.SenderId)
                    .Distinct()
                    .Join(
                        _context.Users,
                        senderId => senderId,
                        user => user.Id,
                        (senderId, user) => new ClientDto
                        {
                            UserID = user.Id,
                            Name = user.Name,
                            Email = user.Email,
                            Role = user.Role,
                            ProfilePicture = user.ProfilePicture,
                            PhoneNumber = user.PhoneNumber
                        }
                    )
                    .ToListAsync();

                // Combine and remove duplicates
                var allClients = clientsFromBookings
                    .Union(clientsFromMessages)
                    .GroupBy(c => c.UserID)
                    .Select(g => g.First())
                    .OrderBy(c => c.Name)
                    .ToList();

                return Ok(new { data = allClients });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new 
                { 
                    message = "Failed to retrieve clients",
                    error = ex.Message 
                });
            }
        }
    }

    // DTO for client response
    public class ClientDto
    {
        public string UserID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string? ProfilePicture { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
```

### 2. Update API Index (if using API service pattern)

In your `src/api/trainer/index.ts`:

```typescript
import { apiClient } from '@/configs/axios';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface Client {
  userID: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  phoneNumber?: string;
}

export interface ClientsResponse {
  data: Client[];
}

// Get trainer's clients
export const getMyClients = () => {
  return apiClient.get<ClientsResponse>('/trainer/clients');
};

// React Query hook
export const useGetMyClients = () => {
  return useQuery({
    queryKey: ['trainer', 'clients'],
    queryFn: async () => {
      const response = await getMyClients();
      return response.data.data;
    },
  });
};

export const trainerApi = {
  getMyClients: {
    useQuery: useGetMyClients,
  },
};
```

### 3. Update TrainerMessagesView.tsx

Replace the TODO section (lines 124-134) with:

```typescript
// Load clients on mount
useEffect(() => {
  const fetchClients = async () => {
    try {
      setIsLoadingClients(true);
      const response = await api.trainer.getMyClients();
      setClients(response);
    } catch (error) {
      console.error("Failed to load clients:", error);
      setIsClientsError(true);
      toast.error("Failed to load clients");
    } finally {
      setIsLoadingClients(false);
    }
  };

  fetchClients();
}, []);
```

### 4. Database Schema Requirements

Ensure your database has these tables/relationships:

**Users Table:**
```sql
CREATE TABLE Users (
    Id NVARCHAR(450) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(256) NOT NULL,
    Role NVARCHAR(50) NOT NULL,
    ProfilePicture NVARCHAR(500),
    PhoneNumber NVARCHAR(20)
);
```

**Bookings Table:**
```sql
CREATE TABLE Bookings (
    Id INT PRIMARY KEY IDENTITY,
    UserId NVARCHAR(450) NOT NULL,
    TrainerId NVARCHAR(450) NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (TrainerId) REFERENCES Users(Id)
);
```

**ChatMessages Table:**
```sql
CREATE TABLE ChatMessages (
    Id INT PRIMARY KEY IDENTITY,
    SenderId NVARCHAR(450) NOT NULL,
    ReceiverId NVARCHAR(450) NOT NULL,
    Content NVARCHAR(MAX),
    Timestamp DATETIME2 NOT NULL,
    FOREIGN KEY (SenderId) REFERENCES Users(Id),
    FOREIGN KEY (ReceiverId) REFERENCES Users(Id)
);
```

### 5. Testing the Endpoint

**Using Swagger:**
1. Navigate to `https://localhost:7003/swagger`
2. Authorize with trainer JWT token
3. Find `GET /api/trainer/clients`
4. Execute request
5. Verify response contains client list

**Using Postman:**
```http
GET https://localhost:7003/api/trainer/clients
Authorization: Bearer YOUR_TRAINER_JWT_TOKEN
```

**Expected Response:**
```json
{
  "data": [
    {
      "userID": "user-guid-1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "User",
      "profilePicture": "https://...",
      "phoneNumber": "+1234567890"
    },
    {
      "userID": "user-guid-2",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "User",
      "profilePicture": null,
      "phoneNumber": "+0987654321"
    }
  ]
}
```

### 6. Authorization & Security

**JWT Token Setup:**
```csharp
// In Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization();
```

**Role-Based Access:**
- Only users with `Role = "Trainer"` can access this endpoint
- Trainers only see their own clients, not other trainers' clients

### 7. Alternative Implementations

**If you're using Entity Framework relations:**

```csharp
[HttpGet("clients")]
public async Task<ActionResult<IEnumerable<ClientDto>>> GetMyClients()
{
    var trainerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    if (string.IsNullOrEmpty(trainerIdClaim))
    {
        return Unauthorized();
    }

    // If you have a TrainerClient junction table
    var clients = await _context.TrainerClients
        .Where(tc => tc.TrainerId == trainerIdClaim)
        .Include(tc => tc.Client)
        .Select(tc => new ClientDto
        {
            UserID = tc.Client.Id,
            Name = tc.Client.Name,
            Email = tc.Client.Email,
            Role = tc.Client.Role,
            ProfilePicture = tc.Client.ProfilePicture,
            PhoneNumber = tc.Client.PhoneNumber
        })
        .ToListAsync();

    return Ok(new { data = clients });
}
```

### 8. Caching (Optional but Recommended)

```csharp
using Microsoft.Extensions.Caching.Memory;

[HttpGet("clients")]
public async Task<ActionResult<IEnumerable<ClientDto>>> GetMyClients()
{
    var trainerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    if (string.IsNullOrEmpty(trainerIdClaim))
    {
        return Unauthorized();
    }

    var cacheKey = $"trainer_{trainerIdClaim}_clients";
    
    if (!_cache.TryGetValue(cacheKey, out List<ClientDto> clients))
    {
        clients = await GetClientsFromDatabase(trainerIdClaim);
        
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(15));
        
        _cache.Set(cacheKey, clients, cacheOptions);
    }

    return Ok(new { data = clients });
}
```

### 9. Logging (Recommended)

```csharp
private readonly ILogger<TrainerController> _logger;

[HttpGet("clients")]
public async Task<ActionResult<IEnumerable<ClientDto>>> GetMyClients()
{
    var trainerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    _logger.LogInformation("Fetching clients for trainer {TrainerId}", trainerIdClaim);
    
    try
    {
        // ... implementation
        
        _logger.LogInformation("Successfully retrieved {Count} clients for trainer {TrainerId}", 
            clients.Count, trainerIdClaim);
        
        return Ok(new { data = clients });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error fetching clients for trainer {TrainerId}", trainerIdClaim);
        return StatusCode(500, new { message = "Failed to retrieve clients" });
    }
}
```

## Summary

1. ✅ Create `TrainerController.cs` with `GetMyClients()` endpoint
2. ✅ Add authorization `[Authorize(Roles = "Trainer")]`
3. ✅ Query database for clients (bookings + messages)
4. ✅ Return `ClientDto` list
5. ✅ Update frontend to call new endpoint
6. ✅ Test with Swagger/Postman
7. ✅ Add caching and logging (optional)

Once this endpoint is implemented, the TrainerMessagesView will automatically load and display the trainer's clients!
