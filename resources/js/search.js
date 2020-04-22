var table = document.getElementById("row");
var search = document.getElementById("searchTxt");
var result = document.getElementById("res");

function checkField(){
	if(search.value == "Search for Alumni"){
		search.value = "";
	}
}

search.onkeydown = function (e) {
    if (e.keyCode == 13) {
		e.preventDefault();
		callSQL();
	}
};

function processSQL(json){
	console.log(json);
	var comp = []
	var val = ""
	for	(var i = 0; i < json.rows.length; i++){
		val = "";
		comp = json.rows[i].Company.split(",")
		for (var j = 0; j < comp.length; j++){
			if(comp[j].indexOf(search.value) > 0){
				val = comp[j]
			}
		} 
		if (val == ""){
			val = comp[0];
		}
		makeRow([json.rows[i].FullName, json.rows[i].GraduationYear, json.rows[i].Degree, val, json.rows[i].ID]);
	}
	result.innerHTML = json.rows.length + " results";
}


function makeRow(arr){
	var row = document.createElement('tr');
	for (var i = 0; i <= 3; i++){
		var cell = document.createElement('td');
		var textnode = document.createTextNode(arr[i]);
		cell.appendChild(textnode);
		row.appendChild(cell);
		table.appendChild(row);
	}
	var cell = document.createElement('td');	
	var link = document.createElement('a');
	link.href = "profile#" + arr[4];
	var textnode = document.createTextNode("View Profile");
	link.appendChild(textnode);
	cell.appendChild(link);
	row.appendChild(cell);
}

function removeTable(){
	table.innerHTML = "<th>Name</th><th>Grad year</th><th>Degree</th><th>Company</th><th>Profile Link</th>";
}


function callSQL(){
	removeTable();
	var vars = {callType: "search", criteria: search.value};
	makeCall(JSON.stringify(vars), processSQL);
}

function colourize() {
  var dnl = document.getElementsByTagName("tr");
  for(i = 0; i < dnl.length; i++) {
    if((Math.round(i / 2) * 2) == ((i / 2) * 2) )
    dnl.item(i).style.background="#F0F0F0";
  }
}

window.onload = colourize;

var tabs = document.getElementById("tabs");
tabs.innerHTML += '<li><a href="profile">Profile</a></li>'
if(getCookie("Permissions") != "Alumni"){
	tabs.innerHTML += '<li><a href="reports">Reporting</a></li>'
}
tabs.innerHTML += '<li onclick="logout()"><a href="home">Logout</a></li>'
