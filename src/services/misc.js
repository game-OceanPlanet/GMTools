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

//将时间戳转换为2019-01-01格式的显示 
var tempDate = null;
export const getFormattedDateString = function (time) {
  if (time <= 0) {
    return "";
  }
  tempDate = new Date();
  tempDate.setTime(time);
  var month = "0" + (tempDate.getMonth() + 1);
  var day = "0" + tempDate.getDate();
  var formattedDate = `${tempDate.getFullYear()}-${month.slice(-2, month.length)}-${day.slice(-2, day.length)}`;
  return formattedDate;
};
//将时间戳转换为2019-01-01 09:36:11格式的显示 
export const getFormattedToDateString = function (time) {
  if (time <= 0) {
    return "";
  }
  tempDate = new Date();
  tempDate.setTime(time);
  var month = "0" + (tempDate.getMonth() + 1);
  var day = "0" + tempDate.getDate();
  var hour = tempDate.getHours() > 9 ? tempDate.getHours() : "0" + tempDate.getHours();
  var minute = tempDate.getMinutes() > 9 ? tempDate.getMinutes() : "0" + tempDate.getMinutes();
  var second = tempDate.getSeconds() > 9 ? tempDate.getSeconds() : "0" + tempDate.getSeconds();
  var formattedDate = `${tempDate.getFullYear()}-${month.slice(-2, month.length)}-${day.slice(-2, day.length)}`;
  formattedDate += " " + hour + ":" + minute + ":" + second;
  return formattedDate;
};

/**
         * 返回不为0的格式
         */
        export const formatRemain4 = function(second)
        {
            var str = "";
            var day = Math.floor(second / 60 / 60 / 24);
            if (day != 0)
            {
                str += getZeroize(day) + "天";
            }
            var hour = Math.floor(second / 60 / 60) % 24;
            if (hour != 0)
            {
                str += getZeroize(hour) + "时";
            }
            var min = Math.floor(second / 60) % 60;
            if (min != 0)
            {
                str += getZeroize(min) + "分";
            }

            return str;
        };

        /** 不足两位补0 */
        export const getZeroize = function(time)
        {
            return (time < 10) ? "0" + time : time + "";
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
