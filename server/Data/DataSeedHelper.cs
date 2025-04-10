using server.Data;
using server.Models;
using server.Service;

public class DataSeedHelper
{
    private readonly AppDbContext dbContext;

    public DataSeedHelper(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public void InsertData()
    {
        if (!dbContext.Users.Any())
        {
            // Hash the password before saving

            _ = dbContext.Users.Add(new User()
            {
                Email = "admin@test.com",
                Password = PasswordHelper.HashPassword("123123"),
                Role = "Admin"
            });

            dbContext.Users.Add(new User()
            {
                Email = "emp1@test.com",
                Password = PasswordHelper.HashPassword("123123"),
                Role = "Employee"
            });

            dbContext.SaveChanges();
        }
    }
}
