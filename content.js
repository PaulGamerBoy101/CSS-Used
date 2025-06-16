function getAllCSS() {
  let css = '';
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        css += rule.cssText + '\n';
      }
    } catch (e) {
      console.warn('Cannot access stylesheet:', sheet.href);
    }
  }
  return beautifyCSS(css);
}

// Basic CSS beautifier
function beautifyCSS(css) {
  css = css
    .replace(/}\s*/g, '}\n\n')
    .replace(/{\s*/g, ' {\n  ')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\n\s*}/g, '\n}')
    .trim();

  return css;
}

function createModal() {
  if (document.getElementById('extract-css-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'extract-css-modal';
  modal.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif;';

  const content = document.createElement('div');
  content.style = 'background: white; padding: 20px; border-radius: 8px; width: 80%; max-width: 800px; max-height: 80%; display: flex; flex-direction: column;';

  const header = document.createElement('div');
  header.style = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';

  const title = document.createElement('h2');
  title.textContent = 'Extracted CSS';
  title.style = 'margin: 0;';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style = 'background: none; border: none; font-size: 24px; cursor: pointer;';
  closeBtn.onclick = () => modal.remove();

  const textarea = document.createElement('textarea');
  textarea.style = 'width: 100%; height: 400px; margin-bottom: 10px; font-family: monospace; resize: vertical;';
  textarea.value = getAllCSS();

  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy to Clipboard';
  copyBtn.style = 'padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; align-self: flex-end;';
  copyBtn.onclick = () => {
    textarea.select();
    navigator.clipboard.writeText(textarea.value).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy to Clipboard', 2000);
    });
  };

  header.append(title, closeBtn);
  content.append(header, textarea, copyBtn);
  modal.append(content);
  document.body.append(modal);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "showCssModal") {
    createModal();
  }
});
