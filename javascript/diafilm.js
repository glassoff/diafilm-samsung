
(function(){
    app.start = function(){
        alert('start app...');

        this.showScene('splashScene');
    }

    app.getThumbUrl = function(imgSrc){
        var parts = imgSrc.match(/^http:\/\/diafilmy.su\/uploads\/(.*)\.(.*?)$/);
        var thumbType = 'samsung-tv';

        var imgUrl = "http://diafilmy.su/thumbs/" + parts[1] + '-thumb-' + thumbType + '.' + parts[2];

        return imgUrl;
    }

    //image loader
    var imgLoader = function(){
        this.images = {};
        this.loaded = 0;
        this.controlLoad = false;
    };
    imgLoader.prototype.images = {};
    imgLoader.prototype.loaded = 0;
    imgLoader.prototype.controlLoad = false;
    imgLoader.prototype.add = function(url){
        if(!this.images[url]){
            this.images[url] = this.createImg(url);
        }
    };
    imgLoader.prototype.createImg = function(url){
        var _this = this;

        var img = document.createElement("img");
        img.src = url;
        $(img).load(function(){
            _this.loaded++;
            //app.log('load ', _this.loaded, ' from ', _.size(_this.images))
            if(_this.controlLoad && _this.loaded >= _.size(_this.images)){
                app.log('IMAGES LOAD! ', _this.loaded);
                _this.onLoad();
            }
        });
        return img;
    };
    imgLoader.prototype.get = function(url){
        if(!this.images[url]){
            this.add(url);
        }
        return this.images[url];
    };
    imgLoader.prototype.onLoad = function(){};

    app.imgLoader = imgLoader;

    //scene with loader
    app.withLoaderScene = app.widgetScene.extend({
        initLoader: function(){
            var _this = this;
            this.prevWidget = null;
            this.blured = true;

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

            this.activeWidget.blur();
            if(this.prevWidget){
                this.activeWidget = this.prevWidget;
            }
        },
        showLoader: function(){
            var _this = this;

            setTimeout(function(){
                if(!_this.blured){
                    _this.prevWidget = _this.activeWidget;
                    _this.focusWidget(_this.loader);
                }
            }, 300);


        }
    });


})();
