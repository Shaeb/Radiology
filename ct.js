var ct = {};

// GETs
exports.view = function(req, res){
	console.log('viewing ct forms');
	res.db.client.connect();

	res.db.client.query(
	  'select * from ct_schedule',
	  function selectCb(err, results, fields) {
	    if (err || results.length === null) {
	      throw err;
	    }
		//console.log(results.length);
		//res.render('forms/ct', {
		res.render('forms', {
			layout: './authenticated-layout.jade',
			title: 'CT Triage Form',
			showHeader: true,
			allergies: 'Magnesium, Potassium, Sodium, Oxygen, Kidneys',
			results: results
		});

	    //console.log(results);
	    // console.log(fields);
	    res.db.client.end();
	  }
	);
};

exports.list_schedule = function(req, res){
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

exports.autosuggest = function(req, res){
	query = '';
	//params = new Array();
	switch(req.query.target){
		case 'mrn':
			query = "select * from ct_schedule where mrn like '" + req.query.term + "%'";
			//params = [req.query.q];
			break;
		case 'patient':
		default:
			query = "select * from ct_schedule where first_name like '%" + req.query.term + "%' or last_name like'%" + req.query.term + "%'";
			//params = [req.query.q, req.query.q];
			break;			
	}
	//console.log('query: ' + query);
	//console.log('params: ' + params);
	res.db.client.connect();
	res.db.client.query(query, function(error, results, field){
		response = new Array();
		if(error || results.length == 0){
			response.push( {value: 1, label: 'No results found.'});
		} else {
			for(var i = 0; i < results.length; (++i)){
				response.push({value: results[i].id, label: results[i].first_name + ' ' + results[i].last_name});
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