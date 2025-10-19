# 🎯 Quiz Me - Daily Quiz App for Kids

A cheerful, kid-friendly daily quiz web app built with Next.js and deployable on Vercel. The app delivers one quiz per day, calculates scores and time, tracks progress with beautiful charts, and celebrates perfect scores with confetti! 🎉

## ✨ Features

- 📅 **Daily Quiz System** - One quiz per day loaded from Vercel Postgres
- 🎨 **Kid-Friendly UI** - Bright, colorful, and engaging interface
- ⏱️ **Timer** - Tracks how long it takes to complete each quiz
- 📊 **Progress Tracking** - View history with interactive charts
- 🎉 **Confetti Celebration** - Special effects for perfect scores
- 📝 **Multiple Question Types** - Radio, checkbox, text input, and dropdown
- 👨‍💼 **Admin Panel** - Easy interface to add daily quizzes

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Vercel Postgres
- **Styling:** TailwindCSS 4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Effects:** Canvas Confetti
- **Language:** TypeScript

## 📁 Project Structure

```
quiz-me/
├── app/
│   ├── page.tsx              # Home page with greeting
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── quiz/
│   │   └── page.tsx          # Quiz taking page with timer
│   ├── results/
│   │   └── page.tsx          # Results history with charts
│   ├── admin/
│   │   └── add-quiz/
│   │       └── page.tsx      # Admin interface to add quizzes
│   └── api/
│       ├── quiz/route.ts     # GET today's quiz
│       ├── submit/route.ts   # POST quiz results
│       ├── results/route.ts  # GET quiz history
│       └── admin/
│           └── add-quiz/route.ts  # POST new quiz
├── lib/
│   ├── db.ts                 # Database utility functions
│   └── types.ts              # TypeScript type definitions
└── README.md
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

Then install the required packages:

```bash
npm install @vercel/postgres recharts canvas-confetti lucide-react @types/canvas-confetti
```

### 2. Set Up Vercel Postgres

1. Create a new project on [Vercel](https://vercel.com)
2. Go to the **Storage** tab
3. Create a new **Postgres** database
4. Copy the connection strings

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-postgres-prisma-url"
POSTGRES_URL_NON_POOLING="your-postgres-non-pooling-url"
POSTGRES_USER="your-user"
POSTGRES_HOST="your-host"
POSTGRES_PASSWORD="your-password"
POSTGRES_DATABASE="your-database"
```

### 4. Initialize Database

The database tables will be created automatically on first API call. The schema includes:

**quizzes table:**
- `id` - Serial primary key
- `date` - Date of the quiz
- `question` - Question text
- `type` - Question type (radio, checkbox, text, dropdown)
- `options` - JSON array of options
- `correct_answer` - Correct answer
- `created_at` - Timestamp

**results table:**
- `id` - Serial primary key
- `date` - Date of quiz completion
- `score` - Number of correct answers
- `time_taken` - Time in seconds
- `total_questions` - Total number of questions
- `created_at` - Timestamp

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📝 Usage

### For Kids (Users)

1. **Home Page** - See greeting and check if today's quiz is available
2. **Start Quiz** - Click "Start Quiz" to begin
3. **Answer Questions** - Complete all questions (timer is running!)
4. **Submit** - Click submit to see your score and correct answers
5. **View Progress** - Check your history and charts on the Results page

### For Parents (Admins)

1. Go to `/admin/add-quiz`
2. Select a date for the quiz
3. Add questions with the following types:
   - **Radio** - Single choice
   - **Checkbox** - Multiple choice
   - **Text** - Free text input
   - **Dropdown** - Select from dropdown
4. Add options for each question (except text type)
5. Enter the correct answer
6. Submit to save the quiz

## 🎨 Features in Detail

### Question Types

- **Radio (Single Choice):** User selects one option
- **Checkbox (Multiple Choice):** User can select multiple options
- **Text Input:** User types their answer
- **Dropdown:** User selects from a dropdown menu

### Scoring System

- Each correct answer = 1 point
- For checkbox questions, all correct options must be selected
- Text answers are case-insensitive and trimmed
- Perfect score (100%) triggers confetti celebration! 🎉

### Progress Tracking

- **Score Trend Chart** - Line chart showing percentage scores over time
- **Time Chart** - Bar chart showing time taken for each quiz
- **Statistics Cards** - Best score, average score, and average time
- **Recent Quizzes Table** - Detailed history with emojis

## 🚀 Deployment on Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

Vercel will automatically:
- Build your Next.js app
- Connect to Postgres
- Deploy on every push to main branch

## 🎯 API Routes

### GET `/api/quiz`
Fetches today's quiz (without correct answers)

### POST `/api/submit`
Submits quiz answers and returns score with detailed results

**Body:**
```json
{
  "date": "2025-10-19",
  "answers": { "1": "Answer 1", "2": ["Option A", "Option B"] },
  "time_taken": 120
}
```

### GET `/api/results`
Fetches last 30 quiz results

### POST `/api/admin/add-quiz`
Adds a new quiz for a specific date

**Body:**
```json
{
  "date": "2025-10-19",
  "questions": [
    {
      "question": "What is 2+2?",
      "type": "radio",
      "options": ["3", "4", "5"],
      "correct_answer": "4"
    }
  ]
}
```

## 🎨 Customization

### Colors
Edit `app/globals.css` to change the color scheme. Current theme uses:
- Purple (#a855f7)
- Pink (#ec4899)
- Yellow (#fbbf24)
- Green (#10b981)
- Blue (#3b82f6)

### Fonts
The app uses Geist Sans and Geist Mono fonts from Vercel.

## 📄 License

MIT License - Feel free to use this project for educational purposes!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with ❤️ for curious minds
