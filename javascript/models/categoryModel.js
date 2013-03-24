
(function(){
    app.models.categoryModel = Backbone.Model.extend({
        idAttribute: 'title'
    });

    app.models.categoryCollection = Backbone.Collection.extend({
        model: app.models.categoryModel
    });
})();


