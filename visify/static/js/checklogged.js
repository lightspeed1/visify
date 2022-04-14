function logout()
{
    console.log("logout called");
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/logout", true);
    xhttp.send();
    xhttp.onload = function()
    {
        location.reload();
    };
}
function checklogin()
{
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/checklogin", true);
    xhttp.send();
    xhttp.onload = function()
    {
        var resJson = JSON.parse(xhttp.responseText);
        if(resJson.loggedin) {
            $("#logout-btn").show();
            $("#login-btn").hide();
            $("#greeting-anchor").html(resJson.email);
        }
        else {
            $("#logout-btn").hide();
            $("#login-btn").show();
            $("#greeting-anchor").html("");
        }
    };
}
checklogin();