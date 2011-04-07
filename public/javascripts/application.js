$(document).ready(function(){
	$('#ct-patient-autosuggest').autoSuggest($('#ct-patient-autosuggest').attr('rel'), {
		minChars: 2,
		matchCase: true /**,
		retrieveComplete: function(data){
			returnValue = new Array();
			for(datum in data){
				returnValue.push({ item: datum.id, value: datum.first_name});
			}
			return returnValue;
		}**/
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