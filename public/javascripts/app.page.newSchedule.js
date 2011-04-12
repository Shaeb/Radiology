$(document).ready(function(){
	$('#splitview-add-btton').bind('click', function(event){
		hideAll('.detailItems');
		$($(this).attr('rel')).show();
	});
	
	// for the splitview schedule
	$('.list-items').live('click', function(event){
		hideAll('.detailItems');
		$($(this).attr('rel')).show();
	});
	
	$(":date").dateinput();
	
	// autosuggest
	$('.autosuggest-text').autocomplete({
		minLength: 2,
		select: function(event, ui){
			this.value = ui.item.label;
			return false;
		},
		source: function(request, response){
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
});

function hideAll(selector){
	$(selector).hide();
}