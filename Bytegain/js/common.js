$(document).ready(function() {

    $('.button-first').magnificPopup( {easing: 'ease-in-out'});

    $(".main-form").submit(function() {
        $.ajax({
            type: "GET",
            url: "mail.php",
            data: $(".main-form").serialize()
        }).done(function() {
            $.magnificPopup.open({
                items: {
                    src: '  <div class="tnx-pop" id="tnx-pop"><div class="ok"></div><div class="hidden-form__heading tnx-pop__heading">Thank you for your interest in our service. We will contact you shortly to discuss the right solution for your business needs.</div></div>',
                    type: 'inline'
                }
            });
        });
        return false;
    });


	$(".hidden-form").submit(function() {
		$.ajax({
			type: "GET",
			url: "mail_pop.php",
			data: $(".hidden-form").serialize()
		}).done(function() {
			$.magnificPopup.open({
				items: {
					src: '  <div class="tnx-pop" id="tnx-pop"><div class="ok"></div><div class="hidden-form__heading tnx-pop__heading">Thank you for your interest in our service. We will contact you shortly to discuss the right solution for your business needs.</div></div>',
					type: 'inline'
				}
			});
		});
		return false;
	});


});