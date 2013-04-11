(function(){
    app.scenes.diafilmScene = app.widgetScene.extend({
        init: function(){

            var _this = this;

            this.diafilm = this.options.diafilm;

            var imagesLoader = new app.imgLoader();

            this.slides = new app.widgets.slidesWidget();
            this.addWidget(this.slides);

            this.diafilm.fetch({
                success: function(){
                    var images = _this.diafilm.get('imgs');
                    imagesLoader.controlLoad = true;
                    for(var i = 0; i < 3; i++){
                        if(images[i]){
                            imagesLoader.add(images[i]);
                        }
                    }

                    imagesLoader.onLoad = function(){
                        imagesLoader.controlLoad = false;

                        _this.slides.imagesLoader = imagesLoader;
                        _this.slides.images = images;

                        _this.render();
                    };

                }
            });

            this.setActiveWidget(this.slides);

        },
        render: function(){
            $(this.el).html(new EJS({url: 'javascript/templates/diafilm.ejs'}).render({}));

            $('#slides', this.el).html(this.slides.render().el);

            this.trigger("rendered");

            return this;
        }
    });
})();
