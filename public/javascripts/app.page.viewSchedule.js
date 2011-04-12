$(document).ready(function(){	
	// specifific autocomplete
	$('#ct-patient-autosuggest').autocomplete({
		minLength: 2,
		select: function(event, ui){
			this.value = ui.item.label;
			return false;
		},
		source: function(request, response){
			url = $('#ct-patient-autosuggest').attr('rel');
			option = $('#ct-patient-autosuggest-options option:selected').val();
			lastXHR = $.getJSON(
				url,
				{ term: request.term, filter: option },
				function(data, status, xhr){
					if( xhr === lastXHR ){
						response(data);
					}
				});
		}
	});
});	