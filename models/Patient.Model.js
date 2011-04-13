var scaffold = require('../models/ScaffoldObject');

var Patient = module.exports = function(){
	this.id = null;
	this.mrn = null;
	this.first_name = null;
	this.middle_name = null;
	this.last_name = null;
	this.date_of_birth = null;
};

Patient.prototype = new scaffold();