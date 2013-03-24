
(function(){
    app.widgets.slidesWidget = app.Widget.extend({
        initialize: function(){
            this.parent = this;

            this.images = [];
            this.currentIndex = 0;

            _.bindAll(this, "next", "prev");
            this.on("key_down", this.next);
            this.on("key_up", this.prev);
            this.on("key_enter", this.next);
        },
        focus: function(){

        },
        blur: function(){

        },
        prev: function(){
            alert('prev')

            this.currentIndex--;
            this.img.attr('src', this.images[this.currentIndex]);
        },
        next: function(){
            alert('next')

            this.currentIndex++;
            this.img.attr('src', this.images[this.currentIndex]);
        },
        tagName: 'div',
        className: 'slide',
        render: function(){
            var _this = this;

            app.log('SLIDES', this.images)

            this.img = $('<img>').attr('src', this.images[0]).css({
                //width: '1280px',
                height: '720px'
            });

            this.$el.html(this.img);

            return this;
        }
    });
})();