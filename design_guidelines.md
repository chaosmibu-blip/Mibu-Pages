# Mibu App Static Pages - Design Guidelines

## Design Approach
**Utility-Focused Design System Approach** - These legal and support pages prioritize clarity, readability, and accessibility. Using a clean, document-style layout with modern web typography principles.

## Core Design Principles
- Information hierarchy through typography and spacing
- Maximum readability for long-form legal content
- Mobile-first responsive design
- Professional yet approachable tone matching the travel app concept

## Typography System
**Font Families:**
- Primary: 'Noto Sans TC' for Chinese text (Google Fonts CDN)
- Secondary: 'Inter' for English text and UI elements (Google Fonts CDN)

**Type Scale:**
- Page Headers: text-4xl (36px) - font-bold
- Section Headers: text-2xl (24px) - font-semibold  
- Subsection Headers: text-xl (20px) - font-medium
- Body Text: text-base (16px) - leading-relaxed (1.625)
- Small Text: text-sm (14px) for metadata/timestamps

## Layout System
**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20
- Section padding: py-12 (mobile), py-20 (desktop)
- Component gaps: gap-6 to gap-8
- Content margins: mb-6 for paragraphs, mb-8 for sections

**Container Structure:**
- Max-width: max-w-4xl (optimized for reading legal text)
- Horizontal padding: px-6 (mobile), px-8 (desktop)
- Center alignment: mx-auto

## Component Library

**Header Navigation:**
- Fixed top bar with logo (Mibu) left, navigation links right
- Links: Privacy Policy, Terms of Service, Support
- Height: h-16, background: #FFFEFA with subtle border-b
- Mobile: Hamburger menu, slide-in drawer

**Page Hero (No Images):**
- Centered text layout on #FFFEFA background
- Page title + brief description
- Minimal height: py-16
- Add decorative coffee-brown accent line (border-t-4) above title

**Content Sections:**
- Article-style layout with clear section breaks
- Numbered or bulleted lists for clarity
- Table format for Privacy Policy data collection details (2-column responsive grid)
- Accordion components for FAQ section (Support page)

**Footer:**
- Single-row layout: Copyright © 2024 查爾斯有限公司 | chaosmibu@gmail.com
- Background: slight tint darker than #FFFEFA
- Height: py-8, text-sm, text-center

**Support Page Form:**
- Contact form with fields: Name, Email, Subject, Message
- Form width: max-w-2xl
- Input styling: border-2, rounded-lg, p-3, focus:border-[#7A5230]
- Submit button: full-width on mobile, auto-width on desktop

**FAQ Accordion:**
- Border-b separation between items
- Click to expand/collapse
- Icon: Heroicons chevron-down (rotate on expand)
- Padding: p-6 for each item

## Visual Treatments (Color Context)
- Links: Underline on hover, coffee brown color (#7A5230)
- Buttons: Filled #7A5230 with white text, rounded-lg
- Code/Technical text: Monospace font, light gray background
- Tables: Subtle borders with alternating row backgrounds
- Current page indicator in navigation: border-b-2 with coffee brown

## Responsive Behavior
**Breakpoints:**
- Mobile: < 768px - Single column, stacked navigation
- Tablet: 768px-1024px - Maintain single column for content
- Desktop: > 1024px - Full layout with side margins

**Mobile Optimizations:**
- Reduce heading sizes by 25%
- Stack form fields vertically
- Full-width buttons
- Collapsible navigation drawer

## Animations
Minimal and purposeful only:
- Smooth scroll to anchors (smooth scroll behavior)
- FAQ accordion expand/collapse (0.2s ease)
- Mobile menu slide-in (0.3s ease)
- No distracting scroll effects or parallax

## Icons
**Heroicons (CDN)** - Outline style for UI elements:
- Menu icon (mobile nav)
- Chevron down (accordions)
- Mail icon (contact sections)
- Check circle (feature lists)

## Accessibility
- Semantic HTML5 (article, section, nav)
- ARIA labels for interactive elements
- Focus visible states for keyboard navigation
- Minimum contrast ratio 4.5:1 for text
- Skip-to-content link

## Page-Specific Notes
**Privacy Policy:** Use definition list format (dt/dd) for data collection sections, include "Last Updated" date at top

**Terms of Service:** Numbered sections for legal clarity, bold important disclaimers

**Support:** Prioritize email contact prominently, FAQ accordion below, version info in small footer text