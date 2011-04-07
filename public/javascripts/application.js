$(document).ready(function(){
	
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
				{ term: request.term, target: option },
				function(data, status, xhr){
					if( xhr === lastXHR ){
						response(data);
					}
				});
		}
	});
	$('.rip').bind('dblclick', rip);
	if("a[rel]"){
		$("a[rel]").overlay({effect: 'apple'});
		$(".clickable-icons").bind('click', function(){
			var target = $($(this).attr('rel'));
			$(".clickable-icons").each(function(index, element){
				$($(this).attr('rel')).hide();
			});
			target.show();
		});
	}
});	

function rip(){
	//$('#allergy-rip-dialog').toggle('blind');
	$('#' + $(this).attr('id') + '-rip-dialog').slideToggle('fast');
}