using sctd.somee.com.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace sctd.somee.com.Controllers
{
    public class SysAdminController : Controller
    {
        // GET: SysAdmin
        [CustomAuthorize(Roles = "superadmin")]
        public ActionResult Index()
        {
            return View();
        }
    }
}