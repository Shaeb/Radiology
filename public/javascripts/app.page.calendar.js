$(document).ready(function(){
	$('.calendar_date_in_month').each(function(index){
		$(this).bind('dblclick', function(event){
			$().toastmessage('showNoticeToast','You just clicked an item.');
		});
	});
});	