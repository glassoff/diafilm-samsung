(function(){
    app.scenes.splashScene = app.widgetScene.extend({
        init: function(){

            var _this = this;

            this.initModels();

            this.diafilmCollection.fetch();

            this.diafilmCollection.on('reset', function(){
                app.log('COUNT', _this.diafilmCollection.length, _this.categoryCollection.length)

                app.showScene("homeScene", {
                    diafilmCollection: _this.diafilmCollection
                });

            });

            this.render();
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
