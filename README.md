# Ghost

A job application tracker that connects to your Gmail and tells you which applications got ghosted.

## The Problem

When job hunting, it's hard to track which applications you've sent and whether companies responded. Ghost automates this by scanning your Gmail for job applications and identifying which ones never got a response.

## What It Does

- Scans your Gmail for job application emails
- Tracks applications and their status (pending, responded, ghosted)
- Calculates your callback rate
- Uses AI to analyze why applications might be getting ghosted
- Generates recommendations to improve response rates
- Shows which companies you've applied to most

**Privacy:** All data is stored locally in your browser's LocalStorage. No backend, no database, no data collection.

## How It Works
```
Gmail API (OAuth) → Scan sent emails → Extract applications → Store in LocalStorage
                                            ↓
                                     Gemini AI analysis
                                            ↓
                                   Display insights dashboard
```

**Architecture decisions:**
- No backend: Simplifies deployment and keeps data private
- LocalStorage: Data persists locally, never leaves your device
- OAuth only: No user accounts or authentication server needed
- Client-side AI: Gemini API called directly from browser

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui (components)
- Gmail API (OAuth 2.0 for email access)
- Google Gemini AI (application analysis)
- Browser LocalStorage (data persistence)

## Setup

### Prerequisites
- Node.js 18+
- Google Cloud account (free tier)
- Gmail account

### 1. Install Dependencies
```bash
git clone https://github.com/DanCsoftware/Ghost.git
cd Ghost
npm install
```

### 2. Configure Google Cloud

**Enable Gmail API:**
1. Create a project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Gmail API
3. Create OAuth 2.0 credentials (Web application type)
4. Add `http://localhost:5173` to authorized JavaScript origins
5. Copy your Client ID

**Get Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Generate an API key
3. Copy the key

### 3. Environment Variables

Create `.env`:
```env
VITE_GMAIL_CLIENT_ID=your_client_id_here
VITE_GEMINI_API_KEY=your_gemini_key_here
```

### 4. Run Locally
```bash
npm run dev
```

Visit `http://localhost:8080`

## Usage

1. Click "Connect Gmail"
2. Authorize Gmail access (read-only)
3. Ghost scans your sent mail for job applications
4. View your dashboard with stats and AI insights
5. Click "Scan Another Inbox" to clear data and connect a different account

## Data Storage

All application data is stored in browser LocalStorage under the key `ghost_job_applications`. This means:
- Data persists across browser sessions
- Data is cleared if you clear browser storage
- Data is only accessible from your device
- No server storage or backups

## Development
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure
```
Ghost/
├── src/
│   ├── components/
│   │   ├── GhostEntry.tsx    # OAuth login screen
│   │   └── GhostScan.tsx     # Main dashboard
│   ├── lib/
│   │   ├── storage.ts        # LocalStorage helpers
│   │   └── gemini.ts         # AI analysis
│   └── App.tsx               # Root component
├── .env                      # API keys (not in git)
└── README.md
```

## Known Limitations

- Only tracks emails sent after October 2024 (configurable in code)
- Company name extraction is basic (uses email domain)
- Response detection is time-based only (7 days = ghosted)
- No actual response parsing (future enhancement)
- Clearbit logo API has CORS limitations (some logos fail)

## Future Improvements

- Parse actual email responses to detect callbacks
- Better company name extraction
- Export data to CSV
- Track application sources (LinkedIn, Indeed, etc.)
- Multi-language support
- Desktop app packaging

## License

MIT

## Contributing

Pull requests welcome. For major changes, open an issue first to discuss.

---

Built to solve a real problem during job hunting.