
(function(){
    app.widgets.loaderWidget = app.Widget.extend({
        initialize: function(){
            var _this = this;

            this.$el.hide();
        },
        focus: function(){
            this.$el.show();
        },
        blur: function(){
            this.$el.hide();
        },
        render: function(){
            var _this = this;

            $(this.el).html(new EJS({url: 'javascript/templates/loader.ejs'}).render({}));

            return this;
        }
    });
})();