(function(){
    app.scenes.homeScene = app.withLoaderScene.extend({
        init: function(){

            this.initLoader();

            var _this = this;

            this.diafilmCollection = this.options.diafilmCollection;
            this.categoryCollection = this.diafilmCollection.categoryCollection;

            //categories
            this.categories = new app.widgets.listWidget({
                collection: this.categoryCollection
            });
            this.categories.count = this.categoryCollection.length;
            this.addWidget(this.categories);

            this.categories.on("key_enter", function(){
                var categoryDiafilms = [];
                var category = _this.categoryCollection.at(_this.categories.activeIndex);
                var categoryName = category.get('title');

                categoryDiafilms = _this.diafilmCollection.filter(function(model) {
                    var cats = model.get('cat');

                    if(_.indexOf(cats, categoryName) >= 0){
                        return true;
                    }

                    return false;
                });

                _this.showLoader();
                 app.showScene("diafilmListScene", {
                     diafilmCollection: categoryDiafilms,
                     category: category
                 });
             });

            //latests
            this.latests = new app.widgets.tilesWidget({
                tileWidth: 150,
                tileHeight: 140,
                rows: 3,
                cols: 4
            });

            this.latests.getTileOnIndex = function(index){

                var item = _this.diafilmCollection.at(index);

                var imgUrl = app.getThumbUrl(item.get('img'), "samsung-tv-small");

                var html = $(
                    '<div>'+
                        '<div class="opacity"></div>'+
                        '<img width="150" height="140" src="'+imgUrl+'"/>'+
                        '<div class="title_small">'+item.get('title')+'</div>'+
                    '</div>'
                );

                return html;
            };

            this.addWidget(this.latests);

            this.latests.on("key_enter", function(){
                _this.showLoader();
                app.showScene("diafilmScene", {
                    diafilm: _this.diafilmCollection.at(_this.latests.getActiveIndex())
                });
            });

            //banner
            this.banner = new app.widgets.bannerWidget();
            this.addWidget(this.banner);

            this.setActiveWidget(this.categories);

            _this.render();
        },
        initModels: function(){
            this.categoryCollection = new app.models.categoryCollection();
            this.diafilmCollection = new app.models.diafilmCollection();
            this.diafilmCollection.categoryCollection = this.categoryCollection;
        },
        render: function(){
            alert('render')
            $(this.el).html(new EJS({url: 'javascript/templates/home.ejs'}).render({

            }));
            $('#categoriesWidget', this.el).append(this.categories.render().el);
            $('#latestWidget', this.el).append(this.latests.render().el);

            //$('#bottomBanner', this.el).append(this.banner.render().el);
            this.banner.render();

            this.trigger("rendered");

            return this;
        }
    });
})();
