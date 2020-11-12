$(document).ready(function(){
  $('.product__images').slick({
		arrows: false,
		dots: true
	});

  $('.reviews__slider').slick({
		arrows: false,
		dots: true
	});

	var tabNav = $('.reviews__tabs-nav-item');
	var accordionBtn = $('.accordion__item-btn');

	tabNav.on('click', function(evt) {
		evt.preventDefault();

		var target = $(this).attr('href');

		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		$(target).siblings().removeClass('active');
		$(target).addClass('active');
	});

	accordionBtn.on('click', function() {
		$(this).toggleClass('accordion__item-btn--open');
		if($(this).hasClass('accordion__item-btn--open')) {
			$(this).next().slideDown(400);
		} else {
			$(this).next().slideUp(400);
		}
	});

});
