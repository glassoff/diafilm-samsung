
(function(){
    app.models.diafilmModel = Backbone.Model.extend({
        url: function(){app.log('http://diafilmy.su/dia.php?id=' + this.get('id'))
            return 'http://diafilmy.su/dia.php?id=' + this.get('id');
        },
        parse: function(res){
            if(res.col){
                //from collection fetch
                return res;
            }
            alert('PARSE MODEL')
            var item = {};
            $(res).find('data').children().each(function(){
                var name = $(this).prop('tagName');
                var value = $(this).text();
                if($(this).children().length > 0){
                    value = [];
                    $(this).children().each(function(){
                        value.push($(this).text());
                    });
                }

                item[name] = value;
            });
            app.log(item)
            return item;
        },
        fetch: function (options) {alert('DIAFILM FETCH')
            options = options || {};
            options.dataType = "xml";
            Backbone.Model.prototype.fetch.call(this, options);
        }
    });

    app.models.diafilmCollection = Backbone.Collection.extend({
        url: function(){
            if(!/WebKit/i.test(navigator.userAgent)){
                app.log('NOT SUPPORT GZIP');
                return 'http://diafilmy.su/dia-listf.php';
            }
            return 'http://diafilmy.su/dia-listfgz.php';
        },
        model: app.models.diafilmModel,
        parse: function(res){
            app.log('PARSE')
            var _this = this;
            var diafilms = [];
            $(res).find('post').each(function(i){
                var item;
                item = {};
                $(this).children().each(function(){
                    var name, value;
                    name = this.tagName;
                    value = this.textContent;
                    item[name] = value;//TODO cat array
                    if(name == 'cat'){
                        _this.categoryCollection.add({'title': value});
                    }

                });
                item['col'] = true;
                diafilms.push(item);
            });
            return diafilms;
        },
        fetch: function (options) {
            options = options || {};
            options.dataType = "xml";
            Backbone.Collection.prototype.fetch.call(this, options);
        }
    });
})();


