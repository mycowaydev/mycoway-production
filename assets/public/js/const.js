var const_array = {
    const_phone_number: '011-6290 7381<br/>016-935 1323',
    const_email_address: 'mycoway.com.my@gmail.com'
}

for (k in const_array) {
    element = $('.'+k)
    if (const_array[k]){
        if (element){
            element.html(const_array[k])
        }
    }
}