using System.Linq;
using server.Data;
using server.Models;

namespace Server.Data
{
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
                dbContext.Users.Add(new User()
                {
                    Email = "admin@test.com",
                    Password = "123123", 
                    Role = "Admin"
                });

                dbContext.Users.Add(new User()
                {
                    Email = "emp1@test.com",
                    Password = "123123",
                    Role = "Employee"
                });

                dbContext.SaveChanges();
            }
        }
    }
}
