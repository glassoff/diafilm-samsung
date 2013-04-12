
$.support.cors = true;

$.ajaxSetup({
    crossDomain: true
});

$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError){
    alert('[ERROR] ajax error!');
    app.log(thrownError);
});

/** app **/
var app = {
    models: {},
    scenes: {},
    widgets: {},
    scene: null, //active scene
    config: {}
}

_.extend(app, Backbone.Events);

app.initialize = function(){
    var _this = this;

    alert('app init...')
    this.on('key_return', function(){
        alert('app return');
        if (app.history.back()){
            _this.trigger('app.blockexit');
        }
        else{
            _this.trigger('app.exit');
        }
    });

    this.trigger("init");
}

app.start = function()
{
    alert('start app...');
}

//show scene with history push
app.showScene = function(){
    if(this.scene){
        //remember current
        if(this.scene.isHistored()){
            this.history.push(this.scene);
        }
    }

    var view = this._showScene.apply(this, arguments);
}

//show scene without history
app._showScene = function(){
    var _this = this;
    var view;         //TODO автоматически рендерить виджеты в сцене
    if(typeof arguments[0] == 'object'){
        view = arguments[0];
        view.render();//TODO зачем заново рендерить? если нет изменений и элемент уже отрендерен
    }
    else if(typeof arguments[0] == 'string'){
        var sceneName = arguments[0];
        alert('show ' + sceneName);
        var data = {el: $('#container')};
        if(arguments[1]){
            data = _.extend(data, arguments[1]);
        }

        view = new app.scenes[sceneName](data);

        view.on("rendered", function(){

            if(_this.scene){
                _this.scene.blur();
            }

            view.focus();

            _this.scene = view; //set active
        });

        view.init();
    }

    return view;
}

app.onLoad = function()
{
    this.start();
}

app.onUnload = function()
{

}

app.appKeyHandler = function()
{
    alert('key!')
}

app.log = function() {

}

app.history = {
    items: [],
    push: function(scene){
        this.items.push(scene);
    },
    back: function(){
        //TODO нужно корректно удалить скрываемую сцену
        var scene = this.items.pop();
        if(scene){
            app._showScene(scene);
            return true;
        }
        return false;
    }
};

/* view with widgets */
app.Widget = Backbone.View.extend({
    disabled: false,
    initialize: function(){
        this.initWidgets();
    },
    // constructor, remember to call
    initWidgets: function(){
        this.widgets = [];
        this.activeWidget = null;
        this.parent = null;

        if(this.options.name){
            this.name = this.options.name;
        }

        _.bindAll(this, 'prevWidget', 'nextWidget');

        this.on("prev_widget", this.prevWidget);
        this.on("next_widget", this.nextWidget);

        return this;
    },
    isDisabled: function(){
        return this.disabled;
    },
    bindWidget: function(view){
        var _this = this;
        _.each(this.widgets, function(widget, k){
            if(widget == view){
                view.parent = _this;
                view.index = k;
            }
        });

    },
    // adding children widgets
    addWidget: function(view){
        view.parent = this;
        var length = this.widgets.push(view);
        view.index = length - 1;

        if(!this.activeWidget){
            this.activeWidget = view;
        }
    },
    replaceWidget: function(view, newView){
        var _this = this;
        _.each(this.widgets, function(widget, k){
            if(widget == view){
                var active = false;
                if(_this.activeWidget == view){
                    active = true;
                }

                _this.widgets[k] = newView;
                newView.parent = _this;
                newView.index = k;

                if(active){
                    //newView.focus();
                    _this.activeWidget = newView;
                }
            }
        });
    },
    prevWidget: function(){
        this.log('previous widget')
        var view;

        if(this.widgets.length){
            view = this.widgets[this.activeWidget.index - 1];
        }

        if(view && view.isDisabled()){
            view.log('disabled!')
            if(this.widgets[this.activeWidget.index - 2]){
                this.setActiveWidget(view);
                return this.prevWidget();
            }
            else{
                if(this.parent){
                    this.log('to parent ' + this.parent.name)
                    this.parent.trigger("prev_widget");
                }
                return;
            }
        }

        if(view){
            this.focusWidget(view, 'prev');
        }
        else{
            if(this.parent){
                this.log('to parent ' + this.parent.name)
                this.parent.trigger("prev_widget");
            }
        }
    },
    nextWidget: function(){
        this.log('next widget')
        var view;

        if(this.widgets.length){
            view = this.widgets[this.activeWidget.index + 1];
        }

        if(view && view.isDisabled()){
            view.log('disabled!')
            if(this.widgets[this.activeWidget.index + 2]){
                this.setActiveWidget(view);
                return this.nextWidget();
            }
            else{
                if(this.parent){
                    this.log('to parent ' + this.parent.name)
                    this.parent.trigger("next_widget");
                }
                return;
            }
        }

        if(view){
            this.focusWidget(view, 'next');
        }
        else{
            if(this.parent){
                this.log('to parent ' + this.parent.name)
                this.parent.trigger("next_widget");
            }
        }
    },
    // set widget will be focused on view render
    setActiveWidget: function(view){
        this.activeWidget.blur();
        this.activeWidget = view;
    },
    focusWidget: function(view, direction){
        if(!view){
            return;
        }
        this.activeWidget.blur();
        view.focus(direction);
        this.activeWidget = view;
    },
    index: 0,//index in the parent
    focus: function(direction){
        if(this.activeWidget && this.activeWidget.isDisabled()){
            if(direction == 'next' || !direction){
                return this.nextWidget();
            }
            else if(direction == 'prev'){
                return this.prevWidget();
            }
        }
        else if(this.activeWidget){
            this.focusWidget(this.activeWidget, direction);
        }
    },
    blur: function(){
        if(this.activeWidget){
            this.activeWidget.blur();
        }
    },
    name: "NoName",
    log: function(){
        var _this = this;
        var args = [];
        _.each(arguments, function(arg, i){
            args[i] = '[' + _this.name + ']' + ': ' + arg;
        });
        app.log.apply(app, args);
    }
});

/* scene with widgets */
app.widgetScene = app.Widget.extend({
    histored: true,
    init: function(){
        //THIS IS CONSTRUCTOR!
    },
    isHistored: function(){
        return this.histored;
    }
});

/* storage */
app.storage = {
    initialize: function(){
        app.log('not storage!');
    }
};

/* device id */
app.getDeviceId = function(){
    return this.deviceId;
};
