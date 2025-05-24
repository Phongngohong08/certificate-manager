// Custom functionality for enhanced Swagger UI

document.addEventListener('DOMContentLoaded', function() {
  // Add dark mode toggle button
  const darkModeToggle = document.createElement('button');
  darkModeToggle.className = 'dark-mode-toggle';
  darkModeToggle.innerHTML = '🌙';
  darkModeToggle.title = 'Toggle Dark Mode';
  document.body.appendChild(darkModeToggle);

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '☀️';
  }

  // Dark mode toggle functionality
  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    darkModeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
  });

  // Add search functionality enhancements
  setTimeout(function() {
    const searchBox = document.querySelector('.operation-filter-input');
    if (searchBox) {
      searchBox.placeholder = 'Search APIs by name, tag, or description...';
      searchBox.style.width = '100%';
      searchBox.style.padding = '10px';
      searchBox.style.borderRadius = '4px';
    }

    // Add keyboard shortcut hints
    const infoSection = document.querySelector('.info');
    if (infoSection) {
      const shortcutSection = document.createElement('div');
      shortcutSection.className = 'shortcuts-info';
      shortcutSection.innerHTML = `
        <h4>Keyboard Shortcuts</h4>
        <ul>
          <li><kbd>Ctrl</kbd> + <kbd>E</kbd>: Focus search box</li>
          <li><kbd>Esc</kbd>: Clear search</li>
          <li><kbd>D</kbd>: Toggle dark mode</li>
        </ul>
      `;
      shortcutSection.style.marginTop = '20px';
      shortcutSection.style.padding = '15px';
      shortcutSection.style.backgroundColor = '#f8f9fa';
      shortcutSection.style.borderRadius = '8px';
      shortcutSection.style.fontSize = '14px';
      infoSection.appendChild(shortcutSection);
    }
  }, 1000); // Delay to ensure Swagger UI has fully loaded

  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl+E: Focus search
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      const searchBox = document.querySelector('.operation-filter-input');
      if (searchBox) searchBox.focus();
    }
    
    // D: Toggle dark mode (when not typing in an input)
    if (e.key === 'd' && document.activeElement.tagName !== 'INPUT' && 
        document.activeElement.tagName !== 'TEXTAREA') {
      darkModeToggle.click();
    }
  });

  // Enhance API categorization
  setTimeout(function() {
    const tags = document.querySelectorAll('.opblock-tag');
    const tagColors = {
      'Universities': '#3498db',
      'Students': '#2ecc71',
      'Certificates': '#e74c3c',
      'Verification': '#f39c12',
      'Health': '#9b59b6'
    };

    tags.forEach(tag => {
      const tagName = tag.querySelector('span').innerText.trim();
      const color = tagColors[tagName];
      
      if (color) {
        tag.style.borderLeft = `5px solid ${color}`;
        tag.style.paddingLeft = '10px';
      }
    });
  }, 1000);
});

// Add copy to clipboard functionality for requests and responses
window.addEventListener('load', function() {
  setTimeout(function() {
    const codeBlocks = document.querySelectorAll('pre.example');
    
    codeBlocks.forEach(function(block) {
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-code-button';
      copyButton.textContent = 'Copy';
      copyButton.style.position = 'absolute';
      copyButton.style.top = '5px';
      copyButton.style.right = '5px';
      copyButton.style.padding = '5px 10px';
      copyButton.style.fontSize = '12px';
      copyButton.style.background = '#0f2d52';
      copyButton.style.color = 'white';
      copyButton.style.border = 'none';
      copyButton.style.borderRadius = '3px';
      copyButton.style.cursor = 'pointer';
      
      // Make the container position relative for proper button placement
      block.style.position = 'relative';
      block.appendChild(copyButton);
      
      copyButton.addEventListener('click', function() {
        const code = block.querySelector('code').innerText;
        navigator.clipboard.writeText(code).then(function() {
          copyButton.textContent = 'Copied!';
          setTimeout(function() {
            copyButton.textContent = 'Copy';
          }, 2000);
        }).catch(function(err) {
          console.error('Failed to copy: ', err);
        });
      });
    });
  }, 1500); // Delay to ensure Swagger UI has fully loaded
});
