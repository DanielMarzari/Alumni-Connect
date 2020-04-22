var username = document.getElementById("uname");
var password = document.getElementById("pword");
var error = document.getElementById("onError");

function processSQL(json){
	console.log(json);
	if((typeof(json) == "string") || (json.rows.length == 0)){
		error.hidden = false;
	}else{
		var d = new Date();
		d.setTime(d.getTime() + (2*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = "UID=" + json.rows[0].UID + "; Permissions=" + json.rows[0].Permissions + "; " + expires + ";path=/";
		window.location.href = "profile";
	}
}

function login(){
	var vars = {callType: "login", Username: username.value, Password: password.value}
	var packet = JSON.stringify(vars);
	makeCall(packet, processSQL);
}

document.onkeydown = function (e) {
    if (e.keyCode == 13) {
		e.preventDefault();
		login();
	}
};