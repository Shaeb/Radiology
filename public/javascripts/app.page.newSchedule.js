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
		$('#new-schedule-time-display').val(time);
		$('#new-schedule-hour').val(time.substring(0,2));
		$('#new-schedule-minute').val(time.substring(2));
		$('#add-to-schedule-form:hidden').show('blind');
		$('#my_target').val('#' + $(this).attr('id'));
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
		//$('#new-schedule-submit').attr('disabled', 'disabled');
		$.post($(this).attr('action'), $(this).serialize(), function(data, testStatus, jqXHR){
			if(data.success){
				var target = $('#my_target').val();
				var parent = '#list-item-' + $('#new-schedule-time-display').val() + '-collapsible';
				/*
				ul(rel='/ct/view.html/form/' + procedure.schedule_id).list-no-decorations.list-item-procedure
					li= procedure.patient.first_name + ' ' + procedure.patient.last_name
					li= 'Protocol: ' + procedure.protocol
					li= 'Diagnosis: ' + procedure.diagnosis
				*/
				var id = 'new-patient-new-procedure-' + data.id;
				var html = '<ul rel="/ct/view.html/form/' + $('#new-schedule-patient-id').val() + '" ' + 
					'class="list-no-decorations list-item-procedure" id="' + id + '">' +
					'<li class="newly-added-list-item">' + $('#new-schedule-patient').val() + '</li>' + 
					'<li class="newly-added-list-item">Protocol: ' + $('#new-schedule-protocol').val() + '</li>' + 
					'<li class="newly-added-list-item">Diagnosis: ' + $('#new-schedule-diagnosis').val() + '</li>' + 
					"</ul>";
				$($(target).parent('ul')).remove();
				$(html).appendTo(parent);
				//$('#' + id).effect('highlight', {}, 3000);
				$().toastmessage('showSuccessToast','Successfully scheduled the procedure!');
			} else {
				$().toastmessage('showErrorToast', data.error);
			}
		}, 'json');
		return false;
	});
});