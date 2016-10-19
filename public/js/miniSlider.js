var miniSlider_data=new Object();

function changeSlideOnMiniSlider(eleID, slideNum) {
	if (eleID!=undefined && slideNum!=undefined && eleID in miniSlider_data) {
		var aMiniSliders_data=miniSlider_data[(eleID)];
		
		if (slideNum=="next" || slideNum=="back") {
			for (es=0; es < aMiniSliders_data['slides'].length; es++) {
				if (! new RegExp("( |)(hideSlide)", "g").test(aMiniSliders_data['slides'][es].className)) {
					eval("var slideNum="+ ((slideNum=="next")?((es==(aMiniSliders_data['slides'].length-1))?"0":"es+1"):((es==0)?(aMiniSliders_data['slides'].length-1):"es-1")));
				}
			}
		}
		
		if (Number(slideNum)!=NaN) {
			for (es=0; es<aMiniSliders_data["slides"].length; es++) {
				aMiniSliders_data["slides"][es].className+=" hideSlide";
				aMiniSliders_data["slidePickers"][es].className=aMiniSliders_data["slidePickers"][es].className.replace(new RegExp("( |)(selected)", "g"), "");
				
				if (es==slideNum) {
					aMiniSliders_data["slidePickers"][es].className+=" selected";
					aMiniSliders_data["slides"][es].className=aMiniSliders_data["slides"][es].className.replace(new RegExp("( |)(hideSlide)", "g"), "");
					aMiniSliders_data["slides"][es].className+=" currentSlide";
				}
			}
		}
	}
}

function miniSliderTimer(eleID, time) {if (miniSlider_data[(eleID)]["timer"]==true) {eval("setTimeout(function() {if (miniSlider_data['"+eleID+"']['timer']==true) {changeSlideOnMiniSlider('"+ eleID +"', 'next'); miniSliderTimer('"+ eleID +"', "+ time +");}}, "+ time +");");}}

function slideSelector(eleID, slideNum) {
	changeSlideOnMiniSlider(eleID, slideNum);
	miniSlider_data[(eleID)]["timer"]=new Boolean(false);
}

if (document.querySelector) {var miniSlider_eleQuery=document.querySelectorAll(".miniSlider[id]");}
else {
	var miniSlider_eleQuery=new Array();
	
	for (fe=0; fe<document.getElementsByTagName("div").length; fe++) {
		var ele=document.getElementsByTagName("div")[fe];
		
		if (ele.hasAttribute("id") && hClass(ele, "miniSlider")) {
			miniSlider_eleQuery.splice(miniSlider_eleQuery.length, 0, ele);
		}
	}
}

for (ms=0; ms < miniSlider_eleQuery.length; ms++) {
	var a_miniSlider=miniSlider_eleQuery[ms];
	
	miniSlider_data[(a_miniSlider.getAttribute("id"))]=new Object();
		var aMiniSliders_data=miniSlider_data[(a_miniSlider.getAttribute("id"))];
	
		aMiniSliders_data["domEle"]=miniSlider_eleQuery[ms];
		
	if (document.querySelector) {
		aMiniSliders_data["slides"]=document.querySelectorAll("#"+ a_miniSlider.getAttribute("id") +".miniSlider .slide");
	}
	else {
		aMiniSliders_data["slides"]=new Array();
		
		for (mss=0; mss < a_miniSlider.childNodes.length; mss++) {
			var maybeSlide=a_miniSlider.childNodes[mss];
			
			if (hClass(maybeSlide, "slides")) {
				for (msss=0; msss < maybeSlide.childNodes.length; msss++) {
					if (hClass(maybeSlide.childNodes[msss], "slide")) {
						aMiniSliders_data["slides"].splice(aMiniSliders_data["slides"].length, 0, maybeSlide.childNodes[msss]);
					}
				}
			
				break;
			}
			else if (hClass(maybeSlide, "slide")) {
				aMiniSliders_data["slides"].splice(aMiniSliders_data["slides"].length, 0, maybeSlide);
			}
		}
	}
	
	if (! new RegExp("(( |)(noSlidePicker))").test(a_miniSlider.className)) {
		var slidePicker_ele=document.createElement("div");
			slidePicker_ele.className="slidePicker";
			
		aMiniSliders_data["slidePickers"]=new Array();
		
		for (sp=0; sp < aMiniSliders_data["slides"].length; sp++) {
			var newSlidePicker=document.createElement("a");
				newSlidePicker.setAttribute("href", "javascript: slideSelector('"+ aMiniSliders_data["domEle"].getAttribute("id") +"', "+ sp +");");
			
			slidePicker_ele.appendChild(newSlidePicker);
					
			aMiniSliders_data["slidePickers"].splice(aMiniSliders_data["slidePickers"].length, 0, newSlidePicker);
		}
	
		a_miniSlider.appendChild(slidePicker_ele);	
	}
		
	changeSlideOnMiniSlider(a_miniSlider.getAttribute("id"), 0);
	
	if (a_miniSlider.hasAttribute("changeSlideAfter") && Number(a_miniSlider.getAttribute("changeSlideAfter"))!=NaN) {
		aMiniSliders_data["timer"]=new  Boolean(true);
		miniSliderTimer(a_miniSlider.getAttribute("id"), a_miniSlider.getAttribute("changeSlideAfter"));
	}
	
	miniSlider_data[(a_miniSlider.getAttribute("id"))]=aMiniSliders_data;
}

var styleSheet=[
	".miniSlider .slide.hideSlide{display: none;}",
	
	".miniSlider .slidePicker a{width: .375em; height: .375em; display: inline-block; margin: 0px; margin-left: .25em; border: .125em solid #000000; border-radius: .375em;}",
	
	".miniSlider .slidePicker a.selected{background-color: yellow;}",
];

document.write("<style>"+ styleSheet.join("\n") +"</style>");
