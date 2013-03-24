(function(){
    app.scenes.diafilmListScene = app.widgetScene.extend({
        initialize: function(){
            this.initWidgets();

            var _this = this;

            this.collection = this.options.diafilmCollection;

            this.diafilms = new app.widgets.hListWidget({
                itemWidth: 270,
                itemHeight: 130,
                marginRight: 10
            });
            this.diafilms.sourceDelegate = this;

            this.addWidget(this.diafilms);

            app.log('COUNT', _this.collection.length)
            _this.diafilms.count = _this.collection.length;
            _this.render();

            this.diafilms.on("key_enter", function(){
                 app.showScene("diafilmScene", {
                    diafilm: _this.collection[_this.diafilms.activeIndex]
                 });
             });

            this.focusWidget(this.diafilms);
        },
        getItemOnIndex: function(index){
            //var item = this.collection.at(index);
            var item = this.collection[index];
            return item.get('title');
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
