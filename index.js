//https://node-postgres.com/api/client
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();
const router = express.Router();
const http = require('http');
const {Client} = require("pg");
var sql = '';
var args = [];
var json = '';
//{0} replace function
String.prototype.format = function() {
    var args = arguments[0];
    return this.replace(/{(\d+)}/g, (match, p1) => {
        var i = parseInt(p1);
        return typeof args[i] != 'undefined' ? args[i] : match;
    });
}
//New Database Credentials 4/22
const client = new Client({
  user: "ffeaqahxbntuyt",
  password: "281ae8a5bb006b3694fb68490c333cf42cc1c04ca64edb01c6b95c2001a428d8",
  database: "ddogk6h7q61gu6",
  port: 5432,
  host: "ec2-34-200-72-77.compute-1.amazonaws.com",
  ssl: {
    rejectUnauthorized: false
  }
});

try{
	client.connect();
	console.log("DB Connected Successfully");
}catch(error){
	console.log("DB Connection Failure");
}

app.use('/db', function(req, res){
	//vars used 
	sql = '';
	args = [];
	json = '';
	//get packet
    req.on('data', chunk => {
        json += chunk.toString(); // convert Buffer to string
    });
	//once done getting the packet, process and send SQL
    req.on('end', () => {//console.log(sql);
		try{
			vars = JSON.parse(json);
			console.log(json);
			with(vars){
				switch(callType){
					case "login":
						args = [Username, Password];
						sql = 'SELECT MD5("ID"::varchar(10)) as "UID", "Permissions" FROM "Alumni" INNER JOIN "Users" ON "Alumni"."User_ID"="Users"."Username" WHERE "Username"= \'{0}\' AND "Password"= MD5(\'{1}\')';
						break;
					case "calendar":
						args = [cYear, cMonth, EOM];
						sql = 'SELECT * FROM "Events" WHERE "Date_Time" BETWEEN ' + "'{0}-{1}-01' and '{0}-{1}-{2}'";
						break;
					case "profile":
						args = [ID];
						sql = 'SELECT * FROM "Alumni" where "ID"=\'{0}\''
						break;
					case "work":
						args = [ID];
						sql = 'SELECT * FROM "WorkHistory" WHERE "Alumni_ID"=\'{0}\' ORDER BY CASE WHEN "EndDate" IS NULL THEN CURRENT_DATE ELSE "EndDate" END DESC';
						break;
					case "update_wh":
						args = [company, title, time, sdate, edate, description, AID, ID];
						sql = 'UPDATE "WorkHistory" SET "Company"=\'{0}\', "Title"=\'{1}\', "Part_FullTime"=\'{2}\', "StartDate"=\'{3}\', "EndDate"=\'{4}\', "Description"=\'{5}\', "Alumni_ID"={6}	WHERE "ID"={7}';
						break;
					case "update_ai":
						args = [name, gender, bdate, phone, email, degree, web, linkedin, bio, gyear, pURL, ID];
						sql = 'UPDATE "Alumni" SET "FullName"=\'{0}\', "Gender"=\'{1}\', "Birthday"=\'{2}\', "Phone"=\'{3}\', "Email"=\'{4}\', "Degree"=\'{5}\', "Website"=\'{6}\', "LinkedInURL"=\'{7}\', "Bio"=\'{8}\', "GraduationYear"={9}, "PictureURL"=\'{10}\' WHERE "ID"={11}';
						break;
					case "search":
						args = [criteria];
						//ILIKE is case insensitive like in postgresql
						sql = 'SELECT "FullName", "GraduationYear", "Degree", array_to_string(array_agg(CONCAT("Title", \' at \', "Company")), \',\') AS "Company", "Alumni"."ID" FROM "WorkHistory" INNER JOIN "Alumni" ON "WorkHistory"."Alumni_ID"="Alumni"."ID" WHERE "FullName" ILIKE \'%{0}%\' OR "GraduationYear"::varchar(10) ILIKE \'%{0}%\' OR "Degree" ILIKE \'%{0}%\' OR "Company" ILIKE \'%{0}%\' GROUP BY "Alumni"."ID" ORDER BY "FullName"';
						break;
					case "fields":
						args = [table]
						sql = 'SELECT column_name FROM information_schema.columns WHERE table_name = \'{0}\'';
						break;
					case "report":
						count = 2
						if(operation == "SELECT"){
							args = [operation, table]
							sql = '{0} * FROM "{1}" WHERE ';
							for(var i = 0; i < fields.length; i++){
								args = args.concat([fields[i], params[i]]);
								sql += '"{' + count++ + '}"::varchar(255) LIKE \'%{' + count++ + '}%\'';
								if(i < fields.length - 1){
									sql += ' AND ';
								}
							}			
							sql += 'ORDER BY "{' + count + '}" ASC';
							args.push(fields[0]);
						}else{ //INSERT
							args = [operation, table]
							sql = '{0} "{1}" VALUES(';
							for(var i = 0; i < params.length; i++){
								args.push(params[i]);
								sql += "'{" + count++ + "}'"
								if(i < params.length - 1){
									sql += ', ';
								}else{
									sql += ');';
								}
							}
						}
						break;
					case "id":
						args = [UID];
						sql = 'SELECT "ID" FROM "Alumni" WHERE MD5("ID"::varchar(10)) = \'{0}\'';
						break;
				}
			}
			sql = sql.format(args);
			console.log(sql);
			
			//https://gist.github.com/balupton/3696140
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Request-Method', '*');
			res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
			res.setHeader('Access-Control-Allow-Headers', '*');
			if (req.method === 'OPTIONS') {
				res.writeHead(200);
				res.end();
				return;
			}
			res.writeHead(200, {'Content-Type': 'text/html'});
			
			client
				.query(sql) //sql
				.then(result => res.write(JSON.stringify({"response": (sql.includes("SELECT")) ? result : "Success"}))) //Result
				.catch(e => res.write(JSON.stringify({"response": e.stack}))) //Error handling
				.then(function(){
					res.end();
				}) //close connection
		}catch(error){
			res.end();
		}
	});
});

app.use('/vendor', function(req, res){
	res.sendFile(path.join(__dirname+'/vendor/'+req.url));
});

app.use('/static', function(req, res){
	res.sendFile(path.join(__dirname+'/resources/'+req.url));
});

app.use('/home', function(req, res){
	res.sendFile(path.join(__dirname+'/resources/html/index.html'));
});

app.use('/login', function(req, res){
	res.sendFile(path.join(__dirname+'/resources/html/login.html'));
});

app.use('/profile', function(req, res){
	res.sendFile(path.join(__dirname+'/resources/html/profile.html'));
});

app.use('/search', function(req, res){
	res.sendFile(path.join(__dirname+'/resources/html/search.html'));
});

app.use('/reports', function(req, res){
	res.sendFile(path.join(__dirname+'/resources/html/reports.html'));
});

router.get('/',function(req, res){
  res.sendFile(path.join(__dirname+'/resources/html/index.html'));
});

//add the router
app.use('/', router);
app.listen(PORT, function(){
	console.log("Listening on port " + PORT);
});
