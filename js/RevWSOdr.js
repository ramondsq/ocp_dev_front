//获取cookie，身份认证
var username = getCookie("op_username");

if (username == "") {
    window.location.replace("OptLogin.html");
} else {
    document.getElementById("signoutl").innerHTML = username;
}


//点击“审核”弹出modal
function rev() {
    $("#myModal").modal();
};

//增加一行
function addRow(type) {
    var num = $("tbody#pdout tr:last td:first").text();
    var number = 0;
    if (num != null) {
        var number = Number(num);
    }
    number += 1;

    $("tbody#pdout tr:last").after('<tr id="item">' +
        '<td id="' + number + '">' + number + '</td>' +
        '<td id="subDate"></td>' +
        '<td id="odNum"></td>' +
        '<td id="rtID"></td>' +
        '<td id="rtName"></td>' +
        '<td id="rtArea"></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td id="price"></td>' +
        '<td id="vol"></td>' +
        '<td>' +
        '    <a href="">查看详情</a>' +
        '    <a href="" id="' + type + '">审核</a>' +
        '</td>' +
        '</tr>');

    //事件重绑定
    if (type == "rev") {
        $("tr td").on("mouseenter", "#rev", function () {
            $(this).click(function () {
                event.preventDefault();
                var odnum = $(this).parent().siblings("#odNum").text();
                $("#myModal").modal();

                var status;
                $("#pass").click(function () {
                    status = 2;
                    console.log(status);
                    subRev(status, odnum);
                });
                $("#notpass").click(function () {
                    status = 4;
                    console.log(status);
                    subRev(status, odnum);
                });
            });
        });
    } else if (type == "rrev") {
        $("tr td").on("mouseenter", "#rrev", function () {
            $(this).click(function () {
                event.preventDefault();
                var odnum = $(this).parent().siblings("#odNum").text();
                $("#myModal").modal();

                var status;
                $("#pass").click(function () {
                    status = 3;
                    console.log(status);
                    subRev(status, odnum);
                });
                $("#notpass").click(function () {
                    status = 4;
                    console.log(status);
                    subRev(status, odnum);
                });

            });
        });
    }

};

//删除最后一行
function delLastRow() {
    $("tbody#pdout tr:last").remove();
};


//获取备货订单
function getRevOdr(stat) {
    var type;
    if (stat == 1) {
        type = "rev";
    } else if (stat == 2) {
        type = "rrev";
    }
    $.get(
        "http://127.0.0.1/ocp_dev/getReviewOrders",
        { "status": stat },
        function (res) {
            var sto = res.orders.sto;
            for (var i = 0; i < sto.length; i++) {
                $("tbody#pdout tr:last td#subDate").html(sto[i].submit_datetime.slice(0, 10));
                $("tbody#pdout tr:last td#odNum").html(sto[i].order_number);
                $("tbody#pdout tr:last td#rtID").html(sto[i].retailer_id);
                $("tbody#pdout tr:last td#rtName").html(sto[i].retailer_name);
                $("tbody#pdout tr:last td#rtArea").html(sto[i].retailer_area);
                $("tbody#pdout tr:last td#price").html(sto[i].price);
                $("tbody#pdout tr:last td#vol").html(sto[i].volume);

                addRow(type);
            }
        }
    );
}

//获取批发订单
function getWSOdr(stat) {
    var type;
    if (stat == 1) {
        type = "rev";
    } else if (stat == 2) {
        type = "rrev";
    }
    $.get(
        "http://127.0.0.1/ocp_dev/getReviewOrders",
        { "status": stat },
        function (res) {
            var sto = res.orders.wso;
            for (var i = 0; i < sto.length; i++) {
                $("tbody#pdout tr:last td#subDate").html(sto[i].submit_datetime.slice(0, 10));
                $("tbody#pdout tr:last td#odNum").html(sto[i].order_number);
                $("tbody#pdout tr:last td#rtID").html(sto[i].retailer_id);
                $("tbody#pdout tr:last td#rtName").html(sto[i].retailer_name);
                $("tbody#pdout tr:last td#rtArea").html(sto[i].retailer_area);
                $("tbody#pdout tr:last td#price").html(sto[i].price);
                $("tbody#pdout tr:last td#vol").html(sto[i].volume);

                addRow(type);
            }
        }
    );
}
//设置订单状态
function getStat() {
    var status;
    $("#pass").click(function () {
        status = 2;
        console.log(status);
    });
    $("#notpass").click(function () {
        status = 4;
        console.log(status);
    });
    return status;
}

//审核操作
$("a#rev").click(function () {
    event.preventDefault();
    var odnum = $(this).parent().siblings("#odNum").text();
    $("#myModal").modal();

    var status;
    $("#pass").click(function () {
        status = 2;
        console.log(status);
        subRev(status, odnum);
    });
    $("#notpass").click(function () {
        status = 4;
        console.log(status);
        subRev(status, odnum);
    });

});

//提交审核操作表单
function subRev(stat, num) {
    $.get(
        "http://127.0.0.1/ocp_dev/reviewWSOrder",
        {
            "order_number": num,
            "status": stat,
            "reviewer_user_name": username
        },
        function (res) {
            if (res.code == 1) {
                $("#succ").modal();
            }
        }
    );
}

//提交审核操作表单
function subRevR(stat, num) {
    $.get(
        "http://127.0.0.1/ocp_dev/reviewWSOrder",
        {
            "order_number": num,
            "status": stat,
            "rereviewer_user_name": username
        },
        function (res) {
            if (res.code == 1) {
                $("#succ").modal();
            }
        }
    );
}

//‘复核’操作
$("a#rrev").click(function () {
    event.preventDefault();
    var odnum = $(this).parent().siblings("#odNum").text();
    $("#myModal").modal();

    var status;
    $("#pass").click(function () {
        status = 3;
        console.log(status);
        subRevR(status, odnum);
    });
    $("#notpass").click(function () {
        status = 4;
        console.log(status);
        subRevR(status, odnum);
    });

});