(function(){
    app.scenes.diafilmListScene = app.withLoaderScene.extend({
        init: function(){

            this.initLoader();

            var _this = this;

            this.collection = this.options.diafilmCollection;
            this.category = this.options.category;

            this.diafilms = new app.widgets.tilesWidget({
                tileWidth: 160,
                tileHeight: 160,
                rows: 3
            });

            var images = new app.imgLoader();

            images.controlLoad = true;
            for(var i = 0; i < 24; i++){
                if(_this.collection[i]){
                    var imgUrl = _this.collection[i].get('img');
                    images.add(app.getThumbUrl(imgUrl));
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
                var imgUrl = app.getThumbUrl(imgSrc);

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
                        images.add(app.getThumbUrl(imgUrl));
                    }
                }

                $('.img', html).html(img);

                return html;
            };

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
