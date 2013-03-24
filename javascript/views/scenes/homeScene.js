(function(){
    app.scenes.homeScene = app.widgetScene.extend({
        initialize: function(){
            this.initWidgets();

            var _this = this;

            this.initModels();

            this.categories = new app.widgets.listWidget({
                collection: this.categoryCollection
            });
            this.addWidget(this.categories);
            this.diafilmCollection.fetch();

            this.diafilmCollection.on('reset', function(){
                app.log('COUNT', _this.diafilmCollection.length, _this.categoryCollection.length)
                _this.render();
            });

            this.categories.on("key_enter", function(){
                 app.showScene("diafilmListScene", {
                     diafilmCollection: _this.diafilmCollection.where({cat: _this.categoryCollection.at(_this.categories.activeIndex).get('title')})
                 });
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
            return this;
        }
    });
})();
