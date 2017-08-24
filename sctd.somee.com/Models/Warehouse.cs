using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace sctd.somee.com.Models
{
    public class Warehouse
    {
        public string Barcode { get; set; }
        public string Carton { get; set; }
        public string Location { get; set; }
        public int Quantity { get; set; }
        public string DateInsert { get; set; }
        public string DateUpdate { get; set; }
        public string Notes { get; set; }
        public bool PError { get; set; }
        public bool PNoTag { get; set; }
        public bool PBlock { get; set; }
        public bool Status { get; set; }
        public int ItemID { get; set; }


    }
}