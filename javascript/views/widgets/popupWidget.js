
(function(){
    app.widgets.popupWidget = app.Widget.extend({
        disabled: true,
        modal: true,
        buttons: [
            {
                title: 'OK',
                el: null,
                action: function(popup){
//                    popup.hide();
                    app.exit(true);
                }
            },
//            {
//                title: 'Выйти',
//                el: null,
//                action: function(){
//
//                }
//            }
        ],
        activeButtonIndex: 0,
        initialize: function(){

            var _this = this;

            this.initWidgets();

            this.html = this.options.html;

            this.tpl = $(
                '<div id="myModal" class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                    '<div class="modal-header">'+
                    '</div>'+
                    '<div class="modal-body">'+
                    '</div>'+
                    '<div class="modal-footer">'+
                    '</div>'+
                '</div>'
            );
            this.tpl.hide();

            this.header = $('.modal-header', this.tpl);
            this.content = $('.modal-body', this.tpl);
            this.footer = $('.modal-footer', this.tpl);

            this.header.text(this.options.titleText);

            _.each(this.buttons, function(btn, i){
                var btnEl = $('<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>');
                btnEl.text(btn.title);

                if(i == _this.activeButtonIndex){
                    btnEl.addClass("btn-primary");
                }

                _this.buttons[i].el = btnEl;

                _this.footer.append(btnEl);
            });

            this.on("key_right", function(){
                _this.nextButton();
            });
            this.on("key_left", function(){
                _this.prevButton();
            });
            this.on("key_up", function(){
                _this.prevButton();
            });
            this.on("key_down", function(){
                _this.nextButton();
            });
            this.on("key_enter", function(){
                _this.buttons[_this.activeButtonIndex].action(_this);
            });
        },
        activateButton: function(index){
            this.buttons[this.activeButtonIndex].el.removeClass("btn-primary");
            this.activeButtonIndex = index;
            this.buttons[this.activeButtonIndex].el.addClass("btn-primary");
        },
        nextButton: function(){
            if(this.activeButtonIndex + 1 < this.buttons.length){
                this.activateButton(this.activeButtonIndex + 1);
            }
        },
        prevButton: function(){
            if(this.activeButtonIndex - 1 >= 0){
                this.activateButton(this.activeButtonIndex - 1);
            }
        },
        show: function(message){
            if(message){
                this.content.html(message);
            }
            if(!this.tpl.is(":visible")){
                this.parent.focusWidget(this);
            }
        },
        focus: function(message){app.log('popup focus')
            this.tpl.show();
            app.blockReturn = true;
        },
        hide: function(){app.log('popup hide')
            this.parent.toPrevActiveWidget();
        },
        blur: function(){
            this.tpl.hide();
            app.blockReturn = false;
        },
        render: function(){

            this.$el.html(this.tpl);

            return this;
        }
    });
})();