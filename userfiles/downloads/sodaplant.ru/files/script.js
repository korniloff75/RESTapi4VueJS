var jshover = function() {
	var sfEls = document.getElementById("horizontal-multilevel-menu").getElementsByTagName("li");
	for (var i=0; i<sfEls.length; i++) 
	{
		sfEls[i].onmouseover=function()
		{
			this.className+=" jshover";
		}
		sfEls[i].onmouseout=function() 
		{
			this.className=this.className.replace(new RegExp(" jshover\\b"), "");
		}
	}
	var sfEls = document.getElementById("horizontal-multilevel-menu").getElementsByTagName("td");
	for (var i=0; i<sfEls.length; i++) 
	{
		sfEls[i].onmouseover=function()
		{
			var srt = "" + this.className;
			//if(srt == "noact root" || srt == "noact end" || srt == "root noact" || srt == "end noact")
				this.className+=" jshover";
		}
		sfEls[i].onmouseout=function() 
		{
			this.className=this.className.replace(new RegExp(" jshover\\b"), "");
		}
	}
}

if (window.attachEvent) 
	window.attachEvent("onload", jshover);