//获取cookie，身份认证
var username = getCookie("rt_username");

if (username == "") {
    window.location.replace("RetailerLogin.html");
} else {
    document.getElementById("signoutl").innerHTML = username;
}

//弹出modal，选择订单类型
$("#myModal").modal();

var odrType;

$("#ws").click(function () {
    odrType = "ws";
    $(".h5").append("（批发订单）");
    //移除“备货需求时间”
    $("#reqtime").remove();
    //增加“收货人”
    $("#row3").append("<div class='col'>收货人：<span id='rtconta'>张祥意</span></div>");
    //增加“联系电话”
    $("#row3").append("<div class='col'>联系电话：<input type='text'></div>");
    //增加“自提”选项
    $("#picup").prepend("<option value='self'>自提</option>");
    //增加“自提地址”
    $("#row4").prepend("<div class='col'>自提地址：<span id='picloc'>广东省佛山市顺德区容桂容边路保供物流园B库</span></div>");
    getRetInfo();
});

$("#sto").click(function () {
    odrType = "sto";
    $(".h5").append("（备货订单）");
    getRetInfo();
});

//获取经销商信息
function getRetInfo() {
    $.get(
        "http://127.0.0.1/ocp_dev/getRetailerInfo",
        { "retailer_user_name": username },
        function (result) {
            var rtname = result.retailer[0].retailer_name;
            var rtid = result.retailer[0].retailer_id;
            var rtstore = result.retailer[0].retailer_store_name;
            var rtarea = result.retailer[0].retailer_area;
            var rtconta = result.retailer[0].retailer_contact_name;

            document.getElementById("rtname").innerHTML = rtname;
            document.getElementById("rtid").innerHTML = rtid;
            document.getElementById("rtstore").innerHTML = rtstore;
            document.getElementById("rtarea").innerHTML = rtarea;
            document.getElementById("rtconta").innerHTML = rtconta;
        }
    );
}




//获取仓库信息
$.get(
    "http://127.0.0.1/ocp_dev/getAllWarehouses",
    function (result) {
        for (var i = 0; i < result.count; i++) {
            $("#whs").append("<option value='" + (i + 1) + "'>" +
                result.warehouse[i].warehouse_name + "</option>")
        }
    }
);

//“增加”按钮
$("#add").click(function () {
    var num = $("tbody tr:last td:first").text();
    var number = 0;
    if (num != null) {
        var number = Number(num);
    }
    number += 1;
    $("tbody tr:last").after("<tr>" +
        "<td>" + number + "</td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td><a href='#' id='del'>删除</a></td>" +
        "</tr>");

    $("tr td").on("mouseenter", "#del", function () {
        $(this).click(function () {
            console.log("1");
            $(this).parents("tr").remove();
        });
    });
});

//“删除”按钮
$("#del").click(function () {
    $(this).parents("tr").remove();
});
