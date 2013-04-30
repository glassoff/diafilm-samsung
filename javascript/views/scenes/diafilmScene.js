(function(){
    app.scenes.diafilmScene = app.withLoaderScene.extend({
        init: function(){

            this.initLoader();

            var _this = this;

            this.diafilm = this.options.diafilm;

            var imagesLoader = new app.imgLoader();

            this.slides = new app.widgets.slidesWidget();
            this.addWidget(this.slides);

            this.diafilm.fetch({
                success: function(){
                    var images = _this.diafilm.get('imgs');

                    imagesLoader.onLoad = function(){
                        imagesLoader.controlLoad = false;

                        _this.slides.imagesLoader = imagesLoader;
                        _this.slides.images = images;

                        _this.render();
                    };

                    imagesLoader.controlLoad = true;
                    for(var i = 0; i < 2; i++){
                        if(images[i]){
                            imagesLoader.add(images[i]);
                        }
                    }
                }
            });

            this.setActiveWidget(this.slides);

            this.on("blured", function(){
                if(_this.slides.previousSlide){
                    if(_this.slides.el.deleteChild){
                        _this.slides.el.deleteChild(_this.slides.previousSlide.get(0));
                    }
                    else{
                        _this.slides.el.removeChild(_this.slides.previousSlide.get(0));
                    }
                    _this.slides.imagesLoader.delete(_this.slides.images[_this.slides.currentIndex - 1]);
                }
                if(_this.slides.el.deleteChild){
                    _this.slides.el.deleteChild(_this.slides.currentSlide.get(0));app.log('del current')
                }
                else{
                    _this.slides.el.removeChild(_this.slides.currentSlide.get(0));
                }
                _this.slides.imagesLoader.delete(_this.slides.images[_this.slides.currentIndex]);

                if(_this.slides.el.deleteChild){
                    _this.slides.el.deleteChild(_this.slides.nextSlide.get(0));
                }
                else{
                    _this.slides.el.removeChild(_this.slides.nextSlide.get(0));
                }
                _this.slides.imagesLoader.delete(_this.slides.images[_this.slides.currentIndex + 1]);
            });

        },
        render: function(){
            $(this.el).html(new EJS({url: 'javascript/templates/diafilm.ejs'}).render({}));

            $('#slides', this.el).html(this.slides.render().el);

            this.trigger("rendered");

            return this;
        }
    });
})();
