# Miscellaneous Chrome / Brave / etc. extensions

This is a collection of miscellaneous extensions I developed for my own use. They may or may not be useful for others.

Installation:

1.  Download or clone the repository somewhere.
2.  Go to the browser's extensions page and activate *Developer Mode*.
3.  Drag and drop the extension's folder onto the browser's extensions page, or use *Load unpacked*


## Extend Startpage Search

*Enhance Startpage search with links to other searches.*

Inserts a vertical toolbar on the right side of [Startpage](https://www.startpage.com/) search results. Clicking on a toolbar button repeats the search on the selected website.

Limitations:

-   Search engines are hardcoded in `contents.js`, so modifications have to be made there. (Remove or add calls to `addLink`, setting a name, search URL scheme, and icon. Icon files have to be put into the subdirectory `icons`.)

-   The extension reads the search term from the page URL (`?query=`). For this to work, the Startpage setting *HTTP request method* has to be set to "GET".


## Outlook Tasks Auto-Open

*Automatically open the tasks side panel in Outlook online.*

Simulates clicks on the check mark icon ("My Day") and then the "To Do" tab, so that on any load of Outlook the tasks side panel is visible (eventually).


## Inject Paged.js

*Prepares a web page for standards-compliant printing.*

Current browsers do not yet fully implement newer CSS standards intended to control the print appearance of web pages. Clicking on the extension button injects [`Paged.js`](https://pagedjs.org/), which paginates in a standards-compliant way. This happens already before printing, in the browser view, so you have to reload the page to undo the effect.


***

This software is copyrighted © 2025 by Carsten Allefeld and released under the terms of the GNU General Public License, version 3 or later.
