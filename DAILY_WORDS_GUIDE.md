# Daily Word Management System

## Overview
HardWord Hex now includes a comprehensive daily word management system that allows you to:
- Set specific words for specific dates
- Automatically use random words if none are set
- Use extended word dictionaries from GitHub
- Admin interface for easy management

## Features

### 1. **Admin Panel** (`/admin`)
Access the admin panel at `http://localhost:3000/admin`

**Default Password:** `admin123`  
(Change this in `src/app/admin/page.tsx` line 34)

#### Admin Features:
- **Set Daily Words**: Schedule 4-letter and 5-letter words for specific dates
- **Random Generator**: Click the 🎲 button to get random word suggestions
- **View Schedule**: See all scheduled words
- **Delete Words**: Remove scheduled words
- **Word Validation**: All words are validated against the dictionary

### 2. **Automatic Word Selection**
If no word is set for a specific date, the system automatically selects a random word from the dictionary. This ensures the game always works even without manual intervention.

### 3. **Extended Word Lists**
The game now includes extended word lists with 500+ words:
- **Location**: `src/lib/wordLists.ts`
- **5-Letter Words**: `EXTENDED_5_LETTER_WORDS` (500+ words)
- **4-Letter Words**: `EXTENDED_4_LETTER_WORDS` (400+ words)

### 4. **Word Source Integration**
The system includes a function to fetch additional words from GitHub:
```typescript
import { fetchWordsFromGitHub } from '@/lib/wordLists';

// Fetch words from online sources
const { fourLetter, fiveLetter } = await fetchWordsFromGitHub();
```

**Default Source**: [dwyl/english-words](https://github.com/dwyl/english-words)

## How It Works

### Daily Word System
1. **Check for Scheduled Word**: When a game starts, it checks if a word is scheduled for today
2. **Use Scheduled Word**: If found, uses the scheduled word
3. **Random Fallback**: If not found, randomly selects from the dictionary
4. **Consistent for All Players**: All players get the same word for the same date

### Data Storage
- **Daily Words**: Stored in `localStorage` as `hardword-hex-daily-words`
- **Game Progress**: Stored in `localStorage` as `hardword-hex-data`

### File Structure
```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin interface
│   └── page.tsx               # Main game page
├── lib/
│   ├── constants.ts           # Original word lists
│   ├── wordLists.ts          # Extended word lists + GitHub fetch
│   └── utils.ts               # Game logic + daily word system
```

## Usage

### Setting Daily Words

1. Navigate to `/admin`
2. Log in with password
3. Select a date
4. Enter 4-letter and 5-letter words (or use Random button)
5. Click "Set Words"

### Adding More Words

Edit `src/lib/wordLists.ts`:
```typescript
export const EXTENDED_5_LETTER_WORDS = [
  'YOUR', 'NEW', 'WORDS', 'HERE',
  // ... more words
];
```

### Fetching from GitHub

To add more word sources, edit the `fetchWordsFromGitHub` function in `src/lib/wordLists.ts`:

```typescript
const sources = [
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt',
  'https://your-repo/word-list.txt', // Add more sources
];
```

## Security Notes

⚠️ **Important**: The admin panel uses a simple password check in the frontend. For production use:
1. Implement proper backend authentication
2. Use environment variables for passwords
3. Add rate limiting
4. Use secure session management

## API

### Set Daily Word Programmatically

```typescript
// In your code
const dailyWords = [
  { date: '2025-10-21', fiveLetter: 'HELLO', fourLetter: 'WORD' },
  { date: '2025-10-22', fiveLetter: 'WORLD', fourLetter: 'TEST' },
];

localStorage.setItem('hardword-hex-daily-words', JSON.stringify(dailyWords));
```

### Get Today's Word

```typescript
import { getDailyWord } from '@/lib/utils';

// This is called automatically by the game
const word5 = getDailyWord(5); // Returns scheduled word or null
const word4 = getDailyWord(4); // Returns scheduled word or null
```

## Troubleshooting

### Words Not Appearing
1. Check browser console for errors
2. Clear localStorage: `localStorage.clear()`
3. Verify word format (uppercase, correct length)

### Invalid Word Error
- Word must exist in dictionary
- Word must be correct length (4 or 5 letters)
- Word must contain only letters A-Z

### Admin Panel Not Loading
1. Check URL: `http://localhost:3000/admin`
2. Clear browser cache
3. Check browser console for errors

## Future Enhancements

- [ ] Backend API for word management
- [ ] Import/Export word schedules
- [ ] Word difficulty ratings
- [ ] Multi-language support
- [ ] Word categories/themes
- [ ] Automatic word rotation algorithms
- [ ] Analytics for word difficulty

## Credits

Word lists sourced from:
- [dwyl/english-words](https://github.com/dwyl/english-words)
- Custom curated lists
- Community contributions

---

**Need help?** Check the code comments in `src/lib/utils.ts` and `src/app/admin/page.tsx`
