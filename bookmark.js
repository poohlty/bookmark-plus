var pageTemplateSource = $("#page-template").html();
var pageTemplate = Handlebars.compile(pageTemplateSource);

var imgTemplateSource = $("#img-template").html();
var imgTemplate = Handlebars.compile(imgTemplateSource);

var quoteTemplateSource = $("#quote-template").html();
var quoteTemplate = Handlebars.compile(quoteTemplateSource);

var youtubeTemplateSource = $("#youtube-template").html();
var youtubeTemplate = Handlebars.compile(youtubeTemplateSource);

var templateDic = {
    page: pageTemplate,
    image: imgTemplate,
    quote: quoteTemplate,
    youtube: youtubeTemplate
};

var Bookmark = Backbone.Model.extend({});
var BookmarkView = Backbone.View.extend({
    events: {
        "click .trash": "deleteEntry"
    },
    template: function(){
        var type = this.model.get("type");
        return templateDic[type];
    },
    render: function(){
        var attributes = this.model.toJSON();
        attributes["timeString"] = moment(this.model.get("date")).fromNow();
        var template = this.template();
        this.$el.html(template(attributes));
    },
    tagName: "div",
    className: "bookmark",
    deleteEntry: function(e){
        var content = this.model.get("content");
        var link = this.model.get("link");
        var hash1 = CryptoJS.SHA1(content + link);
        chrome.storage.sync.remove(hash1.toString(), function(){
            console.log("Entry deleted");
        });
        this.remove();
    }
});

var BookmarkList = Backbone.Collection.extend({
    model: Bookmark
});

var bookmarkList = new BookmarkList();

document.addEventListener('DOMContentLoaded', function () {
    console.log("Here!");

    chrome.storage.sync.get(null, function(items){
        console.log("Get here!" + JSON.stringify(items));

        var sortedItems = _.sortBy(items, function(item){
            var date = new Date(item.date);
            return -date.getTime();
        });

        var keys = Object.keys(sortedItems);
        var values = keys.map(function(v) { return sortedItems[v]; });
        bookmarkList.reset(values);
        bookmarkList.forEach(function(bookmark){
            var newView = new BookmarkView({
                model: bookmark
            });
            newView.render();
            $("#bookmarks").append(newView.el);
        });
    });
});
