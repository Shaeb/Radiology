function Patient(){
	this.id = null;
	this.first_name = null;
	this.last_name = null;
	this.mrn = null;
	this.date_of_birth = null;
};

function Procedure(){
	this.id = null
	this.scheduled_date = null;
	this.time = null;
	this.hour = null;
	this.minute = null;
	this.protocol = null;
	this.diagnosis = null;
	this.patient = null;
}