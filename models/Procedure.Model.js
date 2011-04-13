var scaffold = require('../models/ScaffoldObject');
var patient = require('../models/Patient.Model');

var Procedure = module.exports = function(patient){
	this.patient = null;
	this.scheduled_time = null;
	this.diagnosis = null;
	this.protocol = null;
	this.area = null;
	this.status = null;
	
	if(undefined !== patient){
		this.patient = patient
	}
};

Procedure.prototype.toString = function(){
	return this.protocol + ' ' + this.diagnosis;
};