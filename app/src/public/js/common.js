$(document).ready(function(){

	$('#gnb-menu').click(function(){
		if($(this).is('.on')) {
			$(this).removeClass('on');
			$('#gnb-list').slideUp('fast');
		}else {
			$(this).addClass('on');
			$('#gnb-list').slideDown('fast');
		}
	});	
});

$(document).ready(function(){

	$('input:radio').click(function(){
		if($(this).is('#rdo01')) {
			$('#rdo02').removeClass('on');
			$(this).addClass('on');
			location.replace('/');
			$(this).preventDefault;
		}else if($(this).is('#rdo02')){
			$('#rdo01').removeClass('on');
			$(this).addClass('on');
			location.replace('index_p');
			$(this).preventDefault;
		}
	});	
});
