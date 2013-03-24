(function(){
    app.scenes.diafilmScene = app.widgetScene.extend({
        initialize: function(){
            this.initWidgets();

            var _this = this;

            this.diafilm = this.options.diafilm;

            this.slides = new app.widgets.slidesWidget();
            this.addWidget(this.slides);

            this.diafilm.fetch({
                success: function(){
                    _this.slides.images = _this.diafilm.get('imgs');
                    _this.render();
                }
            });



            this.focusWidget(this.slides);

        },
        render: function(){
            $(this.el).html(new EJS({url: 'javascript/templates/diafilm.ejs'}).render({}));

            $('#slides', this.el).html(this.slides.render().el);

            return this;
        }
    });
})();
