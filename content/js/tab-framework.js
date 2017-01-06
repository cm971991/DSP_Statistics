/**
* jQuery LeaRunUI 4.1
*上海力软信息技术有限公司 Copyright © Learun 2014
*/
/**
加载布局
**/
function Loadlayout() {
    if ($('.layout').length > 0) {
        $("#layout").splitter({
            type: "v",
            outline: true,
            minLeft: 150, sizeLeft: 200, maxLeft: 350,
            anchorToWindow: true,
            accessKey: "L"
        });
    }
}
//Tab标签切换
function Tabchange(id) {
    $('.ScrollBar').find('.tabPanel').hide();
    $('.ScrollBar').find("#" + id).show();
    $(".tab_list_top div").removeClass("actived");
    $(".tab_list_top").find("#Tab" + id).addClass("actived"); //添加选中样式  
}
function thisTabchange(e, id) {
    $(e).parent().find('div').removeClass("actived");
    $(e).addClass("actived");
    $('.tabPanel').hide();
    $("#" + id).show();
}
function standTabchange(e, id) {
    $(e).parent().find('div').removeClass("standtabactived");
    $(e).addClass("standtabactived");
    $(e).parent().next().children('div').hide();
    $("#" + id).show();
}
/*
获取动态tab标签当前iframeID
*/
function tabiframeId() {
    var tabs_container = top.$("#tabs_container");
    return "tabs_iframe_" + tabs_container.find('.selected').attr('id').substr(5);
}
/*
刷新当前页面
*/
function Replace() {
    location.reload();
    return false;
}
//关闭当前tab
function btn_back() {
    top.ThisCloseTab();
}

/*
href跳转页面
*/
function Urlhref(url) {
    location.href = url;
    return false;
}
/*
iframe同步连接
*/
function iframe_src(iframe, src) {
    $html.loading(true);
    $("#" + iframe).attr('src', $util.getVirtual() + src);
    $("#" + iframe).load(function () {
        $html.loading(false);
    });
}

/*打开网页 window.open
/*url:          表示请求路径
/*windowname:   定义页名称
/*width:        宽度
/*height:       高度
---------------------------------------------------*/
function OpenWindow(url, title, w, h) {
    var width = w;
    var height = h;
    var left = ($(window).width() - width) / 2;
    var top = ($(window).height() - height) / 2;
    window.open($util.getVirtual() + url, title, 'height=' + height + ', width=' + width + ', top=' + top + ', left=' + left + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no, titlebar=yes, alwaysRaised=yes');
}
/*鼠标右击菜单begin========================================*/
var getOffset = {
    top: function (obj) {
        return obj.offsetTop + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
    },
    left: function (obj) {
        return obj.offsetLeft + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
    }
};
function LoadrightMenu(element) {
    var oMenu = $('.rightMenu');
    $(document).click(function () {
        oMenu.hide();
    });
    $(document).mousedown(function (e) {
        if (3 == e.which) {
            oMenu.hide();
        }
    })
    var aUl = oMenu.find("ul");
    var aLi = oMenu.find("li");
    var showTimer = hideTimer = null;
    var i = 0;
    var maxWidth = maxHeight = 0;
    var aDoc = [document.documentElement.offsetWidth, document.documentElement.offsetHeight];
    oMenu.hide();
    for (i = 0; i < aLi.length; i++) {
        //为含有子菜单的li加上箭头
        aLi[i].getElementsByTagName("ul")[0] && (aLi[i].className = "sub");
        //鼠标移入
        aLi[i].onmouseover = function () {
            var oThis = this;
            var oUl = oThis.getElementsByTagName("ul");
            //鼠标移入样式
            oThis.className += " active";
            //显示子菜单
            if (oUl[0]) {
                clearTimeout(hideTimer);
                showTimer = setTimeout(function () {
                    for (i = 0; i < oThis.parentNode.children.length; i++) {
                        oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
						(oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                    }
                    oUl[0].style.display = "block";
                    oUl[0].style.top = oThis.offsetTop + "px";
                    oUl[0].style.left = oThis.offsetWidth + "px";

                    //最大显示范围					
                    maxWidth = aDoc[0] - oUl[0].offsetWidth;
                    maxHeight = aDoc[1] - oUl[0].offsetHeight;

                    //防止溢出
                    maxWidth < getOffset.left(oUl[0]) && (oUl[0].style.left = -oUl[0].clientWidth + "px");
                    maxHeight < getOffset.top(oUl[0]) && (oUl[0].style.top = -oUl[0].clientHeight + oThis.offsetTop + oThis.clientHeight + "px")
                }, 300);
            }
        };
        //鼠标移出	
        aLi[i].onmouseout = function () {
            var oThis = this;
            var oUl = oThis.getElementsByTagName("ul");
            //鼠标移出样式
            oThis.className = oThis.className.replace(/\s?active/, "");

            clearTimeout(showTimer);
            hideTimer = setTimeout(function () {
                for (i = 0; i < oThis.parentNode.children.length; i++) {
                    oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
					(oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                }
            }, 300);
        };
    }
    //自定义右键菜单
    $(element).bind("contextmenu", function () {
        var event = event || window.event;
        oMenu.show();
        oMenu.css('top', event.clientY + "px");
        oMenu.css('left', event.clientX + "px");
        //最大显示范围
        maxWidth = aDoc[0] - oMenu.width();
        maxHeight = aDoc[1] - oMenu.height();
        //防止菜单溢出
        if (oMenu.offset().top > maxHeight) {
            oMenu.css('top', maxHeight + "px");
        }
        if (oMenu.offset().left > maxWidth) {
            oMenu.css('left', maxWidth + "px");
        }
        return false;
    }).bind("click", function () {
        oMenu.hide();
    });
}
/*鼠标右击菜单end========================================*/

//自动补全表格
var IndetableRow_autocomplete = 0;
var scrollTopheight = 0;
function autocomplete(Objkey, width, height, data, callBack) {
    if ($('#' + Objkey).attr('readonly') == 'readonly') {
        return false;
    }
    if ($('#' + Objkey).attr('disabled') == 'disabled') {
        return false;
    }
    IndetableRow_autocomplete = 0;
    scrollTopheight = 0;
    var X = $("#" + Objkey).offset().top;
    var Y = $("#" + Objkey).offset().left;
    $("#div_gridshow").html("");
    if ($("#div_gridshow").attr("id") == undefined) {
        $('body').append('<div id="div_gridshow" style="overflow: auto;z-index: 1000;border: 1px solid #A8A8A8;width:' + width + ';height:' + height + ';position: absolute; background-color: #fff; display: none;"></div>');
    } else {
        $("#div_gridshow").height(height);
        $("#div_gridshow").width(width);
    }
    var sbhtml = '<table class="grid" style="width: 100%;">';
    if (data != "") {
        sbhtml += '<tbody>' + data + '</tbody>';
    } else {
        sbhtml += '<tbody><tr><td style="color:red;text-align:center;width:' + width + ';">没有找到您要的相关数据！</td></tr></tbody>';
    }
    sbhtml += '</table>';
    $("#div_gridshow").html(sbhtml);
    $("#div_gridshow").css("left", Y).css("top", X + $('#' + Objkey).height()).show();
    $("#div_gridshow .grid td").css("border-left", "none").css("padding-left", "2px");
    if (data != "") {
        $("#div_gridshow").find('tbody tr').each(function (r) {
            if (r == 0) {
                $(this).addClass('selected');
            }
        });
    }
    $("#div_gridshow").find('tbody tr').click(function () {
        var parameter = "";
        $(this).find('td').each(function (i) {
            parameter += '"' + $(this).attr('id') + '"' + ':' + '"' + $.trim($(this).text()) + '",'
        });
        if ($('#' + Objkey).attr('readonly') == 'readonly') {
            return false;
        }
        if ($('#' + Objkey).attr('disabled') == 'disabled') {
            return false;
        }
        callBack(JSON.parse('{' + parameter.substr(0, parameter.length - 1) + '}'));
        $("#div_gridshow").hide();
    });
    $("#div_gridshow").find('tbody tr').hover(function () {
        $(this).addClass("selected");
    }, function () {
        $(this).removeClass("selected");
    });
    //任意键关闭
    document.onclick = function (e) {
        var e = e ? e : window.event;
        var tar = e.srcElement || e.target;
        if (tar.id != 'div_gridshow') {
            if ($(tar).attr("id") == 'div_gridshow' || $(tar).attr("id") == Objkey) {
                $("#div_gridshow").show();
            } else {
                $("#div_gridshow").hide();
            }
        }
    }
}
//方向键上,方向键下,回车键
function autocompletekeydown(Objkey, callBack) {
    $("#" + Objkey).keydown(function (e) {
        switch (e.keyCode) {
            case 38: // 方向键上
                if (IndetableRow_autocomplete > 0) {
                    IndetableRow_autocomplete--
                    $("#div_gridshow").find('tbody tr').removeClass('selected');
                    $("#div_gridshow").find('tbody tr').each(function (r) {
                        if (r == IndetableRow_autocomplete) {
                            scrollTopheight -= 22;
                            $("#div_gridshow").scrollTop(scrollTopheight);
                            $(this).addClass('selected');
                        }
                    });
                }
                break;
            case 40: // 方向键下
                var tindex = $("#div_gridshow").find('tbody tr').length - 1;
                if (IndetableRow_autocomplete < tindex) {
                    IndetableRow_autocomplete++;
                    $("#div_gridshow").find('tbody tr').removeClass('selected');
                    $("#div_gridshow").find('tbody tr').each(function (r) {
                        if (r == IndetableRow_autocomplete) {
                            scrollTopheight += 22;
                            $("#div_gridshow").scrollTop(scrollTopheight);
                            $(this).addClass('selected');
                        }
                    });
                }
                break;
            case 13:  //回车键
                var parameter = "";
                $("#div_gridshow").find('tbody tr').each(function (r) {
                    if (r == IndetableRow_autocomplete) {
                        $(this).find('td').each(function (i) {
                            parameter += '"' + $(this).attr('id') + '"' + ':' + '"' + $.trim($(this).text()) + '",'
                        });
                    }
                });
                if ($('#' + Objkey).attr('readonly') == 'readonly') {
                    return false;
                }
                if ($('#' + Objkey).attr('disabled') == 'disabled') {
                    return false;
                }
                callBack(JSON.parse('{' + parameter.substr(0, parameter.length - 1) + '}'));
                $("#div_gridshow").hide();
                break;
            default:
                break;
        }
    })
}
/**
树下拉框
Objkey:          ID
width：          宽度
height：         高度
data：           数据
**/
function comboBoxTree(Objkey, height) {
    top.$(".ui_state_highlight").focus();
    var width = $("#" + Objkey).width();
    $("#" + Objkey).css('ime-mode', 'disabled');
    $("#" + Objkey).bind("contextmenu", function () { return false; });
    $("#" + Objkey).keypress(function (e) { return false; });
    if ($('#' + Objkey).attr('readonly') == 'readonly') { return false; }
    if ($('#' + Objkey).attr('disabled') == 'disabled') { return false; }
    var X = $("#" + Objkey).offset().top - 1;
    var Y = $("#" + Objkey).offset().left - 1;
    var comboBoxTree = "comboBoxTree" + Objkey;
    if ($("#" + comboBoxTree).attr("id") == undefined) {
        $('body').append('<div id="' + comboBoxTree + '" style="overflow: auto;border: 1px solid #ccc;border-top:none;width:' + width + 'px;height:' + height + ';position: absolute; background-color: #fff; display: none;"></div>');
    }
    $("#" + comboBoxTree).css("left", Y).css("top", X + $("#" + Objkey).height() + 2).css("z-index", "99").slideDown(100);
    //任意键关闭
    document.onclick = function (e) {
        var e = e ? e : window.event;
        var tar = e.srcElement || e.target;
        if (tar.id != '' + comboBoxTree + '') {
            if ($(tar).hasClass("bbit-tree-ec-icon")) {
                return false;
            }
            if ($(tar).attr("id") == Objkey) {
                return false;
            } else {
                $("#" + comboBoxTree).slideUp(100);
            }
        }
    }
}

//加载操作按钮
function PartialButton(module) {
    var JsonData = "";
    var toolbar_html = "";
    var toolbar_Children_Count = 0;
    getAjax("/Home/Button", "ModuleId=" + module, function (Data) {
        JsonData = eval("(" + Data + ")");
        $.each(JsonData, function (i) {
            if (JsonData[i].ParentId == '0' && JsonData[i].Category == '1') {
                var toolbar_Children_List = Toolbar_Children(JsonData[i].ButtonId, JsonData)
                if (toolbar_Children_Count > 0) {
                    toolbar_html += "<a id=\"" + JsonData[i].Code + "\" ids=\"" + JsonData[i].ButtonId + "\" class=\"tools_btn dropdown\">";
                    toolbar_html += "<div style=\"float: left;\"><div class=\"icon\"><i class=\"" + JsonData[i].Icon + "\" ></i></div><div class=\"text\">" + JsonData[i].FullName + "</div></div>";
                    toolbar_html += "<div class=\"dropdown-icon\"><img src=\"/Content/Template/Images/dropdown-icon.png\" /></div>";
                    toolbar_html += "<div class=\"dropdown-data\"><i></i><span></span>";
                    toolbar_html += "<ul>";
                    toolbar_html += toolbar_Children_List;
                    toolbar_html += "</ul>";
                    toolbar_html += "</div>";
                    toolbar_html += "</a>";
                } else {
                    var title = "title=\"" + JsonData[i].FullName + "\"";
                    if (JsonData[i].FullName == "") { title = ""; }
                    toolbar_html += "<a id=\"" + JsonData[i].Code + "\" ids=\"" + JsonData[i].ButtonId + "\" " + title + " onclick=\"" + JsonData[i].JsEvent + "\" class=\"tools_btn\"><span><i class=\"" + JsonData[i].Icon + "\"></i>" + JsonData[i].FullName + "</b></span></a>";
                }
            }
        });
    });
    $('.tools_bar .PartialButton').prepend(toolbar_html);
    function Toolbar_Children(ButtonId, Data) {
        var _toolbar_Children = "";
        toolbar_Children_Count = 0;
        $.each(Data, function (i) {
            if (Data[i].ParentId == ButtonId) {
                var title = "title=\"" + Data[i].FullName + "\"";
                if (Data[i].FullName == "") { title = ""; }
                _toolbar_Children += "<li id=\"" + Data[i].Code + "\" ids=\"" + Data[i].ButtonId + "\" " + title + " onclick=\"" + Data[i].JsEvent + "\"><i class=\"" + Data[i].Icon + "\" /></i>" + Data[i].FullName + "</li>";
                toolbar_Children_Count++;
            }
        });
        return _toolbar_Children;
    }
    $(".tools_bar .dropdown").hover(function () {
        var left = $(this).offset().left - ($(this).find('.dropdown-data').width() / 2) + ($(this).width() / 2 + 9);
        $(this).find('.dropdown-data').show().css('top', ($(this).offset().top + 50)).css('left', left);
        $(this).find('.dropdown-icon').addClass('dropdown-icon-hover');
        $(this).addClass('dropdown-selected');
    }, function () {
        if (!$(this).hasClass("_click")) {
            $(this).removeClass('dropdown-selected');
            $(this).find('.dropdown-data').hide();
            $(this).find('.dropdown-icon').removeClass('dropdown-icon-hover');
        }
    });
    $('.tools_bar .dropdown').toggle(function () {
        $(this).addClass('_click');
        var left = $(this).offset().left - ($(this).find('.dropdown-data').width() / 2) + ($(this).width() / 2 + 9);
        $(this).find('.dropdown-data').show().css('top', ($(this).offset().top + 50)).css('left', left);
        $(this).find('.dropdown-icon').addClass('dropdown-icon-hover');
        $(this).addClass('dropdown-selected');
    }, function () {
        $(this).removeClass('dropdown-selected');
        $(this).find('.dropdown-data').hide();
        $(this).find('.dropdown-icon').removeClass('dropdown-icon-hover');
        $('.dropdown').removeClass('_click');
    });
    $(".dropdown-data li").click(function () {
        $('.dropdown').removeClass('dropdown-selected');
        $('.dropdown').find('.dropdown-data').hide();
        $('.dropdown').find('.dropdown-icon').removeClass('dropdown-icon-hover');
        $('.dropdown').removeClass('_click');
    });
    //右击菜单Category=2
    var right_toolbar_Count = 0;
    var right_toolbar_html = "";
    right_toolbar_html += '<div class="rightMenu"><ul>';
    $.each(JsonData, function (i) {
        if (JsonData[i].ParentId == '0' && JsonData[i].Category == '2') {
            var title = "title=\"" + JsonData[i].FullName + "\"";
            if (JsonData[i].FullName == "") { title = ""; }
            var righttoolbar_Children_List = right_toolbar_Children(JsonData[i].ButtonId, JsonData)
            if (right_toolbar_Count > 0) {
                right_toolbar_html += "<li id=\"right_" + JsonData[i].Code + "\" ids=\"" + JsonData[i].ButtonId + "\" " + title + " onclick=\"" + JsonData[i].JsEvent + "\" ><img src=\"/Content/Template/Images/" + JsonData[i].Icon + "\" />" + JsonData[i].FullName + righttoolbar_Children_List + "</li>";
            } else {
                right_toolbar_html += "<li id=\"right_" + JsonData[i].Code + "\"  ids=\"" + JsonData[i].ButtonId + "\" " + title + " onclick=\"" + JsonData[i].JsEvent + "\" ><img src=\"/Content/Template/Images/" + JsonData[i].Icon + "\" />" + JsonData[i].FullName + "</li>";
            }
            if (JsonData[i].Split == '1') {
                right_toolbar_html += "<div class=\"m-split\"></div>";
            }
        }
    });
    right_toolbar_html += '</ul></div>';
    function right_toolbar_Children(ButtonId, JsonData) {
        var _right_toolbar = "<ul>";
        right_toolbar_Count = 0;
        $.each(JsonData, function (i) {
            if (JsonData[i].ParentId == ButtonId) {
                var title = "title=\"" + JsonData[i].FullName + "\"";
                if (JsonData[i].FullName == "") { title = ""; }
                _right_toolbar += "<li id=\"right_" + JsonData[i].Code + "\"  ids=\"" + JsonData[i].ButtonId + "\" " + title + " onclick=\"" + JsonData[i].JsEvent + "\" ><img src=\"/Content/Template/Images/" + JsonData[i].Icon + "\" />" + JsonData[i].FullName + "</li>";
                if (JsonData[i].Split == '1') {
                    _right_toolbar += "<div class=\"m-split\"></div>";
                }
                right_toolbar_Count++;
            }
        });
        return _right_toolbar + "</ul>";
    }
    $("body").append(right_toolbar_html);
    if ($('.rightMenu').find('li').length > 0) {
        LoadrightMenu("#grid_List");
    } else {
        $('.rightMenu').remove();
    }
}

//=================动态菜单tab标签========================
function AddTabMenu(tabid, url, name, icon, Isclose, IsReplace, IsVisitorModule) {
    $('#overlay_startmenu').hide();
    $('#start_menu_panel').hide();
    $('#start_menu_panel .nicescroll-rails').show();
    $('.nicescroll-rails').hide();

    if (url == "" || url == "#" || url == $util.getVirtual()) {
        url = $util.getVirtual() + "/Error/Error404";
    }
    //判断url中是否包含http:
    var reg = new RegExp(/^[a-zA-z]+:/);
    if (!reg.test(url)) {
        url = root + url;
    }
    var tabs_container = top.$("#tabs_container");
    var ContentPannel = top.$("#ContentPannel");
    if (IsReplace == 'true' || IsReplace == true) {
        top.RemoveDiv(tabid);
    }
    if (top.document.getElementById("tabs_" + tabid) == null) { //如果当前tabid存在直接显示已经打开的tab
        //$html.loading(true);
        if (!IsVisitorModule) {
            VisitorModule(tabid, name);
        }
        if (tabs_container.find('li').length >= 6) {
            RemoveDiv(tabs_container.find("li:eq(1)").attr("id").replace("tabs_", ""));
        }
        tabs_container.find('li').removeClass('selected');
        ContentPannel.find('iframe').hide();
        if (Isclose != 'false') { //判断是否带关闭tab
            tabs_container.append("<li id=\"tabs_" + tabid
                + "\" class='selected' win_close='true'><span title='" + name
                + "' onclick=\"AddTabMenu('" + tabid + "','" + url + "','" + name + "','true')\"><a><i class='"
                + icon + "' width='16' height='16'></i>" + name
                + "</a></span><i class=\"win_close  fa fa-times\" title=\"关闭当前窗口\" onclick=\"RemoveDiv('" + tabid + "')\"></i></li>");
        } else {
            tabs_container.append("<li id=\"tabs_" + tabid + "\" class=\"selected\" onclick=\"AddTabMenu('" + tabid + "','" + url + "','" + name + "','false')\"><a><i class='" + icon + "' width='16' height='16'></i>" + name + "</a></li>");
        }
        ContentPannel.append("<iframe class=\"tabs_iframe\" id=\"tabs_iframe_" + tabid + "\" name=\"tabs_iframe_" + tabid + "\" height=\"100%\" width=\"100%\" src=\"" + url + "\" frameBorder=\"0\"></iframe>");
        if (tabid === "0") {    //首页加载
            $("#tabs_iframe_" + tabid + "").hide();
            top.document.getElementById("tabs_iframe_" + tabid).style.display = 'block';
        }
    } else {
        if (!IsVisitorModule) {
            VisitorModule(tabid, name);
        }
        tabs_container.find('li').removeClass('selected');
        ContentPannel.find('iframe').hide();
        tabs_container.find('#tabs_' + tabid).addClass('selected');
        top.document.getElementById("tabs_iframe_" + tabid).style.display = 'block';
    }
    $('iframe#' + tabiframeId()).load(function () {
        //$html.loading(false);
    });
    LoadrightMenu(".tab-nav li");
}
//关闭当前tab
function ThisCloseTab() {
    var tabs_container = top.$("#tabs_container");
    top.RemoveDiv(tabs_container.find('.selected').attr('id').substr(5));
}
//全部关闭tab
function AllcloseTab() {
    top.$(".tab-nav").find("[win_close=true]").each(function () {
        RemoveDiv($(this).attr('id').substr(5))
    });
}
//关闭除当前之外的tab
function othercloseTab() {
    var tabs_container = top.$("#tabs_container");
    var id = tabs_container.find('.selected').attr('id').substr(5);
    top.$(".tab-nav").find("[win_close=true]").each(function () {
        if ($(this).attr('id').substr(5) != id) {
            RemoveDiv($(this).attr('id').substr(5))
        }
    });
}
//关闭事件
function RemoveDiv(obj) {
    $html.loading(false);
    var tabs_container = top.$("#tabs_container");
    var ContentPannel = top.$("#ContentPannel");
    var ModuleId = tabs_container.find('.selected').attr('id').substr(5); //原来ID
    var ModuleName = tabs_container.find('.selected').find('span').attr('title'); //原来名称
    SetLeave(ModuleId, ModuleName);
    if (obj != "0") {
        tabs_container.find("#tabs_" + obj).remove();
        ContentPannel.find("#tabs_iframe_" + obj).remove();
    }
    var tablist = tabs_container.find('li');
    var pannellist = ContentPannel.find('iframe');
    if (tablist.length > 0) {
        tablist[tablist.length - 1].className = 'selected';
        pannellist[tablist.length - 1].style.display = 'block';
        var id = tabs_container.find('.selected').attr('id').substr(5);
        VisitorModule(id);
    } else {
        AddTabMenu('0', '/Home/DataStatistics', '首页', "fa fa-home", true);
    }
}
//访问模块，写入系统菜单Id
function VisitorModule(ModuleId, ModuleName) {
    top.$("#ModuleId").val(ModuleId);
    //getAjax("/Home/SetModuleId", { ModuleId: ModuleId, ModuleName: ModuleName }, function (data) { })
}
//离开模块
function SetLeave(ModuleId, ModuleName) {
    //getAjax("/Home/SetLeave", { ModuleId: ModuleId, ModuleName: ModuleName }, function (data) { })
}
