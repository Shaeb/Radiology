var currentlyOpenedMenu = '';

$(document).ready(function(){
	$('#splitview-add-btton').live('click', function(event){
		hideAll('.detailItems');
		$($(this).attr('rel')).show();
	});
	
	// for the splitview schedule
	$('.list-items').live('click', function(event){
		$('.list-item-patient-list').hide();
		//$($(this).attr('rel')).show();
		var target = '#' + $(this).attr('id') + '-procedures';
		if(target != currentlyOpenedMenu && 0 != $(target + ' > ul').size()) {
			currentlyOpenedMenu = target;
			$(target).show('blind');
		} else {
			$(target).hide('blind');
			currentlyOpenedMenu = '';
		}
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