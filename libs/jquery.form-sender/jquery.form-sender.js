const DEFAULT_EMAIL_STYLE = {
    header: { background_color: "c73f98", color: "000000" },
    body:   { background_color: "c73f98", color: "000000" },
    footer: { background_color: "cfd876", color: "ffffff" }
}

const DEFAULT_SETTINGS = {
    dir: "/jquery.form-sender/",
    selector: "form[data-order-form]",
    clearFields: true,
    ajaxCache: false,
    loaderAnimation: "jquery.form-sender/img/loader.gif"
}

function FormSenderFun() {
    if (arguments.callee._singletonInstance) {
        return arguments.callee._singletonInstance;
    }

    arguments.callee._singletonInstance = this;
    this.settings = DEFAULT_SETTINGS;
    this.forms = {};

    this.initSettings = function(settings) {
        if (typeof settings !== 'undefined') {
            this.settings = settings;
            if (!settings.hasOwnProperty("dir"))               this.settings.dir         = DEFAULT_SETTINGS.dir;
            if (!settings.hasOwnProperty("selector"))          this.settings.selector    = DEFAULT_SETTINGS.selector;
            if (!settings.hasOwnProperty("clearFields"))       this.settings.clearFields = DEFAULT_SETTINGS.clearFields;
            if (!settings.hasOwnProperty("ajaxCache"))         this.settings.ajaxCache   = DEFAULT_SETTINGS.ajaxCache;
            if (!settings.hasOwnProperty("loaderAnimation"))   this.settings.ajaxCache   = DEFAULT_SETTINGS.loaderAnimation;
        }
    };

    this.registerForm = function(form) {
        this.forms[form.id] = form;
        if (typeof form.emailStyle === 'undefined')
            form.emailStyle = DEFAULT_EMAIL_STYLE;
    };

    // debug
    this.printForms = function () {
        for(var form in this.forms)
            console.log(this.forms[form]);
    };

    this.emailStyleToJSON = function(style) {
        return '{"header": ' + '{"bg": "' + style.header.background_color + '", "c": "' + style.header.color + '"}, "body": ' + '{"bg": "' + style.body.background_color + '", "c": "' + style.body.color + '"}, "footer": {"bg": "' + style.footer.background_color + '", "c": "' + style.footer.color + '"}}';
    };
}

const FormSender = new FormSenderFun();


$(document).ready(function(){
    $.ajaxSetup({ cache: false });

    $(FormSender.settings.selector).each(function () {
        var $this = $(this);
        var $this_id = $(this).attr('id');

        $this.submit(function(e) {

            tryCallFun(FormSender.forms[$this_id].beforeSubmit);

            var _data = {};
            _data.order_title = $this.attr("data-title");
            _data.style = FormSender.emailStyleToJSON(FormSender.forms[$this_id].emailStyle);

            $("#" + $this_id + " input, #" + $this_id + " select, #" + $this_id + " textarea").each(function(index){
                var input = $(this);
                if (input.attr("data-is-included") === "true") {
                    _data[input.attr('name')] = '{"v" : "' + input.val() + '", "t": "' + input.attr("data-title") + '"}';
                    if (FormSender.settings.clearFields)
                        input.val("");
                }
            });

            tryCallFun(FormSender.forms[$this_id].onWait);

            $.ajax({
                asynch: true,
                url: FormSender.settings.dir + "OrderSender.php",
                data: _data,
                dataType: "json",
                type: "get",
                success : function(json){
                    if (json.status === "error") {
                        tryCallFun(FormSender.forms[$this_id].onError, json);
                    } else
                        if (json.status === "success") {
                            tryCallFun(FormSender.forms[$this_id].onSuccess, json);
                        }
                    return json;
                },
                error : function(json){
                    tryCallFun(FormSender.forms[$this_id].onError, json);
                    return json;
                }
            });
            e.preventDefault();
            tryCallFun(FormSender.forms[$this_id].afterSubmit);
        });
    });
});

function tryCallFun(fun, param) {
    try {
        if (fun !== "undefined")
            if (arguments.length === 2 && param !== "undefined")
                fun(param);
            else
                fun();
    } catch(e) {}
}
