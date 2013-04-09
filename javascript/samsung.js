
(function(){
    var widgetAPI = new Common.API.Widget();
    var tvKey = new Common.API.TVKeyValue();

    function MyStorage() {
        this._filename = window.curWidget.id + '/zoomStorage5.json';
        this._fs = new FileSystem();
        if (!this._fs.isValidCommonPath(curWidget.id)) {
            this._fs.createCommonDir(curWidget.id);
        }
        this._data = {};
        this.load();
    }

    MyStorage.prototype._fs = null;
    MyStorage.prototype._filename = null;
    MyStorage.prototype._fp = null;
    MyStorage.prototype._data = null;

    MyStorage.prototype.getData = function() {
        return this._data;
    };

    MyStorage.prototype.getFilePointer = function() {
        if (!this._fp) {
            this._fp = this._fs.openCommonFile(this._filename, 'r+');
            if (!this._fp) {
                this._fp = this._fs.openCommonFile(this._filename, 'w');
            }
        }
        return this._fp;
    };

    MyStorage.prototype.closeFile = function() {
        this._fs.closeCommonFile(this.getFilePointer());
        this._fp = null;
    };

    MyStorage.prototype.load = function() {
        var result = this.getFilePointer().readAll();

        result = result.replace(/__*/, '');//fix bug

        app.log('Storage raw: ', result)
        this.closeFile();
        this._data = {};
        if (result.length > 0) {
            this._data = JSON.parse(result);
        }
    };

    MyStorage.prototype.save = function() {
        this.getFilePointer().writeAll(JSON.stringify(this._data) + '__');
        this.closeFile();
    };
    MyStorage.prototype.reset = function() {
        return this.load();
    };

    /* extend app */
    app.onLoad = function()
    {
        this.on('app.blockexit', function(){
            widgetAPI.blockNavigation(event);
        });

        // To enable the key event processing
        document.getElementById("anchor").focus();

        // Set Default key handler function
        widgetAPI.sendReadyEvent();

        this.initialize();
        this.start();
    }

    app.onUnload = function()
    {

    }

    app.appKeyHandler = function()
    {
        var KeyCode = event.keyCode;

        switch(KeyCode)
        {
            case tvKey.KEY_LEFT :
                this.scene.activeWidget.trigger('key_left');
                break;
            case tvKey.KEY_RIGHT :
                this.scene.activeWidget.trigger('key_right');
                break;
            case tvKey.KEY_UP :
                this.scene.activeWidget.trigger('key_up');
                break;
            case tvKey.KEY_DOWN :
                this.scene.activeWidget.trigger('key_down');
                break;
            case tvKey.KEY_ENTER :
                this.scene.activeWidget.trigger('key_enter');
                break;
            case tvKey.KEY_RETURN :
                this.trigger('key_return');
                this.scene.activeWidget.trigger('key_return');
                break;
            default :
                break;
        }
    }

    app.log = function() {
        if(!app.config.debug){
            return false;
        }
        if (arguments.length === 2 && typeof arguments[1] === 'string' && typeof arguments[0] === 'object') {
            alert(arguments[1] + ': ' + JSON.stringify(arguments[0]));
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === 'object' && arguments[i] !== null) {
                    alert(JSON.stringify(arguments[i]));
                } else {
                    alert(arguments[i]);
                }
            }
        }
    }

    app.storage = {
        data: null,
        initialize: function(){
            this.storage = new MyStorage();
            this.data = this.storage._data;
            app.log('Storage data:', this.data)
        },
        save: function(){
            this.storage.save();
        }
    }

    if(app.config.debug){
        var nativeAlert = window.alert;
        window.alert = function(text){
            $('#debug').text(text);
            nativeAlert(text);
        };
    }
})();


