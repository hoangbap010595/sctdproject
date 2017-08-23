$(document).ready(function () {

    var dataSources = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/SysAdmin/GetProduct",
                dataType: "json"
            }
        },
        pageSize: 50,
    });
    var columns = [
        { field: "STT", title: "TT", width: "50px", attributes: { class: "ob-center" }, filterable: false },
        { field: "barcode", title: "Mã vạch", width: "170px" },
        { field: "model", title: "Mã sản phẩm", width: "180px" },
        { field: "size", title: "Size", attributes: { class: "ob-center" }, width: "60px", filterable: false },
        { field: "color", title: "Màu", width: "150px" },
        { field: "price", title: "Giá", type: "number", format: "{0:#,#}", width: "100px", attributes: { class: "ob-right" } },
        { field: "brand", title: "Nhãn hiệu", width: "180px" },
        { field: "division_code", title: "Mã vật tư", width: "150px" },
        { field: "descriptionVietnamese", title: "Thông tin", filterable: false },
    ];

    var grid = $("#gridViewMD").kendoGrid({
        dataSource: dataSources,
        columns: columns,
        filterable: true,
        sortable: true,
        scrollable: true,
        resizable: true,
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
        height: $(window).height() - 50,
        excel: {
            filterable: true,
            allPages: true,
            fileName: "File Item Master Data.xlsx"
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
})