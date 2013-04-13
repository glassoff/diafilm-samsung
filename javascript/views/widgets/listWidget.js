
(function(){
    app.widgets.listWidget = app.Widget.extend({
        focused: false,
        initialize: function(){
            this.collection = this.options.collection;
            this.activeIndex = 0;

            this.parent = this;

            var _this = this;

            this.on("key_down", function(){
                if(_this.activeIndex <= _this.count - 2){
                    _this.activeIndex++;
                    _this.render();
                    return;
                }
                _this.parent.trigger('next_widget');
            });
            this.on("key_up", function(){
                if(_this.activeIndex > 0){
                    _this.activeIndex--;
                    _this.render();
                    return;
                }
                _this.parent.trigger('prev_widget');
            });

            this.on("key_left", function(){
                _this.parent.trigger('prev_widget');
            });
            this.on("key_right", function(){
                _this.parent.trigger('next_widget');
            });
        },
        count: 0,
        focus: function(){
            this.$el.find('[rel='+this.activeIndex+']').addClass('active');
            this.focused = true;
        },
        blur: function(){
            this.$el.find('[rel='+this.activeIndex+']').removeClass('active');
            this.focused = false;
        },
        tagName: 'ul',
        className: 'vList unstyled',
        render: function(){
            var _this = this;

            this.$el.empty();
            this.collection.each(function(item, i){
                var itemEl = $('<li>').text(item.get('title'));
                itemEl.attr('rel', i);
                if(_this.focused && i == _this.activeIndex){
                    itemEl.addClass('active');
                }
                $(_this.el).append(itemEl);
            });
            return this;
        }
    });
})();