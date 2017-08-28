using sctd.somee.com.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace sctd.somee.com.Security
{
    public class CustomPrincipal : IPrincipal
    {
        private Account _account;
        public IIdentity Identity { get; set; }

        public CustomPrincipal(Account account)
        {
            this._account = account;
            this.Identity = new GenericIdentity(account.Username);
        }

        public bool IsInRole(string role)
        {
            var roles = role.Split(new char[] { ',' });
            return roles.Any(r => this._account.Role.Contains(r));
        }
    }
}