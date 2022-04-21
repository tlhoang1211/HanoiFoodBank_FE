"use strict"

function changePage(e, page){
    var classLi = document.getElementsByClassName("mm-sidebar");
    if (classLi && classLi.length > 0) {
		for (let index = 0, len = classLi.length; index < len; index++) {
			var element = classLi[index];
			element.classList.remove('active');
		}
	}
	e.parentElement.classList.add("active");
	var pageContent = document.getElementsByClassName('page-content');
	if (pageContent.item(0)) {
		pageContent.item(0).remove();
	}
	localStorage.setItem('page', page);
	loadHtml( '../../../inc/layout/admin/content/' + page + '/' + page + '.html', '.page-wrapper', 'div', 'page-content', '', 'afterbegin', '../../../assets/js/admin/' + page + '/' + page + '.js');
}