
(function(){
    app.widgets.slidesWidget = app.Widget.extend({
        initialize: function(){
            this.parent = this;

            this.images = [];
            this.currentIndex = 0;

            this.height = 720;

            //images
            this.previousSlide = this.currentSlide = this.nextSlide = null;

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

            var _this = this;

            this.previousSlide.animate({
                'margin-top': '+=' + this.height + 'px'
            },{
                duration: 1000,
                complete: function(){

                    _this.nextSlide.remove();
                    _this.nextSlide = _this.currentSlide;

                    _this.currentSlide = _this.previousSlide;

                    _this.currentIndex--;

                    _this.previousSlide = _this.slideContent(_this.currentIndex - 1);
                    _this.previousSlide.css('margin-top', -_this.height + 'px');

                    _this.$el.prepend(_this.previousSlide);
                }
            });
        },
        next: function(){
            alert('next')

            var _this = this;

            this.currentSlide.animate({
                'margin-top': '-=' + this.height + 'px'
            },{
                duration: 1000,
                complete: function(){
                    if(_this.previousSlide){
                        _this.previousSlide.remove();
                    }

                    _this.previousSlide = _this.currentSlide;

                    _this.currentSlide = _this.nextSlide;
                    _this.currentIndex++;

                    _this.nextSlide = _this.slideContent(_this.currentIndex + 1);

                    _this.$el.append(_this.nextSlide);
                }
            });


        },
        tagName: 'div',
        className: 'slide',
        slideContent: function(index){
            return $('<div>').append($('<img>').attr('src', this.images[index]).css('height', this.height + 'px'));
        },
        render: function(){
            var _this = this;

            this.$el.css({
                height: this.height + 'px',
                overflow: 'hidden'
            });

            app.log('SLIDES', this.images)


            this.currentSlide = this.slideContent(0);
            this.nextSlide = this.slideContent(1);

            this.$el.append(this.currentSlide).append(this.nextSlide);

            return this;
        }
    });
})();