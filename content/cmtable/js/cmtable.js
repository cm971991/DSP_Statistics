; (function ($, window, document, undefined) {

    /************************表格类、方法*******************************/
    var Table = function (el, opt) {
        this.$element = el,
        this.defaults = {
            'validate': false,
            'columns': [],
            'toolbtns': [
               { id: "btnSave", type: "confirm", text: "确定" },
               { id: "btnCancel", type: "cancel", text: "取消" },
            ]
        },
        this.options = $.extend({}, this.defaults, opt)
    }
    //定义haorooms的方法
    Table.prototype = {
        // 创建表格
        CreateTable: function () {
            var cmObj = {
                // 创建表格
                CreateTableTr: function (option) {
                    var table = $('<table class="table table-hover table-bordered cmtable"></table>');

                    var column = option.columns;
                    var trLength = column.length;
                    var i = 0;
                    for (i ; i < trLength; i++) {
                        var input = [], alertEle = [];
                        var tr = $('<tr class="tdbg"></tr>');                                                      //行（存在2个单元格）
                        var descTd = $('<td class="td-title"><strong>' + column[i].desc + '：</strong></td>');   //描述的单元格
                        var inputTd = $('<td colspan="3" class="td-content"></td>');                               //输入框的单元格

                        switch (column[i].type) {
                            case this.InputType(0):
                                input = this.InputDefault(column[i]);
                                break;
                            case this.InputType(1):
                                input = this.InputDefault(column[i]);
                                break;
                            case this.InputType(2):
                                input = $('<select id="' + column[i].id + '" class="form-control"></select>');
                                //disable
                                if (Table.prototype.IsBoolean(column[i].disabled) && column[i].disabled == true) {
                                    input.attr("disabled", true);
                                }
                                //判断下拉框数据来源
                                if (Table.prototype.IsBoolean(column[i].client) && column[i].client) {   //客户端绑定 参数option[]
                                    for (var j = 0; j < length; j++) {

                                    }
                                } else {     //发起AJax后端绑定
                                    cmObj.AjaxGetSelect(column[i].url, input, inputTd, descTd, tr, table);
                                }
                                break;
                            case this.InputType(3):    //时间控件 依赖My97DatePicker
                                input = $('<input type="text" id="' + column[i].id + '" class="form-control" ' + column[i].event + '="' + column[i].fn + '" />');
                                break;
                            case this.InputType(4):
                                input = $('<textarea id="' + column[i].id + '" class="form-control" rows="' + column[i].rows + '" placeholder="' + (Table.prototype.IsNullOrEmpty(column[i].placeholder) ? column[i].desc : column[i].placeholder) + '"></textarea>');
                                break;
                            case this.InputType(5):    //上传控件 
                                input = $('<input type="file" id="' + column[i].id + '"  class="form-control">');
                                if (Table.prototype.IsArray(column[i].hideDom)) {
                                    var hideImg = $('<image id="' + column[i].hideDom.id + '" />');
                                    if (Table.prototype.IsBoolean(column[i].hideDom.visible) && column[i].hideDom.visible == false) {
                                        hideImg.hide();
                                    }

                                    //className
                                    if (!Table.prototype.IsNullOrEmpty(column[i].className)) {
                                        input.addClass(column[i].className);
                                    }
                                }
                                inputTd.append(input, hideImg);
                                tr.append(descTd, inputTd);
                                table.append(tr);
                                break;
                            case this.InputType(6):
                                if (Table.prototype.IsArray(column[i].group)) {
                                    var groups = column[i].group;
                                    var radioInpt = "";
                                    var appendDom = [];
                                    for (var j = 0; j < groups.length; j++) {
                                        radioInpt = $("<input>", { type: 'radio', id: groups[j].id, name: groups[j].name });

                                        if (Table.prototype.IsArray(groups[j].attribute)) {
                                            radioInpt.attr(groups[j].attribute[0], groups[j].attribute[1]);
                                        }

                                        if (Table.prototype.IsBoolean(groups[j].checked) && groups[j].checked == true) {
                                            radioInpt.attr("checked", true);
                                        }
                                        //className
                                        if (!Table.prototype.IsNullOrEmpty(groups[j].className)) {
                                            radioInpt.addClass(groups[j].className);
                                        }

                                        inputTd.append(radioInpt);

                                        if (!Table.prototype.IsNullOrEmpty(groups[j].appendDom)) {
                                            inputTd.append(groups[j].appendDom)
                                        }
                                    }
                                    //告警框
                                    if (Table.prototype.IsArray(column[i].alert)) {
                                        alertEle = cmObj.CreateAlert(column[i].alert);
                                    }

                                    inputTd.append(alertEle);
                                    tr.append(descTd, inputTd);
                                    table.append(tr);
                                }
                                break;
                            case this.InputType(7):
                                input = $('<image id="' + column[i].id + '" />');
                                inputTd.append(input);
                                if (!Table.prototype.IsNullOrEmpty(column[i].appendDom)) {
                                    inputTd.append(column[i].appendDom)
                                }
                                //告警框
                                if (Table.prototype.IsArray(column[i].alert)) {
                                    alertEle = cmObj.CreateAlert(column[i].alert);
                                }
                                inputTd.append(alertEle);
                                tr.append(descTd, inputTd);
                                table.append(tr);
                                break;
                            case this.InputType(8):
                                var btnClass = "btn btn-primary";
                                if (column[i].className) {
                                    btnClass = column[i].className;
                                }
                                input = $('<button id="' + column[i].id + '"  class="' + btnClass + '" >' + (Table.prototype.IsNullOrEmpty(column[i].placeholder) ? column[i].desc : column[i].placeholder) + '</button>');
                                break;
                            case this.InputType(9):
                                input = $('<div id="' + column[i].id + '"  class="col-md-12" ></div>');
                                break;
                            case this.InputType(10):
                                input = $('<span id="' + column[i].id + '" class="form-control" placeholder="' + (Table.prototype.IsNullOrEmpty(column[i].placeholder) ? column[i].desc : column[i].placeholder) + '"></span>');
                                break;
                            case this.InputType(11):
                                input = $('<ul id="' + column[i].id + '"></ul>');
                                break;
                            case this.InputType(12):
                                input = $('<table id="' + column[i].id + '" class="' + column[i].className + '"></table>');
                                break;
                            default:    //默认类型为Text
                                input = $('<input type="text" id="' + column[i].id + '" class="form-control" placeholder="' + (Table.prototype.IsNullOrEmpty(column[i].placeholder) ? column[i].desc : column[i].placeholder) + '"/>');
                                break;
                        }

                        if (column[i].type != "select" && column[i].type != "file" && column[i].type != "radio" && column[i].type != "image") {
                            //告警框
                            if (Table.prototype.IsArray(column[i].alert)) {
                                alertEle = cmObj.CreateAlert(column[i].alert);
                            }
                            //验证
                            if (Table.prototype.IsArray(column[i].validate)) {
                                input.attr({ "cvalidate": "yes", "cexpression": column[i].validate.expression, "err": column[i].desc });
                            }

                            //disable
                            if (Table.prototype.IsBoolean(column[i].disabled) && column[i].disabled == true) {
                                input.attr("disabled", true);
                            }

                            //readonly
                            if (Table.prototype.IsBoolean(column[i].readonly) && column[i].readonly == true) {
                                input.attr("readonly", true);
                            }

                            //className
                            if (!Table.prototype.IsNullOrEmpty(column[i].className)) {
                                input.addClass(column[i].className);
                            }

                            inputTd.append(input, alertEle);
                            tr.append(descTd, inputTd);
                            table.append(tr);
                        }

                        // 表格行
                        if (Table.prototype.IsBoolean(column[i].visible) && column[i].visible == false) {    //是否显示 visible：false 隐藏
                            tr.hide();
                        }

                        if (!Table.prototype.IsNullOrEmpty(column[i].trId)) {    //是否有ID字段
                            tr.attr("id", column[i].trId);
                        }
                    }
                    return table;
                },
                // 创建工具行
                CreateToolTr: function (html, ele, option) {
                    //var dom = option.dom;     //传入的容器
                    var tableTr = $('<div class="cmTableTr"></div>').append(html);  //将Table放入tableTr中
                    var toolTr = $('<div class="cmButtonTr"></div>');

                    var column = option.toolbtns;
                    var trLength = column.length;
                    var i = 0;
                    for (i; i < trLength; i++) {
                        switch (column[i].type) {
                            case "confirm":
                                toolTr.append($('<button class="btn btn-primary" id="' + column[i].id + '">' + column[i].text + '</button>'));
                                break;
                            case "cancel":
                                toolTr.append($('<button class="btn btn-default btnRight" id="' + column[i].id + '">' + column[i].text + '</button>'));
                                break;
                            default:    //默认为取消按钮
                                toolTr.append($('<button class="btn btn-default btnRight" id="' + column[i].id + '">' + column[i].text + '</button>'));
                                break;
                        }
                    }
                    return ele.append(tableTr, toolTr);
                },
                // 创建警告框
                CreateAlert: function (alert) {
                    return $('<div class="' + alert.className + '" role="alert">' + alert.text + '</div>');
                },
                // ajax下拉框同步请求 
                AjaxGetSelect: function (url, input, inputTd, descTd, tr, table) {
                    $.ajax({
                        type: "post",
                        async: false,
                        url: url,
                        dataType: "json",
                        success: function (d) {
                            input.append(d.list);
                            inputTd.append(input);
                            tr.append(descTd, inputTd);
                            table.append(tr);
                        },
                        error: function () {
                            console.log("get select error");
                        }
                    });
                },
                // 获取输入框类型
                InputType: function (type) {
                    var input = ['text', 'password', 'select', 'datetime', 'textarea', 'file', 'radio', 'image', 'button', 'div', 'span', 'ul', 'table'];
                    return input[type];
                },
                // 获取默认类型输入框
                InputDefault: function (col) {
                    return $('<input type="' + col.type + '" id="' + col.id + '" class="form-control" placeholder="' + col.desc + '" value="" />');
                }
            }
            return cmObj.CreateToolTr(cmObj.CreateTableTr(this.options), this.$element, this.options);
        },
        // 是否是数组
        IsArray: function (val) {
            return typeof val === "object" || Array == val;
        },
        // 是否是字符串
        IsString: function (val) {
            return typeof val === "string" || String == val;
        },
        // 是否是布尔值
        IsBoolean: function (val) {
            return typeof val === "boolean";
        },
        // 是否为空
        IsNullOrEmpty: function (val) {
            return val == undefined || val == "" || val == 'null';
        },
    };
    /******************************End******************************************/


    /************************验证类、方法*******************************/

    var verify = function (el) {
        this.$element = el;
    }

    verify.prototype = {
        Validate: function () {
            var validateMsg = "";
            var validateFlag = true;
            var ele = this.$element;
            var verifyObj = this;
            ele.find("[cvalidate=yes]").each(function () {
                if ($(this).attr("cexpression") != undefined && ($(this).css("display") != "none" && $(this).parent().css("display") != "none" && $(this).parent().parent().css("display") != "none") && $(this).attr("disabled") != "disabled") {
                    var methodObj = verifyObj.ToolMethods();
                    var value = $(this).val();
                    switch ($(this).attr("cexpression")) {
                        case "NotNull":
                            if (!methodObj.NotNull(value)) {
                                validateMsg = $(this).attr("err") + "不能为空！\n";
                                validateFlag = false;
                                $html.warning(validateMsg); return false;
                            }
                            break;
                        case "IsPhone":
                            if (!methodObj.IsPhone(value)) {
                                validateMsg = $(this).attr("err") + "格式不正确！\n";
                                validateFlag = false;
                                $html.warning(validateMsg); return false;
                            }
                            break;
                        case "IsNum":
                            if (!methodObj.IsNum(value)) {
                                validateMsg = $(this).attr("err") + "必须为正整数！\n";
                                validateFlag = false;
                                $html.warning(validateMsg); return false;
                            }
                            break;
                        default:
                            break;
                    };
                }
            });
            if (validateMsg.length > 0) {
                return validateFlag;
            }
            return validateFlag;
        },
        ToolMethods: function () {
            var obj = {
                NotNull: function (val) {
                    var cval = $.trim(val);
                    if (cval.length == 0 || cval == null || cval == undefined) {
                        return false;
                    }
                    else {
                        return true;
                    }
                },
                IsPhone: function (val) {
                    var reg = /^1[3|4|5|7|8]\d{9}$/;
                    if (!reg.test(val)) {
                        return false;
                    } else {
                        return true;
                    }
                },
                IsNum: function (val) {
                    var reg = /^\+?[1-9][0-9]*$/;
                    if (!reg.test(val)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            };
            return obj;
        }
    };

    /******************************End******************************************/

    $.fn.cmTable = function (options) {
        var table = new Table(this, options);
        return table.CreateTable();
    }
    $.fn.cmValidate = function () {
        var ver = new verify(this);
        return ver.Validate();
    }
})(jQuery, window, document);
