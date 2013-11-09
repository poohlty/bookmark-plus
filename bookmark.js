function retriveBookmarks() {
    chrome.storage.sync.get('test', function(items){
        console.log("Get here!" + JSON.stringify(items));
    });
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("Here!");
  document.getElementById('bookmarks').innerHTML = "HAHAH";
});
