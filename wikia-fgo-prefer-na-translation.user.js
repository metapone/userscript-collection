// ==UserScript==
// @name         Wikia FGO Prefer NA Translation
// @namespace    metapone
// @match        *://fategrandorder.fandom.com/*
// @grant        none
// @version      2.1
// @author       metapone
// @description  Display by default official translation instead of fan translation
// @license      GPL-2.0-only; https://opensource.org/licenses/GPL-2.0
// @homepage     https://github.com/metapone/userscript-collection
// @supportURL   https://github.com/metapone/userscript-collection/issues
// ==/UserScript==
function callback(mutationsList, observer) {
	for (let mutation of mutationsList) {
		for (let addedNode of mutation.addedNodes) {
			if (addedNode.className === 'tabbernav') {
				const NATab = addedNode.querySelector("a[title='NA']");
				if (NATab) NATab.click();
			}
		}
	}
}

const targetNode = document.querySelector("[id='mw-content-text']");
const observer = new MutationObserver(callback);
observer.observe(targetNode, { childList: true, subtree: true });