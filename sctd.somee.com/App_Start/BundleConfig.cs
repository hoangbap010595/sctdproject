﻿using System.Web;
using System.Web.Optimization;

namespace sctd.somee.com
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                    "~/Content/bootstrap.min.css",
                     "~/Content/kendo/kendo.common.min.css",
                     "~/Content/kendo/kendo.silver.min.css",
                     "~/Content/kendo/kendo.silver.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                 "~/Scripts/jquery-{version}.js",
                 "~/Scripts/kendo/jszip.min.js",
                      "~/Scripts/kendo/jquery.min.js",
                      "~/Scripts/kendo/kendo.all.min.js"));
        }
    }
}