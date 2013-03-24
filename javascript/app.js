
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
    scene: null //active scene
}

_.extend(app, Backbone.Events);

app.initialize = function(){
    var _this = this;
    this.on('key_return', function(){
        alert('app return');
        if (app.history.back()){
            _this.trigger('app.blockexit');
        }
        else{
            _this.trigger('app.exit');
        }
    });
}

app.start = function()
{
	alert('=========================')
    alert('start app...');

    app.showScene("homeScene");
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
    var view;
    if(typeof arguments[0] == 'object'){
        view = arguments[0];
        view.render();
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

}

app.log = function() {

}

app.history = {
    items: [],
    push: function(scene){
        this.items.push(scene);
    },
    back: function(){
        var scene = this.items.pop();
        if(scene){
            app._showScene(scene);
            return true;
        }
        return false;
    }
};

/* view with widgets */
app.widgetView = Backbone.View.extend({
    initWidgets: function(){
        this.widgets = [];
        this.activeWidget = this;

        this.on("prev_widget", function(){
            alert('previous widget')
            var view = this.widgets[this.activeWidget.index - 1];
            this.focusWidget(view);
        });
        this.on("next_widget", function(){
            alert('next widget')
            var view = this.widgets[this.activeWidget.index + 1];
            this.focusWidget(view);
        });
    },
    addWidget: function(view){
        view.parent = this;
        var length = this.widgets.push(view);
        view.index = length - 1;
    },
    focusWidget: function(view){
        if(!view){
            return;
        }
        this.activeWidget.blur();
        view.focus();
        this.activeWidget = view;
    }
});

/* widget */
app.Widget = app.widgetView.extend({
    index: 0,//index in the parent
    focus: function(){},
    blur: function(){}
});

/* scene with widgets */
app.widgetScene = app.Widget;
