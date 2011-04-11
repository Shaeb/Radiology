$(document).ready(function(){
	
	// for the splitview schedule
	$('.list-items').live('click', function(event){
		$('.detailItems').hide();
		$($(this).attr('rel')).show();
	});
});