var CTForm;

exports.defineFormModels = function( mongoose, fn ){
	var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;
		
	ContrastHistory = new Schema({
		prior_contrast					: Boolean,
		last_contrast					: Date,
		reaction_to_contrast			: Boolean,
		last_facility					: {type: String, default: "DUMC"},
		prednisone_prep					: Boolean,
		emergency_prep					: Boolean,
		prep_correctly_taken			: Boolean
	});

	Allergies = new Schema({
		allergen						: String,
		reaction						: String
	});
	
	DoctorContactHistory = new Schema({
		name			: String,
		order			: String,
		contacted_at	: { type: Date, default: Date.now }
	});

	CTForm = new Schema({
		document_id			: ObjectId, 
		study_date			: {type: Date, default: Date.now},
		patient				: {
			first_name: String,
			last_name: String,
			date_of_birth: Date,
			MRN: String
		},
		contrast_hx			: [ContrastHistory], 
		allergies			: [Allergies],
		asthma_hx			: {
			has			: Boolean, 
			severity	: {type: String, default: "mild", validate: /^((mild)|(moderate)|(severe))$/}
		},
		kidney_hx			: {
			has: Boolean,
			dx_type: {type: String, validate: /^((transplant)|(nephrectomy)|(dialysis))$/},
			dialysis_schedule	: String,
			last_dialysis		: Date,
			lab_hx				: {
				creatinine	: Number,
				GFR		 	: Number,
				date_of_lab	: Date
			}	
		},
		diabetes_hx			: {	
			has			: Boolean,
			medication	: {type: String, validate: /^((insulin)|(metformin)|(other))$/ }
		},
		chemo_hx			: [{
			date			: Date,
			medication		: String
		}],
		myasthenia_gravis	: Boolean,
		multiple_myeloma	: Boolean,
		hyperthyroidism		: Boolean,
		sickle_cell_hx		: {
			has_ssd		: Boolean,
			in_crisis	: Boolean },
		pregnancy_hx		: 	{
				is_pregnant		: Boolean,
				LMP				: Date,
				comment			: String
			},
		emergent			: Boolean,
		education			: {
			increase_fluids		: Boolean,
			side_effects		: Boolean },
		doctor_contacted	: [DoctorContactHistory]
	});

	mongoose.model('ct_form', CTForm);
	
	fn();
};