
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
            this.tilesCount = this.cols * this.rows;
            app.log('COUNT:', this.tilesCount)

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

        tilesCount: 0,

        outRightTileIndex: 0,
        outRightVal: 0,

        plusOne: 0,

        isTileVisible: function(tile){
            if(!tile){
                return false;
            }
            return tile.el.css('visibility') == 'visible';
        },
        isNextVisible: function(){
            return this.isTileVisible(this.tiles[this.activeTileIndex + 1]);
        },
        right: function(){
            app.log('slides right', this.activeTileIndex + 1)

            var activeTile = this.tiles[this.activeTileIndex];

            if(this.activeTileIndex == (this.outRightTileIndex + this.cols * activeTile.row) - 1 && this.isNextVisible()){

                this.shift++;
                this.renderTiles();

                var margin = - this.outRightVal / 2;

                this.wrapper.css('margin-left', margin+'px');

                /*var viewedWidth = this.tileWidth / 2;
                var margin = 0;

                var margin = - ((this.outRightVal - this.tileWidth) + viewedWidth);
                app.log('MARGIN: ', margin)

                this.activateTileOnIndex(this.activeTileIndex + 1);*/
            }
            else if(this.isNextVisible()){
                this.activateTileOnIndex(this.activeTileIndex + 1);
            }
            else{
                this.parent.trigger('next_widget');
            }


        },
        left: function(){
            app.log('slides left')

            var activeTile = this.tiles[this.activeTileIndex];

            if(this.activeTileIndex == 1 + this.cols * activeTile.row && this.shift > 0){
                this.shift--;
                this.renderTiles();
            }
            else if(this.activeTileIndex > 0 + this.cols * activeTile.row){
                this.activateTileOnIndex(this.activeTileIndex - 1);
            }
            else{
                this.parent.trigger('prev_widget');
            }

            if(this.activeTileIndex == 0 + this.cols * activeTile.row){
                this.wrapper.css('margin-left', 0);
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

            this.deactivateTileOnIndex(this.activeTileIndex);
        },

        activateTileOnIndex: function(index){
            if(!this.tiles[index] || !this.isTileVisible(this.tiles[index])){
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

        getTileIndex: function(tile){
            return tile.index + this.shift * this.rows;
        },
        getActiveIndex: function(){
            return this.getTileIndex(this.tiles[this.activeTileIndex]);
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
            for(var i = 0; i < this.tilesCount; i++){
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
                    index: index,
                    row: row,
                    col: col
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
                tileEl.css('visibility', 'visible');

                var index = _this.getTileIndex(tile);

                if(!_this.cache[index]){
                    _this.cache[index] = _this.getTileOnIndex(index);
                }

                var html = _this.cache[index];

                if(!html){
                    tileEl.css('visibility', 'hidden');
                }

                if(app.config.debug){
                    //var debug = $('<div class="tile-debug">').text('('+i+') ' + index).appendTo(html);
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