(function(){
    app.scenes.splashScene = app.widgetScene.extend({
        histored: false,
        init: function(){

            var _this = this;

            this.render();

            this.initModels();

            this.diafilmCollection.fetch();

            this.diafilmCollection.on('reset', function(){
                app.log('COUNT', _this.diafilmCollection.length, _this.categoryCollection.length)

                setTimeout(function(){
                    app.showScene("homeScene", {
                        diafilmCollection: _this.diafilmCollection
                    });
                }, 1000);

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
