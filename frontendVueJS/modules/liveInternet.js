if (!/:90/.test(location.host))
	$('<a />', {href:'http://www.liveinternet.ru/click', target:'_blank', rel: 'nofollow'})
	.appendTo($f('#LIcounter' ))
	.append('<img src= "//counter.yadro.ru/hit?t24.1;r'+escape(document.referrer)+((typeof(screen)=="undefined")?"": ";s"+screen.width+"*"+screen.height+"*"+(screen.colorDepth? screen.colorDepth: screen.pixelDepth))+";u"+escape(document.URL) + ";"+Math.random() + ' alt="LI" title="LiveInternet: показано число посетителей за сегодня" width=88 height=15>');


/*
<!--LiveInternet counter--><script type="text/javascript"><!--
document.write("<a href='//www.liveinternet.ru/click' "+
"target=_blank><img src='//counter.yadro.ru/hit?t23.1;r"+
escape(document.referrer)+((typeof(screen)=="undefined")?"":
";s"+screen.width+"*"+screen.height+"*"+(screen.colorDepth?
screen.colorDepth:screen.pixelDepth))+";u"+escape(document.URL)+
";"+Math.random()+
"' alt='' title='LiveInternet: показано число посетителей за"+
" сегодня' "+
"border='0' width='88' height='15'><\/a>")
//--></script><!--/LiveInternet-->
*/