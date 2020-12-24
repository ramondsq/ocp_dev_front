//设置cookie
function setCookie(cname,cvalue){
	document.cookie = cname+"="+cvalue+";";
}

//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
    }
    return "";
}

//删除cookie
function delCookie(cname) {
    document.cookie='username=' + cname + ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

//检查cookie
function checkCookie() {
    var user = getCookie("username");
    if (user == "") {
        window.location.replace("RetailerLogin.html");
    }
}