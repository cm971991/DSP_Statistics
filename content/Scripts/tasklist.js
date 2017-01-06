var dataTable;
var layerIndex = 0, layerIndexTwo = 0, dspConfirm = 0, delsort = 0;

$(document).ready(function () {
    Init();
    $("#btnQuery").click(evtOnQuery);               //查询
    $("#btnRefresh").click(evtOnRefresh);           //刷新
    $("#btnAdd").click(evtOnOpenTaskLayer);         //导入弹窗
});

function Init() {
    selectTaskList ()
    heightInit();
    dataTableInit();
}

function dataTableInit() {
    var option = {
        ele: $('#dataTable'),
        ajax: { url: getTaskListUrl, type: "POST" },
        scrollY: scrollY,
        columns: [
            {
                title: "多选", width: 60,
                render: function (data, type, row) {
                    return "<input type='checkbox' />";
                }
            },
           { data: "id", title: "序号", width: 60, className: "dspTableFirstColumns" },
           { data: "server_ip", title: "server-ip", width: 120 },
           { data: "mask", title: "mask", width: 120 },
           { data: "port", title: "port", width: 120 },
           { data: "sid_3gnet", title: "sid_3gnet", width: 120 },
           { data: "sid_3gwap", title: "sid_3gwap", width: 120 },
           { data: "sid_uninet", title: "sid_uninet", width: 120 },
           { data: "sid_uniwap", title: "sid_uniwap", width: 120 }
        ]
    };
    dataTable = $html.dspTable(option);
}

// 查询
function evtOnQuery() {
    dataTable.ajax.url(getTaskListUrl + "&name=" + $("#txtQuery").val());
    dataTable.ajax.reload();
}

// 刷新
function evtOnRefresh() {
    $("#txtQuery").val("");
    dataTable.ajax.url(getTaskListUrl + "&name=" + $("#txtQuery").val());
    dataTable.ajax.reload();
}

// 删除任务
function evtOnDeleteTask(id, name) {
    dspConfirm = $html.dspconfirm("确定删除该条内容吗？",
        function () {
            $request.ajaxPost(deleteTaskUrl, { taskid: id },
                 function (data) {
                     if (data.ret) {
                         $html.success(data.msg);
                         layer.close(dspConfirm);
                         dataTable.ajax.reload();
                     } else {
                         $html.warning(data.msg);
                         layer.close(dspConfirm);
                     }
                 },
                 function () {
                     $html.warning("亲，删除失败！");
                     layer.close(dspConfirm);
                 });
        }, function () {
            layer.close(dspConfirm);
        });
}

//新增或编辑任务 弹框
function evtOnOpenTaskLayer(obj) {
    $html.loading(true);
    $('#popupAddOrEdit').show();
    layerIndexTwo = $html.dspLayer(dspWindowH, $('#popupAddOrEdit'), reset);

    $html.loading(false);
}
