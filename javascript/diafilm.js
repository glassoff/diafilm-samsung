
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

})();
