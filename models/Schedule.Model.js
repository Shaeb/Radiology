var TimeSlot = function(date){
	// expecting ex: 2011-04-01 08:00:00 
	var crumbs = date.split(' ');
	//this.id = 0;
	this.day = crumbs[0];
	this.time = crumbs[1];
	crumbs = this.time.split(':');
	this.hour = crumbs[0];
	this.minute = crumbs[1];
	//this.title = '';
	//this.description = '';
};

// expects list to be an array of objects of {time: XXXX, slots: X}
var ScheduleList = module.exports = function(list){
	this.schedule = new Array();
	this.date = '';
	for(var i = 0; i < list.length; (++i)){
		this.addTimeToList(
			(1000 > list[i].time ) ? '0' + list[i].time.toString() : list[i].time.toString(), 
			list[i].slots);
	}
};

ScheduleList.prototype.addTimeToList = function(time, slots){
	if(!this.doesTimeExist(time)){
		this.schedule.push({
			time: time,
			numberOfSlots: slots,
			procedures: []
		});
	} else {	
		var temp = this.getObjectAtTime(time);
		if(slots < this.schedule[temp.index].slots ) {
			this.schedule[temp.index].procedures.splice(0, (slots - this.schedule[temp.index].slots));
		}
		this.schedule[temp.index].slots = slots;
	}
};

ScheduleList.prototype.addProcedureToList = function(procedure){
	if(this.isProcedureAlreadyScheduled(procedure))
		return false;
	var dateRegEx = /^\d{4,4}-\d\d-\d\d\s\d\d:\d\d:\d\d$/;
	if(dateRegEx.exec(procedure.scheduled_time)){
		var temp = new TimeSlot(procedure.scheduled_time);
		var time = temp.hour.toString() + temp.minute.toString();
		var obj = this.getObjectAtTime(time);
		if(this.schedule[obj.index].procedures.length < this.schedule[obj.index].numberOfSlots){
			this.schedule[obj.index].procedures.push(procedure);
			return true;
		} else {
			return false;
		}
	}
};

// stubbed for now, but basically you cannot schedule a patient to have two contrasted studies within 24 hrs of each other
// so, this method needs to 
ScheduleList.prototype.isProcedureAlreadyScheduled = function(procedure){
	return false;
};

ScheduleList.prototype.getObjectAtTime = function(time){
	for(var i = 0; i < this.schedule.length; i++){
		if(this.schedule[i].time == time) 
			return {index: i, item: this.schedule[i]};
	}
	return undefined;
}

ScheduleList.prototype.doesTimeExist = function(time){
	return (undefined !== this.getObjectAtTime(time));
}