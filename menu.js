
// Global opetions for different Notifications
var iconUrl = "img/ext-icon-16.png";
var newEntryNotifyOptions = {
  "type": "basic",
  "title": "Bookmark Created",
  "message": "Bookmarked!",
  "iconUrl": iconUrl
};
var dupEntryNotifyOptions = {
  "type": "basic",
  "title": "Bookmark already there!",
  "message": "You have already bookmarked this.",
  "iconUrl": iconUrl
};

function displayNotification(options) {
    chrome.notifications.create("", options, function(notificationId){
    console.log('Notification created');
    window.setTimeout(function(){
      chrome.notifications.clear(notificationId, function(wasCleared){
        if (wasCleared) {console.log('Notification cleared');}
      });
    }, 2500);
  });
}

function saveData (dataEntry) {
  // Save it using the Chrome extension storage API.
  var newObj = {};
  var hash = CryptoJS.SHA1(dataEntry.content + dataEntry.link).toString();
  newObj[hash] = dataEntry;
  chrome.storage.sync.set(newObj, function() {
    // Notify that we saved.
    displayNotification(newEntryNotifyOptions);
    console.log('Settings saved');
  });
}

function genericOnClick(info, tab) {
  console.log("This is clicked!");
  console.log("info: " + JSON.stringify(info));
  var link = info.pageUrl;
  var date = Date();
  var hash = CryptoJS.SHA1(content + link).toString();
  var content, type;

  var youtube = (link.indexOf("http://www.youtube.com/watch?") == 0);
  console.log("youtube?: " + youtube);

  if (info.selectionText) {
    content = info.selectionText;
    type = "quote";
  } else if (info.mediaType) {
    switch (info.mediaType) {
      case "image":
        content = info.srcUrl;
        type = "image";
        break;
    }
  } else if (youtube) {
    type = "youtube";
    content = link.substring(link.indexOf("?") + 3);
  } else {
    content = link;
    type = "page";
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {});
    var dataEntry = {
      "type": type,
      "content": content,
      "link": link,
      "date": date,
      "title": tabs[0].title
    };

    console.log("hash = " + hash);
    chrome.storage.sync.get(null, function(items){
      var item = items[hash];
      console.log('Item = '+ JSON.stringify(item));
      if (item != null) {
        displayNotification(dupEntryNotifyOptions);
      } else {
        saveData(dataEntry);
      }
      console.log("All bookmarks = " + JSON.stringify(items));
    });
  });
}

// parent saves the id of the context menu
var parent = chrome.contextMenus.create({
  "title": "Bookmark+",
  "contexts": ["all"],
  "onclick": genericOnClick
});

chrome.browserAction.onClicked.addListener(function(activeTab){
    var newURL = chrome.extension.getURL('bookmark.html');
    chrome.tabs.create({ url: newURL });
});
