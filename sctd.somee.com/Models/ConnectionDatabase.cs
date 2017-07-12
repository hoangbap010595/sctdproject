using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace sctd.somee.com.Models
{
    public class ConnectionDatabase
    {
        private static string sqlConnection = "StorageEntitiesUse";

        public static string strSqlConetion { get { return sqlConnection; } set { sqlConnection = value; } }
    }
}