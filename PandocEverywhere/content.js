console.log("[PE] Pandoc Everywhere")

fetch("http://localhost:3030/version").then(
  (response) => {
    response.text().then(
      (text) => {
        console.log("[PE] Pandoc " + text);
      }
    )
  }
)

// ––– handle shortcuts –––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Listen to key events in the document or embedded iframe documents.

const attached = new WeakSet();
function attachKeyListener(doc) {
  if (! doc) return;
  console.log("[PE] Found document");
  if (attached.has(doc)) {
    console.log("[PE] Handler already attached");
  } else {
    attached.add(doc);
    console.log("[PE] Attaching handler");
    doc.addEventListener("keydown", handleKey, true);
  }
}

// main document
attachKeyListener(document);

// static iframes
for (const iframe of document.querySelectorAll('iframe')) {
  if (iframe.contentDocument) {
    attachKeyListener(iframe.contentDocument);
  }
  iframe.addEventListener('load', () => {
    attachKeyListener(iframe.contentDocument);
  });
}

// dynamic iframes
const mo = new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.tagName === 'IFRAME') {
        const iframe = node;
        if (iframe.contentDocument) {
          attachKeyListener(iframe.contentDocument);
        }
        iframe.addEventListener('load', () => {
          attachKeyListener(iframe.contentDocument);
        });
      }
    }
  }
});
mo.observe(document.body, { childList: true, subtree: true });

function handleKey(e) {
  const editor = e.target.closest('[contenteditable]');
  if (!editor || !editor.isContentEditable) return;

  switch (formatShortcut(e)) {
    case "ScrollLock":
      // html → markdown → html
      editPandoc(editor, "markdown");
      break;
    case "Ctrl+ScrollLock":
      // html → html → html
      editPandoc(editor, "html");
      break;
    case "Alt+ScrollLock":
      // html
      editRaw(editor);
      break;
  }
}


// ––– overlay editor –––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function editRaw(editor) {
  console.log("[PE] editRaw");

  const { host, textarea } = createUI("raw");
  textarea.value = editor.innerHTML;
  textarea.focus();

  textarea.addEventListener("keydown", (e) => {
    switch (formatShortcut(e)) {
      case "ScrollLock":
      case "Ctrl+ScrollLock":
      case "Alt+ScrollLock":
        editor.innerHTML = textarea.value;
        host.remove();
        editor.focus();
        break;
      case "Escape":
        host.remove();
        editor.focus();
        break;
    }
  });
}

function editPandoc(editor, format) {
  console.log("[PE] editPandoc " + format);

  const { host, textarea } = createUI(format);
  textarea.disabled = true;
  textarea.placeholder = "Converting…";

  pandoc(editor.innerHTML, "html", format)
  .then((text) => {
    textarea.value = text;
    textarea.disabled = false;
    textarea.placeholder = "";
    textarea.focus();
  })
  .catch((error) => {
    alert("Could not convert. Is pandoc-server running?");
    host.remove();
  });

  textarea.addEventListener("keydown", (e) => {
    switch (formatShortcut(e)) {
      case "ScrollLock":
      case "Ctrl+ScrollLock":
      case "Alt+ScrollLock":
        const text = textarea.value;
        textarea.value = "";
        textarea.disabled = true;
        textarea.placeholder = "Converting…";
        pandoc(text, format, "html")
        .then((text) => {
          editor.innerHTML = text;
          host.remove();
          editor.focus();
        })
        .catch((error) => {
          alert("Could not convert. Is pandoc-server running?");
          textarea.value = text;
          textarea.disabled = false;
          textarea.placeholder = "";
          textarea.focus();
        })
        break;
      case "Escape":
        host.remove();
        editor.focus();
        break;
    }
  });
}

function pandoc(text, from, to) {
  return fetch('http://localhost:3030/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/plain"
    },
    body: JSON.stringify({
      "text": text,
      "from": from,
      "to": to,
      "html-math-method": "mathjax"
    })
  }).then((response) => response.text());
}


function formatShortcut(e) {
   if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return null;
  const keys = [];
  if (e.ctrlKey) keys.push("Ctrl");
  if (e.altKey) keys.push("Alt");
  if (e.shiftKey) keys.push("Shift");
  if (e.metaKey) keys.push("Meta"); // Cmd on Mac
  const mainKey = e.key.length === 1 ? e.key.toUpperCase() : e.key;
  keys.push(mainKey);
  return keys.join("+");
}

const uiStyle = `
div {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #7f7f7f7f;
  z-index: 10000;
}
label {
  display: block;
  width: min-content;
  height: calc(100vh - 48px);
  margin: 16px auto;
  padding: 8px 16px;
  border-radius: 8px;
  color: black;
  background-color: #ffffffff;
  font-size: 32px;
  font-family: Noto Sans, sans-serif;
}
textarea {
  width: 80ch;
  height: calc(100% - 58px);
  resize: none;
  margin-top: 4px;
  border-radius: 4px;
  border: 1px solid darkgray;
  font-size: 20px;
  font-family: Consolas, monospace;
}
`;

function createUI(format) {
  // Elements are created in a top-down fashion and modified and appended
  // immediately, except for the top-most element which is appended last.
  const host = document.createElement('div');
  Object.assign(host.style, {
    display: 'block',
    width: '1px',
    height: '1px',
    overflow: 'visible'
  });
  const shadow = host.attachShadow({ mode: "open", delegatesFocus: true });
  const style = document.createElement('style');
  style.textContent = uiStyle;
  shadow.appendChild(style);
  const overlay = document.createElement('div');
  shadow.appendChild(overlay);
  const label = document.createElement('label');
  label.textContent = "Editing " + format;
  overlay.appendChild(label);
  const textarea = document.createElement('textarea');
  textarea.addEventListener("keydown", editorKeys);
  label.appendChild(textarea);
  document.body.appendChild(host);
  textarea.focus();
  // focus stolen by modal dialog?
  if (document.activeElement !== host) {
    document.activeElement.appendChild(host);
    textarea.focus();
  }
  return { host, textarea };
}

function editorKeys(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const value = this.value;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const cursorPosInLine = start - lineStart;
    const spacesToAdd = 4 - (cursorPosInLine % 4);
    const spaces = ' '.repeat(spacesToAdd);
    this.value = value.substring(0, start) + spaces + value.substring(end);
    this.selectionStart = this.selectionEnd = start + spacesToAdd;
  }
}
