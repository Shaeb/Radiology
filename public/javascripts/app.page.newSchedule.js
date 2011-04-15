$(document).ready(function(){
	$('#splitview-add-btton').live('click', function(event){
		hideAll('.detailItems');
		$($(this).attr('rel')).show();
	});
	
	// for the splitview schedule
	$('.list-item-procedure').live('click', function(event){
		var target = $(this).attr('rel');
		$.ajax({
			url: target,
			data: {minified: true},
			context: '#detail-view-content-container',
			success: function(data, textStatus, jqXHR){
				$('#detail-view-content-container').html(data);
				$('#detail-view-content-container').show('blind');
				$('#add-to-schedule-form:visible').hide('blind');
			}
		});
		return false;
	});
	
	$('.click-to-add-procedure').live('click', function(event){
		$('#detail-view-content-container:visible').hide('blind');
		var time = $(this).attr('rel');
		$('#new-schedule-time').val(time);
		$('#add-to-schedule-form:hidden').show('blind');
		return false;
	});
	
	$(":date").dateinput();
	
	$('.smart-autosuggest-needed').each(
		function(){
			var url = $(this).attr('rel');
			var target = $(this).attr('target');
			$(this).autocomplete({
				minLength: 2,
				select: function(event, ui){
					$(target).val(ui.item.value);
					this.value = ui.item.label;
					return false;
				},
				source: function(request, response){
					lastXHR = $.getJSON(
						url,
						{ term: request.term },
						function(data, status, xhr){
							if( xhr === lastXHR ){
								response(data);
							}
						});
				}
			});
		}
	);
	
	// submit the form
	$('#new-schedule-form').bind('submit', function(event){
		$().toastmessage('showNoticeToast','Attempting to schedule procedure.');
		$('#new-schedule-submit').attr('disabled', 'disabled');
		return false;
	});
});