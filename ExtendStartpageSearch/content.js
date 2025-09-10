(function () {
  'use strict';

  console.log('[ESS] Extend Startpage Search');

  // get search term
  let url = new URL(document.location);
  let term = url.searchParams.get('query');
  if (! term) {
    term = document.getElementById("q").value;
  }
  console.log('[ESS] Search for "' + term + '"');

  // create linkbox
  let linkbox = document.createElement('div');
  linkbox.id = 'linkbox';
  linkbox.style =
      'position: fixed; '
    + 'left: 16px; '
    + 'top: 116px;'
    + 'padding: 0px 4px; '
    + 'height: fit-content; '
    + 'background-color: #eee;';

  // get place to put linkbox and insert it
  // let container = document.getElementsByClassName('Layout')[0];
  // let container = document.getElementById('root');
  let container = document.getElementsByTagName('body')[0];
  container.insertBefore(linkbox, container.firstChild);

  // make space for linkbox on images page
  if (url.searchParams.get('cat') == 'images') {
    container.style.marginLeft = '64px';
  }

  // function to add links to linkbox
  function addLink(text, url, iconFile) {
    let link = document.createElement('a');
    link.href = url;
    link.title = text;
    link.style =
        'display: block; '
      + 'margin: 4px 0px;'
    linkbox.append(link);
    if (iconFile === undefined) {
      link.innerHTML = text;
    } else {
      let icon = document.createElement('img');
      icon.src = chrome.runtime.getURL('icons/' + iconFile);
      icon.style = 'width: 24px; height: 24px;'
      icon.alt = text;
      link.append(icon);
    }
  }

  // Wikipedia
  addLink('Wikipedia.svg',
    'https://en.wikipedia.org/wiki/Special:Search?' + new URLSearchParams({search: term}),
    'Wikipedia.svg');

  // Wiktionary
  addLink('Wiktionary',
    'https://www.wiktionary.org/wiki/Special:Search?' + new URLSearchParams({search: term}),
    'Wiktionary.svg');

  // Wikipedia Deutschland
  addLink('Wikipedia DE',
    'https://de.wikipedia.org/wiki/Special:Search?' + new URLSearchParams({search: term}),
    'Wikipedia DE.svg');

  // Perplexity
  addLink('ChatGPT',
    'https://chatgpt.com/?' + new URLSearchParams({q: term}),
    'ChatGPT.svg')

  // Google
  addLink('Google',
    'https://www.google.com/search?' + new URLSearchParams({q: term}),
    'Google.svg');

  // Google Maps
  addLink('Google Maps',
    'https://maps.google.com/maps?' + new URLSearchParams({q: term}),
    'Google Maps.svg');

  // Google Translate
  addLink('Google Translate',
    'https://translate.google.com/?sl=auto&tl=en&' + new URLSearchParams({text: term}),
    'Google Translate.svg');

  // Google Translate
  addLink('LEO Dictionary',
    'https://dict.leo.org/german-english/' + term,
    'LEO ende.svg');

  // YouTube
  addLink('YouTube',
    'https://www.youtube.com/results?' + new URLSearchParams({search_query: term}),
    'YouTube.svg');

  // IMDb
  addLink('IMDb',
    'https://www.imdb.com/find?' + new URLSearchParams({q: term}),
    'IMDb.svg');

  // GoodReads
  addLink('goodreads',
    'https://www.goodreads.com/search?' + new URLSearchParams({q: term}),
    'Goodreads.png');

  // Mozilla Developer Network
  addLink('MDN',
    'https://developer.mozilla.org/en-US/search?' + new URLSearchParams({q: term}),
    'MDN.svg');

  // Python Documentation
  addLink('Python',
    'https://docs.python.org/3/search.html?' + new URLSearchParams({q: term}),
    'Python.svg');

  // Rseek
  addLink('Rseek',
    'https://rseek.org/?' + new URLSearchParams({q: term}),
    'R.svg')

  // Matlab Help Center UK
  addLink('Matlab',
    'https://uk.mathworks.com/support/search.html?' + new URLSearchParams({q: term}),
    'Matlab.png')

})();
