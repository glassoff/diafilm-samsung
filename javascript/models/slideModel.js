
(function(){
    app.models.slideModel = Backbone.Model.extend({

    });

    app.models.slideCollection = Backbone.Collection.extend({
        url: function(){//app.log('--ID', this.diafilmId)
            return 'http://diafilmy.su/dia.php?id=' + this.diafilmId;
        },
        model: app.models.slideModel,
        parse: function(res){
            alert('SLIDE PARSE')
        },
        fetch: function (options) {alert('FETCH SLIDE')
            options = options || {};
            options.dataType = "xml";
            Backbone.Collection.prototype.fetch.call(this, options);
        }
    });
})();


