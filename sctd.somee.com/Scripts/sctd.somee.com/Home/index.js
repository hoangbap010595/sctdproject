

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
        var grid = $("#gridView").kendoGrid().data("kendoGrid");
        if (grid.dataSource != null)
            grid.saveAsExcel();
        else
            alert("Không tìm thấy thông tin dữ liệu.");
    }
    var dataSources = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/Home/GetStock",
                dataType: "json"
            }
        },
        pageSize: 50,
        aggregate: [
            { field: "qty", aggregate: "sum" }
        ]

    });

    var columns = [
        { command: { text: "x", click: onRequest, attributes: { class: "k-primary" } }, title: "YC", width: "60px", filterable: false, locked: true },
        { field: "location", title: "Vị trí", width: "120px", attributes: { class: "ob-center" } },
        { field: "carton", title: "Thùng", width: "120px", attributes: { class: "ob-center" } },
        { field: "barcode", title: "Mã vạch", width: "200px" },
        { field: "qty", title: "Tồn", attributes: { class: "ob-center ob-red" }, width: "60px", filterable: false, aggregates: ["sum"], footerTemplate: "#=sum#", type: "number" },
        { field: "model", title: "Mã sản phẩm", width: "180px" },
        { field: "size", title: "Size", attributes: { class: "ob-center" }, width: "60px", filterable: false },
        { field: "color", title: "Màu", width: "150px" },
        { field: "price", title: "Giá", type: "number", format: "{0:#,#}", width: "100px", attributes: { class: "ob-right" } },
        { field: "brand", title: "Nhãn hiệu", width: "180px" },
        { field: "date_update", title: "Cập nhật", type: "date", template: "#= kendo.toString(kendo.parseDate(date_update), 'dd-MM-yyyy' )#", width: "100px", filterable: false, attributes: { class: "ob-center" } },
        { field: "notes", title: "Ghi chú", width: "250px" }
    ];

    var grid = $("#gridView").kendoGrid({
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
        toolbar: kendo.template($("#template").html())
    }).data("kendoGrid");

    $(".k-grid-back").bind('click', buttonClickHandler);

    var win = $("#window").kendoWindow({
        title: "Xác nhận trừ hàng theo yêu cầu",
        modal: true,
        visible: false,
        resizable: false,
        actions: false
    }).data("kendoWindow");

    //ID product
    var ID_Warehouse;
    function onRequest(e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        loadInfo(dataItem);
        win.center().open();
    }

    function loadInfo(dataItem) {
        ID_Warehouse = dataItem.stt;
        $("#txtLocation").val(dataItem.location);
        $("#txtCarton").val(dataItem.carton);
        $("#txtBarcode").val(dataItem.barcode);
        $("#txtModel").val(dataItem.model);
        $("#txtSize").val(dataItem.size);
        $("#txtColor").val(dataItem.color);

        $("#txtLocation").prop({ "disabled": true });
        $("#txtCarton").prop({ "disabled": true });
        $("#txtBarcode").prop({ "disabled": true });
        $("#txtModel").prop({ "disabled": true });
        $("#txtSize").prop({ "disabled": true });
        $("#txtColor").prop({ "disabled": true });
    }

    function onCancel(e) {
        ID_Warehouse = "";
        win.close();
    }

    function onAccept(e) {
        $("#btnAccept").prop("enabled", false);
        var dFilter =
            {
                barcode: $("#txtBarcode").val().trim(),
                carton: $("#txtCarton").val().trim(),
                location: $("#txtLocation").val().trim(),
                qty: kendo.parseInt($("#txtQty").val().trim()),
                notes: $("#txtNote").val().trim()
            };

        if ($("#txtNote").val() == "") {
            $("#dialog").kendoDialog({
                width: 400,
                closable: false,
                title: "Thông báo",
                content: "Xác thực dữ liệu không thành công!<br/>Cột ghi chú không thể để trống.",
                actions: [{ text: 'OK', primary: true }]
            }).data("kendoDialog").open();
            $("#txtNote").focus();
            $("#btnAccept").prop("enabled", true);
            return;
        }
        var windowWidget = $("#dialog").kendoWindow({
            title: "Hệ thống đang xử lí",
            content: {
                template: "Chờ một chút...."
            },
            actions: false,
            width: 200,
            height: 100
        }).data("kendoWindow");

        windowWidget.center().open();
        kendo.ui.progress(windowWidget.element, true);

        $.ajax({
            type: "POST",
            url: "/Home/InsertRequest",
            data: dFilter,
            success: function (e) {
                var urlRequest = "/Home/wRequest";
                window.location.href = urlRequest;
                windowWidget.close();
            },
            error: function (e) {
                windowWidget.close();
                $("#dialog").kendoDialog({
                    width: 400,
                    closable: false,
                    title: "Lỗi gửi yêu cầu",
                    content: e.statusText,
                    actions: [{ text: 'Quay lại', primary: true }]
                }).data("kendoDialog").open();
            }
        })
        console.log(dFilter);
    }

    function onSpin(e) {
        var value = this.value();
        $("#lblMessage").html("Gửi yêu cầu lấy hàng: <b style='color:red'>" + value + "</b> pcs");
    }
    function onChange(e) {
        var value = this.value();
        $("#lblMessage").html("Gửi yêu cầu lấy hàng: <b style='color:red'>" + value + "</b> pcs");
    }

    $("#txtQty").kendoNumericTextBox({
        format: "#",
        min: 1,
        max: 1000,
        step: 1,
        value: 1,
        spin: onSpin,
        change: onChange
    });

    $("#btnCancel").kendoButton({
        click: onCancel
    });
    $("#btnAccept").kendoButton({
        click: onAccept
    });

});