var const_array = {
    const_phone_number: '012-3334445',
    const_email_address: 'temporary@email.com'
}

for (k in const_array) {
    element = $('.'+k)
    if (const_array[k]){
        if (element){
            element.html(const_array[k])
        }
    }
}