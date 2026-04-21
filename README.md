# XYZ Labs Showroom

Basic Cloudflare Pages-ready showroom.

## Files
- `index.html` -> main page shell
- `content.js` -> edit text, sections, links, and image paths here
- `app.js` -> renders the cards from `content.js`
- `styles.css` -> styling
- `assets/` -> put thumbnails here
- `push.sh` -> quick git add/commit/push helper
- `setup-showroom.sh` -> scaffold script

## How to edit
Open `content.js` and update:
- `heroTitle`
- `heroSubtitle`
- `heroButtons`
- `sections`
- each item's `title`, `url`, `image`, `description`

## Add a new card
Duplicate one item object inside a section in `content.js`.

## Add a new section
Duplicate a full section object in `content.js`.

## Run locally
Since this is static HTML/JS/CSS, you can open `index.html` directly or serve it with any static server.

## Deploy to Cloudflare Pages
Upload the folder or connect the repo.
Build command: none
Output directory: `/`
