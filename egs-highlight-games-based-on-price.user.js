// ==UserScript==
// @name        Epic Game Store Highlight Games Based on Price
// @namespace   metapone
// @version     0.1
// @description Highligh games above a certain price
// @author      metapone
// @license     GPL-2.0-only; https://opensource.org/licenses/GPL-2.0
// @homepage    https://github.com/metapone/userscript-collection
// @supportURL  https://github.com/metapone/userscript-collection/issues
// @noframes
// @match       *://www.epicgames.com/store/*
// @grant       none
// ==/UserScript==

(function () {
  const threshold = 14.99; // Minimum price to highlight
  const color = "blue"; // Highlight CSS color

  function callback(mutationsList, observer) {
    for (let mutation of mutationsList) {
      for (let addedNode of mutation.addedNodes) {
        highlightItem(addedNode);
      }
    }
  }

  function highlightItem(node) {
    for (let item of node.querySelectorAll("li")) {
      const priceText = item.querySelector("span[data-component='Price']");
      if (priceText) {
        const price = parseFloat(priceText.innerText.substring(1));
        if (price >= threshold) item.style.backgroundColor = color;
      }
    }
  }

  window.addEventListener(
    "load",
    function () {
      const targetNode = document.querySelector(
        "section[data-component='BrowseMainWithSidebar']"
      );
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, { subtree: true, childList: true });
      highlightItem(targetNode);
    },
    false
  );
})();
