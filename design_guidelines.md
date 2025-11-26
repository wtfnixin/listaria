# Design Guidelines: OLX-Style Classified Ads Marketplace

## Design Approach
**Reference-Based Design** - Taking direct inspiration from OLX and the provided screenshots to create a familiar, trusted marketplace experience. The design prioritizes clarity, scannability, and conversion with a clean, modern aesthetic.

## Core Brand Color
**Primary Purple: #B078C4** - Use consistently for all interactive elements, CTAs, links, and brand accents throughout the application.

## Typography System

**Font Family:** 
- Primary: 'Inter' or 'Poppins' from Google Fonts for clean, modern readability
- Fallback: system-ui, sans-serif

**Type Scale:**
- Hero/H1: text-4xl (36px) font-bold
- Section Headers: text-2xl (24px) font-semibold
- Card Titles: text-lg (18px) font-semibold
- Body Text: text-base (16px) font-normal
- Small Text/Meta: text-sm (14px) font-normal
- Price Tags: text-xl (20px) font-bold

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, and 12 consistently
- Component padding: p-4, p-6
- Section spacing: py-12, py-16
- Grid gaps: gap-4, gap-6
- Element margins: m-2, m-4, m-8

**Container System:**
- Max width: max-w-7xl centered (mx-auto)
- Page padding: px-4 md:px-6 lg:px-8

## Component Library

### Header (Fixed/Sticky)
- White background with subtle bottom border (border-b)
- Logo on left (approximately 140px wide)
- Center: Search bar with category dropdown + text input + search icon button
- Right side: Add Location button, Login/Register buttons, User dropdown (when authenticated), Sell button (#B078C4)
- User dropdown includes: My Profile, Notifications, Chat, Subscription, My Advertisement, Favorites, Transaction, Reviews, Job Applications, Sign out
- Height: h-16 to h-20

### Popular Categories Section
- Grid layout: grid-cols-2 md:grid-cols-4 with gap-6
- Circular category icons (w-20 h-20 to w-24 h-24) with subtle borders
- Category labels below icons (text-sm font-medium)
- Categories: Electronics, Car, Mobile, Clothing
- Hover effect: slight scale transform and purple tint

### Ad Listings Grid
- Responsive grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Gap: gap-4 to gap-6
- Each card includes:
  - Image container (aspect-ratio-square or 4:3) with object-cover
  - Price (text-xl font-bold in purple #B078C4)
  - Title (text-lg font-semibold, truncate after 2 lines)
  - Location tag with pin icon (text-sm text-gray-600)
  - Posted date (text-xs text-gray-500)
- Card styling: white background, rounded corners (rounded-lg), subtle shadow on hover
- Border: border border-gray-200

### Sell Page (Modal or Separate Page)
Multi-step form matching OLX style:

**Step 1 - Category Selection:**
- Large category cards in grid (grid-cols-2 md:grid-cols-3)
- Icons + labels for each category
- Active state with purple border

**Step 2 - Item Details:**
- Form fields with labels above inputs
- Title input (max 70 characters)
- Description textarea (rows-6)
- Price input with currency symbol
- Condition dropdown (New/Used)
- All inputs: border-2 focus:border-purple-500 rounded-lg p-3

**Step 3 - Upload Photos:**
- Drag & drop zone with dashed border
- Image previews in grid (grid-cols-3 gap-2)
- Upload button with camera icon
- Support multiple images (up to 12)

**Step 4 - Location & Contact:**
- Location autocomplete input
- Phone number input
- Show contact details toggle
- Navigation buttons: Back (outlined) and Continue/Publish (filled with #B078C4)

### Search & Filters
- Search bar with rounded-full design (rounded-full border-2)
- Category dropdown on left side of search
- Location input on right
- Search icon button in purple (#B078C4)
- Active filters display as dismissible tags below search

### Footer
- Dark background (bg-gray-900)
- Two-column layout: Quick Links | Get in touch
- Quick Links: About us, Contact us, Subscription, Our Blog, FAQs
- Contact: Email (listana@outlook.com), Phone (+91)
- Links in white text (text-white) with hover:text-purple-400
- Padding: py-12

### Empty State
- Centered illustration/icon (w-48 h-48)
- "No Advertisement Found" heading (text-2xl font-semibold)
- Helpful message suggesting to adjust filters
- Centered layout with generous spacing

## Interaction Patterns

**Buttons:**
- Primary (Sell, Search): bg-purple-600 (#B078C4) text-white rounded-lg px-6 py-3 font-semibold hover:bg-purple-700
- Secondary (Login, Location): border-2 border-purple-600 text-purple-600 rounded-lg px-6 py-3 hover:bg-purple-50
- Icon buttons: rounded-full p-2 hover:bg-gray-100

**Cards:**
- Cursor pointer on entire card
- Transform scale-105 on hover with smooth transition
- Shadow elevation increase on hover

**Links:**
- Purple color (#B078C4) with underline on hover
- Smooth transitions (transition-all duration-200)

## Responsive Behavior
- Mobile: Single column layouts, collapsible search, hamburger menu
- Tablet: 2-column grids, visible search bar
- Desktop: Full multi-column layouts, all elements visible

## Images
Use placeholder images for ad listings showing various products (electronics, cars, mobile phones, clothing items). Category icons should be simple line icons or filled circular icons representing each category clearly.