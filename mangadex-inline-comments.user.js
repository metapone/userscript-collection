// ==UserScript==
// @name         MangaDex Inline Comments
// @namespace    metapone
// @version      0.0.1
// @description  Display chapter comments inside MangaDex's sidebar
// @author       metapone
// @license      GPL-2.0-only; https://opensource.org/licenses/GPL-2.0
// @homepage     https://github.com/metapone/userscript-collection
// @supportURL   https://github.com/metapone/userscript-collection/issues
// @noframes
// @match        *://mangadex.org/chapter/*
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle ('\
    /* Fix sidebar stretched outside the screen because of the collapser */\
    .no-gutters > .col.reader-controls {\
        padding-right: 34px;\
    }\
\
    /* Fix overlapping flex items */\
    .reader-controls-mode, .reader-controls-footer {\
        flex-shrink: 0 !important;\
     }\
');

function insertComments() {
  formatSidebar()

  let xhr = new XMLHttpRequest()
  xhr.open('GET', '/chapter/'+ lastChapterId + '/comments')
  xhr.responseType = "document"
  xhr.addEventListener('load', function() {
    if (xhr.status === 200) {
      let htmlDocument = xhr.responseXML.documentElement
      let posts = htmlDocument.querySelectorAll("table .post")
      let wrapperNode = document.createElement('div')

      wrapperNode.setAttribute('class', 'inline-comments')
      wrapperNode.style.overflow = 'auto'
      wrapperNode.style.overflowWrap = 'break-word'
      wrapperNode.style.wordWrap = 'break-word'

      for (let i = 0; i < posts.length; i++) {
          let poster = posts[i].querySelector("td:first-child span")
          let post = posts[i].querySelector(".postbody")
          let commentNode = document.createElement('div')

          if (!(i % 2)) commentNode.style.backgroundColor = 'rgba(0,0,0,.05)'
          commentNode.innerHTML = '<div style="color: #06f">' + poster.innerHTML + '</div>' + post.innerHTML
          wrapperNode.appendChild(commentNode)
      }

      // Button to redirect to chapter thread
      let toThread = htmlDocument.querySelector("table+div")
      if (toThread) wrapperNode.appendChild(toThread)

      let footerNode = document.querySelector('.reader-controls-footer')
      footerNode.parentNode.insertBefore(wrapperNode, footerNode)

      fixSpoilerButton(wrapperNode)
    }
  })
  xhr.send()
}

function formatSidebar() {
  let modeNode = document.querySelector('.reader-controls-mode')
  let footerNode = document.querySelector('.reader-controls-footer')
  let pageNode = document.querySelector('.reader-controls-pages')
  let oldWrapperNodes = document.querySelectorAll('.inline-comments')  // Multiple divs can show up if users switch chapter too fast

  // Clear old comments
  if (oldWrapperNodes) {
    for (let i = 0; i < oldWrapperNodes.length; i++) {
      oldWrapperNodes[i].parentNode.removeChild(oldWrapperNodes[i])
    }
  }

  // Hide sidebar components. Comment out anything you want to keep
  modeNode.style.setProperty('display', 'none', 'important')    // Common keyboard shortcuts
  footerNode.style.setProperty('display', 'none', 'important')  // Footer credit
  pageNode.style.setProperty('display', 'none', 'important')    // Pagination
}

function fixSpoilerButton(post) {
  let spoilerBtns = post.querySelectorAll('.btn-spoiler')
  for (let i = 0; i < spoilerBtns.length; i++) {
    spoilerBtns[i].addEventListener('click', function() {
      this.nextElementSibling.classList.toggle('display-none')
    })
  }
}

let lastPath = ''
let lastChapterId = '';

setInterval (function () {
  if (lastPath !== location.pathname) {
      lastPath = location.pathname
      let path = location.pathname.split('/')
      if (path.length === 4 && !isNaN(path[3]) && lastChapterId !== path[2]) {
        lastChapterId = path[2]
        insertComments()
      }
  }
}, 500)
