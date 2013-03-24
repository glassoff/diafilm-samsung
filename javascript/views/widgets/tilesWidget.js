
(function(){
    app.widgets.tilesWidget = app.Widget.extend({
        //source delegate
        sourceDelegate: null,
        getItemOnIndex: function(index){
            return 'Item ' + index;
        },
        //
        initialize: function(){
            this.activeIndex = 0;
            this.sourceDelegate = this;

            this.parent = this;

            this.itemWidth = this.options.itemWidth || 200;
            this.itemHeight = this.options.itemHeight || 250;
            this.marginRight = this.options.marginRight || 20;

            var _this = this;

            this.prepareItems();

            this.on("key_right", function(){
                _this.right();
            });
            this.on("key_left", function(){
                _this.left();
            });
            this.on("key_up", function(){
                _this.parent.trigger('prev_widget');
            });
            this.on("key_down", function(){
                _this.parent.trigger('next_widget');
            });

            app.log('COUNT', this.count, 'VIEWED', this.viewCount);
        },
        focus: function(){

        },
        blur: function(){

        },
        tagName: 'div',
        className: 'hList',
        viewCount: 0, //calculated
        count: 6,
        shift: 0,
        outItem: 0,
        outVal: 0,

        containerWidth: 1280,
        itemWidth: 0,
        itemHeight: 0,
        marginRight: 0,
        firstMargin: 40,

        margin: 0,

        prepareItems: function(){
            this.items = [];

            this.tpl = $([
                '<div class="container">',
                '<ul>',
                '</ul>',
                '</div>'
            ].join(''));

            var w = 0;
            var enough = false;
            for(var i = 0; true; i++){
                var itemEl = $('<li>');
                itemEl.css({
                    'width': this.itemWidth + 'px',
                    'height': this.itemHeight + 'px',
                    'margin-right': this.marginRight + 'px'
                });

                this.items.push(itemEl);

                $('ul', this.tpl).append(itemEl);
                if(i == this.activeIndex){
                    this.activateItem(itemEl);
                }

                if(enough){
                    this.viewCount = i + 1;
                    break;
                }

                w = w + this.itemWidth + this.marginRight;
                if(w > this.containerWidth && !this.outItem){
                    alert('NOT ' + i)
                    this.outItem = i;
                    this.outVal = this.containerWidth - w;

                    enough = true;
                }
            }

        },
        activateItemAtIndex: function(index){
            if(this.activateItem(this.items[index])){
                this.deactivateItemAtIndex(this.activeIndex);
                this.activeIndex = index;
                return true;
            }
            return false;
        },
        deactivateItemAtIndex: function(index){
            this.deactivateItem(this.items[index]);
        },
        activateItem: function(el){
            if(el.css('visibility') == 'hidden'){
                return false;
            }
            el.addClass('active');
            return true;
        },
        deactivateItem: function(el){
            el.removeClass('active');
        },
        left: function(){
            if(this.activeIndex == 1 && this.shift > 0){  alert('--shift')
                this.shift--;
                this.renderItems();
            }
            else if(this.activeIndex > 0){ alert('--active next')
                this.activateItemAtIndex(this.activeIndex - 1);
            }
            else{
                this.parent.trigger('prev_widget');
            }

            if(this.activeIndex == this.viewCount - this.outItem - 1){
                var margin = 0;
                if(this.shift > 0){
                    margin = - this.itemWidth/2 - this.firstMargin;
                }
                $('ul', this.tpl).css('margin-left', margin + 'px');
            }
        },
        right: function(){
            if(this.activeIndex < this.viewCount - 2){ alert('++active next')
                if(!this.activateItemAtIndex(this.activeIndex + 1)){
                    this.parent.trigger('next_widget');
                }
            }
            else if(this.activeIndex == this.viewCount - 2 && this.activeIndex + this.shift < this.count - 1){ alert('++shift')
                this.shift++;
                this.renderItems();
            }
            else{
                this.parent.trigger('next_widget');
            }

            if(this.activeIndex == this.outItem){
                //нужно продвинуть текущий последний и показать следующий наполовину
                this.margin = this.outVal - this.firstMargin - this.itemWidth/2;

                app.log('MARGIN', this.margin)
                $('ul', this.tpl).css('margin-left', this.margin + 'px');
            }

        },
        renderItems: function(){
            alert('render items')
            var _this = this;
            var getter = _.bind(this.sourceDelegate.getItemOnIndex, this.sourceDelegate);
            _.each(this.items, function(el, i){
                el.css('visibility', 'visible');
                var index = i + _this.shift;
                var html = '';
                if(index < _this.count){
                    html = getter(index);
                }
                if(!html){
                    el.css('visibility', 'hidden');
                }
                html = html + ' ' + index +'<div class="item-debug">'+i+'</div>';
                el.html(html);
            });
        },
        render: function(){
            var _this = this;

            this.$el.append(this.tpl);
            this.renderItems();

            return this;
        }
    });
})();