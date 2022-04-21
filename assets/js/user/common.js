"use strict";
$(function () {
	$("#header").load("./inc/header.html");
	$("#footer").load("./inc/footer.html");
});
function getCookie (key){
	if (document.cookie) {
		var value;
		var split = document.cookie.split(';');
		if (split && split.length > 0) {
			for (let index = 0, len = split.length; index < len; index++) {
				var element = split[index].trim();
				if (element.indexOf(key) != -1) {
					value = element.split('=')[1];
				}
			}
		}
		return value;
	} else {
		return '';
	}
}
var currentName = getCookie('username');
var isToken = getCookie('token');
function getTimeFromString(strDate) {
	var arrDateHour = strDate.split(' ');
	var arrDate = arrDateHour[0].split('/');
	var year = parseInt(arrDate[2]);
	var month = parseInt(arrDate[1]) - 1;
	var date = parseInt(arrDate[0]);
	var hours = parseInt(arrDateHour[1].split(':')[0]);
	var minutes = parseInt(arrDateHour[1].split(':')[1]);
	if (isNaN(hours)) {
		hours = 0;
	}
	if (isNaN(minutes)) {
		minutes = 0;
	}
	return new Date(year, month, date, hours, minutes, 0, 0).getTime();
}

function timeFromString(strDate) {
	var arrDate = strDate.split('/');
	var year = parseInt(arrDate[2]);
	var month = parseInt(arrDate[1]) - 1;
	var date = parseInt(arrDate[0]);
	return new Date(year, month, date).getTime();
}


