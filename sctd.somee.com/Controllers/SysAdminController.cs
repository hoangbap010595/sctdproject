using Microsoft.ApplicationBlocks.Data;
using sctd.somee.com.Models;
using sctd.somee.com.Security;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace sctd.somee.com.Controllers
{
    [CustomAuthorize(Roles = "superadmin")]
    public class SysAdminController : Controller
    {
        string strCon = ConfigurationManager.ConnectionStrings[ConnectionDatabase.strSqlConetion].ConnectionString;
        // GET: SysAdmin
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult MasterData()
        {
            return View();
        }
        public ActionResult InsertData()
        {
            return View();
        }

        [HttpPost]
        public JsonResult InsertData(IEnumerable<Product> products)
        {
            Dictionary<string, object> content = new Dictionary<string, object>();
            if (products == null)
                content.Add("error", "Không có dữ liệu");
            else
            {
                int total = 0;
                foreach (Product p in products)
                {
                    SqlParameter[] para = new SqlParameter[] {
                        new SqlParameter("@barcode",p.Barcode)
                        ,new SqlParameter("@model",p.Model)
                        ,new SqlParameter("@size",p.Size)
                        ,new SqlParameter("@color",p.Color)
                        ,new SqlParameter("@price", p.Price)
                        ,new SqlParameter("@brand",p.Brand)
                        ,new SqlParameter("@division_code",p.Article)
                        ,new SqlParameter("@descriptionVietnamese",p.Description)
                    };
                    int i = SqlHelper.ExecuteNonQuery(strCon, CommandType.StoredProcedure, "spInsertProduct", para);
                    if(i!=-1)
                        total++;
                }
                content.Add("success", "Insert thành công: " + total + "/" + products.Count());
            }
            var myJson = Json(content, JsonRequestBehavior.AllowGet);
            myJson.MaxJsonLength = int.MaxValue;
            return myJson;
        }
        public JsonResult GetProduct()
        {
            List<Dictionary<string, object>> lsStock = new List<Dictionary<string, object>>();

            DataSet ds = SqlHelper.ExecuteDataset(strCon, CommandType.StoredProcedure, "spGetProduct");
            if (ds.Tables.Count > 0)
            {
                lsStock = GetTableRows(ds.Tables[0]);
            }

            var myJson = Json(lsStock, JsonRequestBehavior.AllowGet);
            myJson.MaxJsonLength = int.MaxValue;
            return myJson;
        }


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
    }
}