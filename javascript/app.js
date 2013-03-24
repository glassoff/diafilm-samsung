
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
        this.history.push(this.scene);
    }

    var view = this._showScene.apply(this, arguments);
}

//show scene without history
app._showScene = function(){
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
    }
    this.scene = view; //set active
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
    initWidgets: function(){
        this.widgets = [];
        this.activeWidget = new app.Widget();
        this.parent = new app.Widget();

        if(this.options.name){
            this.name = this.options.name;
        }

        _.bindAll(this, 'prevWidget', 'nextWidget');

        this.on("prev_widget", this.prevWidget);
        this.on("next_widget", this.nextWidget);

        return this;
    },
    addWidget: function(view){
        view.parent = this;
        var length = this.widgets.push(view);
        view.index = length - 1;
    },
    prevWidget: function(){
        this.log('previous widget')
        var view = this.widgets[this.activeWidget.index - 1];
        if(view){
            this.focusWidget(view);
        }
        else{
            this.log('to parent ' + this.parent.name)
            this.parent.trigger("prev_widget");
        }
    },
    nextWidget: function(){
        this.log('next widget')
        var view = this.widgets[this.activeWidget.index + 1];
        if(view){
            this.focusWidget(view);
        }
        else{
            this.log('to parent ' + this.parent.name)
            this.parent.trigger("next_widget");
        }
    },
    focusWidget: function(view){
        if(!view){
            return;
        }
        this.activeWidget.blur();
        view.focus();
        this.activeWidget = view;
    },
    index: 0,//index in the parent
    focus: function(){},
    blur: function(){},
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
app.widgetScene = app.Widget;

/* storage */
app.storage = {
    initialize: function(){

    }
};
