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


$('#course').prop('disabled', true);
$('#department').prop('disabled', true);
$('#enroll').prop('disabled', true);
$('.btn-auth').addClass('disabled');

$('#type').on('change', function(e) {
	var optionSelected = $("option:selected", this);
    var valueSelected = this.value;

	if (valueSelected === "default") {
		$('#course').prop('disabled', true);
		$('#department').prop('disabled', true);
		$('#enroll').prop('disabled', true);
		$('.btn-auth').addClass('disabled');
	}
	else {
		$('.btn-auth').removeClass('disabled');
		if (valueSelected === "student") {
			$('#course').prop('disabled', false);
			$('#enroll').prop('disabled', false);
			$('#department').prop('disabled', true);
		}
		if (valueSelected === "employee") {
			$('#department').prop('disabled', false);
			$('#course').prop('disabled', true);
			$('#enroll').prop('disabled', true);
		}
	}
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
	google: '970528374418-e2d4lk9te77upvmqgpr1apmtd9ecf11m.apps.googleusercontent.com',
	github: '6879fbfaf6adeb6190c2',
	windows: '000000004C168A78'
});

hello.logout();

function login(network) {
	$('a').disable(true);
	if ($('#type').val() === "default") {
		alert('Please select type and enter details to continue !!!');
		$('a').disable(false);
		return;
	}
	if ($('#type').val() === "employee" && ($('#department').val() === 'default' || $('#year').val() === 'default')) {
		alert('Please select department and year to continue !!!');
		$('a').disable(false);
		return;
	}
	if ($('#type').val() === "student" && ($('#course').val() === 'default' || $('#year').val() === 'default')) {
		alert('Please select course and year to continue !!!');
		$('a').disable(false);
		return;
	}
	
	hello(network).login({scope: 'email'});
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
			$.get("https://sheetsu.com/apis/v1.0/667af32ec687/email/" + r.email,
				function( data ){
					if(data.status === 200 && data.success === true)
					{
						console.log(data.result);
						if(($.grep(data.result, function(e){ return e.email === r.email })).length === 0)
						{
							var payload = { };
							payload.name = r.name;
							payload.network = auth.network;
							payload.email = r.email;
							payload.type = $('#type').val();
							payload.phone = $('#phone').val();
							payload.extra = $('#extra').val();
							payload.dump = JSON.stringify(r);
							payload.year = $('#year').val();
							payload.timestamp = Date.now();
							payload.communities = "";

							if ($('#type') === 'student') {
								payload.course = $('#course').val();
							}
							else {
								payload.department = $('#department').val();
							}

							$('#communities').each(function (index) {
								payload.communities += $(this).is(':checked') ? "," + $(this).val() : "";
							});

							$.ajax({
								url: 'https://sheetsu.com/apis/v1.0/667af32ec687',
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

