//获取cookie，身份认证
var username = getCookie("rt_username");

if (username == "") {
    window.location.replace("RetailerLogin.html");
} else {
    document.getElementById("signoutl").innerHTML = username;
}

//弹出modal，选择订单类型
$("#myModal").modal();


//订单类型选择
var odrType;

$("#ws").click(function () {
    odrType = "ws";
    $(".h5").append("（批发订单）");
    //移除“备货需求时间”
    $("#reqtime").remove();
    //增加“收货人”
    $("#row3").append("<div class='col'>收货人：<span id='rtconta'>张祥意</span></div>");
    //增加“联系电话”
    $("#row3").append("<div class='col'>联系电话：<input type='text' id='phonum'></div>");
    //增加“自提”选项
    $("#picup").prepend("<option value='自提'>自提</option>");
    $("#picup").prepend("<option value='铁运'>铁运</option>");
    $("#picup").prepend("<option value='海运'>海运</option>");
    $("#picup").prepend("<option value='汽运'>汽运</option>");
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
var retailer_id;
function getRetInfo() {
    $.get(
        "http://127.0.0.1/ocp_dev/getRetailerInfo",
        { "retailer_user_name": username },
        function (result) {
            var rtname = result.retailer[0].retailer_name;
            var rtid = result.retailer[0].retailer_id;
            retailer_id = rtid;
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
    "http://127.0.0.1/ocp_dev/getAllWHNameNId",
    function (result) {
        for (var i = 0; i < result.count; i++) {
            $("#whs").append("<option value='" + (i + 1) + "'>" +
                result.warehouse[i].warehouse_name + "</option>");
        }
    }
);



//“增加”按钮
$("#add").click(function () {
    var num = $("tbody#pdout tr:last td:first").text();
    var number = 0;
    if (num != null) {
        var number = Number(num);
    }
    number += 1;
    $("tbody#pdout tr:last").after("<tr id='item'>" +
        "<td id='" + number + "'>" + number + "</td>" +
        "<td id='pid'></td>" +
        "<td id='pname'></td>" +
        "<td id='ptype'></td>" +
        "<td id='pqty'></td>" +
        "<td></td>" +
        "<td id='pprice'></td>" +
        "<td id='pvol'></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td><a href='#' id='del'>删除</a></td>" +
        "</tr>");

    $("tr td").on("mouseenter", "#del", function () {
        $(this).click(function () {
            var pid = $(this).parent().siblings("#pid").text() - 1;

            totalCount -= productJSON.products[pid].product_qty;
            totalVol -= productJSON.products[pid].product_volume;
            totalPrice -= productJSON.products[pid].product_standard_price;

            refreshTableButtom();
            $(this).parents("tr").remove();
        });
    });

    $("tbody#pdout tr").on("mouseenter", "td", function () {
        $(this).click(function () {
            $("#addItem").modal();
        });
    });
});

//“删除”按钮
$("#del").click(function () {
    var pid = $(this).parent().siblings("#pid").text() - 1;

    totalCount -= productJSON.products[pid].product_qty;
    totalVol -= productJSON.products[pid].product_volume;
    totalPrice -= productJSON.products[pid].product_standard_price;

    refreshTableButtom();
    $(this).parents("tr").remove();
});



//单击序号添加产品
$("tr#item td").click(function () {
    $("#addItem").modal();
});


//modal里面表格新增一行
function addNewRow() {
    $("tbody#modl tr:last").after("<tr>" +
        "<td><input type='checkbox'></td>" +
        "<td id='pid'></td>" +
        "<td id='pmod'></td>" +
        "<td id='pname'></td>" +
        "<td id='ptype'></td>" +
        "<td id='pvol'></td>" +
        "<td><a href='#'>查看详情</a></td>" +
        "</tr>");
};

//modal 内表格 删除最后一行
function delRow() {
    $("tbody#modl tr:last").remove();
};

//获取全部产品
var totalCount = 0;
var totalVol = 0;
var totalPrice = 0;
var productJSON;
function getProducts() {
    $.get(
        "http://127.0.0.1/ocp_dev/getAllProducts",
        function (result) {
            productJSON = result;
            for (var i = 0; i < result.products.length; i++) {
                $("tbody#modl tr:last td#pid").html(result.products[i].product_id);
                $("tbody#modl tr:last td#pmod").html(result.products[i].product_model);
                $("tbody#modl tr:last td#pname").html(result.products[i].product_name);
                $("tbody#modl tr:last td#ptype").html(result.products[i].product_type);
                $("tbody#modl tr:last td#pvol").html(result.products[i].product_volume);
                addNewRow();
            }
            delRow();
        }
    );
};

//按下“确认”添加产品详情
function addToTable() {
    var pid = $('input[type=checkbox]:checked').parent().siblings("#pid").text();
    pid--;
    $("tbody#pdout tr:last td#pid").text((pid + 1));
    var pname = productJSON.products[pid].product_name;
    $("tbody#pdout tr:last td#pname").text(pname);
    var ptype = productJSON.products[pid].product_type;
    $("tbody#pdout tr:last td#ptype").text(ptype);
    var pqty = productJSON.products[pid].product_qty;
    $("tbody#pdout tr:last td#pqty").text(pqty);
    var pprice = productJSON.products[pid].product_standard_price;
    $("tbody#pdout tr:last td#pprice").text(pprice);
    var pvol = productJSON.products[pid].product_volume;
    $("tbody#pdout tr:last td#pvol").text(pvol);
    //设置 checkbox 状态为未选中
    $('input[type=checkbox]:checked').prop("checked", false);

    totalCount += pqty;
    totalVol += pvol;
    totalPrice += pprice;

    refreshTableButtom();
}

//刷新表格底部信息
function refreshTableButtom() {
    $("span#totalCount").text(totalCount);
    $("span#totalVol").text(totalVol);
    $("span#totalPrice").text(totalPrice);
}

//分类提交订单
function submitOrder() {
    if (odrType == "sto") {
        submitStockOrder();
    }
    else if (odrType == "ws") {
        submitWSOrder(1);
    }
};

//分类保存订单
function saveOrder() {
    if (odrType == "ws") {
        submitWSOrder(0);
    }
};

//提交备货订单
function submitStockOrder() {
    var invoice_title = "抬头1";
    var out_warehouse_id = $("#whs option:selected").val();
    var in_warehouse_id = 2;
    var period_demand = $("#yy option:selected").val() + '-' + $("#mm option:selected").val() + '-' + $("#dd option:selected").val();
    var remark = $("#rmk").val();
    var products = '';

    var pdcount = $("tbody#pdout tr:last td:first").text();

    for (var i = 0; i < pdcount; i++) {
        var no = i + 1;
        var pid = $("td#" + no).siblings("#pid").text();
        var pqty = productJSON.products[pid - 1].product_qty;
        var iprice = productJSON.products[pid - 1].product_standard_price;
        var ttprice = pqty * iprice;
        var vol = productJSON.products[pid - 1].product_volume;

        products += '{ "product_id":' + pid + ', ';
        products += ' "product_qty":' + pqty + ', ';
        products += ' "invoice_price":' + iprice + ', ';
        products += ' "total_price":' + ttprice + ', ';
        if (i == pdcount - 1) {
            products += ' "volume":' + vol + '}';
        } else {
            products += ' "volume":' + vol + '},';
        }


    }

    var data = '{' +
        '"invoice_title": "' + invoice_title + '",' +
        '"retailer_id": ' + retailer_id + ',' +
        '"out_warehouse_id": ' + out_warehouse_id + ',' +
        '"in_warehouse_id": ' + in_warehouse_id + ',' +
        '"period_demand": "' + period_demand + '",' +
        '"remark": "' + remark + '",' +
        '"productList": [' + products + ']' +
        '}';

    console.log(data);

    $.ajax({
        url: "http://127.0.0.1/ocp_dev/submitStockOrder",
        contentType: "application/json",
        dataType: "json",
        method: "POST",
        data: data,
        success: function (result) {
            if (result.code == 1) {
                $("#subSuc").modal();
            } else {
                alert("失败");
            }
        }
    });
};

//提交批发订单
function submitWSOrder(stat) {
    var invoice_title = "抬头x";
    var out_warehouse_id = $("#whs option:selected").val();
    var phone = $("#phonum").val();
    var pickup_method = $("#picup option:selected").val();
    var remark = $("#rmk").val();
    var products = '';

    var pdcount = $("tbody#pdout tr:last td:first").text();

    for (var i = 0; i < pdcount; i++) {
        var no = i + 1;
        var pid = $("td#" + no).siblings("#pid").text();
        var pqty = productJSON.products[pid - 1].product_qty;
        var iprice = productJSON.products[pid - 1].product_standard_price;
        var ttprice = pqty * iprice;
        var vol = productJSON.products[pid - 1].product_volume;

        products += '{ "product_id":' + pid + ', ';
        products += ' "product_qty":' + pqty + ', ';
        products += ' "invoice_price":' + iprice + ', ';
        products += ' "total_price":' + ttprice + ', ';
        if (i == pdcount - 1) {
            products += ' "volume":' + vol + '}';
        } else {
            products += ' "volume":' + vol + '},';
        }


    }

    var data = '{' +
        '"invoice_title": "' + invoice_title + '",' +
        '"retailer_id": ' + retailer_id + ',' +
        '"out_warehouse_id": ' + out_warehouse_id + ',' +
        '"detail_address": "广东省佛山市顺德区",' +
        '"receiver": "张祥意",' +
        '"phone": "' + phone + '",' +
        '"pickup_method": "' + pickup_method + '",' +
        '"remark": "' + remark + '",' +
        '"status": ' + stat + ',' +
        '"productList": [' + products + ']' +
        '}';

    console.log(data);

    $.ajax({
        url: "http://127.0.0.1/ocp_dev/submitWSOrder",
        contentType: "application/json",
        dataType: "json",
        method: "POST",
        data: data,
        success: function (result) {
            if (result.code == 1) {
                $("#subSuc").modal();
            } else {
                alert("失败");
            }
        }
    });
};