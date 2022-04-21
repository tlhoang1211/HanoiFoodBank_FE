
"use strict";

var date = new Date(), y = date.getFullYear(), m = date.getMonth();
var toDate = new Date(y, m + 1, 0).getTime(), fromDate = new Date(y, m, 1).getTime();
var firstDay = new Date(y, m, 1).toLocaleDateString("vi-VN");
var lastDay = new Date(y, m + 1, 0).toLocaleDateString("vi-VN");
var chartDonate = null, chartFood = null, chartRequest = null;
var arrSeries = [], arrCategory = [], arrSeriesFood = [], arrCategoryFood = [], arrSeriesRequest = [], arrCategoryRequest = [];
var configchart = {
	series: [{
		name: "Charity Money",
		data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
	}, {
		name: "Food",
		data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
	}, {
		name: "Request",
		data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
	}],
	chart: {
		foreColor: "#9ba7b2",
		type: "bar",
		height: 300,
		toolbar: {
			show: !1
		}
	},
	plotOptions: {
		bar: {
			horizontal: !1,
			columnWidth: "55%",
			endingShape: "rounded"
		}
	},
	grid: {
		borderColor: 'rgba(255, 255, 255, 0.12)',
		show: true,
	},
	dataLabels: {
		enabled: !1
	},
	stroke: {
		show: !0,
		width: 2,
		colors: ["transparent"]
	},
	colors: ["rgba(255, 255, 255, 0.60)", "#fff", "rgba(255, 255, 255, 0.25)"],
	xaxis: {
		categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]
	},
	fill: {
		opacity: 1
	},
	tooltip: {
		theme: "dark",
		y: {
			formatter: function(e) {
				return "$ " + e + " thousands"
			}
		}
	}
};
function convertDate(d) {
	var str = moment(d).format('DD/MM/YYYY');
	return str;
}
function drawChart() {
	
	var dataPost = {
		"startDate": moment(fromDate).format('YYYY-MM-DD'),
    	"endDate": moment(toDate).format('YYYY-MM-DD')
	}
	// donate
	getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/statistics/donation', JSON.stringify(dataPost), function (result) {
        if (result && result.status == 200) {
			var countDonate = 0;
            if (result.data && result.data.length > 0) {
				arrSeries = result.data.map(function(e){
					countDonate += e.total;
					return e.total;
				});
				arrCategory = result.data.map(function(e){
					var splitdate = convertDateTime(e.dateTime);
					return splitdate;
				});
            }
			configchart.series = [{
				name: "Charity Money",
				data: arrSeries
			}]
			configchart.colors = ["rgba(255, 255, 255, 0.60)"];
			configchart.xaxis.categories = arrCategory;
			configchart.tooltip = {
				theme: "dark",
				y: {
					formatter: function(e) {
						return "$ " + e + " thousands"
					}
				}
			}
			renderCanvas('#chart_donate', configchart);
			$('.countDonate').text('$'+ countDonate);
        }
    },
        function (errorThrown) { }
    );
	var countFood = 0, countRequest = 0;
	// food
	getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/statistics/food', JSON.stringify(dataPost), function (result) {
        if (result && result.status == 200) {
			if (result.data && result.data.length > 0) {
				arrSeriesFood = result.data.map(function(e){
					countFood += e.total;
					return e.total;
				});
				arrCategoryFood = result.data.map(function(e){
					var splitdate = convertDateTime(e.dateTime);
					return splitdate;
				});
            }
			configchart.series = [{
				name: "Food",
				data: arrSeriesFood
			}]
			configchart.colors = ["#fff"];
			configchart.xaxis.categories = arrCategoryFood;
			configchart.tooltip = {
				theme: "dark",
				y: {
					formatter: function(e) {
						return e + " food";
					}
				}
			}
			renderCanvas('#chart_food', configchart);
			$('.countFood').text(''+ countFood);
        }
    },
        function (errorThrown) { }
    );
	// request
	getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/statistics/request', JSON.stringify(dataPost), function (result) {
		if (result && result.status == 200) {
			if (result.data) {
				if (result.data && result.data.length > 0) {
					arrSeriesRequest = result.data.map(function(e){
						countRequest += e.total;
						return e.total;
					});
					arrCategoryRequest = result.data.map(function(e){
						var splitdate = convertDateTime(e.dateTime);
						return splitdate;
					});
				}
				configchart.series = [{
					name: "Request",
					data: arrSeriesRequest
				}]
				configchart.colors = ["rgba(255, 255, 255, 0.25)"];
				configchart.xaxis.categories = arrCategoryRequest;
				configchart.tooltip = {
					theme: "dark",
					y: {
						formatter: function(e) {
							return e + " request";
						}
					}
				}
				renderCanvas('#chart_request', configchart);
				$('.countRequest').text(''+ countRequest);
			}

		}
	},
		function (errorThrown) { }
	);
}
function convertDateTime(date) {
	var time = '';
	var splitDate = date.split('-');
	time = splitDate[2] + '/' + splitDate[1];
	return time
}
function renderCanvas(ele, configchart) {
	if (ele == '#chart_donate') {
		if (!chartDonate) {
			chartDonate = new ApexCharts(document.querySelector(ele), configchart);
			chartDonate.render();
		} else {
			chartDonate.updateOptions(configchart);
		}
	} else if (ele == '#chart_food') {
		if (!chartFood) {
			chartFood = new ApexCharts(document.querySelector(ele), configchart);
			chartFood.render();
		} else {
			chartFood.updateOptions(configchart);
		}
	} else {
		if (!chartRequest) {
			chartRequest = new ApexCharts(document.querySelector(ele), configchart);
			chartRequest.render();
		} else {
			chartRequest.updateOptions(configchart);
		}
	}
	
}
function changTypeChart(e, type) {
	var typeChart = 'bar', stroke;
	var findClass = $(e).children().hasClass('bx-bar-chart-alt-2');
	if (findClass) {
		$(e).children().removeClass('bx-bar-chart-alt-2').addClass('bx-line-chart');
		typeChart = 'line';
		stroke = {
			curve: 'straight',
			show: !0,
			width: 2,
			colors: ["#fff"]
		}
	} else {
		$(e).children().removeClass('bx-line-chart').addClass('bx-bar-chart-alt-2');
		typeChart = 'bar';
		stroke = {
			show: !0,
			width: 2,
			colors: ["transparent"]
		}
	}
	if (type == 'donate') {
		configchart.series = [{
			name: "Charity money",
			data: arrSeries
		}];
		configchart.colors = ["rgba(255, 255, 255, 0.60)"];
		configchart.xaxis.categories = arrCategory;
		configchart.chart.type = typeChart;
		configchart.stroke = stroke;
		configchart.tooltip = {
			theme: "dark",
			y: {
				formatter: function(e) {
					return "$ " + e + " thousands";
				}
			}
		}
		chartDonate.updateOptions(configchart)
	} else if (type == 'food') {
		configchart.series = [{
			name: "Food",
			data: arrSeriesFood
		}];
		configchart.colors = ["#fff"];
		configchart.xaxis.categories = arrCategoryFood;
		configchart.chart.type = typeChart;
		configchart.stroke = stroke;
		configchart.tooltip = {
			theme: "dark",
			y: {
				formatter: function(e) {
					return e + " food";
				}
			}
		}
		chartFood.updateOptions(configchart)
	} else{
		configchart.series = [{
			name: "Request",
			data: arrSeriesRequest
		}];
		configchart.colors = ["rgba(255, 255, 255, 0.25)"];
		configchart.xaxis.categories = arrCategoryRequest;
		configchart.chart.type = typeChart;
		configchart.stroke = stroke;
		configchart.tooltip = {
			theme: "dark",
			y: {
				formatter: function(e) {
					return e + " request";
				}
			}
		}
		chartRequest.updateOptions(configchart)
	}
}
function initDaterangepicker(alwaysShowCalendars) {
	$('#rs-date').daterangepicker({
		parentEl: ".divDateRangePicker",
		format: 'DD/MM/YYYY',
		opens: "right",
		drops: 'down',
		startDate: fromDate ? moment(fromDate) : moment().startOf('month'),
		endDate: toDate ? moment(toDate) : moment().endOf('month'),
		alwaysShowCalendars: true,
		ranges: {
			'Today': [moment(), moment()],
			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}).on('hide.daterangepicker', function (ev, picker) {
		var fromDate_temp = new Date(picker.startDate.format('YYYY-MM-DD HH:mm')).setHours(0, 0, 0, 0);
		var toDate_temp = new Date(picker.endDate.format('YYYY-MM-DD HH:mm')).setHours(0, 0, 0, 0) + 86400000 - 1;
		if (toDate_temp != toDate || fromDate_temp != fromDate) {
			toDate = toDate_temp;
			fromDate = fromDate_temp;
		}
		if (!fromDate && !toDate) {
			initDaterangepicker(false);
			$('#rs-date').val(firstDay + " - " + lastDay);
		} else {
			initDaterangepicker(true);
			$('#rs-date').val(convertDate(fromDate) + ' - ' + convertDate(toDate));
		}
		drawChart();
	}).on('show.daterangepicker', function (ev, picker) {
	});
}
function initPageDashboard() {
	
	if (fromDate && toDate) {
		$('#rs-date').val(new Date(fromDate).toLocaleDateString("vi-VN") + ' - ' + new Date(toDate).toLocaleDateString("vi-VN"));
	} else {
		$('#rs-date').val(firstDay + " - " + lastDay);
	}
	initDaterangepicker(false);
	drawChart();
}
initPageDashboard();