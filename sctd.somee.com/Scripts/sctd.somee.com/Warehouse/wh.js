/// <reference path="../../kendo/kendo.all.min.js" />
/// <reference path="../../kendo/jquery.min.js" />


$(document).ready(function () {
    //Toolbar
    //$("#toolbarStock").kendoToolBar({
    //    items: [
    //        {
    //            icon: "accept", type: "button", text: "Yêu cầu trừ hàng",
    //            click: buttonClickHandler
    //        },
    //         {
    //             icon: "excel", type: "button", text: "Xuất Excel",
    //             click: buttonClickHandlerExcel
    //         }
    //    ]
    //});
    //var tb = $("#toolbarStock").kendoToolBar().data("kendoToolBar");

    function buttonClickHandler(e) {
        var urlRequest = "/Home/wRequest";
        window.location.href = urlRequest;
    }
    function buttonClickHandlerExcel(e) {
        var grid = $("#gridViewWH").kendoGrid().data("kendoGrid");
        if (grid.dataSource != null)
            grid.saveAsExcel();
        else
            alert("Không tìm thấy thông tin dữ liệu.");
    }

    var dataSources = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/Warehouse/GetStock"
            }
        },
        schema: {
            model: {
                fields: {
                    product_error: { type: "boolean" },
                    product_no_tag: { type: "boolean" },
                    product_block: { type: "boolean" }
                }                       
            }
        },
        pageSize: 50,
        aggregate: [
            { field: "qty", aggregate: "sum" }
        ]

    });

    var columns = [
        { field: "location", title: "Vị trí", width: "120px", attributes: { class: "ob-center" } },
        { field: "carton", title: "Thùng", width: "120px", attributes: { class: "ob-center" } },
        { field: "barcode", title: "Mã vạch", width: "200px" },
        { field: "qty", title: "Tồn", attributes: { class: "ob-center ob-red" }, width: "60px", filterable: false, aggregates: ["sum"], footerTemplate: "#=sum#", type: "number" },
        { field: "model", title: "Mã sản phẩm", width: "180px" },
        { field: "size", title: "Size", attributes: { class: "ob-center" }, width: "60px", filterable: false },
        { field: "color", title: "Màu", width: "150px" },
        { field: "price", title: "Giá", type: "number", format: "{0:#,#}", width: "100px", attributes: { class: "ob-right" } },
        { field: "brand", title: "Nhãn hiệu", width: "180px" },
        { field: "notes", title: "Ghi chú", width: "250px",attributes: { class: "ob-red" } },
        { field: "date_update", title: "Cập nhật", type: "date", template: "#= kendo.toString(kendo.parseDate(date_update), 'dd-MM-yyyy' )#", width: "100px", filterable: false, attributes: { class: "ob-center" } },
        { field: "date_insert", title: "Ngày nhập", type: "date", template: "#= kendo.toString(kendo.parseDate(date_insert), 'dd-MM-yyyy' )#", width: "120px", filterable: false, attributes: { class: "ob-center" } }    
    ];

    var grid = $("#gridViewWH").kendoGrid({
        dataSource: dataSources,
        columns: columns,
        filterable: true,
        sortable: true,
        scrollable: true,
        resizable: true,
        height: $(window).height() - 50,
        pageable: {
            messages: {
                itemsPerPage: "dòng / trang",
                display: "{0}-{1} / {2} dòng",
                empty: "Không có dữ liệu",
                refresh: "Tải lại",
                first: "Trang đầu",
                last: "Trang cuối",
                next: "Trang sau",
                previous: "Trang trước"
            }
        },
        toolbar: kendo.template($("#template").html()),
        //    [
        //    kendo.template($("#template").html()),
        //    { name: "excel", text: "Xuất Excel" },
        //],
        excel: {
            filterable: true,
            allPages: true,
            fileName: "File Stock.xlsx"
        }
    });
    //Grid
    //var grid = $("#gridViewWH").kendoGrid();
    var dropDown = grid.find("#kind").kendoDropDownList({
        dataTextField: "Value",
        dataValueField: "ID",
        dataSource: [
            { ID: -1, Value: "Tất cả" }
            , { ID: 1, Value: "Bình Thường" }
            , { ID: 2, Value: "Hàng Lỗi" }
            , { ID: 3, Value: "Block" }
            , { ID: 4, Value: "Không tem giá" }
        ],
        value: 0,
        change: function () {
            var value = this.value();
            switch (value) {
                case "1":
                    grid.data("kendoGrid").dataSource.filter(
                        { field: "product_error", operator: "eq", value: false }
                        , { field: "product_no_tag", operator: "eq", value: false }
                        , { field: "product_block", operator: "eq", value: false });
                    break;
                case "2":
                    grid.data("kendoGrid").dataSource.filter(
                        { field: "product_error", operator: "eq", value: true });
                    break;
                case "3":
                    grid.data("kendoGrid").dataSource.filter(
                        { field: "product_block", operator: "eq", value: true });
                    break;
                case "4":
                    grid.data("kendoGrid").dataSource.filter(
                        { field: "product_no_tag", operator: "eq", value: true });
                    break;
                default:
                    grid.data("kendoGrid").dataSource.filter({});
                    break;
            }
        }
    });

    grid.find(".k-grid-toolbar").on("click", ".k-pager-refresh", function (e) {
        e.preventDefault();
        grid.data("kendoGrid").dataSource.read();
        grid.data("kendoGrid").refresh();
    });

    grid.find(".k-grid-toolbar").on("click", ".k-pager-excel", function (e) {
        e.preventDefault();
        grid.data("kendoGrid").saveAsExcel();
    });

    //$(".k-grid-back").bind('click', buttonClickHandler);
});