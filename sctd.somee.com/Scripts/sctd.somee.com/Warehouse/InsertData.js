//Warehouse/InsertData
$(document).ready(function () {
    $("#tabstrip").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });

    $("#btnInsert").on('click', function () {
        insertOneRecord();
    });

    var dataFromFile = [];
    var grid = $("#grid").kendoGrid({
        columns: [
            { field: "Barcode", title: "Mã vạch", width: 130 },
            { field: "Carton", title: "Thùng", width: 130 },
            { field: "Location", title: "Vị trí", width: 130 },
            { field: "Quantity", title: "Số lượng", width: 130 },
            { field: "Notes", title: "Ghi chú", width: 330 }
        ],
        filterable: false,
        sortable: true,
        scrollable: true,
        resizable: true,
        height: $(window).height() - 150,
        toolbar: kendo.template($("#template").html()),
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
    });

    var dropDown = grid.find("#kind").kendoDropDownList({
        dataTextField: "Value",
        dataValueField: "ID",
        dataSource: [
            { ID: 1, Value: "Bình Thường" }
            , { ID: 2, Value: "Hàng Lỗi" }
            , { ID: 3, Value: "Block" }
            , { ID: 4, Value: "Không tem giá" }
        ],
        value: 0,
        change: function () {
            var value = this.value();
            switch (value) {
                case "1":
                    for (var i = 0; i < dataFromFile.length; i++) {
                        delete dataFromFile[i].PError;
                        delete dataFromFile[i].PNoTag;
                        delete dataFromFile[i].PBlock;
                    }
                    break;
                case "2":
                    for (var i = 0; i < dataFromFile.length; i++) {
                        dataFromFile[i].PError = true;
                        delete dataFromFile[i].PNoTag;
                        delete dataFromFile[i].PBlock;
                    }
                    break;
                case "3":
                    for (var i = 0; i < dataFromFile.length; i++) {
                        delete dataFromFile[i].PError;
                        delete dataFromFile[i].PNoTag;
                        dataFromFile[i].PBlock = true;
                    }
                    break;
                case "4":
                    for (var i = 0; i < dataFromFile.length; i++) {
                        delete dataFromFile[i].PError;
                        dataFromFile[i].PNoTag = true;
                        delete dataFromFile[i].PBlock;
                    }
                    break;
            }
            console.log(dataFromFile);
        }
    });
    function onSuccess(e) {
        var fileName = getFileInfo(e);
        removeOrderFile(fileName);

        var upload = $("#files").data("kendoUpload");
        var files = upload.getFiles();

        /* set up XMLHttpRequest */
        var parentFolder = "/Upload/FileImport/";
        var url = parentFolder + fileName;
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (e) {
            var arraybuffer = oReq.response;

            /* convert data to binary string */
            var data = new Uint8Array(arraybuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i)
                arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");

            /* Call XLSX */
            var workbook = XLSX.read(bstr, { type: "binary" });

            /* DO SOMETHING WITH workbook HERE */
            var first_sheet_name = workbook.SheetNames[0];
            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];

            dataFromFile = XLSX.utils.sheet_to_json(worksheet);

            var dataSources = new kendo.data.DataSource({
                data: dataFromFile,
                pageSize: 50,
            });
            //console.log(data);

            $('body,html').animate({
                scrollTop: $(window).height()
            }, 200);
            grid.data("kendoGrid").setDataSource(dataSources);

        }

        oReq.send();
    }

    grid.find(".k-grid-toolbar").on("click", ".k-pager-insert", function (e) {
        e.preventDefault();
        if (dataFromFile.length > 0) {
            $("#dialog").kendoDialog({
                width: 300,
                closable: false,
                title: "Thông báo",
                content: "Tiến hành nhập dữ liệu vào hệ thống ?",
                actions: [
                    { text: 'Hủy bỏ', action: onCancel },
                    { text: 'Xác nhận', primary: true, action: onOK }
                ]
            }).data("kendoDialog").open();
            return;
        }
        else {
            $("#dialog").kendoDialog({
                width: 300,
                closable: false,
                title: "Thông báo",
                content: "Không tìm thấy dữ liệu cần import!",
                actions: [
                    { text: 'Quay lại', primary: true }
                ]
            }).data("kendoDialog").open();
            return;
        }
    });

    grid.find(".k-grid-toolbar").on("click", ".k-pager-getfile", function (e) {
        e.preventDefault();
        var url = "/UploadFile/DownloadFile?fileName=WarehouseItem.xlsx"
        window.open(url);
    });

    function onCancel() {
    }

    //Nhập 1 mảng dữ liệu vào database
    function onOK() {
        var windowWidget = $("#dialog2").kendoWindow({
            title: "Hệ thống đang xử lí",
            content: {
                template: "<span id=\"message\" class=\"winMessage\">Vui lòng chờ đến khi tiến trình kết thúc.</span>"
            },
            actions: false,
            draggable: false,
            visible: false,
            modal: true,
            iframe: true,
            width: 222,
            height: 111
        }).data("kendoWindow");

        windowWidget.center().open();
        kendo.ui.progress(windowWidget.element, true);

        $.ajax({
            type: "POST",
            url: "/Warehouse/InsertData",
            data: { products: dataFromFile },
            success: function (e) {
                console.log(e);
                windowWidget.close();
                $("#dialog").kendoDialog({
                    width: 400,
                    closable: false,
                    title: "Nhập dữ liệu hoàn thành",
                    content: e.success,
                    actions: [{ text: 'Xác nhận', primary: true }]
                }).data("kendoDialog").open();

            },
            error: function (e) {
                windowWidget.close();
                $("#dialog").kendoDialog({
                    width: 400,
                    closable: false,
                    title: "Quá trình xảy ra lỗi",
                    content: e.error,
                    actions: [{ text: 'Quay lại', primary: true }]
                }).data("kendoDialog").open();
            }
        })
    }

    function getFileInfo(e) {
        return $.map(e.files, function (file) {
            var info = file.name;
            //// File size is not available in all browsers
            //if (file.size > 0) {
            //    info += " (" + Math.ceil(file.size / 1024) + " KB)";
            //}
            return info;
        }).join(", ");
    }

    $("#files").kendoUpload({
        async: {
            saveUrl: "/UploadFile/Save",
            removeUrl: "/UploadFile/Remove",
            autoUpload: true
        }
        , success: onSuccess
        , validation: {
            allowedExtensions: [".xlsx", ".xls"],
            maxFileSize: 16777216
        }
    });

    function removeOrderFile(fileName) {
        $.ajax({
            url: "/UploadFile/RemoveOderFile", // don't hardcode
            type: "POST",
            data: fileName,
            success: function (data) {

            },
            error: function () {

            }
        });
    }
});