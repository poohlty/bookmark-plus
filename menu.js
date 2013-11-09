
function genericOnClick(info, tab) {


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
    var hash = CryptoJS.SHA1(dataEntry.content+dataEntry.link).toString();
    newObj[hash] = dataEntry;
    chrome.storage.sync.set(newObj, function() {
    // Notify that we saved.
    displayNotification(options);
    console.log('Settings saved');
  })};


  console.log("This is clicked!");
  console.log("info: " + JSON.stringify(info));
  var link = info.pageUrl;
  var date = Date();
  var youtube = (link.indexOf("http://www.youtube.com/watch?") == 0);
  console.log("youtube?: " + youtube);
  var content, type;


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

  var iconUrl = "img/ext-icon-16.png";
  var options = {
    "type": "basic",
    "title": "Bookmark Created!",
    "message": type+" bookmarked!",
    "iconUrl": iconUrl
  };
  var options2 = {
    "type": "basic",
    "title": "Bookmark is already there!",
    "message": "You have already bookmarked this "+type+"!",
    "iconUrl": iconUrl
  };

  var hash = CryptoJS.SHA1(content + link).toString();
  var dataEntry = {
    "type": type,
    "content": content,
    "link": link,
    "date": date
  };

  console.log("hash = " + hash);
  chrome.storage.sync.get(null, function(items){
    var item = items[hash];
    console.log('Item = '+ JSON.stringify(item));
    if (item != null) {
      displayNotification(options2);
    } else {
      saveData(dataEntry);
    };
    console.log("All bookmarks = " + JSON.stringify(items));
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
