$('#login-button').click(function(event){
	event.preventDefault()

	let email = $('#email_address').val()
	let password = $('#password').val()
	let controlpassword = $('#password-control').val()
	let error = false

	if (email === ''){
		$('#email_address').addClass('is-invalid')
		error=true
	} else {
		$('#email_address').removeClass('is-invalid')
	}

	if(password===''){
		$('#password').addClass('is-invalid')
		error = true
	}else {
		$('#password').removeClass('is-invalid')
	}


	if(controlpassword != password){
		$('#password-control').addClass('is-invalid')
		error = true
	}else {
		$('#password-control').removeClass('is-invalid')
	}

	if(!error){
		$('#login-form').submit()
	}
})