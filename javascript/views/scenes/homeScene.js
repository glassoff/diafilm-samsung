(function(){
    app.scenes.homeScene = app.widgetScene.extend({
        initialize: function(){
            this.initWidgets();

            var _this = this;

            this.initModels();

            //categories
            this.categories = new app.widgets.listWidget({
                collection: this.categoryCollection
            });
            this.addWidget(this.categories);
            this.diafilmCollection.fetch();

            this.categories.on("key_enter", function(){
                 app.showScene("diafilmListScene", {
                     diafilmCollection: _this.diafilmCollection.where({cat: _this.categoryCollection.at(_this.categories.activeIndex).get('title')}),
                     category: _this.categoryCollection.at(_this.categories.activeIndex)
                 });
             });

            //latests
            this.latests = new app.widgets.tilesWidget({
                tileWidth: 150,
                tileHeight: 150,
                rows: 3,
                cols: 4
            });

            this.latests.getTileOnIndex = function(index){

                var item = _this.diafilmCollection.at(index);

                var imgSrc = item.get('img');
                var parts = imgSrc.match(/^http:\/\/diafilmy.su\/uploads\/(.*)\.(.*?)$/);

                var thumbType = 'samsung-tv';

                var imgUrl = "http://diafilmy.su/thumbs/" + parts[1] + '-thumb-' + thumbType + '.' + parts[2];
                //app.log(imgSrc);

                var html = $(
                    '<div>'+
                        '<div class="opacity"></div>'+
                        '<img width="150" src="'+imgUrl+'"/>'+
                        '<div class="title">'+item.get('title')+'</div>'+
                        '</div>'
                );

                /*var img = document.createElement("img");
                 img.src = imgSrc;
                 //img.width = 160;

                 var html = img;*/
                return html;
            };

            this.addWidget(this.latests);

            this.latests.on("key_enter", function(){
                app.showScene("diafilmScene", {
                    diafilm: _this.diafilmCollection.at(_this.latests.getActiveIndex())
                });
            });


            this.diafilmCollection.on('reset', function(){
                app.log('COUNT', _this.diafilmCollection.length, _this.categoryCollection.length)

                _this.categories.count = _this.categoryCollection.length;
                //this.latests.count =

                _this.render();
            });

            this.focusWidget(this.categories);
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
            $('#categoriesWidget').append(this.categories.render().el);
            $('#latestWidget').append(this.latests.render().el);
            return this;
        }
    });
})();
