$(document).ready(function(){
  $('.product__images').slick({
		arrows: false,
		dots: true
	});

	$('.product__days-slider').slick({
		arrows: true,
		dots: false
	});

	$('.reviews__slider').on('init', function(event, slick) {
		var customDotsContainer = $('.reviews__custom-dots');
		var reviewsItemsCount = $('.reviews__slider-item:not(.slick-cloned)').length;

		var currentSlide = 0;

		$('.reviews__prev').on('click', function() {
			$('.reviews__slider').slick('slickPrev');
			if (currentSlide > 0 && currentSlide <= reviewsItemsCount) {
				$('.reviews__dot.active').removeClass('active').prev().addClass('active');
				currentSlide--;
			}
		});

		$('.reviews__next').on('click', function() {
			$('.reviews__slider').slick('slickNext');

			if (currentSlide >= 0 && currentSlide < reviewsItemsCount - 1) {

				$('.reviews__dot.active').removeClass('active').next().addClass('active');
				currentSlide++;
			}
		});

		for(var i = 0; i < reviewsItemsCount; i++) {
			var dot = $('<button class="reviews__dot" type="button"></button>');
			dot.text(i + 1);
			if (i === 0) {
				dot.addClass('active');
			}

			dot.on('click', function() {
				$(this).siblings().removeClass('active');
				$(this).addClass('active');
				$('.reviews__slider').slick('slickGoTo', i);
				reviewsItemsCount = i;
			});
			customDotsContainer.append(dot);
		}
	});

  $('.reviews__slider').slick({
		arrows: false,
		dots: false,
		infinite: false
		/*prevArrow: $('.reviews__prev'),
		nextArrow: $('.reviews__next')*/
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
