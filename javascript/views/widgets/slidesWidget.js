
(function(){
    app.widgets.slidesWidget = app.Widget.extend({
        initialize: function(){
            this.parent = this;

            this.images = [];
            this.imagesLoader = null;
            this.currentIndex = 0;

            this.sliding = false;
            this.queue = [];

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

            if(this.sliding){
                //this.queue.push('prev');
                return false;
            }

            if(this.currentIndex <= 0){
                app.log('stop')
                return false;
            }

            this.sliding = true;
            this.previousSlide.animate({
                'margin-top': '+=' + this.height + 'px'
            },{
                duration: 1000,
                complete: function(){

                    _this.nextSlide.remove();
                    _this.nextSlide = _this.currentSlide;

                    _this.currentSlide = _this.previousSlide;

                    _this.currentIndex--;

                    if(_this.currentIndex > 0){
                        _this.previousSlide = _this.slideContent(_this.currentIndex - 1);
                        _this.previousSlide.css('margin-top', -_this.height + 'px');

                        _this.$el.prepend(_this.previousSlide);

                    }

                    _this.onSlide();
                }
            });
        },
        next: function(){
            alert('next')

            var _this = this;

            if(this.sliding){
                //this.queue.push('next');
                return false;
            }

            if(this.currentIndex >= this.images.length - 1){
                app.log('stop')
                return false;
            }

            this.sliding = true;
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

                    if(_this.currentIndex < _this.images.length - 1){
                        _this.nextSlide = _this.slideContent(_this.currentIndex + 1);

                        _this.$el.append(_this.nextSlide);

                    }

                    _this.onSlide();
                }
            });


        },
        onSlide: function(){
            this.sliding = false;

            /*var action = this.queue.shift();
            if(action){
                this[action]();
            }*/
        },
        tagName: 'div',
        className: 'slide',
        slideContent: function(index){
            for(var i = index; i < index + 3; i++){
                if(this.images[i]){
                    this.imagesLoader.add(this.images[i]);
                }
            }
            var img = this.imagesLoader.get(this.images[index]);
            return $('<div>').append($(img).css('height', this.height + 'px'));
        },
        render: function(){
            var _this = this;

            this.$el.css({
                height: this.height + 'px',
                overflow: 'hidden'
            });

            this.currentSlide = this.slideContent(0);
            this.nextSlide = this.slideContent(1);

            this.$el.append(this.currentSlide).append(this.nextSlide);

            return this;
        }
    });
})();