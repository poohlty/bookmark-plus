var source = $("#bookmark-template").html();
var bookmarkTemplate = Handlebars.compile(source);

var Bookmark = Backbone.Model.extend({});
var BookmarkView = Backbone.View.extend({
    template: bookmarkTemplate,
    render: function(){
        var attributes = this.model.toJSON();
        this.$el.html(this.template(attributes));
    },
    tagName: "div",
    className: "bookmark"
});

var BookmarkList = Backbone.Collection.extend({
    model: Bookmark
});

var bookmarkList = new BookmarkList();


document.addEventListener('DOMContentLoaded', function () {
    console.log("Here!");

    chrome.storage.sync.get('test', function(items){
        console.log("Get here!" + JSON.stringify(items));
        bookmarkList.reset(items.test);
        bookmarkList.forEach(function(bookmark){
            var newView = new BookmarkView({
                model: bookmark
            });
            newView.render();
            $("#bookmarks").append(newView.el);
        });
    });
});
