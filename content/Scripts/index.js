$(document).ready(function () {
    AddTabMenu('0', '/Home/DataStatistics', '首页', "fa fa-home", 'false');
    ServerCurrentTime();
    InitializeImpact();
    GetAccordionMenu();
    $(".popup li").click(function () {
        linkAddTabMenu()
    });
    $(".submenu a").hover(function () {
        $(".submenu a").removeClass("mtree-hover");
        $(this).addClass("mtree-hover");
    });
    $(".submenu a").on("click", function () {
        $(".submenu a").removeClass("mtree-active");
        $(this).addClass("mtree-active");
    });
});

//menu菜单折叠展开
$(".pull-menu").on("click", function () {
    $util.log("首页-菜单折叠");
    var statu = $(this).attr("data-menu");

    //展开---关闭
    if (statu == "open") {
        //更改tip提示
        $(this).attr("data-original-title", "展开菜单");

        //点击按钮位移，menu样式变化
        $(".navigation,.div-logo-title").animate({ width: 50, paddingLeft: 0 }, 300).addClass("close-menu");
        $(".div-logo-title .div-title img").css({ "width": "36px", "height": "32px", "margin-left": "5px" });
        //更改按钮方法值
        $(this).attr("data-menu", "close");

        //menu菜单tip提示激活
        $('#accordion [data-toggle="tooltip"]').tooltip();

        $("#accordion").children("li").each(function (i, e) {
            if ($(this).hasClass("open")) {
                $(this).removeClass("open");
                $(this).children("ul").slideToggle();
            }
        });
    } else {
        $(this).attr("data-original-title", "收缩菜单");
        //点击按钮位移，menu样式变化
        $(".navigation").animate({ width: 203, paddingLeft: 0 }, 300).removeClass("close-menu");
        $(".div-logo-title .div-title img").css({ "width": "40px", "height": "36px", "margin-left": "0px" });
        $(".div-logo-title").css({ "padding-left": "11px", "width": "203px" }).removeClass("close-menu");
        //更改按钮方法值
        $(this).attr("data-menu", "open");

        //menu菜单tip提示关闭
        $('#accordion [data-toggle="tooltip"]').tooltip('destroy');
    }
})

//服务器当前时间
function ServerCurrentTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var date = now.getDate();
    var day = now.getDay();
    var hour = now.getHours();
    var minu = now.getMinutes();
    var sec = now.getSeconds();
    var week;
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    week = arr_week[day];
    var time = "";
    time = year + "年" + month + "月" + date + "日" + " " + hour + ":" + minu + ":" + sec;
    $("#currentTime").text(time);
    var timer = setTimeout("ServerCurrentTime()", 1000);
}

//导航一级菜单
var accordionJson = [];
function GetAccordionMenu() {
    var html = "";
    $request.ajaxPost(getMenuUrl, {},
        function (data) {
            accordionJson = data.list;
            $.each(accordionJson, function (i) {
                if (accordionJson[i].ParentId == '0') {
                    html += "<li>";
                    html += "<a href=\"#\" class=\"link\"  data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"" + accordionJson[i].FullName + "\" data-container=\"div.mainPannel\" data-trigger=\"hover\"><i class='" + accordionJson[i].Icon + "'></i>";
                    html += "<span>" + accordionJson[i].FullName + "</span><i class=\"fa fa-angle-left pull-right\"></i>";
                    html += "</a>";
                    html += GetSubmenu(accordionJson[i].ModuleId, "submenu b-children", false);
                    html += "</li>";
                }
            });
            $("#accordion").append(html);

            //手风琴效果
            var Accordion = function (el, multiple) {
                this.el = el || {};
                this.multiple = multiple || false;
                var links = this.el.find('.link');
                links.on('click', { el: this.el, multiple: this.multiple }, this.dropdown)
            }
            Accordion.prototype.dropdown = function (e) {
                //计算高度
                var accordionheight = ($("#accordion").children("ul li").length * 60);
                var navigationheight = $(".navigation").height();
                $('#accordion li').children('.b-children').height(navigationheight - accordionheight - 1);
                $(this).next().slideToggle();
                $(this).parent().toggleClass('open');
                if (!e.data.multiple) {
                    $(this).parent().parent().find('.submenu,.secmenu').not($(this).next()).slideUp().parent().removeClass('open');
                };
            }
            var accordion = new Accordion($('#accordion'), false);

            //默认第一个展开
            $("#accordion li:first").find('a:first').trigger("click").find(".submenu li:first").trigger("click");
        }, function () {
            console.log("获取权限列表失败");
        });
}

//导航子菜单
function GetSubmenu(ModuleId, _class, isRecursion) {
    var submenu = "<ul class=\"" + _class + "\" >";
    $.each(accordionJson, function (i) {
        if (accordionJson[i].ParentId == ModuleId) {
            //判断是否有子节点
            if (IsBelowMenu(accordionJson[i].ModuleId) > 0) {
                submenu += "<li class=\"secmenu-parent\" title=" + accordionJson[i].FullName + ">";
                submenu += "<a class=\"link\" data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"" + accordionJson[i].FullName + "\" data-container=\"div.mainPannel\" data-trigger=\"hover\" onclick=\"ChangeIcon(this,false)\" style=\"padding-left: 40px;border-bottom: 1px solid #dedede;\">";
                submenu += "<img class=\"coin22\" src='../Content/img/index/coin222.png' style=\"display: block;left: 35px;top: 0;\">";
                submenu += "<img class=\"coin11\" src='../Content/img/index/coin111.png' style=\"display: none;left: 35px;top: 0;\">";
                submenu += "<span style=\"margin-left:24px\">" + accordionJson[i].FullName + "</span><i class=\"fa fa-angle-left pull-right\"></i>";
                submenu += "</a>";
                submenu += GetSubmenu(accordionJson[i].ModuleId, "secmenu c-children", true)
                submenu += "</li>";
            }
            else {
                if (!isRecursion) {
                    submenu += "<li class=\"hover-li\" title=" + accordionJson[i].FullName + " onclick=\"AddTabMenu('" + accordionJson[i].ModuleId + "', '" + accordionJson[i].Location + "', '" + accordionJson[i].FullName + "',  '" + accordionJson[i].Icon + "','true');ChangeIcon(this,true)\">";
                    submenu += "<a data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"" + accordionJson[i].FullName + "\" data-container=\"div.mainPannel\" data-trigger=\"hover\" style=\"padding-left: 40px;\">";
                    submenu += "<img class=\"coin22\" src='../Content/img/index/coin222.png' style=\"display: block;left: 35px;top: 0;\">";
                    submenu += "<img class=\"coin11\" src='../Content/img/index/coin111.png' style=\"display: none;left: 35px;top: 0;\">";
                    submenu += "<span style=\"margin-left:24px\">" + accordionJson[i].FullName + "</span>";
                    submenu += "<div class=\"arrow-left\" style=\"display:none;position:absolute;right:0;top:0;\"></div>";
                    submenu += "</a></li>";
                } else {
                    submenu += "<li class=\"hover-li\" title=" + accordionJson[i].FullName + " onclick=\"AddTabMenu('" + accordionJson[i].ModuleId + "', '" + accordionJson[i].Location + "', '" + accordionJson[i].FullName + "',  '" + accordionJson[i].Icon + "','true');ChangeIcon(this,true)\">";
                    submenu += "<a data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"" + accordionJson[i].FullName + "\" data-container=\"div.mainPannel\" data-trigger=\"hover\" style=\"padding-left: 60px;\">";
                    submenu += "<img class=\"coin22\" src='../Content/img/index/coin222.png' style=\"display: block;left: 55px;top: 0;\">";
                    submenu += "<img class=\"coin11\" src='../Content/img/index/coin111.png' style=\"display: none;left: 55px;top: 0;\">";
                    submenu += "<span style=\"margin-left:24px\">" + accordionJson[i].FullName + "</span>";
                    submenu += "<div class=\"arrow-left\" style=\"display:none;position:absolute;right:0;top:0;\"></div>";
                    submenu += "</a></li>";
                }
            }
        }
    });
    submenu += "</ul>";
    return submenu;
}

//判断是否有子节点
function IsBelowMenu(ModuleId) {
    var count = 0;
    $.each(accordionJson, function (i) {
        if (accordionJson[i].ParentId == ModuleId) {
            count++;
            return false;
        }
    });
    return count;
}

//初始化界面UI效果
function InitializeImpact() {
    //设置自应高度
    resizeU();
    $(window).resize(resizeU);
    function resizeU() {
        var divkuangH = $(window).height();
        $(".mainPannel").height(divkuangH - 50);
        $(".navigation").height(divkuangH - 50);
        $("#ContentPannel").height(divkuangH - 50);
    }
}

//点击菜单图标改变
function ChangeIcon(obj, islast) {
    $(".arrow-left").hide();
    $('.coin11').hide();
    $('.coin22').show();

    $(obj).find('.coin22').hide();
    $(obj).find('.coin11').show();
    $(obj).find('.arrow-left').show();
}

//点击菜单连接（隐藏导航菜单）
function linkAddTabMenu() {
    //点击Tab事件
    $('#tabs_container li').click(function () {
        var id = $(this).attr('id');
        if (id == 'tabs_Imain') {
            $('.btn-nav-toggle').attr('disabled', 'disabled');
            //点击首页（显示导航菜单）
            $(".navigation").css('position', '');
            $(".navigation").css('width', '204');
            $('.accordion').show();
            $('.btn-nav-toggle').addClass('harvest');
            $('.btn-nav-toggle').find('b').hide();
            $('.btn-nav-toggle').find('i').show();
            $('.btn-nav-toggle').attr('title', '');
        }
    });
}

$("ul.dropdown-menu").on("click", "[data-stopPropagation]", function (e) {
    e.stopPropagation();
});

// 退出登录
function evtOnLogOut() {
    $util.log("首页-退出登录");
    var closeIndex = $html.dspconfirm('亲，确定退出吗?',
        function (index) {
            $request.ajaxPost(doLogOutUrl, {},
                  function (data) {
                      location.href = data.u;
                  },
                  function () { });
            layer.close(closeIndex);
        }, function () {
            layer.close(closeIndex);
        });
}