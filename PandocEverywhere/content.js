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

// Attach event listener handleKey to all editor elements,
// in the document itself or within an iframe.
const host = window.location.hostname;
if (host.includes("moodle")) {
  // Moodle
  console.log("[PE] Detected possible Moodle site.")
  // Wait for iframe.tox-edit-area__iframe to be created.
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.matches?.("iframe.tox-edit-area__iframe")) {
          console.log("[PE] Found iframe.tox-edit-area__iframe.", node);
          // Wait for iframe document to be loaded.
          node.addEventListener("load", () => {
            // Listen for keypresses.
            node.contentDocument.addEventListener("keydown", handleKey);
          })
        }
      }
    }
  })
  mo.observe(document.body, { childList: true, subtree: true });

} else if (host.includes("outlook")) {
  // Outlook
  console.log("[PE] Detected possible Outlook site.");
  // Listen for keypresses.
  document.addEventListener("keydown", handleKey);
}

function handleKey(e) {
  if (formatShortcut(e) == "ScrollLock") {
    const editor = e.target.closest('[contenteditable]');
    if (editor && editor.isContentEditable) {
      pandocEverywhere(editor)
    }
  }
}

function handleKey(e) {
  const editor = e.target.closest('[contenteditable]');
  if (!editor || !editor.isContentEditable) return;

  switch (formatShortcut(e)) {
    case "ScrollLock":
      pandocEverywhere(editor, "Markdown");
      break;
    case "Ctrl+ScrollLock":
      pandocEverywhere(editor, "Tidy HTML");
      break;
    case "Alt+ScrollLock":
      pandocEverywhere(editor, "Raw HTML");
      break;
  }
}

function pandocEverywhere(editor, type) {
  console.log("[PE] pandocEverywhere " + type);

  const { overlay, textarea } = createUI(type);
  textarea.disabled = true;
  textarea.placeholder = "Converting…";

  pandoc(editor.innerHTML, "html", "markdown").then((text) => {
    textarea.value = text;
    textarea.disabled = false;
    textarea.placeholder = "";
    textarea.focus();
  });

  textarea.addEventListener('keydown', (e) => {
    switch (formatShortcut(e)) {
      case "ScrollLock":
      case "Ctrl+ScrollLock":
      case "Alt+ScrollLock":
        pandoc(textarea.value, "markdown", "html").then((text) => {
          editor.innerHTML = text;
          overlay.remove();
          editor.focus();
        });
        textarea.value = "";
        textarea.disabled = true;
        textarea.placeholder = "Converting…";
        break;
      case "Escape":
        overlay.remove();
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
    body: JSON.stringify({ text, from, to })
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

function createUI(text, type) {
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'width': '100%',
    'height': '100%',
    'background-color': '#7f7f7f7f',
    'zIndex': '10000'
  });
  const label = document.createElement('label');
  Object.assign(label.style, {
    'display': 'block',
    'width': 'min-content',
    'height': 'calc(100vh - 32px)',
    'margin': '16px auto',
    'padding': '8px 16px',
    'border-radius': '8px',
    'color': 'black',
    'background-color': '#ffffffff',
    'font-size': '32px'
  });
  label.textContent = "Pandoc Everywhere – " + type;
  const textarea = document.createElement('textarea');
  Object.assign(textarea.style, {
    'font-size': '20px',
    'width': '80ch',
    'height': 'calc(100% - 58px)',
    'resize': 'none',
    'margin-top': '4px',
    'border-radius': '4px',
    'font-family': 'Consolas, monospace'
  });
  label.appendChild(textarea);
  overlay.appendChild(label);
  document.body.appendChild(overlay);
  textarea.focus();
  return { overlay, textarea };
}




