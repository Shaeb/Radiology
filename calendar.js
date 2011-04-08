var Calendar = module.exports = function(createForDate){
	var regex = /^\d{4,4}(-\d\d){2,2}$/;
	if(undefined !== createForDate && regex.test(createForDate)){
		this.today = new Date(createForDate);
	} else {
		this.today = new Date();
	}
	this.firstDayOfTheWeek = 'Sunday';
	this.weekValues = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	this.format = 'Y-m-d';
	this.month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];
	this.month_name = this.month_names[this.today.getMonth()];
	this.month_number = this.today.getMonth();
	this.year = this.today.getFullYear();
	this.month_day = this.today.getDate();
	this.daysInMonth = this.totalDaysInMonth(this.year, this.month_number);
	this.firstDay = new Date(this.year, this.today.getMonth(), 1);
	this.lastDay = new Date(this.year, this.today.getMonth(), this.daysInMonth);
	this.firstDayInfo = {
		weekday: this.weekValues[this.firstDay.getDay()]
	};
	this.lastDayInfo = {
		weekday: this.weekValues[this.lastDay.getDay()]
	};
// this represents how many days from the first week the month starts on belongs to the prior month
	this.daysMissingInFirstWeek = this.firstDay.getDay();
// this represents how many days are left in the week when the month is over
	this.daysMissingInLastWeek = 7 - this.lastDay.getDay() + 1;
	this.numberOfWeeks = Math.floor((this.daysMissingInFirstWeek + this.daysInMonth + this.daysMissingInLastWeek)/7);
	
	// build previous month ...
	this.previousMonth = {
		year: this.year,
		month: this.month_number - 1,
		firstDay: 1
	};
	
	if( 1 == this.month_number){
		this.previousMonth.month = 12;
		this.previousMonth.year--;
	}
	this.previousMonth.dateObject = new Date(this.previousMonth.year, this.previousMonth.month, 1);
	this.previousMonth.numberOfDays = this.totalDaysInMonth(this.previousMonth.year, this.previousMonth.month);
	this.displayDaysForNextMonth = 1;
	
	this.constants = {
		CALENDAR_STYLE_CONTAINER: 'calendar_container',
		CALENDAR_STYLE_HEADER: 'calendar_header',
		CALENDAR_STYLE_TABLE: 'calendar_table',
		CALENDAR_STYLE_DATE_NOT_IN_MONTH: 'calendar_date_not_in_month',
		CALENDAR_STYLE_DATE_IN_MONTH: 'calendar_date_in_month',
		CALENDAR_STYLE_DATE: 'calendar_date',
		CALENDAR_STYLE_DATE_ITEM: 'calendar_date_item',
		CALENDAR_STYLE_LAST_COLUMN: 'calendar_last_column',
		CALENDAR_STYLE_ROW: 'calendar_row',
		CALENDAR_STYLE_BOTTOM_ROW: 'calendar_bottom_row',
		CALENDAR_STYLE_TODAY: 'calendar_today',
		CALENDAR_STYLE_DATA_CONTAINER: 'calendar-date-data-container'
	};
	
	// data store calendar info
	this.data = {};
};

Calendar.prototype.totalDaysInMonth = function(year, month){
	return new Date(year, month, 0).getDate();
};

Calendar.prototype.concatClass = function(stringToConcat, className){
	return (0 == stringToConcat.length) ? className : stringToConcat + ' ' + className;
};

Calendar.prototype.build = function(){
	this.data.container = {style: this.constants.CALENDAR_STYLE_CONTAINER};
	this.data.header = {
		text: this.month_name + ' ' + this.year,
		style: this.constants.CALENDAR_STYLE_HEADER
	};
	this.data.table = {
		attributes: {
			style: this.constants.CALENDAR_STYLE_TABLE,
			cellspacing: 0,
			cellpadding: 0
		},
		header: this.weekValues
	};
	
	this.data.table.body = {
		rows: new Array()
	};
	
	var classToAdd = null;
	var payPeriod = null;
	var rowData = {};
	var displayDate = 0;
	var dayOfMonthToDisplay = 1;
	var dateInMonth = false;
	
	for(var i = 1; i <=  this.numberOfWeeks; (++i)){
		classToAdd = (i != this.numberOfWeeks) ? this.constants.CALENDAR_STYLE_ROW : 
			this.constants.CALENDAR_STYLE_ROW + ' ' + this.constants.CALENDAR_STYLE_BOTTOM_ROW;
		if(i % 2) {
			payPeriod = 'payperiod_' + i;
		}
		rowData = {
			row: {
				style: classToAdd + ' ' + payPeriod,				
				data: []
			}
		};
		for(var j = 0; j < 7; (++j)){
			classToAdd = (6 == j) ? this.constants.CALENDAR_STYLE_LAST_COLUMN : '';
			displayDate = 0;

			// firstm check if we are at the beggining of the month and need to display padding values
			if(j < this.daysMissingInFirstWeek && i == 1){
				classToAdd = this.concatClass(classToAdd, this.constants.CALENDAR_STYLE_DATE_NOT_IN_MONTH);
				displayDate = (this.previousMonth.numberOfDays - (this.daysMissingInFirstWeek - j) + 1); 
				dateInMonth = false;
				/**
				console.log('this.previousMonth.numberOfDays => ' + this.previousMonth.numberOfDays);
				console.log('this.daysMissingInFirstWeek => ' + this.daysMissingInFirstWeek);
				console.log('j => ' + j);
				console.log('(this.previousMonth.numberOfDays - (this.daysMissingInFirstWeek - j) + 1) => ' + 
					(this.previousMonth.numberOfDays - (this.daysMissingInFirstWeek - j) + 1));
				console.log('displaying day from last month: ' + displayDate);
				**/
			} else {
				// guess not, display regular values
				// dealing with a day in this month that exists in the past.  e.g., iths the 12th and this is the 3rd
				if(dayOfMonthToDisplay <= this.daysInMonth){
					displayDate = dayOfMonthToDisplay;
					if(this.today.getDate() == displayDate){
						classToAdd = this.concatClass(classToAdd, this.constants.CALENDAR_STYLE_TODAY);
					}
					classToAdd = this.concatClass(classToAdd, this.constants.CALENDAR_STYLE_DATE_IN_MONTH);
					dayOfMonthToDisplay++;
					dateInMonth = true;
				} else {
					// we are at the end of the month now ...
					classToAdd = this.concatClass(classToAdd, this.constants.CALENDAR_STYLE_DATE_NOT_IN_MONTH);	
					displayDate = this.displayDaysForNextMonth;
					this.displayDaysForNextMonth++;
					dateInMonth = false;
				}
			}
			rowData.row.data.push({
				attributes: {
					style: this.concatClass(classToAdd, this.constants.CALENDAR_STYLE_DATE_ITEM),
					id: 'date_' + i + '_' + j
				},
				dateContainer: {
					style: this.constants.CALENDAR_STYLE_DATE,
					text: displayDate
				},
				textContainer: {
					style: this.constants.CALENDAR_STYLE_DATA_CONTAINER,
					data: (dateInMonth) ? [displayDate, displayDate, displayDate] : ['&nbsp;','&nbsp;','&nbsp;']
				}
			});
			//console.log(rowData);
		}
		this.data.table.body.rows.push(rowData);
	}
}