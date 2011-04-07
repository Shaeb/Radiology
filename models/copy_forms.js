var ContrastHistory, Allergy, AsthmaHistory, KidneyHistory, DiabetesHistory, ChemotherapyHistory, PregnancyHistory,
	DoctorContact, CT;

exports.defineFormModels = function( mongoose, fn ){
	var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;
	
	Allergy = new Schema({
		allergen						: String,
		reaction						: String
	});
	
	ContrastHistory = new Schema({
		prior_contrast					: Boolean,
		last_contrast					: Date,
		reaction_to_contrast			: Boolean,
		last_facility					: {type: String, default: "DUMC"},
		steroid_prep					: Boolean,
		prednisone_prep					: Boolean,
		emergency_prep					: Boolean,
		prep_correctly_taken			: Boolean
	});

	AsthmaHistory = new Schema({
		has			: Boolean, 
		severity	: {type: String, default: "mild", validate: /^((mild)|(moderate)|(severe))$/}
	});

	KidneyHistory = new Schema({
		has: Boolean,
		dx_type: {type: String, validate: /^((transplant)|(nephrectomy)|(dialysis))$/},
		dialysis_schedule	: String,
		last_dialysis		: Date,
		lab_hx				: {
			creatinine	: Number,
			GFR		 	: Number,
			date_of_lab	: Date
		}	
	});

	DiabetesHistory = new Schema({	
		has			: Boolean,
		medication	: {type: String, validate: /^((insulin)|(metformin)|(other))$/ }
	});

	ChemotherapyHistory = new Schema({
		date			: Date,
		medication		: String
	});

	PregnancyHistory = new Schema({
		is_pregnant		: Boolean,
		LMP				: Date,
		comment			: String
	});

	DoctorContact = new Schema({
		name			: String,
		order			: String,
		contacted_at	: { type: Date, default: Date.now }
	});

	CT = new Schema({
		document_id			: ObjectId, 
		contrast_hx			: [ContrastHistory], 
		allergies			: [Allergy],
		asthma_hx			: AsthmaHistory,
		kidney_hx			: KidneyHistory,
		diabetes_hx			: DiabetesHistory,
		chemo_hx			: [ChemotherapyHistory],
		myasthenia_gravis	: Boolean,
		multiple_myeloma	: Boolean,
		hyperthyroidism		: Boolean,
		sickle_cell_hx		: {
			has_ssd		: Boolean,
			in_crisis	: Boolean },
		pregnancy_hx		: PregnancyHistory,
		emergent			: Boolean,
		education			: {
			increase_fluids		: Boolean,
			side_effects		: Boolean },
		doctor_contacted	: [DoctorContact]
	});

	mongoose.model('CT', CT);
	
	fn();
};