# Chamber of Commerce Project - Setup Guide

## Project Overview
This is the Chamber of Commerce website for the WDD231 course. The project includes a responsive business directory with member cards that can be toggled between grid and list views.

## Project Structure

```
chamber/
├── index.html              # Main home page
├── directory.html          # Business directory page
├── images/                 # Image assets folder
│   ├── favicon.ico        # (TO BE ADDED) Favicon for the site
│   ├── logo.png           # (TO BE ADDED) Chamber logo
│   ├── og-image.jpg       # (TO BE ADDED) Open Graph image for social media
│   └── (member images)    # (TO BE ADDED) Images for each business
├── styles/
│   ├── normalize.css      # CSS reset for cross-browser consistency
│   ├── small.css          # Mobile-first styles (320px and up)
│   └── large.css          # Responsive styles for larger screens
├── scripts/
│   ├── navigation.js      # Mobile menu toggle functionality
│   ├── members.js         # Member data loading and display
│   └── date.js            # Year and last-modified date display
├── data/
│   └── members.json       # Member/business data
└── README.md              # Project documentation
```

## Setup Instructions

### 1. Update Author Information
- Open `directory.html` and `index.html`
- Replace `"Your Name"` with your full name
- Replace `"Your Full Name"` in the footer with your full name

### 2. Add Images
Add the following images to the `images/` folder:

**Required Images:**
- `favicon.ico` - Small icon for browser tab (16x16 or 32x32 pixels)
- `logo.png` - Chamber logo (recommended size: 80x80 pixels)
- `og-image.jpg` - Open Graph image for social media sharing (recommended size: 1200x630 pixels)

**Member Images** (one for each business in members.json):
- `sunshine-bakery.jpg`
- `tech-solutions.jpg`
- `green-garden.jpg`
- `wellness-fitness.jpg`
- `river-view-realty.jpg`
- `downtown-coffee.jpg`
- `premier-auto.jpg`
- `artisan-craft.jpg`

You can use placeholder images or create/download appropriate images for each business.

### 3. Members Data
The `data/members.json` file contains 8 business entries with the following fields:
- `id` - Unique identifier
- `name` - Business name
- `address` - Physical address
- `phone` - Contact phone number
- `website` - Business website URL
- `image` - Image filename (must match files in images folder)
- `membershipLevel` - 1=Member, 2=Silver, 3=Gold
- `description` - Brief business description

You can modify or add more entries as needed.

### 4. Customize Styling
- Update color scheme in `small.css` under the `:root` CSS variables
- Current colors:
  - Primary: #0066cc (Blue)
  - Secondary: #004a99 (Dark Blue)
  - Accent: #ff6b6b (Red)
  - Gold: #ffd700
  - Silver: #c0c0c0

### 5. Update Footer Information
- Open `directory.html` and `index.html`
- Update the footer with your chamber's actual information:
  - Address
  - Phone number
  - Email address

## Features Implemented

✅ **Responsive Design** - Works from 320px to desktop widths
✅ **Mobile Navigation** - Hamburger menu that collapses on mobile
✅ **Member Directory** - Grid and list view toggle
✅ **Member Cards** - Display business information with badges
✅ **Membership Levels** - Gold, Silver, and Member badges with different colors
✅ **Async Data Loading** - Uses fetch and async/await to load member data
✅ **Automatic Copyright Year** - Updates every year
✅ **Last Modified Date** - Shows when the page was last modified
✅ **Facebook Meta Tags** - Open Graph tags for social media sharing
✅ **Accessibility** - Focus states and keyboard navigation

## Testing

### Local Testing with Live Server
1. Open the `chamber` folder in VS Code
2. Right-click on `index.html` (or `directory.html`)
3. Select "Open with Live Server"
4. The page will open in your default browser

### Browser DevTools Testing
1. Open DevTools (F12 or right-click > Inspect)
2. Check the Console tab for any JavaScript errors
3. Use the Console tab to debug any issues
4. Check the Lighthouse tab for:
   - Accessibility
   - Best Practices
   - SEO
   - Performance (desktop and mobile)

### Facebook Sharing Debugger Testing
1. Visit https://developers.facebook.com/tools/debug/
2. Enter your page URL
3. Click "Debug"
4. Verify Open Graph properties are displayed correctly

## Next Steps

The following pages will be created in future assignments:
- `discover.html` - Events and announcements page
- `join.html` - Membership application page

These pages should follow the same HTML structure and styling as `directory.html` for consistency.

## Notes

- Do NOT use CSS frameworks like Bootstrap or Tailwind CSS
- All CSS is custom and responsive
- The navigation menu is fully functional and responsive
- Member images will default to `images/placeholder.jpg` if the specified image is not found
- Update the GitHub repository URL in the Open Graph meta tags to your actual repository URL

## Support

If you encounter any issues:
1. Check the DevTools Console for error messages
2. Verify all image files are in the `images/` folder
3. Ensure the `data/members.json` file is properly formatted
4. Check that all script files are properly linked in the HTML

