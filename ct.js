var Patient = require('./models/Patient.Model');
var ScheduleList = require('./models/Schedule.Model');
var Procedure = require('./models/Procedure.Model');

// coordinator
exports.dispatch = function(params, req, res){
	switch(params.action){
		case 'autosuggest':
			var query = '';
			switch(params.target){
				case 'studies':
					query = 'select id, description as label from ProcedureProtocols';
					break;
				case 'diagnoses':
					query = 'select id, description as label from ProcedureDiagnoses';
					break;
				case 'patient':
					switch(req.query.filter){
						case 'mrn':
							query = "select id, concat(first_name,' ', last_name) as label from patients where mrn like '" + req.query.term + "%'";
							//params = [req.query.q];
							break;
						case 'patient':
						default:
							query = "select id, concat(first_name,' ', last_name) as label from patients where first_name like '%" + req.query.term + "%' or last_name like'%" + req.query.term + "%'";
							//params = [req.query.q, req.query.q];
						break;			
					}
					break;
			}
			exports.autosuggest(req, res, query);
			break;
		case 'view':
			switch(params.target){
				case 'schedule':
					exports.view_schedule(req, res);
					break;
				case 'calendar':
					var calendar = require('./models/Calendar.Model');
					req.calendar = new calendar();
					exports.view_calendar(req, res);
					break;
				case 'form':
					exports.view_form(req, res);
					break;
			}
			break;
		case 'new':
			switch(params.target){
				case 'schedule':
					exports.new_schedule(req, res);
			}
			break;
	}	
};

// GETs
exports.view_form = function(req, res){
	res.db.client.connect();
	var procedure = new Procedure(new Patient());
	// first, get patient
	res.db.client.query('select patient_id, first_name, last_name, date_of_birth, mrn from ct_schedule where schedule_id = ?',
		 [req.params.id], function(error, results, fields){
		if(error || results.length == 0){
			req.flash('error', 'No Patients Scheduled');
			var flash = req.flash();
			res.render('./index', {title: 'Error: No Patients Scheduled', error: true, flash: flash.error});
			res.db.client.end();
		} else {
			procedure.patient.id = results[0].patient_id;
			procedure.patient.first_name = results[0].first_name;
			procedure.patient.last_name = results[0].last_name;
			procedure.patient.date_of_birth = results[0].date_of_birth;
			procedure.patient.mrn = results[0].mrn;
			procedure.schedule_id = req.params.id;
			
			//res.db.client.end();
			res.db.client.query('select a.description as allergen from allergies als, allergens a where als.patient_id = ? and a.id = als.allergen_id',
				[procedure.patient.id], function(error, results, fields){
				//console.log(res.db.client.format(query, [req.params.id]));
				if(error){
					res.db.client.end();
					req.flash('error', 'No Patients Scheduled');
					var flash = req.flash();
					res.render('./index', {title: 'Error: No Patients Scheduled', error: true, flash: flash.error});
				} else {
					var allergies = new Array();
					if(results.length != 0){
						for(var i = 0; i < results.length;  i++){
								/**
								allergies.push({
									allergen: results[i].allergen,
									reaction: results[i].reaction
								});
								**/
							allergies.push(results[i].allergen);
						}
					} else {
						allergies.push('No Allergy Data Defined');
					}
					res.db.client.end();
				}
				res.render('forms', {
					layout: (req.query.minified) ? './minilayout' : './authenticated-layout.jade',
					title: 'CT Triage Form',
					showHeader: true,
					patient: {
						first_name: procedure.patient.first_name,
						last_name: procedure.patient.last_name,
						date_of_birth: procedure.patient.date_of_birth,
						mrn: procedure.patient.mrn,
						allergies: allergies
					}
				});
			});
		}
	});
};

exports.view_schedule = function(req, res){
	res.db.client.connect();
	res.db.client.query('select * from ct_schedule', function(error, results, fields){
		if(error || results.length == 0){
			req.flash('error', 'No Patients Scheduled');
			var flash = req.flash();
			res.render('./index', {title: 'Error on login', error: true, flash: flash.error});
		} else {
			res.render('ct/list', {
				layout: './authenticated-layout',
				title: 'CT Schedule',
				showHeader: false,
				patients: results
			});
		}
		res.db.client.end();
	});
};

exports.new_schedule = function(req, res){
	res.db.client.connect();
	var listItems = new Array();
	var detailContentItems = new Array();
	var schedule = null;
	var procedure = null;
	
	// first, need to build out slot options
	res.db.client.query('select time, slots from areatimeslots where area = 1', function(error, results, fields){
		if(error || results.length == 0){
			req.flash('error', 'No Patients Scheduled');
			var flash = req.flash();
			res.render('./index', {title: 'Error on login', error: true, flash: flash.error});
			res.db.client.end();
			next(error);
		} else {
			schedule = new ScheduleList(results);
			//res.db.client.end();
			//res.db.client.connect();
			res.db.client.query('select schedule_id, scheduled_time, first_name, last_name, diagnosis, protocol from ct_schedule where YEAR(scheduled_time) = ? and MONTH(scheduled_time) = ? and DAY(scheduled_time) = ?', 
				[req.params.year, req.params.month, req.params.day],
			  function( error, results, fields){
				if(error || results.length == 0){
					console.log(results);
					req.flash('error', req.params.id);
					var flash = req.flash();
					res.render('./index', {title: 'Error on login', error: true, flash: flash.error});
					res.db.client.end();
					//next(error);
				} else {
					for(var i = 0; i < results.length; (++i)){
						procedure = new Procedure(new Patient());
						procedure.schedule_id = results[i].schedule_id;
						procedure.patient.first_name = results[i].first_name;
						procedure.patient.last_name = results[i].last_name;
						procedure.protocol = results[i].protocol;
						procedure.diagnosis = results[i].diagnosis;
						procedure.scheduled_time = results[i].scheduled_time;
						schedule.addProcedureToList(procedure);
					}
					res.db.client.end();
					res.render('schedule', { 
						title: 'New Schedule',
						year: req.params.year,
						month: req.params.month,
						day: req.params.day,
						schedule: schedule.schedule
					});
				}
			});
		}
	});
};

exports.view_calendar = function(req, res){
	/**
	rows = req.calendar.data.table.body.rows[0];
	for(var i = 0; i < rows.row.data.length; (++i)){
		console.log(rows.row.data[i]);
	}
	**/
	res.db.client.connect();
	res.db.client.query('select * from ct_schedule order by scheduled_time', function(error, results, fields){
		if(error || 0 == results.length){
			req.flash('error', 'No Patients Scheduled');
			var flash = req.flash();
			res.render('./index', {title: 'Error building schedule', error: true, flash: flash.error});
		} else {
			var scheduled_dates = new Array();
			var regex = /^\d{4,4}(-\d{2,2}){2,2}/;
			for(x = 0; x < results.length; (++x)){
				if( 0 < regex.exec(results[x].scheduled_time).length)
					//scheduled_dates.push(new Date(regex.exec(results[x].scheduled_time)[0]));
					scheduled_dates.push(regex.exec(results[x].scheduled_time)[0]);
			}
			req.calendar.build(req.calendar.constants.BUILD_MONTH);
			var rows = req.calendar.data.table.body.rows;
			var dates = null;
			var date = null;
			var date_str = '';
			var m = 3;
			for(var i = 0; i < rows.length; (++i)){
				dates = rows[i].row.data;
				for(var k = 0; k < dates.length; (++k)){
					date = dates[k];
					for(var l = 0; l < scheduled_dates.length; (++l)){
						date_str = date.attributes.year + '-' + date.attributes.month + '-' + date.attributes.day;
						/**
						console.log('scheduled_dates[l] => ' + scheduled_dates[l]);
						console.log('date.attributes.date => ' + date_str);
						console.log('match? => ' + date_str.match(scheduled_dates[l]));
						**/
						if(date_str.match(scheduled_dates[l])){
							date.textContainer.data.push(results[l].first_name + ' ' + results[l].last_name);
							//console.log('found a date at: ' + l);
						} else {
							//console.log('didnt find a date');
						}
					}
					// pad dates with a minimum of three entries
					/**
					m = (3 - date.textContainer.data.length)
					while(m >= 0){
						date.textContainer.data.push('&nbsp;');
						m--;
					}
					**/
				}
			}
			res.render('calendar', {
				layout: './authenticated-layout',
				title: 'CT Schedule',
				showHeader: false,
				calendar: req.calendar.data
			});
		}
		res.db.client.end();
	});
};

exports.autosuggest = function(req, res, query){
	res.db.client.connect();
	res.db.client.query(query, function(error, results, fields){
		response = new Array();
		if(error || results.length == 0){
			response.push( {value: 1, label: 'No results found.'});
		} else {
			for(var i = 0; i < results.length; (++i)){
				response.push({value: results[i].id, label: results[i].label});
			}
		}
		res.db.client.end();
		res.contentType('json');
		res.send(JSON.stringify(response));
	});
};

// POSTs

exports.post = function(req,res){
	var ct_form = req.mongoose.model;
	var params = req.body.triage;
	
	// contrast hx
	ct_form.contrast_hx.push(req.body.contrast_history);
	
	ct_form.patient = req.body.patient;
	
	// allergies
	if(undefined !== params.allergies){
	var allergies = params.allergies.split(', ');
		for(allergy in allergies){
			ct_form.allergies.push({allergen: allergy, reaction: 'unknown'});
		}
	}
	
	// asthma
	if(cbxToBoolean(params.asthma_mild) || cbxToBoolean(params.asthma_moderate) || cbxToBoolean(params.asthma_severe)){
		ct_form.asthma.has = true;
		ct_form.asthma.severity = (cbxToBoolean(params.asthma_mild)) ? 'mild' : 
			(cbxToBoolean(params.asthma_moderate)) ? 'moderate' : 'severe';
	}
	
	// kidneys
	if(cbxToBoolean(params.transplant) || cbxToBoolean(params.nephrectomy) || cbxToBoolean(params.dialysis)){
		ct_form.kidney_hx.has = true;
		ct_form.kidney_hx.dx_type = (cbxToBoolean(params.transplant)) ? 'transplant' : 
			(cbxToBoolean(params.nephrectomy)) ? 'nephrectomy' : 'dialysis';
	}
	
	// dm
	if(cbxToBoolean(params.insulin) || cbxToBoolean(params.metformin) || cbxToBoolean(params.diabetes_other)){
		ct_form.diabetes_hx.has = true;
		ct_form.diabetes_hx.dx_type = (cbxToBoolean(params.insulin)) ? 'insulin' : 
			(cbxToBoolean(params.metformin)) ? 'metformin' : 'other';
	}
	
	ct_form.myasthenia_gravis = cbxToBoolean(params.other_mg);
	ct_form.multiple_myeloma = cbxToBoolean(params.other_mm);
	ct_form.hyperthyroidism = cbxToBoolean(params.other_hthy);
	
	// ssd
	if(cbxToBoolean(params.ssd_crisis) || cbxToBoolean(params.ssd_no_crisis)){
		ct_form.sickle_cell_hx.has = true;
		ct_form.sickle_cell_hx.in_crisis = cbxToBoolean(params.ssd_crisis);
	}
	
	// pregnancy
	if(cbxToBoolean(params.pregnant) || !cbxToBoolean(params.denies_pregnancy)){
		ct_form.pregnancy_hx.is_pregnant = true;
		ct_form.pregnancy_hx.LMP = Date.now();
		ct_form.pregnancy_hx.comment = '';
	}
	
	ct_form.emergent = strToBoolean(params.emergent_study);
	ct_form.education.increase_fluids = strToBoolean(params.instructions);
	ct_form.education.side_effects = strToBoolean(params.side_effects);
	
	// md contact
	if(undefined !== req.body.md_contact.name && undefined !== req.body.md_contact.order ){
		ct_form.doctor_contacted.push(req.body.md_contact);
	}
	
	console.log(ct_form);
	
	ct_form.save(function(error){
		console.log('error saving form:\n');
		console.log(error);
	});
	res.redirect('back');
};

function strToBoolean(source){
	return (source != 'true' || source === undefined) ? false : true;
};

function cbxToBoolean(source) {
	return (source != 'on' || source === undefined) ? false : true;	
};