function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}
  throw new Error("Could not create HTTP request object.");
}

function makeCall(packet, next){
	var request = makeHttpObject();
	//request.open("POST", "http://localhost:8888", true);
	request.open("POST", "db", true);
	request.send(packet);
	request.onreadystatechange = function() {
		if (request.readyState == 4){
			next(JSON.parse(request.responseText).response);
		}
	};
	//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
}

function logout(){
	document.cookie = 'UID=; Permissions=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	window.location.href = 'home';
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}