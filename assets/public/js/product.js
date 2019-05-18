function setupPage() {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': jsonFile,
        'dataType': "json",
        'success': function (data) {
            setTitle(data);
            setErrorMessage(data);
            setElementInfo(data);
            getProductList(data);
        }
    });
    return json;
}

function setElementInfo(data) {
    $('#txtTitle').text(data.title);
    $('#txtTitleDesc').text(data.titleDescription);
    $('#txtPageDesc').text(data.pageDescription);
}

function setTitle(data) {
    document.title = data.pageTitle;
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
    document.getElementById("productPanel").style.display = "block";
    displayFooter(true);
}

function setErrorMessage(data) {
    $('#txtErrorMessage').text(data.error.title);
    $('#txtErrorMessageDesc').text(data.error.message);
    $('#txtErrorPageDesc').text(data.error.solution);
}

function showError() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("messagePanel").style.display = "block";
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
    if(productList.length <= 0) {
        $('#txtPageDesc').text("We are sorry. No record found.");
    }

    productList.forEach(product => {
        $('#productList').append(
            '<div class="col-md-6 col-lg-4">' +
            '<a href="#"><div class="card text-center card-product">' +
            '<div class= "card-product__img" >' +
            '<img class="card-img" src="' + product.image[0] + '" onerror="this.src=\'img/imageNotFound.png\'">' +
            '</div>' +
            '<div class="card-body">' +
            '<h4 class="card-product__title">' + product.name + '</h4>' +
            '<p class="card-product__price">$150.00</p>' +
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
