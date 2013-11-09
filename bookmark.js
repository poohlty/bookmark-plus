var pageTemplateSource = $("#page-template").html();
var pageTemplate = Handlebars.compile(pageTemplateSource);

var imgTemplateSource = $("#img-template").html();
var imgTemplate = Handlebars.compile(imgTemplateSource);

var quoteTemplateSource = $("#quote-template").html();
var quoteTemplate = Handlebars.compile(quoteTemplateSource);

var templateDic = {
    page: pageTemplate,
    image: imgTemplate,
    quote: quoteTemplate
};

var Bookmark = Backbone.Model.extend({});
var BookmarkView = Backbone.View.extend({
    template: function(){
        var type = this.model.get("type");
        return templateDic[type];
    },
    render: function(){
        var attributes = this.model.toJSON();
        var template = this.template();
        this.$el.html(template(attributes));
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
