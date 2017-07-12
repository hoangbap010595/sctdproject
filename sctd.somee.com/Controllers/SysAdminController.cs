﻿using Microsoft.ApplicationBlocks.Data;
using sctd.somee.com.Models;
using sctd.somee.com.Security;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
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
        public JsonResult GetProduct()
        {   
            List<Dictionary<string, object>> lsStock = new List<Dictionary<string, object>>();

            DataSet ds = SqlHelper.ExecuteDataset(strCon, CommandType.StoredProcedure, "GetProduct");
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