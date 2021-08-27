var pathname = window.location.pathname; // Returns path only (/path/example.html)
var url = window.location.href;     // Returns full URL (https://example.com/path/example.html)
var origin = window.location.origin;
$(document).ready(function () {
    var userRole = getCookie("user")
    console.log(userRole)
    if(userRole == "employee")
    {
        console.log('1')
        var leng = document.getElementsByClassName("adminUser")
        lengths= leng.length
        for(i=0;i<lengths;i++)
        {
            document.getElementsByClassName("adminUser")[i].style.display= "none";
        }
    }


console.log(pathname,'path ')
    if (pathname.includes("/users/list-leave-request/")) {
        $("#lrBlock").addClass("side-active");
        $("#lr").css("color", "white");
    }
    else if (pathname.includes("/users/list-leave/")) {
        console.log('2')
        $("#lsBlock").addClass("side-active");
        $("#ls").css("color", "white");
    }
    else if (pathname.includes("/users/dashboard/")) {
        $("#dsBlock").addClass("side-active");
        $("#ds").css("color", "white");
    }

    else if (pathname.includes("/users/")) {
        console.log('1')
        $("#umBlock").addClass("side-active");
        $("#um").css("color", "white");
    }
});
