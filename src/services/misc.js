var filterPlayerByUid = false;

export const setIsFilterPlayerByUid = function (yes) {
	filterPlayerByUid = yes;
}

export const isFilterPlayerByUid = function () {
	return filterPlayerByUid;
}

export const getPlayerFilterFieldName = function() {
	if (filterPlayerByUid) {
		return "uid";
	} else {
		return "roleId";
	}
}

var selectedDateRangeFrom = null;
var selectedDateRangeTo = null;
var initedDateRange = false;

function getFormattedDateStr(date) {
	var month = '0' + (date.getMonth() + 1);
	var day = '0' + date.getDate();
	var formattedDate = `${date.getFullYear()}-${month.slice(-2, month.length)}-${day.slice(-2, day.length)}`;
	return formattedDate;
}

function initDateRange() {
	if (!initedDateRange) {
		var to = new Date();
		var from = new Date();
		from.setTime(to.getTime() - 3600 * 1000 * 24 * 6);

		setSelectedDateRange(getFormattedDateStr(from), getFormattedDateStr(to));
		initedDateRange = true;
	}
}

export const setSelectedDateRange = function(from, to) {
	selectedDateRangeFrom = from;
	selectedDateRangeTo = to;
}

export const getSelectedDate = function() {
  initDateRange();
  return selectedDateRangeTo;
}

export const getSelectedDateRangeFrom = function() {
	initDateRange();
	return selectedDateRangeFrom;
}

export const getSelectedDateRangeTo = function() {
	initDateRange();
	return selectedDateRangeTo;	
}
