# PhotoInstant Uploader

Automatic photo upload tool for Windows (Surface Go 3).

Watches a folder for new photos, generates watermarked previews, uploads to Supabase, and creates database records automatically.

## Quick Start

1. Download `photoinstant-uploader.exe` (or use `npm start` if Node.js is installed).
2. Create a `.env` file in the same folder as the executable:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
WATCH_FOLDER=C:\Users\YourName\Pictures\PhotoInstant
LOCATION_LABEL=Club Name
PRICE_CENTS=100
CURRENCY=AUD
WATERMARK_TEXT=photoinstant.au
```

3. Run the executable.
4. Drop photos into the watch folder — they upload automatically.

## Requirements (if running from source)

- Node.js 18+
- `npm install`
- `npm run dev`

## Build standalone .exe

```bash
npm install
npm run package
```

This creates `photoinstant-uploader.exe` — no Node.js required on the target machine.

## Supported Formats

JPG, JPEG, PNG, RAW, ARW (Sony), CR2/CR3 (Canon), NEF (Nikon), ORF (Olympus), RW2 (Panasonic)

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| SUPABASE_URL | Yes | — | Your Supabase project URL |
| SUPABASE_SERVICE_ROLE_KEY | Yes | — | Service role key (not anon key) |
| WATCH_FOLDER | Yes | — | Folder to watch for new photos |
| LOCATION_LABEL | No | — | Default location label (e.g. "Club Name") |
| PRICE_CENTS | No | 100 | Price in cents (100 = 1 AUD) |
| CURRENCY | No | AUD | Currency code |
| PREVIEW_WIDTH | No | 800 | Preview image width in pixels |
| PREVIEW_QUALITY | No | 75 | JPEG quality for preview (1-100) |
| WATERMARK_TEXT | No | photoinstant.au | Text shown on preview watermark |

## Security Note

Use the **service role key** (not the anon key) — this tool needs to write to private storage and the database. Never share this key or commit it to git.
