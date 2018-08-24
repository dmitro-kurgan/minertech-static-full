    $("input[name=phone]").intlTelInput({
       initialCountry: "ua",
       nationalMode: false,
       formatOnDisplay: true,
       utilsScript: "libs/jquery.form-sender/utils.js",
       preferredCountries: ['ua', 'ru', 'by'],
    });
    var _emailStyle = {
        header: {
            background_color: "f3f3f3",
            color: "3579eb"
        },
        body: {
            background_color: "f3f3f3",
            color: "000000"
        },
        footer: {
            background_color: "f3f3f3",
            color: "3579eb"
        }
    };
    FormSender.initSettings({
        dir: "libs/jquery.form-sender/",
        clearFields: false
    });
    var loading = function() {
        $("#order-thanks-popup .modal-title").html("<h1>Обработка</h1>");
        $("#order-thanks-popup .modal-body").html("<object data=\"/images/loader.svg\" class=\"loader\" type=\"image/svg+xml\" id=\"svg1\"></object>");
        $('#order-thanks-popup').modal("show");
    }
    FormSender.registerForm({
        id: "order-form",
        emailStyle: _emailStyle,
        onSuccess: function(json) {
            // $("#order-thanks-popup .modal-img").html("<img src=\"./images/image_sent.png\">");
            $("#order-thanks-popup .modal-title").html("<h1>Отправлено!</h1>");
            $("#order-thanks-popup .modal-text").html("<p>Ваша заявка успешно отправлена.</p>");
            function hideSuccess() {
              $('#order-thanks-popup').modal('hide');
            }
        setTimeout(hideSuccess, 2000);
        },
        onError: function(json) {
            $("#order-thanks-popup .modal-title").html("<h1>Ошибка!</h1>");
            $("#order-thanks-popup .modal-text").html("<p>Произошла ошибка при отправке заявки. Пожалуйста, попробуйте отправить заявку еще раз.</p>");
        },
        onWait: function() {
            loading();
        }
    });
    $('input[name=phone]').keyup(function() {
        if ($(this).intlTelInput("isValidNumber")) {
            $(this).removeClass("input-invalid");
            $(this).addClass("input-valid");
        } else {
            $(this).removeClass("input-valid");
            $(this).addClass("input-invalid");
        }
    });