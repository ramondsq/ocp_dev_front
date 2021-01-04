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