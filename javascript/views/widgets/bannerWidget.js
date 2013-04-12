
(function(){
    app.widgets.bannerWidget = app.Widget.extend({
        initialize: function(){

        },
        focus: function(){

        },
        blur: function(){

        },
        render: function(){
            var _this = this;

            this.parent.on("rendered", function(){
                $('#bottomBanner').sfAdHubView({
                    order : "start",
                    inventoryId : "2100000689_001",    // You have to insert real inventory id. Without real inventory id, it does not work normally.
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