
(function(){
    if(!/SmartHub|SMART-TV|SmartTV|Maple/i.test(navigator.userAgent)){
        app.config.browser = true;
    }

    if(app.config.browser){

        app.onLoad = function() {
            this.initialize();
            this.start();
        }

        var originalAjax = $.ajax;
        $.ajax = function(options){
            //options.crossDomain = true;
            //options.dataType = 'jsonp';
            /*options.xhrFields = {
                withCredentials: true
            };*/
            options.xhr = function(){
                var xhr = new CrossXHR();
                xhr.getAllResponseHeaders = function(){ return "Content-Type: application/xml\n" }
                return xhr;
            };
            return originalAjax.call(this, options);
        }

        window.alert = function(){
            console.log.apply(console, arguments);
        };

        app.log = function(){
            console.log.apply(console, arguments);
        };

        alert('==Browser mode');

        app.appKeyHandler = function(event){
            var KeyCode = event.keyCode;
            //alert(KeyCode)
            switch(KeyCode)
            {
                case 37:
                    app.scene.activeWidget.trigger('key_left');
                    break;
                case 39:
                    app.scene.activeWidget.trigger('key_right');
                    break;
                case 38:
                    app.scene.activeWidget.trigger('key_up');
                    event.preventDefault();
                    break;
                case 40:
                    app.scene.activeWidget.trigger('key_down');
                    event.preventDefault();
                    break;
                case 13:
                    app.scene.activeWidget.trigger('key_enter');
                    break;
                case 8:
                    app.trigger('key_return');
                    app.scene.activeWidget.trigger('key_return');
                    event.preventDefault();
                    break;
                default :
                    break;
            }

        }

        $(document).keypress(app.appKeyHandler);
    }
})();

