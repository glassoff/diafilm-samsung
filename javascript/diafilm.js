
(function(){
    app.start = function(){
        alert('start app...');

        this.showScene('splashScene');
    }

    app.getThumbUrl = function(imgSrc, type){
        var parts = imgSrc.match(/^http:\/\/diafilmy.su\/uploads\/(.*)\.(.*?)$/);
        var thumbType = type || 'samsung-tv';

        var imgUrl = "http://diafilmy.su/thumbs/" + parts[1] + '-thumb-' + thumbType + '.' + parts[2];

        return imgUrl;
    }

    app.loadedImages = [];

    //image loader
    var imgLoader = function(){
        this.images = {};//{img : ..., loaded: false}
        this.loaded = 0;
        this.controlLoad = false;
    };
    imgLoader.prototype.images = {};
    imgLoader.prototype.loaded = 0;
    imgLoader.prototype.controlLoad = false;
    imgLoader.prototype.add = function(url){
        if(!this.images[url]){
            this.images[url] = {loaded: false};
            this.images[url].img = this.createImg(url);
        }
    };
    imgLoader.prototype.createImg = function(url){app.log('create '+url)
        var _this = this;

        var img = document.createElement("img");
        img.src = url;

        if(_.indexOf(app.loadedImages, url) >= 0){
            onLoad();
        }
        else{
            $(img).load(onLoad);
        }

        function onLoad(){
            app.log('loaded ', url)
            app.loadedImages.push(url);
            _this.loaded++;
            _this.images[url].loaded = true;
            app.log('load '+ _this.loaded+ ' from '+ _.size(_this.images))
            if(_this.controlLoad && _this.loaded >= _.size(_this.images)){
                app.log('IMAGES LOAD! ', _this.loaded);
                _this.onLoad();
            }
        }

        return img;
    };
    imgLoader.prototype.get = function(url){
        if(!this.images[url]){app.log('add')
            this.add(url);
        }
        else if(!this.images[url].img){app.log('add after delete')
            this.images[url].img = this.createImg(url);
        }
        return this.images[url].img;
    };
    imgLoader.prototype.delete = function(url){
        if(url){
            this.images[url].img = null;
            this.loaded--;
        }
    };
    imgLoader.prototype.isLoaded = function(url){
        if(this.images[url]){
            return this.images[url].loaded;
        }
        app.log('no this image!');
        return false;
    },
    imgLoader.prototype.onLoad = function(){};

    app.imgLoader = imgLoader;

                                        /* scene with error popup */
    app.withErrorPopupScene = app.widgetScene.extend({
        initErrorPopup: function(){
            var _this = this;

            this.popup = new app.widgets.popupWidget({
                titleText: 'Ошибка'
            });
            this.addWidget(this.popup);

            app.on("error_ajax", function(){
                _this.popup.show('Сервер недоступен<br><br>Приложение будет закрыто');
            });
            app.on("no_internet", function(){
                _this.popup.show("Отсутствует соединение с Internet<br><br>Приложение будет закрыто");

                app.once("internet", function(){
                    _this.popup.hide();
                });
            });

            this.on("rendered", function(){
                $('#popupWidget', _this.el).append(_this.popup.render().el);
            });
        }
    });

                                        /* scene with loader */
    app.withLoaderScene = app.withErrorPopupScene.extend({
        initLoader: function(){
            var _this = this;

            this.initErrorPopup();

            this.blured = true;

            this.hiddenLoader = true;

            this.on("focused", function(){
                _this.blured = false;
            });

            //loader
            this.loader = new app.widgets.loaderWidget();
            this.addWidget(this.loader);

            this.on("rendered", function(){
                $('#loaderWidget', _this.el).append(_this.loader.render().el);
            });
        },
        blur: function(){
            this.blured = true;
            this.hiddenLoader = true;

            this.activeWidget.blur();
            if(this.prevActiveWidget){
                this.activeWidget = this.prevActiveWidget;
            }
            this.trigger("blured");
        },
        showLoader: function(notBlockReturn){
            var _this = this;

            this.hiddenLoader = false;
            setTimeout(function(){
                if(!_this.blured && !_this.hiddenLoader){
                    _this.focusWidget(_this.loader);

                    if(notBlockReturn){
                        app.blockReturn = false;
                    }
                }
            }, 300);
        },
        hideLoader: function(){
            this.hiddenLoader = true;
            if(this.prevActiveWidget != this.activeWidget && this.prevActiveWidget != this.loader){
                this.toPrevActiveWidget();
            }
        }
    });


})();
