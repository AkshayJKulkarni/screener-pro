# AI Resume Screener

A modern web application that uses AI to analyze resumes against job descriptions, providing instant feedback on match scores, skills alignment, and improvement suggestions.

## Features

- **Smart Resume Analysis**: Upload PDF or DOCX resumes for instant AI-powered analysis
- **Job Matching**: Compare resumes against specific job descriptions
- **Skills Assessment**: Identify matched and missing skills
- **Actionable Insights**: Get personalized improvement suggestions
- **Modern UI**: Clean, responsive design built with React and Tailwind CSS
- **Supabase Backend**: Scalable backend with Edge Functions and database storage

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Supabase** for backend services
- **Edge Functions** for serverless resume processing
- **PostgreSQL** database for data storage
- **File processing** for PDF and DOCX parsing

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-resume-screener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Update `src/lib/supabase.ts` with your project URL and anon key
   - Deploy the Edge Function:
     ```bash
     supabase functions deploy screen-resume
     ```

4. **Create database tables**
   Run this SQL in your Supabase SQL editor:
   ```sql
   CREATE TABLE screening_sessions (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       resume_filename TEXT NOT NULL,
       job_description TEXT NOT NULL,
       match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
       matched_skills TEXT[] DEFAULT '{}',
       missing_skills TEXT[] DEFAULT '{}',
       improvement_suggestions TEXT[] DEFAULT '{}',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE INDEX idx_screening_sessions_created_at ON screening_sessions(created_at DESC);
   CREATE INDEX idx_screening_sessions_match_score ON screening_sessions(match_score DESC);

   ALTER TABLE screening_sessions ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Allow all operations on screening_sessions" ON screening_sessions FOR ALL USING (true);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Usage

1. **Upload Resume**: Drag and drop or select a PDF/DOCX resume file
2. **Enter Job Description**: Paste the target job description with requirements
3. **Analyze**: Click "Analyze Resume" to process the comparison
4. **View Results**: Get instant feedback on:
   - Match score (0-100%)
   - Matched skills
   - Missing skills
   - Improvement suggestions

## API Endpoints

### POST `/api/screen` (Supabase Edge Function)
Analyzes a resume against a job description.

**Request:**
- `resume`: File (PDF or DOCX)
- `jobDescription`: String

**Response:**
```json
{
  "matchScore": 85,
  "matchedSkills": ["JavaScript", "React", "Node.js"],
  "missingSkills": ["Python", "AWS"],
  "improvementSuggestions": [
    "Consider adding Python to your skill set",
    "Gain experience with cloud platforms"
  ]
}
```

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components  
│   ├── FileUploader.tsx
│   ├── LoadingSpinner.tsx
│   └── Navbar.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── ResultsPage.tsx
│   └── NotFound.tsx
├── lib/                # Utilities and configurations
│   ├── supabase.ts     # Supabase client
│   └── utils.ts
├── types/              # TypeScript type definitions
│   └── screening.ts
└── hooks/              # Custom React hooks
    └── use-toast.ts

supabase/
└── functions/
    └── screen-resume/   # Edge Function for resume processing
        └── index.ts
```

### Adding AI Integration

The current implementation includes mock AI responses. To integrate with real AI services:

1. **OpenAI Integration**
   ```typescript
   import OpenAI from 'openai'
   
   const openai = new OpenAI({
     apiKey: Deno.env.get('OPENAI_API_KEY')
   })
   ```

2. **Hugging Face Integration**
   ```typescript
   const response = await fetch('https://api-inference.huggingface.co/models/...')
   ```

3. **Update the `screenResume` function** in `supabase/functions/screen-resume/index.ts`

## Deployment

### Frontend (Lovable)
1. Open your [Lovable project](https://lovable.dev)
2. Click **Share → Publish**
3. Your app will be deployed automatically

### Backend (Supabase)
```bash
# Deploy Edge Functions
supabase functions deploy screen-resume

# Deploy database migrations (if using)
supabase db push
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

Required environment variables for Supabase Edge Functions:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `OPENAI_API_KEY`: (Optional) For AI integration
- `HUGGINGFACE_API_KEY`: (Optional) For Hugging Face models

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in this repository
- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Lovable documentation](https://docs.lovable.dev)