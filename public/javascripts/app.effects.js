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
});	

function rip(){
	//$('#allergy-rip-dialog').toggle('blind');
	$('#' + $(this).attr('id') + '-rip-dialog').slideToggle('fast');
}