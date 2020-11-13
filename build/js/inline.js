var cartIcon = $('#header-cart-link'),
	cartBlock = $('#header-cart-block');
cartBlock.show();
/* region cart notifications */
var cartNotification = $('#header-cart-notification'),
	cartNotificationWrapper = $('table.items', cartNotification);
window.updateCartIcon = function() {
	let test = $('.new-item');
	// let cartBlockItems = $('.item', '#header-cart-block-items'),
	let cartBlockItems = $('.new-item'),
		cartIndiactor = $('#header-cart-indicator'),
		totalPrice = $('span.value', '#header-cart-block-total').text(),
		headerCart = $('#header-cart');
	cartIcon.attr('title', totalPrice);
	if(cartBlockItems.length > 0) {
		cartIndiactor.html(cartBlockItems.length);
		headerCart.removeClass('empty').addClass('with-items');
	} else {
		cartIndiactor.empty();
		headerCart.removeClass('with-items').addClass('empty');
	}
};
updateCartIcon();
window.hideCartNotification = function() {
	cartNotification.removeClass('in-view');
};
window.showCartNotification = function(item) {
	let id = item.data('id');
	let cartBlockItems = $('table.items', '#header-cart-block-items'),
		itemContent = $('tr.item[data-product-id=' + id + ']', cartBlockItems);
	if(itemContent.length !== 0) {
		let notificationContent = itemContent.clone();
		cartNotification.addClass('in-view');
		cartNotificationWrapper.empty().append(notificationContent);
		setTimeout(function() {
			hideCartNotification();
		}, 3000);
	}
};
// cartNotification.swipe(
//     {
//         swipe: function () {
//
//             hideCartNotification();
//
//         }
//     }
// );
/* endregion */
/* region cart block */
window.updateCart = function(callback) {
	$.ajax('/ajax/cart.php', {
		method: 'POST',
		data: {},
		success: function(data) {
			let newCartContent = $('#header-cart-block-wrapper', data);
			cartBlock.html(newCartContent);
		},
		complete: function() {
			checkOrderItems();
			updateCartIcon();
			showCart();
		}
	});
};
cartBlock.on('mouseleave', function() {
	// hideCart();
});
$(document).on('touchstart', function(event) {
	if((cartBlock.has(event.target).length == 0) && ($('#header-user-bar').has(event.target).length == 0)) {
		hideCart();
	}
});
$(document).on('click', '#header-cart-block span.close.control, #header-cart__link-wrapper, .header-cart__link-wrapper', function() {
	hideCart();
});
window.showCart = function() {
	cartBlock.addClass('in-view');
};
window.hideCart = function() {
	cartBlock.removeClass('in-view');
};
var orderCheckoutButton = $('button#header-cart-block-submit', '#header-cart-block-buttons');
window.checkOrderItems = function() {
	let cartBlockItems = $('table.items', '#header-cart-block-items');
	if($('.item', cartBlockItems).length > 0) {
		orderCheckoutButton.removeAttr('disabled');
	} else {
		orderCheckoutButton.attr('disabled', true);
	}
};
/* endregion */
$(window).scroll(function() {
	hideCartNotification();
});
// $("#header-cart-block-wrapper").swipe({
//     //Generic swipe handler for all directions
//     swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
//         if (direction == 'up') {
//             hideCart();
//         }
//     }
// });
$(document).on('click', '#header-cart-block-upsell a.add', function(event) {
	event.preventDefault();
	let item = $(this),
		cartBlock = $('#header-cart-block');
	$.ajax('/ajax/cart.php', {
		method: 'POST',
		dataType: 'html',
		data: {
			ID: item.data('id'),
			ACTION: 'ADD'
		},
		success: function(data) {
			let newCartContent = $('#header-cart-block-wrapper', data);
			cartBlock.html(newCartContent);
		},
		complete: function() {
			checkOrderItems();
			updateCartIcon();
			if(typeof ym != "undefined") {
				ym(ymID, 'reachGoal', 'cartBlockItemsItemUpdate');
			}
			if(typeof ga != "undefined") {
				ga('send', 'event', {
					eventCategory: 'cartBlock',
					eventAction: 'click',
					eventLabel: 'cartBlockItemsItemUpdate'
				});
				ga('send', 'event', 'Cart', 'updateitem');
			}
		}
	});
});
/* region cart item delete */
$(document).on('click', '#header-cart-block-items .item span.bQuantity, .header-cart__close', function(event) {
	console.log("YES");
	event.preventDefault();
	let item = $(this).closest('.item, .new-item'),
		cartBlock = $('#header-cart-block'),
		method = '';
	if($(this).hasClass('plus')) {
		method = 'ADD'
	} else {
		method = 'REMOVE'
	}
	console.log(method);
	//ghb
	const quantity = $('#catalog-element .catalogElement__quantity');
	const quantityValue = 0;
	quantity.removeClass('displayInline');
	quantity.attr('data-quantity', quantityValue);
	$.ajax('/ajax/cart.php', {
		method: 'POST',
		dataType: 'html',
		data: {
			ID: item.data('id'),
			BID: item.data('product-id'),
			METHOD: method,
			ACTION: 'DELETE'
		},
		success: function(data) {
			var productList = [];
			$.each($('.new-item', data), function(key, value) {
				var quantity = $(value).data('quantity'),
					productId = $(value).data('product-id'),
					price = $(value).data('price');
				productList.push({
					product: {
						ids: {
							richeSystem: productId
						}
					},
					count: quantity,
					price: price
				});
				console.log(productList);
			});
			mindbox("async", {
				operation: "Website.SetCart",
				data: {
					productList: productList
				}
			});
			let newCartContent = $('#header-cart-block-wrapper', data);
			cartBlock.html(newCartContent);
		},
		complete: function() {
			checkOrderItems();
			updateCartIcon();
			if(typeof ym != "undefined") {
				ym(ymID, 'reachGoal', 'cartBlockItemsItemUpdate');
			}
			if(typeof ga != "undefined") {
				ga('send', 'event', {
					eventCategory: 'cartBlock',
					eventAction: 'click',
					eventLabel: 'cartBlockItemsItemUpdate'
				});
				ga('send', 'event', 'Cart', 'updateitem');
			}
		}
	});
});
// endregion
$('#header-cart-link').click(function(event) {
	event.preventDefault();
	showCart();
});
$(document).on('click', '#header-cart-block-submit', function() {
	if(typeof ym != "undefined") {
		ym(ymID, 'reachGoal', 'headerCartOrder');
	}
});
// custom
$(document).on('click', '.new-item__quantity-plus-wrapper, .new-item__quantity-minus-wrapper', function(event) {
	event.preventDefault();
	let button = $(this),
		element = button.closest('.new-item'),
		blockQuantity = $('new-item').data("quantity"),
		quantityInput = $('.new-item__quantity-number', element),
		quantityOld = parseInt(quantityInput.val()),
		quantityNew;
	if(button.hasClass('new-item__quantity-plus-wrapper')) {
		quantityNew = quantityOld + 1;
	} else if(button.hasClass('new-item__quantity-minus-wrapper')) {
		if(quantityOld > 1) {
			quantityNew = quantityOld - 1;
		} else {
			quantityNew = 1;
		}
	}
	if(quantityNew !== quantityOld) {
		quantityInput.val(quantityNew).trigger('input');
		element.attr('data-quantity', quantityNew);
	}
});
// $(document).on(
//     'click',
//     'button#header-cart-block-submit',
//     function () {
//         event.preventDefault();
//         $('.header-cart__wrapper').children('div').hide();
//         $('.header-cart__wrapper').children('section').hide();
//         $('form.header-cart__code-wrapper').show();
//     }
// );
$(document).on('click', '#step1.header-cart__code-submit', function(event) {
	event.preventDefault();
	const phoneNumberInput = $('[name="PHONE"].header-cart__code-input');
	const phoneNumber = phoneNumberInput.val();
	const form = phoneNumberInput.closest('form');
	$.ajax('/account/sendconfirmationcode/', {
		dataType: 'json',
		method: 'POST',
		data: form.serializeArray(),
		success: function(data) {
			form.children('.header-cart__code-tel').hide();
			form.children('#step1').hide();
			form.children('.header-cart__code-password').show();
			form.children('#step2').show();
		},
		error: function(jqXHR, exception) {}
	});
});
$(document).on('input', '[name="PASSWORD"].header-cart__code-input', function(event) {
	event.preventDefault();
	const smsPasswordInput = $('[name="PASSWORD"].header-cart__code-input');
	console.log(smsPasswordInput);
	const smsPassword = smsPasswordInput.val();
	console.log(smsPassword);
	const form = smsPasswordInput.closest('form');
	console.log(form.serializeArray());
	if(smsPassword.length === 4) {
		$.ajax('/account/loginbyphoneandcode/', {
			dataType: 'json',
			method: 'POST',
			data: form.serializeArray(),
			success: function(data) {
				if(data.status) {
					window.location.href = '/checkout'
				}
			},
			error: {}
		});
	}
});
