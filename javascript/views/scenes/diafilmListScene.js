(function(){
    app.scenes.diafilmListScene = app.widgetScene.extend({
        init: function(){

            var _this = this;

            this.collection = this.options.diafilmCollection;
            this.category = this.options.category;

            this.diafilms = new app.widgets.tilesWidget({
                tileWidth: 160,
                tileHeight: 160,
                rows: 3
            });

            var images = new imgLoader();

            images.controlLoad = true;
            for(var i = 0; i < 24; i++){
                if(_this.collection[i]){
                    var imgUrl = _this.collection[i].get('img');
                    images.add(_this.getThumbUrl(imgUrl));
                }
            }

            images.onLoad = function(){
                images.controlLoad = false;
                _this.render();
            };

            this.diafilms.getTileOnIndex = function(index){
                var item = _this.collection[index];

                if(!item){
                    return;
                }

                var imgSrc = _this.collection[index].get('img');
                var imgUrl = _this.getThumbUrl(imgSrc);

                var html = $(
                    '<div>'+
                        '<div class="opacity"></div>'+
                        '<div class="img"></div>'+
                        '<div class="title">'+item.get('title')+'</div>'+
                    '</div>'
                );

                var img = images.get(imgUrl);

                for(var i = index; i < index + 6; i++){
                    if(_this.collection[i]){
                        var imgUrl = _this.collection[i].get('img');
                        images.add(_this.getThumbUrl(imgUrl));
                    }
                }

                $('.img', html).html(img);

                return html;
            };

            this.addWidget(this.diafilms);

            app.log('COUNT', _this.collection.length)
            _this.diafilms.count = _this.collection.length;

            this.diafilms.on("key_enter", function(){
                 app.showScene("diafilmScene", {
                    diafilm: _this.collection[_this.diafilms.getActiveIndex()]
                 });
             });

            this.setActiveWidget(this.diafilms);
        },
        getThumbUrl: function(imgSrc){
            var parts = imgSrc.match(/^http:\/\/diafilmy.su\/uploads\/(.*)\.(.*?)$/);
            var thumbType = 'samsung-tv';

            var imgUrl = "http://diafilmy.su/thumbs/" + parts[1] + '-thumb-' + thumbType + '.' + parts[2];

            return imgUrl;
        },
        render: function(){
            $(this.el).html(new EJS({url: 'javascript/templates/diafilmList.ejs'}).render({
                category: this.category
            }));
            $('#diafilmsWidget').append(this.diafilms.render().el);

            this.trigger("rendered");

            return this;
        }
    });

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


})();
