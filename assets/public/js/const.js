var const_array = {
    const_phone_number: '017-228 8377',
    const_email_address: 'https://www.facebook.com/www.mycoway.com.my'
}

for (k in const_array) {
    element = $('.'+k)
    if (const_array[k]){
        if (element){
            element.html(const_array[k])
        }
    }
}