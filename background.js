/*
chrome.commands.onCommand.addListener(async function (command) {
  if (command === "switch-to-tab-left") {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const highlightedTabIndex = tabs.findIndex((tab) => tab.highlighted);
    const index =
      highlightedTabIndex === 0 ? tabs.length - 1 : highlightedTabIndex - 1;
    await chrome.tabs.highlight({ tabs: index });
  } else if (command === "switch-to-tab-right") {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const highlightedTabIndex = tabs.findIndex((tab) => tab.highlighted);
    const index =
      highlightedTabIndex === tabs.length - 1 ? 0 : highlightedTabIndex + 1;
    await chrome.tabs.highlight({ tabs: index });
  }
});
*/

chrome.commands.onCommand.addListener(function (command) {
  if (command === "switch-to-tab-left") {
    switchToTabLeft();
  } else if (command === "switch-to-tab-right") {
    switchToTabRight();
  } else if (command === "duplicate-tab") {
    duplicateTab();
  }
});

function switchToTabLeft() {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const activeTabIndex = tabs.findIndex((tab) => tab.active);
    const lastTabIndex = tabs.length - 1;
    const newIndex = activeTabIndex === 0 ? lastTabIndex : activeTabIndex - 1;
    chrome.tabs.update(tabs[newIndex].id, { active: true });
  });
}

function switchToTabRight() {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const activeTabIndex = tabs.findIndex((tab) => tab.active);
    const lastTabIndex = tabs.length - 1;
    const newIndex = activeTabIndex === lastTabIndex ? 0 : activeTabIndex + 1;
    chrome.tabs.update(tabs[newIndex].id, { active: true });
  });
}

function duplicateTab() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const currentTab = tabs[0];
    chrome.tabs.duplicate(currentTab.id, function (newTab) {
      chrome.tabs.update(newTab.id, { active: true });
    });
  });
}

chrome.commands.getAll(function (commands) {
  var commandLeft = commands.filter(function (command) {
    return command.name === "switch-to-tab-left";
  })[0];
  var commandRight = commands.filter(function (command) {
    return command.name === "switch-to-tab-right";
  })[0];
  var commandDuplicate = commands.filter(function (command) {
    return command.name === "duplicate-tab";
  })[0];

  if (!commandLeft) {
    chrome.commands.update({
      name: "switch-to-tab-left",
      shortcut: "Ctrl+Shift+E",
    });
  }
  if (!commandRight) {
    chrome.commands.update({
      name: "switch-to-tab-right",
      shortcut: "Ctrl+Shift+E",
    });
  }
  if (!commandDuplicate) {
    chrome.commands.update({
      name: "duplicate-tab",
      shortcut: "Ctrl+K",
    });
  }
});
