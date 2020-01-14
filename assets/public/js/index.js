function setupPage() {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': jsonFile,
        'dataType': "json",
        'success': function (data) {
            getProductList(data);
        }
    });
    return json;
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
            } else {
                hidePromotionList();
            }
        })
        .catch(function (err) {
            hidePromotionList();
        })
}

function hidePromotionList() {
    document.getElementById("promotion_panel").style.display = "none";
}

function loadProductList(productList) {
    if(productList.length <= 0) {
        hidePromotionList();
        return;
    }
    
    productList.forEach(product => {
        $('#promotion_panel_detail').trigger('add.owl.carousel',
        '<div class="hero-carousel__slide">' +
        '    <img src="' + product.image[0] + '" alt="" class="img-fluid">' +
        '    <a href="product-detail?id=' + product._id + '" class="hero-carousel__slideOverlay">' +
        '        <h3>' + product.name + '</h3>' +
        '        <p>RM ' + product.price.rental_price + '</p>' +
        '    </a>' +
        '</div>')
    });

    $('#promotion_panel_detail').trigger('refresh.owl.carousel')
}

$(document).ready(function () {
    setupPage();
});
