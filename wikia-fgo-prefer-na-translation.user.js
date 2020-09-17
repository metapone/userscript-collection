// ==UserScript==
// @name         Wikia FGO Prefer NA Translation
// @namespace    metapone
// @match        *://fategrandorder.fandom.com/*
// @grant        none
// @version      1.0
// @author       metapone
// @description  Display by default official translation instead of fan translation
// @license      GPL-2.0-only; https://opensource.org/licenses/GPL-2.0
// @homepage     https://github.com/metapone/userscript-collection
// @supportURL   https://github.com/metapone/userscript-collection/issues
// ==/UserScript==
window.addEventListener('load', function() {
    Array.from(document.querySelectorAll(".tabbernav a[title='NA']")).forEach(node=>node.click());
}, false);