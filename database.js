var sqlite3 = require('sqlite3').verbose()

var DBSOURSE = "./db/db.sqlite"

var db = new sqlite3.Database(DBSOURSE,(err)=>{
	if(err)
	{
		console.error(err.message)
		throw err
	}
	else {
		console.log('Connected to the SQLite database.')
			
			db.run(`CREATE TABLE accounts (
			 id INTEGER PRIMARY KEY AUTOINCREMENT,
			 name text, 
			 surname text, 
			 email text UNIQUE,
			 password text,
			 photo text , 
			 company text,
			 CONSTRAINT email_unique UNIQUE (email))`,
			(err)=>{
				if(err)
				{
					console.log("Table accounts id already created:"+err.message)
				}
				else{
					console.log("Table accounts is created")
				}
			});

			db.run(`CREATE TABLE company (id INTEGER PRIMARY KEY AUTOINCREMENT, name text)`,
			(err)=>{
				if(err)
				{
					console.log("Table coments id already created:"+err.message)
				}
				else{
					console.log("Table coments is created")
				}
			});


	}
	
});

module.exports =db