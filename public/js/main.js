var mailto_js=new Object();
	mailto_js["services"]={
		"aol": {
			"name": "AOL mail", 
			"url": "http://mail.aol.com/33490-311/aim-6/en-us/mail/compose-message.aspx?to={to}&cc={cc}&bcc={bcc}&subject={subject}&body={body}"
		},
		
		"fastmail": {
			"name": "FastMail", 
			"url": "https://www.fastmail.fm/action/compose/?to={to}&cc={cc}&bcc={bcc}&subject={subject}&body={body}"
		},

		"gmail": {
			"name": "Gmail", 
			"url": "https://mail.google.com/mail/?view=cm&tf=1&to={to}&cc={cc}&bcc={bcc}&su={subject}&body={body}"
		},
		
		"hotmail": {
			"name": "Hotmail / Windows Live Mail / Outlook.com", 
			"url": "https://mail.live.com/default.aspx?rru=compose&to={to}&subject={subject}&body={body}&cc={cc}"
		},
		
		"myopera": {
			"name": "My Opera mail", 
			"url": "https://mail.opera.com/action/compose/?to={to}&cc={cc}&bcc={bcc}&subject={subject}&body={body}"
		},
		
		"ymail": {
			"name": "Yahoo mail",
			"url": "http://compose.mail.yahoo.com/?To={to}&Cc={cc}&Bcc={bcc}&Subj={subject}&Body={body}"
		},
		
		"zoho": {
			"name": "Zoho mail", 
			"url": "https://zmail.zoho.com/mail/compose.do?extsrc=mailto&mode=compose&tp=zb&ct={to}"
		}
	};

var popupManager=new Object();
	popupManager["styler"]=function(popupId) {		
		var popupEle=$("#"+ popupId +"_popup.popupContainer .thePopup");
		
		popupEle.css("left", ($(window).width()-popupEle.width())/2);
		
		$("#"+ popupId +"_popup.popupContainer").toggleClass("abs", (popupEle.height() > $(window).height()));
	};
			
	popupManager["open"]=function(popupId) {
		if (! $("html").hasClass("viewingPopup") && $("#"+ popupId +"_popup.popupContainer").length) {
			$("html").addClass("viewingPopup viewingPopup_"+ popupId +"");
			$("#"+ popupId +"_popup.popupContainer").addClass("active");
			
			popupManager.styler(popupId);
			
			$("html").toggleClass("longerThenWin", $(window).height()<$("body").height());
		}
	};	
	
	popupManager["close"]=function(popupId) {
		$("html").removeClass("viewingPopup viewingPopup_"+ popupId +"");
		$("#"+ popupId +"_popup.popupContainer").removeClass("active");
	};
	
	$(window).on("resize", function() {
		$("div.popupContainer").each(function() {
			if ($(this).hasClass("active")) {
				popupManager.styler($(this).attr("id").replace("_popup", ""));
			}
		});
	}).on("keydown", function(event) {				
		if  (event.keyCode == 27 && $("html").hasClass("viewingPopup")) {
			$("div.popupContainer").each(function() {
				if ($(this).hasClass("active")) {
					popupManager.close($(this).attr("id").replace("_popup", ""));
				}
			});
		}
	});

function createToken(L) {
	var letters="qwertyuiopasdfjklzxcvbnm", token="";
	
	for(T=1; T<L; T++) {				
		switch (Math.floor((Math.random()*2))) {
			case 1: 
				token+=letters[(Math.floor(Math.random()*letters.length))];
				break;
							
			default:
				token+=Math.floor(Math.random()*9);
		}
	}
	
	return token;
}

$(window).on("resize", function(event) {
	$("html").toggleClass("longerThenWin", $(window).height()<$("body").height());
});

// Simple Sizing
var numberOfSizes=3;

function changeFontSize(Num) {
	for (size=1; size <= numberOfSizes; size++) {
		$("body").removeClass("fontSize"+size);
	}

	$("body").addClass("fontSize"+Num);
	
	$("#simpleSizing a").each(function() {
		$(this).removeClass("inUse");
	});
	
	localStorage.setItem("simpleSize", Num);
	
	$("#simpleSizing a[option='"+ localStorage.getItem("simpleSize") +"']").addClass("inUse");
}

var contactMe_submitKey=createToken(6);

$(document).ready(function() {
	$(window).trigger("resize");
	
	$(".menu a").each(function() {
		if ($(this).attr("href") == window.location.pathname) {
			$(this).addClass("onIt");
		}
	});
	
	// Top Link
	$('a#topLink').click(function(event) {
		event.preventDefault();
		$('body,html').animate({scrollTop: $('body,html').offset().top,}, '1500', 'swing');
	});
	
	// Simple Sizes
	for (size=1; size <= numberOfSizes; size++) {
		 $("#simpleSizing").append("<a option='"+ size +"' href='javascript: changeFontSize("+ size +");'>A</a>");
	}

	if (localStorage.getItem("simpleSize")) {	
		changeFontSize(localStorage.getItem("simpleSize"));
	}
	
	// Contant Me Form	
	$("form[name='contactMe'] input, form[name='contactMe'] textarea").each(function() {
		$(this).focus(function() {
			var name=$(this).attr("name");
			$("label[for='"+ name +"']").css("font-style", "italic");
		}).blur(function() {
			var name=$(this).attr("name");
			$("label[for='"+ name +"']").css("font-style", "normal");
		});
	});

	var canvas = document.getElementById("submit-key");
	var context = canvas.getContext("2d");
		context.font = "bold 100px Arial";
		context.fillText(contactMe_submitKey, 0, 100);
	
	$("form[name=contactMe] input[name=submit-key]").on("input", function() {
		if (! ($(this).val() == contactMe_submitKey)) {
			$(this).addClass("error").removeClass("good");
		}
		else {
			$(this).addClass("good").removeClass("error");
		}
	});
	
	$("form[name=contactMe] input[required], form[name=contactMe] textarea[required]").each(function() {
		$(this).change(function() {
			if ($(this).val() == "") {
				$(this).addClass("error");
			}
			else {
				$(this).removeClass("error");
			}
		});
	});

	$("form[name=contactMe]").on("submit", function(e) {
		if (! $("form[name=contactMe] input[name=submit-key]").val() == contactMe_submitKey) {
			$("form[name=contactMe] input[name=submit-key]").addClass("error");

			e.preventDefault();
			return false;
		}

		$("form[name=contactMe] input[required], form[name=contactMe] textarea[required]").each(function() {
			if ($(this).val() == "") {
				$(this).addClass("error");
			}
			else {
				$(this).removeClass("error");
			}
		}).each(function() {
			if ($(this).val() == "") {
				e.preventDefault();
				return false;
			}
		});
	});	
});

