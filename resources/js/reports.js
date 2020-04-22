var firstColumn = document.getElementById("firstColumn");
var otherColumns = document.getElementById("otherColumns");
var firstHeader = document.getElementById("firstHeader");
var otherHeaders = document.getElementById("otherHeaders");
var sqlTxt = document.getElementById("sqlTxt");
var csv = '';

function checkField(){
	if(sqlTxt.value == "Type SQL"){
		sqlTxt.value = "";
	}
}

function processSQL(json){
	csv = '';
	console.log(json);
	if(typeof json == "string"){
		alert("There was an error with your SQL. See console for more details.");
	}else{
		var fields = [];
		for(var i = 0; i < json.fields.length; i++){
			fields.push(json.fields[i].name);
		}
		
		var maxlen = 0;
		var curLen = 0;
		csv = '"';
		
		for (var i = 0; i < fields.length; i++){
			if(csv != '"'){
				csv += '", "';
			}
			csv += fields[i];
			
			for(var j = 0; j<json.rows.length; j++){
				if(i == 0){
					//First Column
					make_firstColumn(json.rows[j][fields[0]]);
				}
				curLen = (json.rows[j][fields[i]] + '').length;
				if(curLen > maxlen){
					maxlen = curLen;
				}
			}
			if(i == 0){
				//First Header (stable)
				make_firstHeader(fields[0]);
				setColumnOffset(maxlen);
			}else{
				//Other headers
				make_otherHeaders(fields[i], i+1);
			}
			if(fields[i].length > maxlen){
				setColumnStyle(i+1, fields[i].length); //this should be all caps
			}else{
				setColumnStyle(i+1, maxlen);
			}
			maxlen = " "
		}
		
		csv += '\r\n';
		//Other columns
		var data = [];
		var line = '"';
		
		for(var j = 0; j<json.rows.length; j++){
			line = '"'
			for (var i = 0; i < fields.length; i++){
				if (line != '"'){
					line += '", "';
				}
				line += json.rows[j][fields[i]];
				if(i != 0){
					data.push(json.rows[j][fields[i]]);
				}
			}
			csv += line + '\r\n';
			make_otherColumns(data);
			data = [];
		}
	}
}

function make_firstColumn(name){
	var row = document.createElement('tr');
	row.className = 'row100 body';
	var cell = document.createElement('td');
	cell.className = 'cell100 column1';
	var textnode = document.createTextNode(name);
	
	row.appendChild(cell);
	cell.appendChild(textnode);
	firstColumn.appendChild(row);
}

function make_otherColumns(arr){	
	var row = document.createElement('tr');
	row.className = 'row100 body';
	for(var i = 0; i < arr.length; i++){
		var cell = document.createElement('td');
		cell.className = 'cell100 column' + (i+2);
		var textnode = document.createTextNode(arr[i]);
		cell.appendChild(textnode);
		row.appendChild(cell);
	}
	otherColumns.appendChild(row);
}

function make_firstHeader(name){
	var cell = document.createElement('th');
	cell.className = 'cell100 column1';
	var textnode = document.createTextNode(name);
	
	cell.appendChild(textnode);
	firstHeader.appendChild(cell);
}

function make_otherHeaders(name, index){
	var cell = document.createElement('th');
	cell.className = 'cell100 column' + index;
	var textnode = document.createTextNode(name);
	
	cell.appendChild(textnode);
	otherHeaders.appendChild(cell);
}

function removeTable(){
	firstColumn.innerHTML = "";
	otherColumns.innerHTML = "";
	firstHeader.innerHTML = "";
	otherHeaders.innerHTML = "";
}

function setColumnStyle(indx, max){
  var style = document.createElement('style');
  style.innerHTML = ".column" + indx + " {width: " + (max * 10) + "px;}";
  document.head.appendChild(style);
}

function setColumnOffset(size){
  var style = document.createElement('style');
  style.innerHTML = ".wrap-table100-nextcols {padding-left: " + (size + 80) + "px;}";
  document.head.appendChild(style);
}

function callSQL(){
	removeTable();
	var vars = {callType: "report", reportSQL: sqlTxt.value};
	makeCall(JSON.stringify(vars), processSQL);
}

function downloadCSV(){
	var d = new Date();
	
	var fileTitle = d.toLocaleTimeString().replace(/:/g, "-") +  "_" + d.toDateString() + '.csv';
	var exportedFilenmae = fileTitle;
	var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	var link = document.createElement("a");
	if (link.download !== undefined) { // feature detection
		// Browsers that support HTML5 download attribute
		var url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", exportedFilenmae);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

sqlTxt.onkeydown = function (e) {
    if (e.keyCode == 13) {
		e.preventDefault();
		callSQL();
	}
};

var tabs = document.getElementById("tabs");
tabs.innerHTML += '<li><a href="profile">Profile</a></li>'
tabs.innerHTML += '<li><a href="search">Search</a></li>'
tabs.innerHTML += '<li onclick="logout()"><a href="home">Logout</a></li>'
