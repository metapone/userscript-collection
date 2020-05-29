// ==UserScript==
// @name        Reddit Highlight Posts Based on Scores
// @namespace   metapone
// @version     0.1
// @description Highligh posts above a certain score
// @author      metapone
// @license     GPL-2.0-only; https://opensource.org/licenses/GPL-2.0
// @homepage    https://github.com/metapone/userscript-collection
// @supportURL  https://github.com/metapone/userscript-collection/issues
// @noframes
// @match       *://*.reddit.com/*
// @grant       none
// ==/UserScript==

const threshold = 500;  // Minimum score to highlight
const color = "yellow"; // Highlight CSS color

if (window.location.href.indexOf('old.reddit.com') !== -1) {
	document.querySelectorAll(".midcol .score.unvoted").forEach(e => (parseInt(e.textContent, 10) >= threshold) && (e.parentNode.parentNode.style.background = color));
} else {
	function callback(mutationsList, observer) {
		for (let mutation of mutationsList) {
			for (let addedNode of mutation.addedNodes) {
				highlightPosts(addedNode);
			}
		}
	};

	function parseScore(score) {
		const temp = parseFloat(score, 10);
		return score.indexOf('k') === -1 ? temp : temp * 1000;
	}

	function highlightPosts(node) {
		node.querySelectorAll("[id^='upvote-button']").forEach(e => {
			if (parseScore(e.nextSibling.textContent) > threshold) {
				e.parentNode.parentNode.style.background = color;
				e.parentNode.parentNode.nextSibling.style.background = color;
			}
		});
	}

	highlightPosts(document);
	const targetNode = document.querySelector(".Post").parentNode.parentNode.parentNode;
	const observer = new MutationObserver(callback);
	observer.observe(targetNode, { childList: true });
}