// #include

/*
console.log('               ////         ////       ');
console.log('              ////         ////        ');
console.log('    ===============================    ');
console.log('   ===============================     ');
console.log('           ////         ////           ');
console.log('          ////         ////            ');
console.log(' ===============================       ');
console.log('===============================        ');
console.log('       ////         ////               ');
console.log('      ////         ////                ');
*/



// Re-enable the below code for typind animation.

$( document ).ready(function()
{
	$("#typed-title").typed(
	{
		strings: ["hash", "^1000#^1000include"],
		typeSpeed: 90,
		startDelay: 1000,
		backSpeed: 0,
		backDelay: 2000
	});
});

// Code to disable auth providers link.
$(function() {
	jQuery.fn.extend({
		disable: function(state) {
			return this.each(function() {
				var $this = $(this);
				$this.toggleClass('disabled', state);
			});
		}
	});

	$('body').on('click', 'a.disabled', function(event) {
		event.preventDefault();
	});
});

$('courseForm').submit(function() {
	return false;
});

// Allow only numeric input 
$(function() {
  $('.mui-textfield').on('keydown', '#enroll', function(e){-1!==$.inArray(e.keyCode,[46,8,9,27,13,110,190])||/65|67|86|88/.test(e.keyCode)&&(!0===e.ctrlKey||!0===e.metaKey)||35<=e.keyCode&&40>=e.keyCode||(e.shiftKey||48>e.keyCode||57<e.keyCode)&&(96>e.keyCode||105<e.keyCode)&&e.preventDefault()});
})
$(function() {
  $('.mui-textfield').on('keydown', '#phone', function(e){-1!==$.inArray(e.keyCode,[46,8,9,27,13,110,190])||/65|67|86|88/.test(e.keyCode)&&(!0===e.ctrlKey||!0===e.metaKey)||35<=e.keyCode&&40>=e.keyCode||(e.shiftKey||48>e.keyCode||57<e.keyCode)&&(96>e.keyCode||105<e.keyCode)&&e.preventDefault()});
})

localStorage.clear();
sessionStorage.clear();
hello.init({
	facebook: '1634502443492240',
	google: '615042929237-ephb8jem6h6q8vf83e6d0db50qi2dmrs.apps.googleusercontent.com',
	github: 'cdbd672cb7a4de29c76b',
	windows: '000000004C168A78'
});

hello.logout();

function login(network) {
	$('a').disable(true);
	if ($('#course').val() === 'default' || $('#year').val() === 'default') {
		alert('Please select course and year to continue !!!');
		$('a').disable(false);
	}
	else{
		hello(network).login({scope: 'email'});
	}
}

hello.on('auth.login', function(auth) {


	// Call user information, for the given network
	hello(auth.network).api('/me').then(function(r) {
		
		// Authenticated succesfully.
		
		console.log("Network: " + auth.network + ", " + "User: " + r.name + ", " + "E-Mail: " + r.email + ", " + "Response dump: " + JSON.stringify(r) );
		
		// Check if email is available or not.
		if (r.email != undefined)
		{
			// Posting to the sheetsu API.
			$.get("https://sheetsu.com/apis/ba75adb2",
				function( data ){
					if(data.status === 200 && data.success === true)
					{
						console.log(data.result);
						if(($.grep(data.result, function(e){ return e.email === r.email })).length === 0)
						{
							$.ajax({
								url: 'https://sheetsu.com/apis/ba75adb2',
								type: 'post',
								data: {
									name: r.name,
									network: auth.network,
									email: r.email,
									course: $('#course').val(),
									year: $('#enroll').val(),
									phone: $('#phone').val(),
									extra: $('#extra').val(),
									response_dump: JSON.stringify(r)
								},
								dataType: 'json',
								success: function(response) {
									console.log(data);
									alert("Registered Successfully!");
									$('a').disable(false);
								}

							});
						}
						else
						{
							console.log("User already registered.");
							alert("Already registered!");
							$('a').disable(false);
							// TODO - Implement showing previous registration.
						}
					}
					else
					{
						alert("Unknown error occurred!");
						$('a').disable(false);
						console.log(data);
						// TODO - Implement error showing while connecting to the API.
					}
				});
		}
		else
		{
			alert("Unable to get e-mail ID, please check you profile or try a different provier!!!");
		}
	});
		
}, function(e) {
	alert('Unknown error occurred!!!');
	console.log(e);
	$('a').disable(true);
});

