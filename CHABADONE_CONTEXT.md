# ChabadOne Website Context

## What is this?
Custom code for chabadnm.org website using ChabadOne CMS.

## How it works
ChabadOne only allows code in two places:
- **Header Box**: CSS only
- **Footer Box**: JavaScript/HTML

## Current Setup
Everything is now on GitHub Pages. ChabadOne boxes only contain:

**Header:**
```html
<link rel="stylesheet" href="https://yossi837.github.io/chabadnm-assets/chabadnm-styles.css">
```

**Footer:**
```html
<script src="https://yossi837.github.io/chabadnm-assets/chabadnm-scripts.js"></script>
```

## Important Rules
- Must inject HTML using JavaScript
- Content width: 975px, Sidebar: 260px
- Test on iOS Safari (it's picky)
- MutationObserver should target specific elements, not document.body

## Files
- `chabadnm-styles.css` - All CSS styles
- `chabadnm-scripts.js` - All JavaScript + HTML injection


