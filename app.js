var express = require("express");
var bodyParser = require('body-parser');
var ejs = require("ejs");
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "node@joshuahoffman.me",
        pass: "ngoufsWC4v5W",
    }
});

var app = express();

app.set('view engine', 'ejs');

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

var portfolio_items=require("./portfolio_items.js");

app.locals.portfolioItemPreview = function(itemID) {
	var theItem=portfolio_items[itemID];
	var classNames=new Array("portfolioItem");
		if (theItem.older) {
			classNames.push("olderWork");
		}
		
	var action=(theItem['action'])?theItem['action']:theItem["id"];
	
	var returnHTML='<a href="'+ action +'" title="'+ theItem['name'] +'" class="'+ classNames.join(' ') +'" target="_blank">';
		returnHTML+='<h2 class="hidden-md hidden-lg">'+ theItem["name"] +'</h2>';
		returnHTML+='<img src="/images/portfolio-items/'+ itemID +'.png">';
		
		if (theItem["caption"] != "") {
			returnHTML+='<div class="caption"><div class="arrow"></div><div class="card">'+ theItem["caption"] +'</div></div>';
		}
	returnHTML+='</a>';
	
	return returnHTML;
}

app.locals.cardMenuButton_action = function (text, action) {
	return '<div class="card"><div class="menu"><b><span class="action" onclick="'+ action +'">'+ text +'</span></b></div></div>';
}

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/about', function(req, res){
	res.render('about');
});

app.get("/portfolio", function(req, res){
	res.render("portfolio");
});

app.get("/resume", function(req, res){
	res.render("resume");
});

app.post("/mail", function(req, res) {
	console.log(req.body);

	smtpTransport.sendMail({
		from: req.body.name +" <"+ req.body.email +">",
		replyTo: req.body.name +" <"+ req.body.email +">",
		to: "mail@joshuahoffman.me",
		subject: req.body.subject,
		html: req.body.message,
		generateTextFromHTML: true,
	}, function(error, response) {
		/*
			if(error) {
				console.log(error);
			}
			else {
				console.log("Message sent: " + response.message);
			}
		*/

		// if you don't want to use this transport object anymore, uncomment following line
		smtpTransport.close(); // shut down the connection pool, no more messages
	});

	res.render("sent");
});

app.use(function(req, res, next){
	res.status(404);

	// respond with html page
	if (req.accepts('html')) {
		res.render('404', { url: req.url });
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.send({ error: 'Not found' });
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Not found');
});

app.listen((app.settings.env == "development")?3000:80);
