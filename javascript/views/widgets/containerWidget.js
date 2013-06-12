
(function(){
    app.widgets.containerWidget = app.Widget.extend({
        initialize: function(){
            this.initWidgets();

            var _this = this;

            _.each(this.options, function(v, k){
                _this[k] = v;
            });

            this.from = "";

            this.on("key_down", this.down, this);
            this.on("key_up", this.up, this);
            this.on("key_right", this.right, this);
            this.on("key_left", this.left, this);

            this.on("key_enter", this.enter, this);

            this.off("prev_widget", this.prevWidget);
            this.off("next_widget", this.nextWidget);
            this.on("next_widget", this.next, this);
            this.on("prev_widget", this.prev, this);
        },
        next: function(){

        },
        prev: function(){

        },

        up: function(){
            this.prevWidget();
        },
        right: function(){
            this.nextWidget();
        },
        down: function(){
            this.nextWidget();
        },
        left: function(){
            this.prevWidget();
        },
        enter: function(){
            this.activeWidget.trigger("key_enter");
        },
        tagName: 'div',
        className: 'container',
        render: function(){
            var _this = this;

            this.$el.empty();
            _.each(this.widgets, function(widget){
                _this.$el.append(widget.render().el);
            });
            return this;
        }
    });
})();