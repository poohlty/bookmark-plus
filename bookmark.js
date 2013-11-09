function retriveBookmarks() {
    chrome.storage.sync.get('test', function(items){
        console.log("Get here!" + JSON.stringify(items));
    });
}


