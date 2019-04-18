$("#checkout").click(function(){
    if (!sessionStorage.cart) {
        var cart_list = [];
        var itemA = {id: '0001', name: 'water purifier A', quantity: 2, charge: 120.00};
        cart_list.push(itemA);
        var itemB = {id: '0002', name: 'water purifier B', quantity: 1, charge: 135.00};
        cart_list.push(itemB);
        sessionStorage.cart = JSON.stringify(cart_list);
    }

    console.log('is empty ' + !Object.keys(sessionStorage.cart).length);
    console.log('session.cart : ' + JSON.stringify(sessionStorage.cart));
});