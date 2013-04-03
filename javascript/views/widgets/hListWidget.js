/* Такой же список как и listWidget, только памяти меньше занимает и поддерживает элементы только фиксированной одинаковой ширины*/
(function(){
    app.widgets.hListWidget = app.Widget.extend({
        //source delegate
        sourceDelegate: null,
        getItemOnIndex: function(index){
            return 'Item ' + index;
        },
        //
        initialize: function(){
            var _this = this;

            this.initWidgets();
            this.activeIndex = 0;
            this.sourceDelegate = this;

            this.parent = this;

            _.each(this.options, function(v, k){
                _this[k] = v;
            });

            this.prepareItems();

            this.on("key_right", function(){
                _this.right();
            });
            this.on("key_left", function(){
                _this.left();
            });
            this.on("key_up", function(){
                var item = _this.getActiveItem();
                if(item.widget){
                    item.widget.trigger("key_up");
                }
                else{
                    _this.parent.trigger('prev_widget');
                }
            });
            this.on("key_down", function(){
                var item = _this.getActiveItem();
                if(item.widget){
                    item.widget.trigger("key_down");
                }
                else{
                    _this.parent.trigger('next_widget');
                }
            });
            this.on("key_enter", function(){
                var item = _this.getActiveItem();
                if(item.widget){
                    item.widget.trigger("key_enter");
                }
            });

            app.log('COUNT', this.count, 'VIEWED', this.viewCount);
        },
        focus: function(){
            var item = this.items[this.activeIndex];
            this.activateItem(item);
        },
        blur: function(){
            var item = this.items[this.activeIndex];
            this.deactivateItem(item);
        },
        tagName: 'div',
        className: 'hList',
        viewCount: 0, //calculated
        count: 6,
        shift: 0,
        outItem: 0,
        outVal: 0,

        wrapperClass: '',
        itemClass: '',
        hoverSelector: '',
        hoverClass: 'active',

        containerWidth: 1280,
        itemWidth: 200,
        itemHeight: 0,
        marginRight: 0,
        firstMargin: 40,

        margin: 0,

        prepareItems: function(){
            this.items = [];//{el: ..., widget: ...}

            this.tpl = $([
                '<div class="hList__container">',
                    '<div class="hList__wrapper">',
                    '</div>',
                '</div>'
            ].join(''));

            if(this.wrapperClass){
                $('.hList__wrapper', this.tpl).addClass(this.wrapperClass);
            }

            var w = 0;
            var enough = false;
            for(var i = 0; true; i++){
                var itemEl = $('<div class="hList__item">');
                if(this.itemClass){
                    itemEl.addClass(this.itemClass);
                }
                itemEl.css({
                    'width': this.itemWidth + 'px',
                    'margin-right': this.marginRight + 'px'
                });
                if(i == 0 && this.firstMargin){
                    itemEl.css({
                        'margin-left': this.firstMargin + 'px'
                    });
                }

                if(this.itemHeight){
                    itemEl.css({
                        'height': this.itemHeight + 'px'
                    });
                }

                var item = {el: itemEl, widget: null};
                this.items.push(item);

                $('.hList__wrapper', this.tpl).append(itemEl);
                if(i == this.activeIndex){
                    //this.activateItem(item);
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
        getCurrentIndex: function(){
            return this.activeIndex + this.shift;
        },
        getActiveItem: function(){
            return this.items[this.activeIndex];
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
        activateItem: function(item){
            var el = item.el;
            if(el.css('visibility') == 'hidden'){
                return false;
            }

            if(item.widget){
                item.widget.focus();
            }
            else{
                if(this.hoverSelector){
                    $(this.hoverSelector, el).addClass(this.hoverClass);
                }
                else{
                    el.addClass(this.hoverClass);
                }
            }
            return true;
        },
        deactivateItem: function(item){
            var el = item.el;

            if(item.widget){
                item.widget.blur();
            }
            else{
                if(this.hoverSelector){
                    $(this.hoverSelector, el).removeClass(this.hoverClass);
                }
                else{
                    el.removeClass(this.hoverClass);
                }
            }
        },
        left: function(){
            if(this.activeIndex == 1 && this.shift > 0){  alert('--shift')
                this.shift--;
                this.renderItems();
                this.activateItem(this.items[this.activeIndex]);
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
                $('.hList__wrapper', this.tpl).css('margin-left', margin + 'px');
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
                this.activateItem(this.items[this.activeIndex]);
            }
            else{
                this.parent.trigger('next_widget');
            }

            if(this.activeIndex == this.outItem){
                //нужно продвинуть текущий последний и показать следующий наполовину
                this.margin = this.outVal - this.firstMargin - this.itemWidth/2 - this.marginRight;

                app.log('MARGIN', this.margin)
                $('.hList__wrapper', this.tpl).css('margin-left', this.margin + 'px');
            }

        },
        renderItems: function(){
            alert('render items')
            var _this = this;
            var getter = _.bind(this.sourceDelegate.getItemOnIndex, this.sourceDelegate);
            _.each(this.items, function(item, i){
                var el = item.el;
                el.css('visibility', 'visible');
                var index = i + _this.shift;
                var html = '';
                var itemData;
                if(index < _this.count){
                    itemData = getter(index);
                }
                if(!itemData){
                    el.css('visibility', 'hidden');
                }

                if(itemData instanceof app.Widget){
                    item.widget = itemData;
                    item.widget.parent = _this;  alert(_this.name)
                    html = itemData.render().el;
                }
                else{
                    html = itemData;
                }
                //html = html + ' ' + index +'<div class="item-debug">'+i+'</div>';
                el.html(html);
            });
        },
        render: function(){
            var _this = this;
            this.$el.html(this.tpl);
            this.renderItems();

            return this;
        }
    });
})();