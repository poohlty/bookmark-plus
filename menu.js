
function genericOnClick(info, tab) {
  console.log("This is clicked!");
  console.log("info: " + JSON.stringify(info));
  var link = info.pageUrl;
  var date = Date();
  var youtube = (link.indexOf("http://www.youtube.com/watch?") === 0);
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
  var options = {"type": "basic", "title": "Bookmark Created!", "message": type+" bookmarked!", "iconUrl": iconUrl};
  var dataEntry = {"type": type, "content": content, "link": link, "date": date};

  chrome.storage.sync.get('test', function(items){
    var dataList = items.test;

    if (dataList) {
      dataList.push(dataEntry);
    } else {
      dataList = [dataEntry];
    }
    chrome.notifications.create("", options, function(notificationId){
      console.log('Notification created');
      window.setTimeout(function(){
        chrome.notifications.clear(notificationId, function(wasCleared){
          if (wasCleared) {console.log('Notification cleared');}
        });
      }, 2500);
    });
    saveData(dataList);
    console.log("items" + JSON.stringify(dataList));
  });
}

// parent saves the id of the context menu
var parent = chrome.contextMenus.create({
  "title": "Bookmark+",
  "contexts": ["all"],
  "onclick": genericOnClick
});

function saveData (value) {
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'test': value}, function() {
    // Notify that we saved.
    console.log('Settings saved');
  });
}

chrome.browserAction.onClicked.addListener(function(activeTab){
    var newURL = chrome.extension.getURL('bookmark.html');
    chrome.tabs.create({ url: newURL });
});
