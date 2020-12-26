//获取cookie，身份认证
var username = getCookie("rt_username");

if (username == "") {
    window.location.replace("RetailerLogin.html");
} else {
    document.getElementById("signoutl").innerHTML = username;
}

//获取经销商信息
var page = "http://127.0.0.1/ocp_dev/getRetailerInfo";

$.get(
    page,
    { "retailer_user_name": username },
    function (result) {
        var rtname = result.retailer[0].retailer_name;
        var rtid = result.retailer[0].retailer_id;
        var rtstore = result.retailer[0].retailer_store_name;
        var rtarea = result.retailer[0].retailer_area;

        document.getElementById("rtname").innerHTML = rtname;
        document.getElementById("rtid").innerHTML = rtid;
        document.getElementById("rtstore").innerHTML = rtstore;
        document.getElementById("rtarea").innerHTML = rtarea;
    }
);

//获取仓库信息
$.get(
    "http://127.0.0.1/ocp_dev/getAllWarehouses",
    function (result) {
        for (var i=0; i<result.count; i++) {
            $("#whs").append("<option value='"+(i+1)+"'>"+
            result.warehouse[i].warehouse_name+"</option>")
        }
    }
);

//弹出modal
$("#myModal").modal();

var odrType;

$("#ws").click(function(){
    odrType = "ws";
    $(".h5").append("（批发订单）");
});

$("#sto").click(function(){
    odrType = "sto";
    $(".h5").append("（备货订单）");
});

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

        $("tr td").on("mouseenter", "#del", function() {
            $(this).click(function () {
                console.log("1");
                $(this).parents("tr").remove();
            });
        });
});

//“删除”按钮
$("#del").click(function () {
    console.log("1");
    $(this).parents("tr").remove();
});
