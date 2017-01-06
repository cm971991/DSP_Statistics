/**************************************页面布局计算**************************************************/

var scrollY = 0, dspWindowH = 0, dspWindowW = 0, tableH = 0;
function heightInit() {
    var windowH = $(window).height();
    var taskbarTabsH = 60;  //面包屑高度
    var marginTop = 10;
    var marginBottom = 10;
    tableH = windowH - taskbarTabsH - marginTop - marginBottom;
    $("#main").height(tableH);  //表格整体高度

    var tableQueryH = 36 + 10; //表格查询列高度
    var tableHeadH = 41; //表格表头高度
    var tablePageH = 41; //表格分页栏高度

    dspWindowH = windowH - tableQueryH - 25; //弹出层高度

    scrollY = (tableH - tableQueryH - tableHeadH - tablePageH);   //表格内容高度

    var windowW = $(window).width();
    dspWindowW = windowW - 40;

    if (scrollY <= 0) scrollY = 400;
}


/**************************************AJax请求方法******************************************************/

var $request = {
    ajaxAsync: function (url, data, async, successfn, errorfn, beforefn, completefn) {
        data = (data == null || data == "" || typeof (data) == "undefined") ? { "date": new Date().getTime() } : data;
        $.ajax({
            type: "post",
            data: data,
            async: async,
            url: url,
            dataType: "json",
            beforeSend: function (b) {
                if (beforefn) {
                    beforefn(b);
                }
            },
            success: function (d) {
                successfn(d);
            },
            complete: function (c) {
                if (completefn) {
                    completefn(c);
                }
            },
            error: function (e) {
                errorfn(e);
            }
        });
    },
    ajaxPost: function (url, data, successfn, errorfn, beforefn, completefn) {
        data = (data == null || data == "" || typeof (data) == "undefined") ? { "date": new Date().getTime() } : data;
        $.ajax({
            type: "post",
            data: data,
            url: url,
            dataType: "json",
            beforeSend: function (b) {
                if (beforefn) {
                    beforefn(b);
                } else {
                    $html.loading(true);
                }
            },
            success: function (d) {
                successfn(d);
            },
            complete: function (c) {
                if (completefn) {
                    completefn(c);
                } else {
                    $html.loading(false);
                }
            },
            error: function (e) {
                errorfn(e);
            }
        });
    }
}


/******************************************html方法************************************************/

var $html = {
    dspTable: function (option) {       // datatables.js 封装
        // 必填参数
        if (!option.ele || typeof option.ele === "undefined" || !option.ajax || typeof option.ajax === "undefined" || typeof option.scrollY !== "number" || option.scrollY <= 0 || !option.columns || typeof option.columns === "undefined") {
            return;
        }

        // 可选参数
        if (option.pageLength <= 0) {
            option.pageLength = 10;
        }

        if (typeof option.paging === "") {
            option.paging = true;
        }

        if (typeof option.info === "undefined") {
            option.info = true;
        }

        if (typeof option.ordering === "undefined") {
            option.ordering = false;
        }

        if (typeof option.processing === "undefined") {
            option.processing = true;
        }

        var config = {
            ajax: option.ajax,
            language: {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "processing": "加载中...",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "上一页",
                    "sNext": "下一页",
                    "sLast": "尾页"
                }
            },
            scrollY: option.scrollY,
            deferRender: true,
            searching: false,
            paging: option.paging,
            ordering: option.ordering,
            lengthChange: false,
            serverSide: true,
            processing: option.processing,
            info: option.info,
            pageLength: option.pageLength,
            columns: option.columns,
            headerCallback: function (thead, data, start, end, display) {
                $(thead).css({ "background": "#F7F7F7", "font-size": "16px", "color": "black" });
            }
        };

        if (typeof option.drawCallback === "function") {
            config.drawCallback = option.drawCallback;
        }

        return $(option.ele).DataTable(config);
    },
    loading: function (bol) {
        var ajaxbg = top.$("#loading");
        top.$("#loading").css("left", (top.$('body').width() - top.$("#loading").width()) / 2);
        if (bol) {
            ajaxbg.show();
        } else {
            ajaxbg.hide();
        }
    },
    warning: function (content, end) {      // Layer提示框 失败
        var options = {
            content: content,
            time: 2000,
            shade: false,
            skin: 'dspwarning',
            title: false,
            closeBtn: 0,
            btn: false,
            end: end
        };
        return layer.open(options);
    },
    success: function (content, end) {      // Layer提示框 成功
        var options = {
            content: content,
            time: 2000,
            shade: false,
            skin: 'dspsuccess',
            title: false,
            closeBtn: 0,
            btn: false,
            end: end
        };
        return layer.open(options);
    },
    dspconfirm: function (content, yes, cancel) {       // Layer确认框
        options = {
            btn: ['确定', '取消'],
            skin: 'dspconfirm',
            title: false,
            closeBtn: 0
        };
        return layer.confirm(content, options, yes, cancel);
    },
    dspLayer: function (height, ele, end) {     // Layer弹出框
        return layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            move: false,
            shadeClose: true,
            area: ['1100px', height + 'px'],
            skin: 'layui-layer-lan',
            offset: '5px',
            shift: 0,
            content: ele,
            end: end
        });
    },
    dspSmallLayer: function (width, height, title, ele, end) {      // Layer弹出框
        return layer.open({
            type: 1,
            title: title,
            closeBtn: 0,
            move: false,
            shadeClose: true,
            area: [width + 'px', height + 'px'],
            skin: 'layui-layer-lan',
            offset: '50px',
            shift: 0,
            content: ele,
            end: end
        });
    }
}


/******************************************工具类方法************************************************/

var $util = {
    virtual: "",
    html2Escape: function (sHtml) {
        return sHtml.replace(/[&]/g, function (c) { return { '&': 'godlike' }[c]; });
    },
    log: function (operationName) {
        var regex = /\#$/;
        if (typeof logUri === "undefined") {
            return;
        }
        var url = logUri + "?page=" + $util.html2Escape(location.href).replace(regex, "")
                + "&operationName=" + operationName
        $.ajax({ url: url });
    },
    getVirtual: function () {   // 获取项目虚拟目录
        try {
            var currentUrl = window.location.href;
            var list = currentUrl.replace("http://", "").split("/");
            if (list.length > 1) {
                if (list[1] == "iProbe") {
                    $util.virtual = "http://" + list[0] + "/" + list[1];
                } else {
                    $util.virtual = "http://" + list[0];
                }
            }
            return $util.virtual;
        } catch (e) { return ""; }
    },
    exportFile: function (url, params) {    //导出Excel
        var temp = document.createElement("form");
        temp.action = url;
        temp.method = "post";
        temp.style.display = "none";
        for (var x in params) {
            var opt = document.createElement("textarea");
            opt.name = x;
            opt.value = params[x];
            temp.appendChild(opt);
        }
        document.body.appendChild(temp);
        temp.submit();
    },
    /*  createGuid() {  // 生成Guid
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }, */
    getStartAndEndTime: function (type, zeroFlag) {     // 获取当前开始时间、结束时间
        var ddStart = new Date();
        var ddStartMonth = ddStart.getMonth() + 1;
        var ddStartDay = ddStart.getDate();

        var ddEnd = new Date(ddStart);
        var ddEndMonth = ddEnd.getMonth() + 1;
        var ddEndDay = ddEnd.getDate();
        var ddEndDayPlus = ddEnd.getDate() + 7;

        var thisMonthDay = new Date(ddStart.getFullYear(), (ddStart.getMonth() + 1), 0).getDate();
        if (thisMonthDay < ddEndDayPlus) {    //当前月加7天不存在
            var diff = 7 - (thisMonthDay - ddStartDay);
            ddEndMonth = ddEndMonth + 1;
            ddEndDay = diff;
            ddEndDayPlus = diff;
        }

        if (ddStartMonth < 10) {
            ddStartMonth = "0" + ddStartMonth;
        }

        if (ddStartDay < 10) {
            ddStartDay = "0" + ddStartDay;
        }

        if (ddEndMonth < 10) {
            ddEndMonth = "0" + ddEndMonth;
        }

        if (ddEndDay < 10) {
            ddEndDay = "0" + ddEndDay;
        }

        if (ddEndDayPlus < 10) {
            ddEndDayPlus = "0" + ddEndDayPlus;
        }

        var strStart, strEnd = "";
        if (type == 1) {
            strStart = ddStart.getFullYear() + '-' + ddStartMonth + '-' + ddStartDay + " 00:00";
            strEnd = ddEnd.getFullYear() + '-' + ddEndMonth + '-' + ddEndDayPlus + " 00:00";
        } else if (type == 2) {
            strStart = ddStart.getFullYear() + '-' + ddStartMonth;
            strEnd = ddEnd.getFullYear() + '-' + ddEndMonth;
        } else if (type == 3) {
            strStart = ddStart.getFullYear() + '-' + ddStartMonth + '-' + ddStartDay + " 00:00:00";
            strEnd = ddEnd.getFullYear() + '-' + ddEndMonth + '-' + ddEndDayPlus + " 00:00:00";
        } else {
            strStart = ddStart.getFullYear() + '-' + ddStartMonth + '-' + ddStartDay;
            strEnd = ddEnd.getFullYear() + '-' + ddEndMonth + '-' + ddEndDay;
        }
        return [strStart, strEnd];
    },
    getNow: function () {     // 获取当前时间，格式YYYY-MM-DD
        var date = new Date();
        var seperator = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator + month + seperator + strDate;
        return currentdate;
    }
}








//function AjaxAsync(url, data, async, successfn, errorfn, beforefn, completefn) {
//    data = (data == null || data == "" || typeof (data) == "undefined") ? { "date": new Date().getTime() } : data;
//    $.ajax({
//        type: "post",
//        data: data,
//        async: async,
//        url: url,
//        dataType: "json",
//        beforeSend: function (b) {
//            if (beforefn) {
//                beforefn(b);
//            }
//        },
//        success: function (d) {
//            successfn(d);
//        },
//        complete: function (c) {
//            if (completefn) {
//                completefn(c);
//            }
//        },
//        error: function (e) {
//            errorfn(e);
//        }
//    });
//};


//function AjaxPost(url, data, successfn, errorfn, beforefn, completefn) {
//    data = (data == null || data == "" || typeof (data) == "undefined") ? { "date": new Date().getTime() } : data;
//    $.ajax({
//        type: "post",
//        data: data,
//        url: url,
//        dataType: "json",
//        beforeSend: function (b) {
//            if (beforefn) {
//                beforefn(b);
//            } else {
//                $html.loading(true);
//            }
//        },
//        success: function (d) {
//            successfn(d);
//        },
//        complete: function (c) {
//            if (completefn) {
//                completefn(c);
//            } else {
//                $html.loading(false);
//            }
//        },
//        error: function (e) {
//            errorfn(e);
//        }
//    });
//};



///**************************************datatables.js封装*********************************************/

//// datatables.js 封装
//function dspTable(option) {
//    // 必填参数
//    if (!option.ele || typeof option.ele === "undefined" || !option.ajax || typeof option.ajax === "undefined" || typeof option.scrollY !== "number" || option.scrollY <= 0 || !option.columns || typeof option.columns === "undefined") {
//        return;
//    }

//    // 可选参数
//    if (option.pageLength <= 0) {
//        option.pageLength = 10;
//    }

//    if (typeof option.paging === "") {
//        option.paging = true;
//    }

//    if (typeof option.info === "undefined") {
//        option.info = true;
//    }

//    if (typeof option.ordering === "undefined") {
//        option.ordering = false;
//    }

//    if (typeof option.processing === "undefined") {
//        option.processing = true;
//    }

//    var config = {
//        ajax: option.ajax,
//        language: {
//            "sLengthMenu": "每页显示 _MENU_ 条记录",
//            "sZeroRecords": "抱歉， 没有找到",
//            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
//            "sInfoEmpty": "没有数据",
//            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
//            "processing": "加载中...",
//            "oPaginate": {
//                "sFirst": "首页",
//                "sPrevious": "上一页",
//                "sNext": "下一页",
//                "sLast": "尾页"
//            }
//        },
//        scrollY: option.scrollY,
//        deferRender: true,
//        searching: false,
//        paging: option.paging,
//        ordering: option.ordering,
//        lengthChange: false,
//        serverSide: true,
//        processing: option.processing,
//        info: option.info,
//        pageLength: option.pageLength,
//        columns: option.columns,
//        headerCallback: function (thead, data, start, end, display) {
//            $(thead).css({ "background": "#F7F7F7", "font-size": "16px", "color": "black" });
//        }
//    };

//    if (typeof option.drawCallback === "function") {
//        config.drawCallback = option.drawCallback;
//    }

//    return $(option.ele).DataTable(config);
//}


///*******************************************弹出框封装************************************************/

//// 加载效果
//function Loading(bool) {
//    var ajaxbg = top.$("#loading");
//    top.$("#loading").css("left", (top.$('body').width() - top.$("#loading").width()) / 2);
//    if (bool) {
//        ajaxbg.show();
//    } else {
//        ajaxbg.hide();
//    }
//}

//// Layer提示框 失败
//function warning(content, end) {
//    var options = {
//        content: content,
//        time: 2000,
//        shade: false,
//        skin: 'dspwarning',
//        title: false,
//        closeBtn: 0,
//        btn: false,
//        end: end
//    };
//    return layer.open(options);
//}

//// Layer提示框 成功
//function success(content, end) {
//    var options = {
//        content: content,
//        time: 2000,
//        shade: false,
//        skin: 'dspsuccess',
//        title: false,
//        closeBtn: 0,
//        btn: false,
//        end: end
//    };
//    return layer.open(options);
//}

//// Layer确认框
//function dspconfirm(content, yes, cancel) {
//    options = {
//        btn: ['确定', '取消'],
//        skin: 'dspconfirm',
//        title: false,
//        closeBtn: 0
//    };
//    return layer.confirm(content, options, yes, cancel);
//}

//// Layer弹出框
//function dspLayer(height, ele, end) {
//    return layer.open({
//        type: 1,
//        title: false,
//        closeBtn: 0,
//        move: false,
//        shadeClose: true,
//        area: ['1100px', height + 'px'],
//        skin: 'layui-layer-lan',
//        offset: '5px',
//        shift: 0,
//        content: ele,
//        end: end
//    });
//}

//// Layer弹出框
//function dspSmallLayer(width, height, title, ele, end) {
//    return layer.open({
//        type: 1,
//        title: title,
//        closeBtn: 0,
//        move: false,
//        shadeClose: true,
//        area: [width + 'px', height + 'px'],
//        skin: 'layui-layer-lan',
//        offset: '50px',
//        shift: 0,
//        content: ele,
//        end: end
//    });
//}


///************************************记录操作行为封装 Log记录*****************************************/


//function Log(operationName) {
//    var regex = /\#$/;
//    if (typeof logUri === "undefined") {
//        return;
//    }
//    var url = logUri + "?page=" + html2Escape(location.href).replace(regex, "")
//			+ "&operationName=" + operationName
//    $.ajax({ url: url });
//}

//function html2Escape(sHtml) {
//    return sHtml.replace(/[&]/g, function (c) { return { '&': 'godlike' }[c]; });
//}


//// 获取项目虚拟目录
//var virtual = "";
//function GetVirtual() {
//    try {
//        var currentUrl = window.location.href;
//        var list = currentUrl.replace("http://", "").split("/");
//        if (list.length > 1) {
//            if (list[1] == "iProbe") {
//                virtual = "http://" + list[0] + "/" + list[1];
//            } else {
//                virtual = "http://" + list[0];
//            }
//        }
//        return virtual;
//    } catch (e) { return ""; }
//}

//// Excel导出
//function Export(url, params) {
//    var temp = document.createElement("form");
//    temp.action = url;
//    temp.method = "post";
//    temp.style.display = "none";
//    for (var x in params) {
//        var opt = document.createElement("textarea");
//        opt.name = x;
//        opt.value = params[x];
//        temp.appendChild(opt);
//    }
//    document.body.appendChild(temp);
//    temp.submit();
//}

//// Guid生成
//function Guid() {
//    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//        return v.toString(16);
//    });
//}

//// 获取当前开始时间、结束时间
//function getStartAndEndTime(type, zeroFlag) {
//    var ddStart = new Date();
//    var ddStartMonth = ddStart.getMonth() + 1;
//    var ddStartDay = ddStart.getDate();

//    var ddEnd = new Date(ddStart);
//    var ddEndMonth = ddEnd.getMonth() + 1;
//    var ddEndDay = ddEnd.getDate();
//    var ddEndDayPlus = ddEnd.getDate() + 7;

//    var thisMonthDay = new Date(ddStart.getFullYear(), (ddStart.getMonth() + 1), 0).getDate();
//    if (thisMonthDay < ddEndDayPlus) {    //当前月加7天不存在
//        var diff = 7 - (thisMonthDay - ddStartDay);
//        ddEndMonth = ddEndMonth + 1;
//        ddEndDay = diff;
//        ddEndDayPlus = diff;
//    }

//    if (ddStartMonth < 10) {
//        ddStartMonth = "0" + ddStartMonth;
//    }

//    if (ddStartDay < 10) {
//        ddStartDay = "0" + ddStartDay;
//    }

//    if (ddEndMonth < 10) {
//        ddEndMonth = "0" + ddEndMonth;
//    }

//    if (ddEndDay < 10) {
//        ddEndDay = "0" + ddEndDay;
//    }

//    if (ddEndDayPlus < 10) {
//        ddEndDayPlus = "0" + ddEndDayPlus;
//    }

//    var strStart, strEnd = "";
//    if (type == 1) {
//        strStart = ddStart.getFullYear() + '-' + ddStartMonth + '-' + ddStartDay + " 00:00";
//        strEnd = ddEnd.getFullYear() + '-' + ddEndMonth + '-' + ddEndDayPlus + " 00:00";
//    } else if (type == 2) {
//        strStart = ddStart.getFullYear() + '-' + ddStartMonth;
//        strEnd = ddEnd.getFullYear() + '-' + ddEndMonth;
//    } else if (type == 3) {
//        strStart = ddStart.getFullYear() + '-' + ddStartMonth + '-' + ddStartDay + " 00:00:00";
//        strEnd = ddEnd.getFullYear() + '-' + ddEndMonth + '-' + ddEndDayPlus + " 00:00:00";
//    } else {
//        strStart = ddStart.getFullYear() + '-' + ddStartMonth + '-' + ddStartDay;
//        strEnd = ddEnd.getFullYear() + '-' + ddEndMonth + '-' + ddEndDay;
//    }
//    return [strStart, strEnd];
//}

//// 获取当前时间，格式YYYY-MM-DD
//function getNowFormatDate() {
//    var date = new Date();
//    var seperator = "-";
//    var year = date.getFullYear();
//    var month = date.getMonth() + 1;
//    var strDate = date.getDate();
//    if (month >= 1 && month <= 9) {
//        month = "0" + month;
//    }
//    if (strDate >= 0 && strDate <= 9) {
//        strDate = "0" + strDate;
//    }
//    var currentdate = year + seperator + month + seperator + strDate;
//    return currentdate;
//}

/***********************************************页面按钮统一加载***********************************************************/
//var $html = {
//    hasEdit: false,     //列表 编辑权限 
//    hasDelete: false,   //列表 删除权限
//    btnInit: function (moduleId) {
//        var url = $util.getVirtual() + "/Api/SelectApi/GetButtons";
//        AjaxAsync(url, { moduleId: moduleId }, false,
//            function (res) {
//                if (res.list) {
//                    var toolBtnDiv = $("#main :first.col-md-12 :first");
//                    var list = JSON.parse(res.list);
//                    for (var item in list) {
//                        if (list[item].FullName == "编辑") {
//                            $html.hasDelete = true;
//                        } else if (list[item].FullName == "删除") {
//                            $html.hasEdit = true;
//                        } else {
//                            toolBtnDiv.append($('<a id="' + list[item].DomId + '" class="dspToolBtn"><i class="' + list[item].Icon + '"></i>' + list[item].FullName + '</a>'));
//                        }
//                    }
//                }
//            },
//            function () {

//            })
//    }
//};