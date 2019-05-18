if (!sessionStorage.cart) {
    var cart_list = [];
    var itemA = {
        product_id: '0001',
        product_name: 'water purifier A',
        desc: 'can filter water',
        quantity: 2,
        image: [
            'url1',
            'url2'
        ],
        price: 114.50,
        payment: 120.00,
        payment_type: 'Rental',
        service: [
            {
                name: 'sst',
                value: 6,
                unit: '%',
                per_order_charge: false,
                remarks: 'this is services remarks'
            },{
                name: 'discount',
                value: 20,
                unit: 'RM',
                per_order_charge: false,
                remarks: 'this is services remarks'
            }
        ],
        remarks: 'this product remarks'
    };
    cart_list.push(itemA);

    var itemB = {
        product_id: '0002',
        product_name: 'water purifier B',
        desc: 'can filter water',
        quantity: 1,
        image: [
            'url1',
            'url2'
        ],
        payment: 135.00,
        payment_type: 'Retail',
        service: [
            {
                name: 'shipping',
                value: 100,
                unit: 'RM',
                per_order_charge: true,
                remarks: 'this is services remarks'
            }
        ],
        remarks: 'this product remarks'
    };
    cart_list.push(itemB);

    sessionStorage.cart = JSON.stringify(cart_list);
}

if (sessionStorage.cart) {
    console.log('is empty ' + !Object.keys(sessionStorage.cart).length);
    console.log('session.cart : ' + JSON.stringify(sessionStorage.cart));
}

var emptyRowContent = "<tr><td colspan='7'>No product in cart.<td></tr>"

function getDefaultRowContent() {
    return "<tr class='shipping_area'>" +
       "<td class='d-none d-md-block'></td>" +
       "<td></td>" +
       "<td></td>" +
       "<td>" +
           "<h5>Shipping</h5>" +
       "</td>" +
       "<td colspan='2'>" +
           "<h7>Free</h7>" +
       "</td>" +
   "</tr>" +
   "<tr class='out_button_area'>" +
       "<td colspan='7'>" +
           "<div class='checkout_btn_inner d-flex align-items-center'>" +
               "<a class='gray_btn' href='/'>Continue Shopping</a>" +
               "<a class='primary-btn ml-2'  id='checkout' href='order-form'>Proceed to Order Detail</a>" +
           "</div>" +
       "</td>" +
   "</tr>"
}

function addQuantity(elementIndex) {
	var result = document.getElementById('sst' + elementIndex);
	var sst = result.value;
	if( !isNaN( sst )){
	    result.value++;

        var cart_list = JSON.parse(sessionStorage.cart);
        cart_list[elementIndex].quantity = result.value;
        sessionStorage.cart = JSON.stringify(cart_list);
	}
}

function reduceQuantity(elementIndex) {
    var result = document.getElementById('sst' + elementIndex);
    var sst = result.value;
    if( !isNaN( sst ) && sst > 0 ){
        result.value--;

        var cart_list = JSON.parse(sessionStorage.cart);
        cart_list[elementIndex].quantity = result.value;
        sessionStorage.cart = JSON.stringify(cart_list);
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
}

if (sessionStorage.cart) {
    var cart_list = JSON.parse(sessionStorage.cart);

    if (cart_list.length === 0) {
        $('tbody').append(emptyRowContent);
    } else {
        $.each( cart_list , function( index, obj ){
            $('tbody').append(
                "<tr id='cartItemRow" + index + "'>" +
                    "<td>" +
                        "<div class='media'>" +
                            "<div class='d-flex'>" +
                                "<img alt='' src='img/cart/cart1.png'>" +
                            "</div>" +
                            "<div class='media-body'>" +
                                "<p>" + obj.product_name + "</p>" +
                            "</div>" +
                        "</div>" +
                    "</td>" +
                    "<td>" +
                        "<h5>RM&nbsp;" + obj.payment + "</h5>" +
                    "</td>" +
                    "<td>" +
                        "<h5>" + obj.payment_type + "</h5>" +
                    "</td>" +
                    "<td>" +
                        "<div class='product_count'>" +
                            "<input class='input-text qty' id='sst" + index + "' maxlength='12' name='qty' title='Quantity:' type='text' value='" + obj.quantity + "'>" +
                            "<button class='increase items-count' onclick=\"addQuantity(" + index + ", " + obj.payment + ")\" type='button'>" +
                                "<i class='lnr lnr-chevron-up'></i>" +
                            "</button>" +
                            "<button class='reduced items-count' onclick=\"reduceQuantity(" + index + ", " + obj.payment +")\" type='button'>" +
                                "<i class='lnr lnr-chevron-down'></i>" +
                            "</button>" +
                        "</div>" +
                    "</td>" +
                    "<td class='cart_nowrap'>" +
                        "<h5 id='item-total" + index + "'>RM " + (obj.payment * obj.quantity) + "</h5>" +
                    "</td>" +
                    "<td><a onclick=\"deleteItem(" + index + ")\"><i class='far fa-trash-alt'></i></a></td>" +
                "</tr>"
            );
        });
    }

    $('tbody').append(getDefaultRowContent());

    if (cart_list.length === 0) {
        $('#checkout').click(function(e) {
            e.preventDefault();
        });
        $('#checkout').addClass('button-disable');
    }
} else {
    $('tbody').append(emptyRowContent);
    $('tbody').append(getDefaultRowContent());
    $('#checkout').click(function(e) {
        e.preventDefault();
    });
    $('#checkout').addClass('button-disable');
}



