(function(){
    app.scenes.splashScene = app.widgetScene.extend({
        histored: false,
        init: function(){

            var _this = this;


            //error popup
            this.popup = new app.widgets.popupWidget({
                titleText: 'Ошибка',
                contentText: 'Сервер недоступен'
            });
            this.addWidget(this.popup);

            app.on("error_ajax", function(){
                _this.popup.focus();
            });

            this.on("rendered", function(){
                $('#popupWidget', _this.el).append(_this.popup.render().el);
            });
            //

            this.render();

            this.initModels();

            this.diafilmCollection.fetch();

            this.diafilmCollection.on('reset', function(){
                app.log('COUNT', _this.diafilmCollection.length, _this.categoryCollection.length)

                var images = new app.imgLoader();

                images.controlLoad = true;
                for(var i = 0; i < 12; i++){
                    if(_this.diafilmCollection.at(i)){
                        var imgUrl = _this.diafilmCollection.at(i).get('img');
                        images.add(app.getThumbUrl(imgUrl, "samsung-tv-small"));
                    }
                }

                images.onLoad = function(){
                    images.controlLoad = false;

                    //go
                    setTimeout(function(){
                        app.showScene("homeScene", {
                            diafilmCollection: _this.diafilmCollection
                        });
                    }, 1000);
                };


            });


        },
        initModels: function(){
            this.categoryCollection = new app.models.categoryCollection();
            this.diafilmCollection = new app.models.diafilmCollection();
            this.diafilmCollection.categoryCollection = this.categoryCollection;
        },
        render: function(){
            $(this.el).html(new EJS({url: 'javascript/templates/splash.ejs'}).render({

            }));

            this.trigger("rendered");

            return this;
        }
    });
})();
