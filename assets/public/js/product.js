function setupPage() {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': jsonFile,
        'dataType': "json",
        'success': function (data) {
            setTitle(data);
            setElementInfo(data);
            getProductList(data);
        }
    });
    return json;
}

function setElementInfo(data) {
    $('#txtPageTitle').addClass(data.pageTitle);
    $('#txtPageSlogan').addClass(data.pageSlogan);
    $('#txtPageMessage').addClass(data.pageMessage);
    $('#txtTotalRecord').addClass("string_no_record_found");
}

function setTitle(data) {
    document.title = data.page;
}

function getProductList(data) {
    var formData = new FormData();
    formData.append('productType', data.search.type);

    fetch(data.setting.link.getAllProduct, { method: data.setting.http.method, body: formData })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (result) {
            if (result.status_code == '100') {
                loadProductList(result.data);
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
    document.getElementById("mainPanel").style.display = "block";
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

function loadProductList(productList) {
    if (productList.length == 1) {
        $('#txtTotalRecord').text( $('#txtPageTitle').text() + ' x ' +  productList.length);
    } else if (productList.length > 1) {
        $('#txtTotalRecord').text(productList.length);
    }

    productList.forEach(product => {
        $('#productList').append(
            '<div class="col-md-6 col-lg-4">' +
            '<a href="/product-detail?id=' + product._id + '"><div class="card text-center card-product">' +
            '<div class= "card-product__img" >' +
            '<img class="card-img" style="height:100; width:100%" src="' + product.image[0] + '" onerror="this.src=\'img/imageNotFound.png\'">' +
            '</div>' +
            '<div class="card-body">' +
            '<h4 class="card-product__title">' + product.name + '</h4>' +
            '<p class="card-product__price">RM ' + product.price.rentalPrice + ' </p>' +
            '</div>' +
            '</div></a>' +
            '</div>'
        );
    });
}

$(document).ready(function () {
    displayFooter(false);
    setupPage();
});
