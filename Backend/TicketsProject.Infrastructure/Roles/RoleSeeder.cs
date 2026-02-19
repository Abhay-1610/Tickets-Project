using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Domain.Entities;

namespace TicketsProject.Infrastructure.Roles
{
    public class RoleSeeder
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        public RoleSeeder(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public async Task SeedAsync()
        {
            // Create Admin role
            if (!await _roleManager.RoleExistsAsync(RoleConstants.Admin))
            {
                var user = new ApplicationUser
                {
                    UserName = "Admin",
                    Email = "Admin@gmail.com"
                };

                var result = await _userManager.CreateAsync(user, "Pass@123");

                //  Assign role

                await _roleManager.CreateAsync(new IdentityRole(RoleConstants.Admin));

                await _userManager.AddToRoleAsync(user, RoleConstants.Admin);

            }

            // Create Agent role
            if (!await _roleManager.RoleExistsAsync(RoleConstants.Agent))
            {
                await _roleManager.CreateAsync(new IdentityRole(RoleConstants.Agent));
            }

            // Create Customer role
            if (!await _roleManager.RoleExistsAsync(RoleConstants.Customer))
            {
                await _roleManager.CreateAsync(new IdentityRole(RoleConstants.Customer));
            }
        }
    }
}
