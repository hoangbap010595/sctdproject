$(document).ready(function () {
    $("#tabstrip").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });
    var windowWidget = $("#dialog").kendoWindow({
        title: "Hệ thống đang xử lí",
        content: {
            template: "Chờ một chút...."
        },
        actions: false,
        width: 200,
        height: 100
    });

    function onSuccess(e) {
        //show loading
        //windowWidget.center().open();
        //kendo.ui.progress(windowWidget.element, true);

        var fileName = getFileInfo(e);
        console.log(fileName);
        var upload = $("#files").data("kendoUpload");
        var files = upload.getFiles();
        //console.log("You have selected " + files.length + " files");
        console.log(files);

        /* set up XMLHttpRequest */
        var parentFolder = "/Upload/";
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

            var data = XLSX.utils.sheet_to_json(worksheet);
            console.log(data);
            var dataSources = new kendo.data.DataSource({
                data: data,
                pageSize: 50,
            });
            //console.log(data);
            var grid = $("#grid").kendoGrid({
                columns: [
                    { field: "Barcode", title: "Mã vạch" },
                    { field: "Model", title: "Mã sản phẩm" },
                    { field: "Size", title: "Kích thước" },
                    { field: "Color", title: "Màu" },
                    { field: "Price", title: "Giá" },
                    { field: "Brand", title: "Nhãn hiệu" }
                ],
                dataSource: dataSources,
                filterable: false,
                sortable: true,
                scrollable: true,
                resizable: true,
                height: $(window).height() - 150,
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
            $('body,html').animate({
                scrollTop: $(window).height()
            }, 200);
        }

        oReq.send();
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

    $.ajax({
        url: "/UploadFile/filesInFolder", // don't hardcode
        dataType: "json",
        success: function (data) {
            //$.each(data, function (index, item) {
            //    $('#filelist').append($('<tr><td>#= index#</td><td><b>item.Name</b></td></tr>').text(item));
            //});
            console.log(data);
            
        },
        error: function () {

        }
    });
});