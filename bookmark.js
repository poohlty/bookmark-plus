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

var bookmarkItem = new Bookmark({
    type: "type",
    content: "content",
    link: "link",
    date: "date",
});

var newView = new BookmarkView({
    model: bookmarkItem
});


document.addEventListener('DOMContentLoaded', function () {

    console.log("Here!");

    chrome.storage.sync.get('test', function(items){
        console.log("Get here!" + JSON.stringify(items));
        document.getElementById('bookmarks').innerHTML = JSON.stringify(items);
    });
});
