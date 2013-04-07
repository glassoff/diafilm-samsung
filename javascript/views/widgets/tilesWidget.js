
(function(){
    app.widgets.tilesWidget = app.Widget.extend({
        getTileOnIndex: function(index){
            return 'Tile ' + index;
        },
        initialize: function(){

            this.cache = [];

            this.tileWidth = this.options.tileWidth || this.tileWidth;
            this.tileHeight = this.options.tileHeight || this.tileHeight;
            this.rows = this.options.rows || this.rows;
            this.cols = this.options.cols || this.cols;

            this.activeTileIndex = 0;

            if(!this.cols){
                this.calculateCount();
            }
            this.count = this.cols * this.rows;
            app.log('COUNT:', this.count)

            this.prepareTiles();

            this.on("key_right", this.right, this);
            this.on("key_left", this.left, this);
            this.on("key_up", this.up, this);
            this.on("key_down", this.down, this);
        },
        //options
        count: 0,
        tileWidth: 206,
        tileHeight: 192,
        tileMargin: 5,
        rows: 3,
        containerWidth: 1280,
        firstMargin: 0,

        shift: 0,

        cols: 0,

        outRightTileIndex: 0,
        outRightVal: 0,

        plusOne: 0,

        right: function(){
            app.log('slides right')

            if(this.activeTileIndex == this.outRightTileIndex - 1){

                var viewedWidth = this.tileWidth / 2;
                var margin = 0;

                var margin = - ((this.outRightVal - this.tileWidth) + viewedWidth);
                app.log('MARGIN: ', margin)
                this.wrapper.css('margin-left', margin+'px');

                this.activateTileOnIndex(this.activeTileIndex + 1);
            }
            else{
                this.activateTileOnIndex(this.activeTileIndex + 1);
            }


        },
        left: function(){
            app.log('slides left')

            if(this.activeTileIndex == this.cols - this.outRightTileIndex){
                this.shift--;
                this.renderTiles();
            }
            else{
                this.activateTileOnIndex(this.activeTileIndex - 1);
            }


        },
        up: function(){
            app.log('slides up')
            this.activateTileOnIndex(this.activeTileIndex - this.cols);
        },
        down: function(){
            app.log('slides down')
            this.activateTileOnIndex(this.activeTileIndex + this.cols);
        },

        focus: function(){
            app.log('tiles focus')

            this.activateTileOnIndex(this.activeTileIndex);
        },
        blur: function(){
            app.log('tiles blur')
        },

        activateTileOnIndex: function(index){
            if(!this.tiles[index]){
                return;
            }
            this.deactivateTileOnIndex(this.activeTileIndex);
            this.activateTile(this.tiles[index]);
            this.activeTileIndex = index;
        },
        deactivateTileOnIndex: function(index){
            this.deactivateTile(this.tiles[index]);
        },
        activateTile: function(tile){
            var el = tile.el;

            el.addClass('pseudo-hover');
        },
        deactivateTile: function(tile){
            var el = tile.el;

            el.removeClass('pseudo-hover');
        },

        getActiveIndex: function(){
            return this.tiles[this.activeTileIndex].index + this.shift * this.rows;
        },

        calculateCount: function(){
            var w = 0;
            for(var i = 0; true; i++){
                w += this.tileWidth + this.tileMargin * 2;
                if(w > this.containerWidth){
                    this.outRightTileIndex = i;
                    this.outRightVal = w - this.containerWidth;

                    this.cols = i + 1;
                    if(w - this.containerWidth < this.tileWidth/2){
                        this.cols++;
                        this.plusOne = 1;
                        this.outRightVal += this.tileWidth;
                    }

                    app.log('COLS:', this.cols)
                    app.log('Outed:', this.outRightTileIndex, 'OutedVal:', this.outRightVal)
                    break;
                }
            }
        },
        prepareTiles: function(){
            this.tiles = [];//{el: ..., widget: ...}

            this.tpl = $(
                '<div class="tiles__wrapper">'+
                '</div>'
            );

            this.wrapper = this.tpl;

            var wrapperHeight = (this.tileHeight + this.tileMargin*2) * this.rows;

            app.log('wrapper height', wrapperHeight)

            this.wrapper.css('height', wrapperHeight + 'px');

            var w = 0;
            var outedRight = false;
            for(var i = 0; i < this.count; i++){
                var tileEl = $('<div class="tile">');

                tileEl.css({
                    width: this.tileWidth,
                    height: this.tileHeight
                });

                tileEl.text(i);
                this.wrapper.append(tileEl);

                var row = Math.floor(i / this.cols);
                var col = i % this.cols;

                var index = col * this.rows + row;

                var tile = {
                    el: tileEl,
                    i: i,
                    index: index
                };

                this.tiles.push(tile);

            }

            var wrapperWidth = (this.tileWidth + this.tileMargin*2) * this.cols;
            app.log('wrapper width', wrapperWidth)
            this.wrapper.css('width', wrapperWidth + 'px');

            this.wrapper.css('margin-left', this.firstMargin + 'px');

        },
        renderTiles: function(){
            var _this = this;
            _.each(this.tiles, function(tile, i){
                var tileEl = tile.el;
                var index = tile.index + _this.shift * _this.rows;

                if(!_this.cache[index]){
                    _this.cache[index] = _this.getTileOnIndex(index);
                }

                var html = _this.cache[index];

                if(app.config.debug){
                    var debug = $('<div class="tile-debug">').text(index).appendTo(html);
                }

                tileEl.html(html);
                /*var el = tileEl.get(0);
                if(el.firstChild){
                    var a = el.removeChild(el.firstChild);
                }

                el.appendChild(html)*/
            });
        },
        tagName: 'div',
        className: 'tiles',
        render: function(){
            this.$el.html(this.tpl);

            this.renderTiles();

            return this;
        }
    });
})();