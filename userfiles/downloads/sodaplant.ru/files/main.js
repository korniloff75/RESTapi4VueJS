
function wopenPrint(src)
{
	w=window.open(src, "print", "toolbars:no, scrollbars=1, width=770, height=700, top=" + ((screen.availHeight - 700)/2) + ", left=" + ((screen.availWidth - 770)/2));
	w.focus();
}