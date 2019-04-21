if (!sessionStorage.cart) {
    var cart_list = [];
    var itemA = {id: '0001', name: 'water purifier A', quantity: 2, price: 120.00};
    cart_list.push(itemA);
    var itemB = {id: '0002', name: 'water purifier B', quantity: 1, price: 135.00};
    cart_list.push(itemB);
    sessionStorage.cart = JSON.stringify(cart_list);
}

if (sessionStorage.cart) {
    console.log('is empty ' + !Object.keys(sessionStorage.cart).length);
    console.log('session.cart : ' + JSON.stringify(sessionStorage.cart));
}

var emptyRowContent = "<tr><td colspan='6'>No product in cart.<td></tr>"

function getDefaultRowContent(subtotal) {
    return "<tr class='bottom_button' id='subtotal-row'>" +
       "<td></td>" +
       "<td></td>" +
       "<td>" +
           "<h5>Subtotal</h5>" +
       "</td>" +
       "<td colspan='2'>" +
           "<h5 id='subtotal' class='cart_nowrap'>RM " + subtotal + "</h5>" +
       "</td>" +
   "</tr>" +
   "<tr class='shipping_area'>" +
       "<td class='d-none d-md-block'></td>" +
       "<td></td>" +
       "<td>" +
           "<h5>Shipping</h5>" +
       "</td>" +
       "<td colspan='2'>" +
           "<h7>Free</h7>" +
       "</td>" +
   "</tr>" +
   "<tr class='out_button_area'>" +
       "<td colspan='5'>" +
           "<div class='checkout_btn_inner d-flex align-items-center'>" +
               "<a class='gray_btn' href='/'>Continue Shopping</a>" +
               "<a class='primary-btn ml-2'  id='checkout' href='cart-submission'>Proceed to Payment Detail</a>" +
           "</div>" +
       "</td>" +
   "</tr>"
}

function addQuantity(elementIndex, price) {
	var result = document.getElementById('sst' + elementIndex);
	var sst = result.value;
	if( !isNaN( sst )){
	    result.value++;

        var cart_list = JSON.parse(sessionStorage.cart);
        cart_list[elementIndex].quantity = result.value;
        sessionStorage.cart = JSON.stringify(cart_list);

        updateSubtotal(cart_list);
	}
}

function reduceQuantity(elementIndex, price) {
    var result = document.getElementById('sst' + elementIndex);
    var sst = result.value;
    if( !isNaN( sst ) && sst > 0 ){
        result.value--;

        var cart_list = JSON.parse(sessionStorage.cart);
        cart_list[elementIndex].quantity = result.value;
        sessionStorage.cart = JSON.stringify(cart_list);

        updateSubtotal(cart_list);
    }
}

function deleteItem(elementIndex) {
    var cart_list = JSON.parse(sessionStorage.cart);
    cart_list.splice(elementIndex,1);
    sessionStorage.cart = JSON.stringify(cart_list);

    $('#cartItemRow' + elementIndex).remove();

    if (cart_list.length === 0){
        $("tbody").prepend(emptyRowContent);
        $('#checkout').click(function(e) {
            e.preventDefault();
        });
        $('#checkout').addClass('button-disable');
    }

    updateSubtotal(cart_list);
}

function updateSubtotal(cart_list) {
    var subtotal = 0;
    $.each( cart_list, function( index, obj ){
        $("#item-total" + index).text('RM ' + (obj.quantity * obj.price));
        subtotal += obj.quantity * obj.price;
    });
    $("#subtotal").text('RM ' + subtotal);
}

if (sessionStorage.cart) {
    var subtotal = 0;
    var cart_list = JSON.parse(sessionStorage.cart);

    if (cart_list.length === 0) {
        $('tbody').append(emptyRowContent);
    } else {
        $.each( cart_list , function( index, obj ){
            subtotal += (obj.price * obj.quantity);
            $('tbody').append(
                "<tr id='cartItemRow" + index + "'>" +
                    "<td>" +
                        "<div class='media'>" +
                            "<div class='d-flex'>" +
                                "<img alt='' src='img/cart/cart1.png'>" +
                            "</div>" +
                            "<div class='media-body'>" +
                                "<p>" + obj.name + "</p>" +
                            "</div>" +
                        "</div>" +
                    "</td>" +
                    "<td>" +
                        "<h5>RM&nbsp;" + obj.price + "</h5>" +
                    "</td>" +
                    "<td>" +
                        "<div class='product_count'>" +
                            "<input class='input-text qty' id='sst" + index + "' maxlength='12' name='qty' title='Quantity:' type='text' value='" + obj.quantity + "'>" +
                            "<button class='increase items-count' onclick=\"addQuantity(" + index + ", " + obj.price + ")\" type='button'>" +
                                "<i class='lnr lnr-chevron-up'></i>" +
                            "</button>" +
                            "<button class='reduced items-count' onclick=\"reduceQuantity(" + index + ", " + obj.price +")\" type='button'>" +
                                "<i class='lnr lnr-chevron-down'></i>" +
                            "</button>" +
                        "</div>" +
                    "</td>" +
                    "<td class='cart_nowrap'>" +
                        "<h5 id='item-total" + index + "'>RM " + (obj.price * obj.quantity) + "</h5>" +
                    "</td>" +
                    "<td><a onclick=\"deleteItem(" + index + ")\"><i class='far fa-trash-alt'></i></a></td>" +
                "</tr>"
            );
        });
    }

    $('tbody').append(getDefaultRowContent(subtotal));

    if (cart_list.length === 0) {
        $('#checkout').click(function(e) {
            e.preventDefault();
        });
        $('#checkout').addClass('button-disable');
    }
} else {
    $('tbody').append(emptyRowContent);
    $('tbody').append(getDefaultRowContent('0'));
    $('#checkout').click(function(e) {
        e.preventDefault();
    });
    $('#checkout').addClass('button-disable');
}



