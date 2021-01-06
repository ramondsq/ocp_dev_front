//获取cookie，身份认证
var username = getCookie("rt_username");

if (username == "") {
    window.location.replace("RetailerLogin.html");
} else {
    document.getElementById("signoutl").innerHTML = username;
};



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
        '<td id="date"></td>' +
        '<td id="num"></td>' +
        '<td id="type"></td>' +
        '<td id="status"></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td id="rmk"></td>' +
        '<td id="reason"></td>' +
        '<td>' +
        '    <a href="" id="subOdr">提交</a>' +
        '    <a href="">编辑</a>' +
        '    <a href="">详情</a>' +
        '    <a href="">取消</a>' +
        '</td>' +
        '</tr>');

    //事件重绑定
    $("tr td").on("mouseenter", "#subOdr", function () {
        $(this).click(function () {
            event.preventDefault();
            var odnum = $(this).parent().siblings("#num").text();
            subOdrToRev(odnum);
        });
    });
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
            status = '待处理';
            break;
        case 1:
            status = '待初审';
            break;
        case 2:
            status = '待复核';
            break;
        case 3:
            status = '已通过';
            break;
        case 4:
            status = '已驳回';
            break;
    }

    return status;
};



//获取所有订单
function getList() {
    var name = '经销商' + username.charAt(8);
    $.get(
        "http://127.0.0.1/ocp_dev/getOrders",
        { "rtlog_user_name": name },
        function (result) {

            for (var i = 0; i < result.stock_order.length; i++) {
                var type = "备货订单";
                $("tbody#pdout tr:last td#date").html(result.stock_order[i].sto_submit_datetime.slice(0, 10));
                $("tbody#pdout tr:last td#num").html(result.stock_order[i].sto_order_number);
                $("tbody#pdout tr:last td#type").html(type);
                $("tbody#pdout tr:last td#status").html(getStatus(result.stock_order[i].sto_status));
                $("tbody#pdout tr:last td#rmk").html(result.stock_order[i].sto_remark);
                $("tbody#pdout tr:last td#reason").html(result.stock_order[i].sto_reason);

                addRow();
            }

            for (var i = 0; i < result.wholesale_order.length; i++) {
                var type = "批发订单";
                $("tbody#pdout tr:last td#date").html(result.wholesale_order[i].wso_submit_datetime.slice(0, 10));
                $("tbody#pdout tr:last td#num").html(result.wholesale_order[i].wso_order_number);
                $("tbody#pdout tr:last td#type").html(type);
                $("tbody#pdout tr:last td#status").html(getStatus(result.wholesale_order[i].wso_status));
                $("tbody#pdout tr:last td#rmk").html(result.wholesale_order[i].wso_remark);
                $("tbody#pdout tr:last td#reason").html(result.wholesale_order[i].wso_reason);

                addRow();
            }

            delLastRow();
        }
    );
}

//获取待处理订单
function getUnhandList() {
    var name = '经销商' + username.charAt(8);
    $.get(
        "http://127.0.0.1/ocp_dev/getOrders",
        { "rtlog_user_name": name },
        function (result) {

            for (var i = 0; i < result.stock_order.length; i++) {
                if (result.stock_order[i].sto_status != 0) {
                    continue;
                }
                var type = "备货订单";
                $("tbody#pdout tr:last td#date").html(result.stock_order[i].sto_submit_datetime.slice(0, 10));
                $("tbody#pdout tr:last td#num").html(result.stock_order[i].sto_order_number);
                $("tbody#pdout tr:last td#type").html(type);
                $("tbody#pdout tr:last td#status").html("待处理");
                $("tbody#pdout tr:last td#rmk").html(result.stock_order[i].sto_remark);
                $("tbody#pdout tr:last td#reason").html(result.stock_order[i].sto_reason);

                addRow();
            }

            for (var i = 0; i < result.wholesale_order.length; i++) {
                if (result.wholesale_order[i].wso_status != 0) {
                    continue;
                }
                var type = "批发订单";
                $("tbody#pdout tr:last td#date").html(result.wholesale_order[i].wso_submit_datetime.slice(0, 10));
                $("tbody#pdout tr:last td#num").html(result.wholesale_order[i].wso_order_number);
                $("tbody#pdout tr:last td#type").html(type);
                $("tbody#pdout tr:last td#status").html("待处理");
                $("tbody#pdout tr:last td#rmk").html(result.wholesale_order[i].wso_remark);
                $("tbody#pdout tr:last td#reason").html(result.wholesale_order[i].wso_reason);

                addRow();
            }

            delLastRow();
        }
    );
}


//提交审核
$("a#subOdr").click(function () {
    event.preventDefault();
    var odnum = $(this).parent().siblings("#num").text();
    subOdrToRev(odnum);
});

function subOdrToRev(odnum) {
    $.get(
        "http://127.0.0.1/ocp_dev/submitOrderReview",
        {
            "order_number": odnum,
            "status": 1
        },
        function (result) {
            if (result.code == 1) {
                $("#subSucc").modal();
            } else {
                alert("失败");
            }
        }
    );
}
