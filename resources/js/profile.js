var profilePicture = document.getElementById("picture");
var profileName = document.getElementById("name");
var picURL = document.getElementById("picurl");

var contactNumber = document.getElementById("number");
var contactWebsite = document.getElementById("website");
var contactEmail = document.getElementById("email");
var contactLinked = document.getElementById("linkedin");
var contactSlack = document.getElementById("slack");

var infoBio = document.getElementById("bio");
var infoBday = document.getElementById("bday");
var infoGender = document.getElementById("gender");
var infoGyear = document.getElementById("gradyear");
var infoDegree = document.getElementById("degree");
var infoJob = document.getElementById("job");

var updateBtn = document.getElementById("updateBtn");
var workExp = document.getElementById("workexp");

var updated = false;
var ID;
var WorkHistory_IDs = [];
// ---------------------------------------------------------------------------------------------------------------------------------
contentArr = [contactNumber, contactWebsite, contactEmail, contactLinked, infoBio, infoBday, infoGender, infoGyear, infoDegree, infoJob, profileName];

function addEL(){
	for(var i=0; i< contentArr.length; i++){
		contentArr[i].addEventListener('input', userUpdate);
	}
}


function setEditable(section){
	if(picURL.hidden){
		picURL.hidden = false;
		picURL.classList.add("edit");
		for(var i=0; i< contentArr.length; i++){
			contentArr[i].classList.add("edit");
			contentArr[i].contentEditable = 'true';
		}
	}else{
		picURL.hidden = true;
		picURL.classList.remove("edit");
		for(var i=0; i< contentArr.length; i++){
			contentArr[i].classList.remove("edit");
			contentArr[i].contentEditable = 'true';
		}
	}
}

function userUpdate(){
	updateBtn.style="display:block;";
	updated = true;
}

function processInfoSQL(json){ 
	console.log(json);
	with(json.rows[0]){
		try{
			profilePicture.src = PictureURL;
		}catch(e){
			profilePicture.src = "http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
		}
		picURL.innerText = PictureURL;
		profileName.innerText = FullName;
		contactNumber.innerText = Phone;
		contactWebsite.innerHTML = "<a href='" + Website + "'>" + Website + "</a>";
		contactEmail.innerText = Email;
		contactLinked.innerHTML = "<a href='" + LinkedInURL + "'>" + LinkedInURL + "</a>";
		contactSlack.innerHTML = "<a href='https://alumni-connect-forum.slack.com/'>Connect on Slack</a>";

		infoBio.innerText = Bio;
		infoBday.innerText = (new Date(Birthday)).toLocaleDateString();
		infoGender.innerText = Gender;
		infoGyear.innerText = GraduationYear;
		infoDegree.innerText = Degree;
	}
	workSQL();
}

function processWorkSQL(json){
	console.log(json);
	if(json.rows.length > 0){
		infoJob.innerText = json.rows[0].Title + " at " + json.rows[0].Company;
		var data = []
		for	(var i = 0; i < json.rows.length; i++){
			data = []
			data.push(json.rows[i].Title);
			data.push(json.rows[i].Company + " - " + json.rows[i].Part_FullTime);
			if(json.rows[i].EndDate == null){
				data.push((new Date(json.rows[i].StartDate)).toLocaleDateString() + " - Present");
			}else{
				data.push((new Date(json.rows[i].StartDate)).toLocaleDateString() + " - " + (new Date(json.rows[i].EndDate)).toLocaleDateString());
			}
			data.push(json.rows[i].Description);
			makeExp(data);
		}
	}
}

function processUpdateSQL(json){
	console.log(json);
	//This should check if there was an error
}

function makeExp(arr){
	var div1 = document.createElement('div');
	div1.className = "panel panel-info";
	div1.style = "margin:1em";
	var div2 = document.createElement('div');
	var h4 = document.createElement('h4');
	var textnode1 = document.createTextNode(arr[0]);
	var h5 = document.createElement('h5');
	var textnode2 = document.createTextNode(arr[1]);
	var h6 = document.createElement('h6');
	var textnode3 = document.createTextNode(arr[2]);
	var p = document.createElement('p');
	var textnode4 = document.createTextNode(arr[3]);
	
	h4.appendChild(textnode1);
	h5.appendChild(textnode2);
	h6.appendChild(textnode3);
	p.appendChild(textnode4);
	
	contentArr.push(h4);
	contentArr.push(h5);
	contentArr.push(h6);
	contentArr.push(p);
	
	div2.appendChild(h4);
	div2.appendChild(h5);
	div2.appendChild(h6);
	div2.appendChild(p);
	
	div1.appendChild(div2);

	workExp.appendChild(div1);
	addEL();
}

function removeTable(){
	if(window.location.href.includes("#")){
			workExp.innerHTML = "<div class='panel-heading'><h3 class='panel-title'>Expierence<i hidden class='bx bxs-edit' onclick='setEditable(2)'></i></h3></div>";
	}else{
		workExp.innerHTML = "<div class='panel-heading'><h3 class='panel-title'>Expierence<i class='bx bxs-edit' onclick='setEditable(2)'></i></h3></div>";
	}
	
}

function profileSQL(){
	var vars = {callType: "profile", ID: ID};
	makeCall(JSON.stringify(vars), processInfoSQL); 
}

function workSQL(){
	removeTable();
	var vars = {callType: "work", ID: ID};
	makeCall(JSON.stringify(vars), processWorkSQL);
}


//{0} replace function
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, (match, p1) => {
        var i = parseInt(p1);
        return typeof args[i] != 'undefined' ? args[i] : match;
    });
}


function updateSQL(){
	setEditable(4, 'false');
	updateBtn.style="display:none;";
	var vars, packet; 
	
	var sdate, edate;
	for(var i = 1; i < workExp.children.length; i++){		
		with(workExp.children[i].children[0]){
			sdate = new Date(children[2].innerText.split(' - ')[0]);
			edate = new Date(children[2].innerText.split(' - ')[1]);
			
			vars = {callType: "update_wh",
					ID: WorkHistory_IDs[i],
					company: children[1].innerText.split(' - ')[0],
					title: children[0].innerText,
					time: children[1].innerText.split(' - ')[1],
					sdate: "'{0}-{1}-{2}'".format(sdate.getFullYear(), ('00' + (sdate.getMonth()+1)).slice(-2), ('00' + sdate.getDate()).slice(-2)),
					edate: (children[2].innerText.split(' - ')[1] == 'Present') ? "NULL" : "'{0}-{1}-{2}'".format(sdate.getFullYear(), ('00' + (sdate.getMonth()+1)).slice(-2), ('00' + sdate.getDate()).slice(-2)),
					description: children[3].innerText,
					AID: ID};
		}
		makeCall(JSON.stringify(vars), processUpdateSQL);
	}
	
	var bdate = new Date(infoBday.innerText);
	
	vars = {callType: "update_ai",
			ID: ID,
			name: profileName.innerText,
			gender: infoGender.innerText,
			bdate: "'{0}-{1}-{2}'".format(bdate.getFullYear(), ('00' + (bdate.getMonth()+1)).slice(-2), ('00' + bdate.getDate()).slice(-2)),
			phone: contactNumber.innerText,
			email: contactEmail.innerText,
			degree: infoDegree.innerText,
			web: contactWebsite.innerText,
			linkedin: contactLinked.innerText,
			bio: infoBio.innerText,
			gyear: infoGyear.innerText,
			pURL: picURL.innerText};
	
	makeCall(JSON.stringify(vars), processUpdateSQL);
}

function getID(){
	if(window.location.href.includes("#")){
		ID = window.location.href.split("#")[1];
		removeEdit();
		loadpage();
	}else{
		var cookie = getCookie("UID");
		if(cookie == ""){
			window.location.href = 'login';
		}else{
			var vars = {callType: "id", UID: cookie};
			makeCall(JSON.stringify(vars), function(json){
				console.log(json);
				ID = json.rows[0].ID;
				loadpage();
			});
		}
	}
}

function removeEdit(){
	editable = document.getElementsByClassName("bxs-edit");
	for(var i = 0; i < editable.length; i++){
		editable[i].hidden = true;
	}
}

function loadpage(){
	profileSQL();
}

window.onload = getID();

var tabs = document.getElementById("tabs");
if(window.location.href.includes("#")){
	tabs.innerHTML += '<li><a href="profile">Profile</a></li>';
}
if(getCookie("Permissions") != "Alumni"){
	tabs.innerHTML += '<li><a href="reports">Reporting</a></li>';
}

tabs.innerHTML += '<li><a href="search">Search</a></li>';
tabs.innerHTML += '<li onclick="logout()"><a href="">Logout</a></li>';
