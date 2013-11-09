document.addEventListener('DOMContentLoaded', function () {

    console.log("Here!");

    chrome.storage.sync.get('test', function(items){
        console.log("Get here!" + JSON.stringify(items));
        document.getElementById('bookmarks').innerHTML = JSON.stringify(items);
    });
});
