(function(){
    app.scenes.diafilmListScene = app.withLoaderScene.extend({
        init: function(){

            this.initLoader();

            var _this = this;

            this.collection = this.options.diafilmCollection;
            this.category = this.options.category;

            this.diafilms = new app.widgets.tilesWidget({
                tileWidth: 230,
                tileHeight: 230,
                rows: 2
            });

            var images = new app.imgLoader();
            this.images = images;

            this.addWidget(this.diafilms);

            app.log('COUNT', _this.collection.length)
            _this.diafilms.count = _this.collection.length;

            this.diafilms.on("key_enter", function(){
                _this.showLoader();
                 app.showScene("diafilmScene", {
                    diafilm: _this.collection[_this.diafilms.getActiveIndex()]
                 });
             });

            //banner
            this.banner = new app.widgets.bannerWidget();
            this.addWidget(this.banner);

            this.setActiveWidget(this.diafilms);


            images.onLoad = function(){
                images.controlLoad = false;
                _this.render();
            };

            this.diafilms.getTileOnIndex = function(index, tileEl){

                if(tileEl && tileEl.find('img').length > 0){
                    var oldImgUrl = tileEl.find('img').attr('src');
                    if(tileEl.get(0).deleteChild){
                        tileEl.get(0).deleteChild(tileEl.get(0).firstChild);
                    }
                    else{
                        tileEl.get(0).removeChild(tileEl.get(0).firstChild);
                    }
                    images.delete(oldImgUrl);
                }

                var item = _this.collection[index];

                if(!item){
                    return;
                }

                var imgSrc = _this.collection[index].get('img');
                var imgUrl = app.getThumbUrl(imgSrc, "samsung-tv-medium");

                var html = $(
                    '<div>'+
                        '<div class="opacity"></div>'+
                        '<div class="img"></div>'+
                        '<div class="year">'+item.get('year')+' г.</div>'+
                        '<div class="btm">'+
                        '<div class="title">'+item.get('title')+'</div>'+
                        '</div>'+
                        '</div>'
                );

                var img = images.get(imgUrl);
                img.width = 230;
                img.height = 190;

                for(var i = index; i < index + 4; i++){
                    if(_this.collection[i]){
                        var imgUrl = _this.collection[i].get('img');
                        images.add(app.getThumbUrl(imgUrl, "samsung-tv-medium"));
                    }
                }

                $('.img', html).html(img);

                return html;
            };


            images.controlLoad = true;
            for(var i = 0; i < 12; i++){
                if(_this.collection[i]){
                    var imgUrl = _this.collection[i].get('img');
                    images.add(app.getThumbUrl(imgUrl, "samsung-tv-medium"));
                }
            }

            this.on("blured", function(){
                _.each(_this.diafilms.tiles, function(tile, i){
                    var tileEl = tile.el;

                    var oldImgUrl = tileEl.find('img').attr('src');
                    if(tileEl.get(0).deleteChild){
                        tileEl.get(0).deleteChild(tileEl.get(0).firstChild);
                    }
                    else{
                        tileEl.get(0).removeChild(tileEl.get(0).firstChild);
                    }
                    _this.images.delete(oldImgUrl);
                });
            });
        },
        render: function(){
            $(this.el).html(new EJS({url: 'javascript/templates/diafilmList.ejs'}).render({
                category: this.category
            }));
            $('#diafilmsWidget', this.el).append(this.diafilms.render().el);

            this.banner.render();

            this.trigger("rendered");

            return this;
        }
    });

})();
