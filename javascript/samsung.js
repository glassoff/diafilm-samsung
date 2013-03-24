
var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();

/* extend app */
app.onLoad = function()
{
    this.on('app.blockexit', function(){
        //widgetAPI.blockNavigation(event);
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
