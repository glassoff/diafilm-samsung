(function(){
    app.scenes.diafilmListScene = app.widgetScene.extend({
        initialize: function(){
            this.initWidgets();

            var _this = this;

            this.collection = this.options.diafilmCollection;

            this.diafilms = new app.widgets.tilesWidget({
                tileWidth: 160,
                tileHeight: 160
            });
            this.diafilms.getTileOnIndex = function(index){
                var item = _this.collection[index];

                var imgSrc = _this.collection[index].get('img');
                var parts = imgSrc.match(/^http:\/\/diafilmy.su\/uploads\/(.*)\.(.*?)$/);

                var thumbType = 'samsung-tv';

                var imgUrl = "http://diafilmy.su/thumbs/" + parts[1] + '-thumb-' + thumbType + '.' + parts[2];
                app.log(imgSrc);

                var html = $(
                    '<div>'+
                        '<div class="opacity"></div>'+
                        '<img width="160" src="'+imgUrl+'"/>'+
                        '<div class="title">'+item.get('title')+'</div>'+
                    '</div>'
                );

                /*var img = document.createElement("img");
                img.src = imgSrc;
                //img.width = 160;

                var html = img;*/
                return html;
            };

            this.addWidget(this.diafilms);

            app.log('COUNT', _this.collection.length)
            _this.diafilms.count = _this.collection.length;
            _this.render();

            /*var loadedImg = 0;
            for(var i = 0; i < 100; i++){
                $('<img>').attr('src', this.collection[i].get('img')).load(function(){
                    app.log('loaded')
                    loadedImg++;
                    if(loadedImg >= 100){
                        app.log('LOADED!');
                        _this.render();
                    }
                });
            }*/

            this.diafilms.on("key_enter", function(){
                 app.showScene("diafilmScene", {
                    diafilm: _this.collection[_this.diafilms.activeIndex + _this.diafilms.shift]
                 });
             });

            this.focusWidget(this.diafilms);
        },
        render: function(){
            $(this.el).html(new EJS({url: 'javascript/templates/diafilmList.ejs'}).render({
                //categories: this.collection
            }));
            $('#diafilmsWidget').append(this.diafilms.render().el);
            return this;
        }
    });
})();
