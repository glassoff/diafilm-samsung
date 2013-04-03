
(function(){
    app.widgets.tilesWidget = app.Widget.extend({
        initialize: function(){
            this.count = 50;

            this.tileWidth = this.options.tileWidth;
            this.tileHeight = this.options.tileHeight;

            this.prepareTiles();
        },
        //options
        count: 0,
        tileWidth: 206,
        tileHeight: 192,
        rows: 0,

        prepareTiles: function(){
            this.tiles = [];//{el: ..., widget: ...}

            this.tpl = $(
                '<div class="tiles__wrapper">'+
                '</div>'
            );

            this.wrapper = this.tpl;

            //this.wrapper.css();

            for(var i = 0; i < this.count; i++){
                var tileEl = $('<div class="tile">');

                tileEl.css({
                    width: this.tileWidth,
                    height: this.tileHeight
                });

                tileEl.text(i);
                this.wrapper.append(tileEl);
            }

        },
        tagName: 'div',
        className: 'tiles',
        render: function(){
            this.$el.html(this.tpl);

            return this;
        }
    });
})();