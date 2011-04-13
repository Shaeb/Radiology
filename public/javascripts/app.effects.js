$(document).ready(function(){	
	$('.rip').bind('dblclick', rip);
	if("a[rel]"){
		$("a[rel]").overlay({
			effect: 'apple',
		});
		$(".clickable-icons").bind('click', function(){
			var target = $($(this).attr('rel'));
			$(".clickable-icons").each(function(index, element){
				$($(this).attr('rel')).hide();
			});
			target.show();
		});
	}
	
	// autosuggest
	$('.autosuggest-needed').each(function(){
		var source = $(this).attr('rel');
		$(this).autocomplete({
			minLength: 2,
			select: function(event, ui){
				this.value = ui.item.label;
				return false;
			},
			source: source
		});
	});
});	

function rip(){
	//$('#allergy-rip-dialog').toggle('blind');
	$('#' + $(this).attr('id') + '-rip-dialog').slideToggle('fast');
}

function hideAll(selector){
	$(selector).hide();
}