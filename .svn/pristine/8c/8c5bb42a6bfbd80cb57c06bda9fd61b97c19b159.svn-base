using Microsoft.ApplicationBlocks.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;

namespace sctd.somee.com.Models
{
    public class AccountModel
    {
        string strCon = ConfigurationManager.ConnectionStrings[ConnectionDatabase.strSqlConetion].ConnectionString;
        private List<Account> listAccounts = new List<Account>();

        public AccountModel()
        {
            string sql = "SELECT Username, Password, Role FROM Account";
            DataSet ds = SqlHelper.ExecuteDataset(strCon, CommandType.Text, sql);

            listAccounts = GetTableRows(ds.Tables[0]);
        }

        public Account find(string username)
        {
            return listAccounts.Where(x => x.Username.Equals(username)).FirstOrDefault();
        }

        public List<Account> GetTableRows(DataTable dt)
        {
            List<Account> listData = new List<Account>();
            Account rowData;

            foreach (DataRow dr in dt.Rows)
            {
                rowData = new Account();
                foreach (DataColumn col in dt.Columns)
                {
                    rowData.Username = dr["Username"].ToString().ToUpper();
                    rowData.Password = dr["Password"].ToString();
                    rowData.Role = dr["Role"].ToString().Split(',');
                }
                listData.Add(rowData);
            }

            return listData;
        }
    }
}