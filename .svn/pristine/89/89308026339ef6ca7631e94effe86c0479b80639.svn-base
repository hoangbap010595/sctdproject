using Kendo.Mvc.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.Mvc.Extensions;
using System.Data;
using Microsoft.ApplicationBlocks.Data;
using Microsoft.Ajax.Utilities;
using System.Configuration;
using System.Data.SqlClient;
using sctd.somee.com.Security;
using sctd.somee.com.Models;

namespace sctd.somee.com.Controllers
{

    public class HomeController : Controller
    {
        string strCon = ConfigurationManager.ConnectionStrings[ConnectionDatabase.strSqlConetion].ConnectionString;
        //string strCon = ConfigurationManager.ConnectionStrings["StorageEntitiesUse"].ConnectionString;
        private List<Dictionary<string, object>> GetTableRows(DataTable dt)
        {
            List<Dictionary<string, object>> listData = new List<Dictionary<string, object>>();
            Dictionary<string, object> rowData;

            foreach (DataRow dr in dt.Rows)
            {
                rowData = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    rowData.Add(col.ColumnName, dr[col]);
                }
                listData.Add(rowData);
            }

            return listData;
        }

        [CustomAuthorize(Roles = "superadmin,admin")]
        public ActionResult Index()
        {
            return View();
        }

        [CustomAuthorize(Roles = "superadmin,admin")]
        public ActionResult wRequest()
        {
            return View();
        }

        //Url: /Home/GetStock
        [CustomAuthorize(Roles = "superadmin,admin")]
        public JsonResult GetStock()
        {
            List<Dictionary<string, object>> lsStock = new List<Dictionary<string, object>>();

            DataSet ds = SqlHelper.ExecuteDataset(strCon, System.Data.CommandType.StoredProcedure, "spGetStock");
            if (ds.Tables.Count > 0)
            {
                lsStock = GetTableRows(ds.Tables[0]);
            }

            var myJson = Json(lsStock, JsonRequestBehavior.AllowGet);
            myJson.MaxJsonLength = int.MaxValue;
            return myJson;
        }

        //Url: /Home/GetRequest
        [CustomAuthorize(Roles = "superadmin,admin")]
        public JsonResult GetRequest()
        {
            List<Dictionary<string, object>> lsStock = new List<Dictionary<string, object>>();

            DataSet ds = SqlHelper.ExecuteDataset(strCon, System.Data.CommandType.StoredProcedure, "spGetRequest");
            if (ds.Tables.Count > 0)
            {
                lsStock = GetTableRows(ds.Tables[0]);
            }

            var myJson = Json(lsStock, JsonRequestBehavior.AllowGet);
            myJson.MaxJsonLength = int.MaxValue;
            return myJson;
        }

        //Url: /Home/InsertRequest
        [CustomAuthorize(Roles = "superadmin,admin")]
        public JsonResult InsertRequest(string barcode, string carton, string location, int qty, string notes)
        {
            SqlConnection con = new SqlConnection(strCon);
            SqlParameter[] dFilter = new SqlParameter[]
            {
                new SqlParameter("@barcode", barcode),
                new SqlParameter("@carton", carton),
                new SqlParameter("@location", location),
                new SqlParameter("@qty", qty),
                new SqlParameter("@date_request", DateTime.Now.ToString("MM-dd-yyyy HH:mm:ss")),
                new SqlParameter("@notes", notes)
            };
            con.Open();
            SqlCommand cmd = new SqlCommand("spInsertRequest");
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Connection = con;
            cmd.Parameters.AddRange(dFilter);

            int rs = cmd.ExecuteNonQuery();
            con.Close();
            //int rs = SqlHelper.ExecuteNonQuery(strCon, System.Data.CommandType.StoredProcedure, "spInsertRequest", dFilter);

            var myJson = Json(rs, JsonRequestBehavior.AllowGet);
            myJson.MaxJsonLength = int.MaxValue;
            return myJson;
        }
    }
}