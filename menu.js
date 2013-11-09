
function genericOnClick(info, tab) {
  console.log("This is clicked!");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

var parent = chrome.contextMenus.create({"title": "Test parent item", "onclick": genericOnClick});
