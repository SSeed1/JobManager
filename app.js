const express = require('express')
 const app = express()
 const db=require('./database.js')
 const bcrypt = require('bcrypt')
 const session = require('express-session')
 const fileUpload = require('express-fileupload');
 app.use(session({secret:'randomly generated secret',}))
 app.use(fileUpload());
 app.set('view engine', 'ejs')



function setCurrentUser (req,res,next){
	if (req.session.loggedIn){
		var sql = "SELECT * FROM accounts WHERE id=?"
		var params = [req.session.userId]
		db.get(sql,params,(err,row)=>{
			if(row !== undefined){
				res.locals.currentUser=row
			}
			return next()
		});
	} else {
		return next()
	}
}

 app.use(setCurrentUser)
 app.use('/images', express.static( __dirname + '/views/images/'));
 app.use('/photos', express.static(__dirname + '/photos/'))
 app.use('/css', express.static( __dirname + '/views/css/'));
 app.use('/js', express.static( __dirname + '/views/js/'));
 app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'))
 app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))


app.use(express.urlencoded())

 app.get('/',checkAuth, function (req, res) {
 res.render('post', {activePage: "home"})
 })



app.get('/post',function(reg,res){
 	var sql ="SELECT * FROM company"
 	db.all(sql,[],(err,rows)=>{
 		if(err){
 			res.status(400)
 			res.send("database error:"+err.message)
 			return;
 		}

 		res.render('post',{activePage:"department", dep:rows })
 	});
 })


app.get('/new_dep',function(req,res){
	var sql ="SELECT * FROM company"
 	db.all(sql,[],(err,rows)=>{
 		if(err){
 			res.status(400)
 			res.send("database error:"+err.message)
 			return;
 		}

	res.render('new_dep',{activePage:"Add Department",dep:rows})
});
})

app.post('/new_dep',function(req,res){
	var data = [
	req.body.dep,
	]
	var sql = "INSERT INTO company (name) VALUES (?)"
	db.run(sql,data,function(err,result){
		if(err){
			res.status(400)
			res.send("database error:"+err.message)
			return;
		}
		res.render('add_dep',{ activePage:"department",formData: req.body})
	});
})

app.post('/del_dep',function(req,res){
	var data = [
	req.body.department,
	]
	var sql = "DELETE FROM company WHERE name=?"
	db.run(sql,data,function(err,result){
		if(err){
			res.status(400)
			res.send("database error:"+err.message)
			return;
		}
		res.render('delete_dep',{ activePage:"department",formData: req.body})
	});
})




app.get( '/register', function ( req , res ) {
var sql = "SELECT * FROM company"
 	
	db.all(sql, (err,rows)=>{
	if(err){
		res.status(400)
		res.send("database error:"+ err.message)
		return;
	}
res.render('register',{dep:rows, activePage:"register"})
});
})

app.post('/register',function (req,res) {
	
	var photoFile = req.files.photo;

	photoFile.mv(__dirname + '/photos/'+req.files.photo.name, function(err) {

	bcrypt.hash(req.body.password,10,function(err,hash){
		
 		var data=[
		req.body.name,
		req.body.surname,
		req.body.email,
		hash,
		req.files.photo.name,
		req.body.department,
		]
		var sql="INSERT INTO accounts (name,surname,email,password,photo,company)VALUES (?,?,?,?,?,?)"
		db.run(sql,data,function(err,result){
			if(err){
				res.status(400)
				res.send("database error:"+err.message)
				return;
			}
			res.render('register_answer',{activePage:"register",formData:req.body})
		});
	});
});
})

app.post('/poisk',function(req,res){
	var data=req.body.search
	console.log(data)
	var sql ="SELECT * FROM accounts WHERE name LIKE '"+ data+"%'"
	console.log(sql)
	db.get(sql,function(err,row){
			if(err){
				res.status(400)
				
				return;
			}

			var sql2 ="SELECT * FROM accounts WHERE surname LIKE '"+ data+"%'"
	console.log(sql2)
	db.get(sql2,function(err,row2){
			if(err){
				res.status(400)
				
				return;
			}

			if(row==undefined&&row2==undefined)res.render('error',{activePage:"register"})

			else if(row!=undefined)res.render('view_profile2',{activePage:"register",emp:row})
			else if(row2!=undefined)res.render('view_profile2',{activePage:"register",emp:row2})
		});
});
})

app.get( '/login' , function ( req , res ) {
res.render( 'login' , { activePage : "login",error:"" })
})


app.post('/login',function (req,res){
	var sql = "SELECT * FROM accounts WHERE email = ?"
	var params = [req.body.email]
	var error=""
	db.get(sql,params,(err,row)=>{
		if(err){
			error = err.message
		}
		if(row===undefined){
			error = "Wrong email or password"
		}
		if( error !== ""){
			console.log("net emaila")
			res.render('login',{activePage:"login",error: error})
			return
		}
		
		bcrypt.compare(req.body.password, row["password"],function(err,hashRes){
			if(hashRes === false){
				error="Wrong email or password"
				console.log("net parolya")
				
			}
			
			req.session.userId = row["id"]
			req.session.loggedIn = true
			
			res.redirect("/post")
		});
	})
})



app.get('/logout' ,function(req,res){
	req.session.userId = null
	req.session.loggedIn = false
	res.redirect("/login")
})


function checkAuth(req,res,next){
	if(req.session.loggedIn){
		return next()
	}else {
		res.redirect("/login")
	}
}
app.get('/view_profile',checkAuth,function(req,res){
	res.render('view_profile',{activePage:"profile"})
})


app.get('/post/:name', checkAuth,function (req, res) {
	var sql = "SELECT * FROM company WHERE name=?"
 	var params = [req.params.name]
	db.get(sql,params, (err,row)=>{
	if(err){
		res.status(400)
		res.send("database error:"+ err.message)
		return;
	}
	var sql2 = "SELECT * FROM accounts WHERE company=?"
	db.all(sql2,[row["name"]]	,(err,rows)=>{
	if(err){
		res.status(400)
		res.send("database error:"+ err.message)
		return;}
	
	res.render('view_dep',{dep:row, emp:rows, activePage:"post"})
		});
	});

 })



app.get('/post/:name/employes/:id',checkAuth,function (req, res) {
	var sql = "SELECT * FROM company WHERE name=?"
 	var params = req.params.name;
	db.get(sql,params, (err,row)=>{
	if(err){
		res.status(400)
		res.send("database error:"+ err.message)
		return;
	}
	var sql2 = "SELECT * FROM accounts WHERE id=?"
	var params2 = req.params.id
	db.get(sql2, params2,(err,row2)=>{
	if(err){
		res.status(400)
		res.send("database error:"+ err.message)
		return;}
	
	res.render('view_profile2',{dep:row, emp:row2, activePage:"post"})
		});
	});

 })

app.get('/post/:name/employes/:id/delete',checkAuth,function (req, res) {
	
	var sql2 = "DELETE FROM accounts WHERE id=?"
	var params2 = req.params.id
	db.get(sql2, params2,(err,row2)=>{
	if(err){
		res.status(400)
		res.send("database error:"+ err.message)
		return;}
	
	res.redirect("/post")
		});
	
 })





 app.listen(3000)