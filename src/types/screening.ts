export interface ScreeningResult {
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  improvementSuggestions: string[]
}

export interface ScreeningSession {
  id: string
  resume_filename: string
  job_description: string
  match_score: number
  matched_skills: string[]
  missing_skills: string[]
  improvement_suggestions: string[]
  created_at: string
}