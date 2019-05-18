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
            //notify_req_failed();
        })
        .then(function (result) {
            if (result.status_code == '100') {
                loadProductList(result.data)
            } else {
                console.log(result);
            }
        })
        .catch(function (err) {
            console.log(err);
        })
        .finally(function () {
            showPage();
        })
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("productPanel").style.display = "block";
  }
function loadProductList(productList) {
    productList.forEach(product => {
        $('#productList').append(
            '<div class="col-md-6 col-lg-4">' +
            '<div class="card text-center card-product">' +
            '<div class= "card-product__img" >' +
            '<img class="card-img" src="' + product.image[0] + '" alt="">' +
            '</div>' +
            '<div class="card-body">' +
            '<p>' + product.name + '</p>' +
            '<h4 class="card-product__title"><a href="#">' + product.name + '</a></h4>' +
            '<p class="card-product__price">$150.00</p>' +
            '</div>' +
            '</div >' +
            '</div > '
        );
    });
}

$(document).ready(function () {
    setupPage();
});
