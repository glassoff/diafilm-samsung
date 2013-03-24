
(function(){
    app.widgets.buttonsWidget = app.Widget.extend({
        initialize: function(){
            this.parent = this;

        },
        focus: function(){

        },
        blur: function(){

        },
        render: function(){
            var _this = this;

            this.$el.append(this.tpl);

            return this;
        }
    });
})();