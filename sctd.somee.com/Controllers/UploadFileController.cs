using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace sctd.somee.com.Controllers
{
    public class UploadFileController : Controller
    {
        // GET: UploadFile
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ReadFileExcel()
        {
            return View();
        }

        public ActionResult Save(IEnumerable<HttpPostedFileBase> files)
        {
            // The Name of the Upload component is "files"
            if (files != null)
            {
                foreach (var file in files)
                {
                    // Some browsers send file names with full path.
                    // We are only interested in the file name.
                    var fileName = Path.GetFileName(file.FileName);
                    var physicalPath = Path.Combine(Server.MapPath("~/Upload/FileImport"), fileName);

                    // The files are not actually saved in this demo
                    file.SaveAs(physicalPath);
                }
            }

            // Return an empty string to signify success
            return Content("");
        }

        public ActionResult Remove(IEnumerable<HttpPostedFileBase> files)
        {
            // The parameter of the Remove action must be called "fileNames"

            if (files != null)
            {
                foreach (var file in files)
                {
                    // Some browsers send file names with full path.
                    // We are only interested in the file name.
                    var fileName = Path.GetFileName(file.FileName);
                    var physicalPath = Path.Combine(Server.MapPath("~/Upload/FileImport"), fileName);
                    // TODO: Verify user permissions
                    //FileInfo i = new FileInfo(file.FileName);

                    if (System.IO.File.Exists(physicalPath))
                    {
                        // The files are not actually removed in this demo
                        System.IO.File.Delete(physicalPath);
                    }
                }
            }

            // Return an empty string to signify success
            return Content("");
        }
        public ActionResult RemoveOderFile(string fileName)
        {
            // The parameter of the Remove action must be called "fileNames"
            string root = Server.MapPath("~/Upload/FileImport");
            if (fileName != "")
            {
                var a = Directory.EnumerateFiles(root);
                foreach (var item in a)
                {
                    if (!item.Equals(fileName))
                    {
                        var physicalPath = Path.Combine(root, item);
                        if (System.IO.File.Exists(physicalPath))
                        {
                            // The files are not actually removed in this demo
                            System.IO.File.Delete(physicalPath);
                        }
                    }
                }
            }

            // Return an empty string to signify success
            return Content("");
        }
        public JsonResult filesInFolder()
        {
            string dirPath = Server.MapPath("~/Upload/FileImport");
            List<Dictionary<string, object>> files = new List<Dictionary<string, object>>();

            DirectoryInfo dirInfo = new DirectoryInfo(dirPath);
            Dictionary<string, object> item = null;
            int i = 1;
            foreach (FileInfo fInfo in dirInfo.GetFiles())
            {
                item = new Dictionary<string, object>();
                item.Add("Id", i);
                item.Add("Name", fInfo.Name);
                item.Add("Length", String.Format("{0:#,#}", fInfo.Length) + " KB");
                item.Add("CreationTime", Convert.ToDateTime(fInfo.CreationTime).ToString("dd-MM-yyyy HH:mm"));
                files.Add(item);
                i++;
            }
            return Json(files.ToArray(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult DownloadFile(string fileName)
        {
            string dirPath = Server.MapPath("~/Upload/Form/");

            var filepath = System.IO.Path.Combine(dirPath, fileName);
            return File(filepath, MimeMapping.GetMimeMapping(filepath), fileName);
        }
    }
}