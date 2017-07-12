using System.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using sctd.somee.com.Models;

namespace sctd.somee.com.Security
{
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            if(string.IsNullOrEmpty(SessionPersister.Username))
            {
                filterContext.Result = new RedirectToRouteResult(new System.Web.Routing.RouteValueDictionary(
                    new { controller = "Login", action = "Index" }));
            }
            else
            {
                AccountModel am = new AccountModel();
                CustomPrincipal mp = new CustomPrincipal(am.find(SessionPersister.Username.ToUpper()));
                if (!mp.IsInRole(Roles))
                {
                    filterContext.Result = new RedirectToRouteResult(new System.Web.Routing.RouteValueDictionary(
                        new { controller = "Error", acction = "Index" }));
                }
            }
        }
    }
}