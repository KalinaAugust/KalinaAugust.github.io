(function () {
	$(document).ready(function () {


        $('.main-slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            nextArrow: '<div class="slick-slider__next"></div>',
            prevArrow: '<div class="slick-slider__prev"></div>',
            responsive: [
                {
                    breakpoint: 480,
                    settings: {
                    }
                }
            ]
        });





		$("#button1").click(function () {
			var b = "/sendemail.php";
			$.ajax({
				type: "POST",
				url: b,
				data: $("#form1").serialize(),
				success: function (a) {
					console.log("ok")
				},
				error: function (a) {
					console.dir(a)
				}
			})
		});
		$("#button2").click(function () {
			var b = "/sendemail.php";
			$.ajax({
				type: "POST",
				url: b,
				data: $("#form3").serialize(),
				success: function (a) {
					console.log("ok")
				},
				error: function (a) {
					console.dir(a)
				}
			})
		});
		$("#button-vizy-send").click(function () {
			var b = "/sendemail.php";
			$.ajax({
				type: "POST",
				url: b,
				data: $("#form2").serialize(),
				success: function (a) {
					console.log("ok");
					$('#exampleModal').modal('hide');
					$("#myModal").modal("show");
				},
				error: function (a) {
					console.dir(a)
				}
			})
		})
	});
	$.validator.setDefaults({
		submitHandler: function () {
			$("#myModal").modal("show");
		}
	});

	$(document).ready(function () {
		$("#form1").validate({
			rules: {
				name: "required",
				phone: "required"
			},
			messages: {
				name: "Пожалуйста введите Ваше имя",
				phone: "Пожалуйста введите Ваш телефон"
			},
			errorElement: "em",
			errorPlacement: function (d, c) {
				d.addClass("help-block");
				if (c.prop("type") === "checkbox") {
					d.insertAfter(c.parent("label"))
				} else {
					d.insertAfter(c)
				}
			},
			highlight: function (f, e, d) {
				$(f).parents(".form-group").addClass("has-error").removeClass("has-success")
			},
			unhighlight: function (f, e, d) {
				$(f).parents(".form-group").addClass("has-success").removeClass("has-error")
			}
		});
		$("#form2").validate({
			rules: {
				name: "required",
				phone: "required"
			},
			messages: {
				name: "Пожалуйста введите Ваше имя",
				phone: "Пожалуйста введите Ваше телефон",
			},
			errorElement: "em",
			errorPlacement: function (q, r) {
				d.addClass("help-block");
				if (r.prop("type") === "checkbox") {
					q.insertAfter(r.parent("label"))
				} else {
					q.insertAfter(r)
				}
			},
			highlight: function (a, e, q) {
				$(a).parents(".form-group").addClass("has-error").removeClass("has-success")
			},
			unhighlight: function (a, e, q) {
				$(a).parents(".form-group").addClass("has-success").removeClass("has-error")
			}
		});
		$("#form3").validate({
			rules: {
				name: "required",
				phone: "required"
			},
			messages: {
				name: "Пожалуйста введите Ваше имя",
				phone: "Пожалуйста введите Ваше телефон",
			},
			errorElement: "em",
			errorPlacement: function (d, c) {
				d.addClass("help-block");
				if (c.prop("type") === "checkbox") {
					d.insertAfter(c.parent("label"))
				} else {
					d.insertAfter(c)
				}
			},
			highlight: function (f, e, d) {
				$(f).parents(".form-group").addClass("has-error").removeClass("has-success")
			},
			unhighlight: function (f, e, d) {
				$(f).parents(".form-group").addClass("has-success").removeClass("has-error")
			}
		});
	});
	$("input[name=phone]").mask("+375(99) 999-99-99")
})();