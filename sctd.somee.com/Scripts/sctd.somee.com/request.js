$(document).ready(function () {

    function buttonClickHandler(e) {
        var urlRequest = "/Home";
        window.location.href = urlRequest;
    }
    function buttonClickHandlerExcel(e) {
        var gridHistory = $("#gridView").kendoGrid().data("kendoGrid");
        if (gridHistory == null)
            gridHistory.destroy();
        gridHistory.saveAsExcel();
    }

    var dataSources = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/Home/GetRequest",
                dataType: "json"
            }
        },
        pageSize: 20,
        aggregate: [
            { field: "qty", aggregate: "sum" }
        ]

    });

    var colum = [
        {
            title: "Thời gian", columns: [
                { field: "date_request", title: "Ngày", width: "60px", attributes: { class: "ob-center" }, type: "date", template: "#= kendo.toString(kendo.parseDate(date_request), 'dd-MM-yyyy' )#", },
                { field: "time_request", title: "Giờ", width: "60px", attributes: { class: "ob-center" }, type: "date", template: "#= kendo.toString(kendo.parseDate(time_request), 'HH:mm:ss' )#", },
                { field: "notes", title: "Ghi chú", width: "100px" }
            ]
        },
          {
              title: "Chi tiết", columns: [
                  { field: "location", title: "Vị trí", width: "70px", filterable: false, attributes: { class: "ob-center" } },
                  { field: "carton", title: "Thùng", width: "70px", filterable: false, attributes: { class: "ob-center" } },
                  { field: "barcode", title: "Mã vạch", width: "120px", filterable: false },
                  { field: "qty", title: "SL", width: "40px", filterable: false, attributes: { class: "ob-center ob-red" }, aggregates: ["sum"], footerTemplate: "#=sum#", type: "number" },
                  { field: "model", title: "Mã sản phẩm", width: "100px", filterable: false },
                  { field: "size", title: "Kích thước", width: "60px", filterable: false, attributes: { class: "ob-center" } },
                  { field: "color", title: "Màu", width: "80px", filterable: false },
                  { field: "brand", title: "Nhãn hiệu", width: "80px", filterable: false }
              ]
          },
    ];


    var gridHistory = $("#gridView").kendoGrid({
        columns: colum,
        dataSource: dataSources,
        reorderable: true,
        resizable: true,
        pageable: {
            messages: {
                itemsPerPage: "dòng / trang",
                display: "{0} - {1} / {2} dòng",
                empty: "Không có dữ liệu",
                first: "Trang đầu",
                last: "Trang cuối",
                previous: "Trang trước",
                next: "Trang sau"
            },
            buttonCounts: 5,
            pageSizes: true
        },
        height: $(window).height() - 50,
        sortable: true,
        filterable: true,
        scrollable: true,
        toolbar: [
            { name: "excel", text: "Xuất Excel" }
        ],
        excel: {
            filterable: true,
            allPages: true,
            fileName: "Yêu cầu trừ hàng.xlsx"
        }
    }).data("kendoGrid");

    $(".k-grid-back").bind('click', buttonClickHandler);

    function onCancel() {
        alert("ádfasdf");
    }
});