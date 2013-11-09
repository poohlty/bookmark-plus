
function genericOnClick(info, tab) {
  console.log("This is clicked!");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));

  var entry1 = {"type": 1, "content": 2, "link": 2};
  var entry2 = {"num": 3, "num2":5};
  var myList = [entry1, entry2];
  saveData(myList);

  chrome.storage.sync.get('test', function(items){
    console.log("Get here!" + JSON.stringify(items));
  });
}

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
