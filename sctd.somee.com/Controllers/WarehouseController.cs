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
    public class WarehouseController : Controller
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
        // GET: Warehouse
        public ActionResult Product()
        {
            return View();
        }
        public ActionResult InsertData()
        {
            return View();
        }

        [HttpPost]
        public JsonResult InsertData(IEnumerable<Warehouse> products)
        {
            Dictionary<string, object> content = new Dictionary<string, object>();
            if (products == null)
                content.Add("error", "Không có dữ liệu");
            else
            {
                int total = 0;
                foreach (Warehouse p in products)
                {
                    SqlParameter[] para = new SqlParameter[] {
                        new SqlParameter("@barcode",p.Barcode)
                        ,new SqlParameter("@carton",p.Carton)
                        ,new SqlParameter("@location",p.Location)
                        ,new SqlParameter("@qty",p.Quantity)
                        ,new SqlParameter("@date_insert", p.DateInsert)
                        ,new SqlParameter("@date_update",p.DateUpdate)
                        ,new SqlParameter("@notes",p.Notes)
                        ,new SqlParameter("@product_error",p.PError)
                        ,new SqlParameter("@product_no_tag",p.PNoTag)
                        ,new SqlParameter("@product_block",p.PBlock)
                        ,new SqlParameter("@ItemID",p.ItemID)
                    };
                    int i = SqlHelper.ExecuteNonQuery(strCon, CommandType.StoredProcedure, "spInsertDataWarehouse", para);
                    if (i != -1)
                        total++;
                }
                content.Add("success", "Insert thành công: " + total + "/" + products.Count());
            }
            var myJson = Json(content, JsonRequestBehavior.AllowGet);
            myJson.MaxJsonLength = int.MaxValue;
            return myJson;
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
    }
}