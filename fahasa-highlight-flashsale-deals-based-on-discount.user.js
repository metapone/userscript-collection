// ==UserScript==
// @name        Fahasa Highlight Flashsale Deals Based on Discount
// @namespace   metapone
// @version     2.0
// @description Highligh deals above a certain discount value
// @author      metapone
// @license     GPL-2.0-only; https://opensource.org/licenses/GPL-2.0
// @homepage    https://github.com/metapone/userscript-collection
// @supportURL  https://github.com/metapone/userscript-collection/issues
// @noframes
// @match       *://www.fahasa.com/flashsale*
// @grant       none
// ==/UserScript==

const threshold = 50; // Minimum sale to highlight
const color = "yellow"; // Highlight CSS color
const wishlistColor = "cyan"; // Wishlist highlight CSS color
const wishlist = ["Title 1", "Title 2"].map((x) => x.toLowerCase()); // Target book title (case insensitive)

function highlightSale(node) {
	for (let item of node.querySelectorAll(".flashsale-item")) {
		const discountNode = item.querySelector(".discount-l-fs");
		if (!discountNode) continue;
		const discount = parseInt(discountNode.innerText, 10);
		if (discount >= threshold) item.style.backgroundColor = color;

		const targetNode = item.querySelector(".product-name-no-ellipsis > a");
		if (!targetNode) continue;
		const productTitle = targetNode.innerText.toLowerCase();
		if (wishlist.some((x) => productTitle.includes(x))) item.style.backgroundColor = wishlistColor;
	}
}

function callback(mutationsList) {
	for (let mutation of mutationsList) {
		for (let addedNode of mutation.addedNodes) {
			highlightSale(addedNode);
		}
	}
}

function onLoad() {
	const targetNode = document.querySelector(".flashsale-page-period-content");
	const observer = new MutationObserver(callback);
	observer.observe(targetNode, { subtree: true, childList: true });
	highlightSale(targetNode);
}

window.addEventListener("load", onLoad, false);
