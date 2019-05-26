var productDetail;

function setupPage() {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': jsonFile,
        'dataType': "json",
        'success': function (data) {
            setTitle(data);
            buttonBehavior();
            inputBehavior();
            initModal();
            getProductDetail(data);
        }
    });
    return json;
}


function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function setTitle(data) {
    document.title = data.page;
}

function getProductDetail(data) {
    var formData = new FormData();
    formData.append('id', getUrlVars()['id']);

    fetch(data.setting.link.getProductDetail, { method: data.setting.http.method, body: formData })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (result) {
            if (result.status_code == '100') {
                console.log(result);
                loadProductDetail(result.data);
                showProduct();
            } else {
                showError();
            }
        })
        .catch(function (err) {
            showError();
        })
}

function showProduct() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("productPanel").style.display = "block";
    displayFooter(true);
}

function showError() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("errorPanel").style.display = "block";
    displayFooter(true);
}

function displayFooter(displayFlag) {
    if (displayFlag) {
        document.getElementsByClassName("footer-area footer-only")[0].style.display = "block";
        document.getElementsByClassName("footer-bottom")[0].style.display = "block";
    } else {
        document.getElementsByClassName("footer-area footer-only")[0].style.display = "none";
        document.getElementsByClassName("footer-bottom")[0].style.display = "none";

    }
}

function loadProductDetail(productList) {
    productList.forEach(product => {
        for (var row = 0; row < product.image.length; row++) {
            $('#owlProductImage').append(
                '<div class="item">' +
                '<img class="img-fluid" style="height:100; width:100%" src="' + product.image[row] + '" onerror="this.src=\'img/imageNotFound.png\'">' +
                '</div>'
            );
        }
        $('.owl-carousel').owlCarousel({
            loop: false,
            margin: 10,
            singleItem: true,
            items: 1,
            nav: true,
            navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>']
        });

        $('#txtProductName').text(product.name)
        $('#txtPurchasePrice').text('100.00')
        $('#description').append(product.desc);

        productDetail = product;
    });
}

function inputBehavior() {
    $('#txtProductQty').keypress(function (key) {
        if (key.charCode < 48 || key.charCode > 57) return false;
    });
}
function buttonBehavior() {
    $("#btnAddCart").click(function () {
        addToCart();
    });
    $("#btnIncProductQty").click(function () {
        addProductQuantity();
    });
    $("#btnDecProductQty").click(function () {
        reduceProductQuantity();
    });
}

function initModal() {
    $('#modalAlertAddCart').modal({
        backdrop: 'static', keyboard: true, show: false
    });
}

function addToCart() {
    if (cartContainExistProduct(productDetail)) {
        increaseCartQuantity(productDetail);
    } else {
        addProductToCart(productDetail);
    }

    $('#modalAlertAddCart').modal('show');
    $('#modalAlertAddCart').css('zIndex', 9999);
}

function addProductToCart(product) {
    var cartList = [];

    if (sessionStorage.cart) {
        var previousCartList = JSON.parse(sessionStorage.cart);

        previousCartList.forEach(cart => {
            cartList.push(cart);
        });
    }

    var cart = {
        product_id: product._id,
        product_name: product.name,
        quantity: $('#txtProductQty').val(),
        image: product.image[0],
        price: 100,
        payment: 120.00,
        payment_type: 'Rental',
    };
    cartList.push(cart);

    sessionStorage.cart = JSON.stringify(cartList);
}

function increaseCartQuantity(product) {
    var newCartList = [];

    if (sessionStorage.cart) {
        var previousCartList = JSON.parse(sessionStorage.cart);

        previousCartList.forEach(cart => {
            if (cart.product_id === product._id) {
                cart.product_id = product._id;
                cart.product_name = product.name;
                cart.quantity = parseInt(cart.quantity) + parseInt($('#txtProductQty').val());
                cart.image = product.image[0];
                cart.price = 100;
                cart.payment = 120;
                cart.payment_type = 'Rental';
            }
            newCartList.push(cart);
        });
    } else {
        addProductToCart(productDetail);
    }

    sessionStorage.cart = JSON.stringify(newCartList);
}

function cartContainExistProduct(product) {
    containFlag = false;

    if (sessionStorage.cart) {
        var cartList = JSON.parse(sessionStorage.cart);

        cartList.forEach(cart => {
            if (cart.product_id === product._id) {
                containFlag = true;
                return containFlag;
            }
        });
    } else {
        addProductToCart(productDetail);
    }

    return containFlag;
}

function addProductQuantity() {
    var newQty = parseInt($('#txtProductQty').val()) + 1;
    $('#txtProductQty').val(newQty < 100 ? newQty : 100);
}

function reduceProductQuantity() {
    var newQty = parseInt($('#txtProductQty').val()) - 1;
    $('#txtProductQty').val(newQty > 1 ? newQty : 1);
}

$(document).ready(function () {
    displayFooter(false);
    setupPage();
});