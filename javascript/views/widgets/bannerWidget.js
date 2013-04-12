
(function(){
    app.widgets.bannerWidget = app.Widget.extend({
        initialize: function(){

            var _this = this;

            if(!$.fn.sfAdHubView){
                this.disabled = true;
            }

            this.on("key_right", function(){
                this.parent.trigger('next_widget');
            });
            this.on("key_left", function(){
                this.parent.trigger('prev_widget');
            });
            this.on("key_up", function(){
                this.parent.trigger('prev_widget');
            });
            this.on("key_down", function(){
                this.parent.trigger('next_widget');
            });
            this.on("key_enter", function(){
                $('#bottomBanner').sfAdHubView({order: 'click'});
            });

        },
        focus: function(){
            app.log('BANNER FOCUS')
            $('#bottomBanner').sfAdHubView({order: 'focus'});
        },
        blur: function(){
            $('#bottomBanner').sfAdHubView({order: 'unfocus'});
        },
        deactivate: function(){
            if(!this.isDisabled()){
                $('#bottomBanner').sfAdHubView({order: 'hide'});
            }
        },
        render: function(){
            var _this = this;

            this.parent.on("rendered", function(){
                if(_this.isDisabled()){
                    return false;
                }
                $('#bottomBanner').sfAdHubView({
                    order : "start",
                    inventoryId : app.config.inventoryId,    // You have to insert real inventory id. Without real inventory id, it does not work normally.
                    size: "HFBANNER",                 // banner size
                    focusColor: "red",
                    unfocusColor : "black"
                    //age : 60,                         // age
                    //interests: ["car", "soccer"],     // interests
                    //gender : "f",                     // gender
                    //keyword: "sports"                // keyword
                });

            });

            return this;
        }
    });
})();