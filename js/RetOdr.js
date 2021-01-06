//获取cookie，身份认证
var username = getCookie("rt_username");

if (username == "") {
    window.location.replace("RetailerLogin.html");
} else {
    document.getElementById("signoutl").innerHTML = username;
}


//增加一行
function addRow() {
    var num = $("tbody#pdout tr:last td:first").text();
    var number = 0;
    if (num != null) {
        var number = Number(num);
    }
    number += 1;

    $("tbody#pdout tr:last").after('<tr id="item">' +
        '<td id="' + number + '">' + number + '</td>' +
        '<td id="source"></td>' +
        '<td id="rtname"></td>' +
        '<td id="store"></td>' +
        '<td id="odrstatus"></td>' +
        '<td id="shpstatus"></td>' +
        '<td id="odrdate"></td>' +
        '<td id="paidate"></td>' +
        '<td id="shipdate"></td>' +
        '<td id="odrprice"></td>' +
        '<td id="actprice"></td>' +
        '<td id="weight"></td>' +
        '<td id="freight"></td>' +
        '<td id="addr"></td>' +
        '<td id="recname"></td>' +
        '<td id="phone"></td>' +
        '<td id="expco"></td>' +
        '<td id="expno"></td>' +
        '</tr>');
};

//删除最后一行
function delLastRow() {
    $("tbody#pdout tr:last").remove();
};


//判断订单状态
function getStatus(num) {
    var status = '';

    switch (num) {
        case 0:
            status = '打开';
            break;
        case 1:
            status = '关闭';
            break;
        case 2:
            status = '取消';
            break;
        case 3:
            status = '完成';
            break;
    }

    return status;
};

//判断发货状态
function getShipStatus(num) {
    var status = '';

    switch (num) {
        case 0:
            status = '待发货';
            break;
        case 1:
            status = '待收货';
            break;
        case 2:
            status = '已收货';
            break;
    }

    return status;
};

//获取订单
function getRetailerOdr() {
    $.get(
        "http://127.0.0.1/ocp_dev/getRetailOrderRtr",
        { "rtlog_user_name": username },
        function (result) {
            for (var i = 0; i < result.retail_order.length; i++) {
                var order = result.retail_order;
                $("tbody#pdout tr:last td#source").html(order[i].rto_source_website);
                $("tbody#pdout tr:last td#rtname").html(result.retailer_name);
                $("tbody#pdout tr:last td#store").html(order[i].rto_source_store);
                $("tbody#pdout tr:last td#odrstatus").html(getStatus(order[i].rto_order_status));
                $("tbody#pdout tr:last td#shpstatus").html(getShipStatus(order[i].rto_shipment_status));
                $("tbody#pdout tr:last td#odrdate").html(order[i].rto_order_date.slice(0, 10));
                $("tbody#pdout tr:last td#paidate").html(order[i].rto_paid_date.slice(0, 10));
                $("tbody#pdout tr:last td#shipdate").html(order[i].rto_shipment_date.slice(0, 10));
                $("tbody#pdout tr:last td#odrprice").html(order[i].rto_order_price);
                $("tbody#pdout tr:last td#actprice").html(order[i].rto_actually_paid);
                $("tbody#pdout tr:last td#weight").html(order[i].rto_weight);
                $("tbody#pdout tr:last td#freight").html(order[i].rto_freight);
                $("tbody#pdout tr:last td#addr").html(order[i].rto_shipping_address);
                $("tbody#pdout tr:last td#recname").html(order[i].rto_receiver_name);
                $("tbody#pdout tr:last td#phone").html(order[i].rto_receiver_phone);
                $("tbody#pdout tr:last td#expco").html(order[i].rto_express_company);
                $("tbody#pdout tr:last td#expno").html(order[i].rto_express_number);

                addRow();
            }
            delLastRow();
        }
    );
};