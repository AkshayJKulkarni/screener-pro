import { createClient } from '@supabase/supabase-js'
import type { ScreeningResult } from '@/types/screening'

// These would be your actual Supabase project values
// For now, we'll use a direct fetch to the edge function
const supabaseUrl = 'https://your-project-ref.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Screen resume function
export async function screenResume(resumeFile: File, jobDescription: string): Promise<ScreeningResult> {
  try {
    const formData = new FormData()
    formData.append('resume', resumeFile)
    formData.append('jobDescription', jobDescription)

    // For development, we'll use a mock response
    // In production, this would call your actual Supabase Edge Function
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time
    
    const mockResult: ScreeningResult = {
      matchScore: Math.floor(Math.random() * 40) + 60, // 60-100%
      matchedSkills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS', 'Git'],
      missingSkills: ['Python', 'AWS', 'Docker', 'Kubernetes'],
      improvementSuggestions: [
        'Consider adding Python to your skill set for backend development',
        'Gain experience with cloud platforms like AWS',
        'Learn containerization technologies like Docker'
      ]
    }

    return mockResult

    // Uncomment this when you have Supabase configured:
    /*
    const { data, error } = await supabase.functions.invoke('screen-resume', {
      body: formData,
    })

    if (error) {
      throw new Error(error.message || 'Failed to screen resume')
    }

    return data
    */
  } catch (error) {
    console.error('Error screening resume:', error)
    throw error
  }
}