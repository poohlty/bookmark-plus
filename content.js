
function getTitle(){
    return $("title")[0].innerHTML;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    title = getTitle();
    sendResponse({title: title});
});
