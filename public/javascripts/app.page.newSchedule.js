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
				$('#detail-view-content-container').show();
			}
		});
		return false;
	});
	
	$(":date").dateinput();
	
	/**
	autocomplete({
		minLength: 2,
		select: function(event, ui){
			this.value = ui.item.label;
			return false;
		},
		source: function(request, response){
			alert($(this).attr('rel'));
			url = $(this).attr('rel');
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
	**/
});