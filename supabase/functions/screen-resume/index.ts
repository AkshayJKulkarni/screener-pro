import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const formData = await req.formData()
    const resumeFile = formData.get('resume') as File
    const jobDescription = formData.get('jobDescription') as string

    if (!resumeFile || !jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Resume file and job description are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract text from resume file
    let resumeText = ''
    const fileType = resumeFile.type

    if (fileType === 'application/pdf') {
      // For now, we'll use a simple text extraction
      // In production, you'd use a proper PDF parsing library
      resumeText = await extractTextFromPDF(resumeFile)
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      resumeText = await extractTextFromDOCX(resumeFile)
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Please upload PDF or DOCX files.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Perform AI resume screening
    const screeningResult = await screenResume(resumeText, jobDescription)

    // Save to database
    const { data, error } = await supabase
      .from('screening_sessions')
      .insert([
        {
          resume_filename: resumeFile.name,
          job_description: jobDescription,
          match_score: screeningResult.matchScore,
          matched_skills: screeningResult.matchedSkills,
          missing_skills: screeningResult.missingSkills,
          improvement_suggestions: screeningResult.improvementSuggestions,
          created_at: new Date().toISOString(),
        }
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save screening result' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(screeningResult),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Simple text extraction functions (production would use proper libraries)
async function extractTextFromPDF(file: File): Promise<string> {
  // Placeholder for PDF text extraction
  // In production, use a proper PDF parsing library
  const arrayBuffer = await file.arrayBuffer()
  const text = new TextDecoder().decode(arrayBuffer)
  
  // Simple extraction - look for readable text patterns
  const readableText = text.match(/[a-zA-Z\s]{10,}/g)?.join(' ') || ''
  return readableText.slice(0, 5000) // Limit text length
}

async function extractTextFromDOCX(file: File): Promise<string> {
  // Placeholder for DOCX text extraction
  // In production, use a proper DOCX parsing library
  const arrayBuffer = await file.arrayBuffer()
  const text = new TextDecoder().decode(arrayBuffer)
  
  // Simple extraction - look for readable text patterns
  const readableText = text.match(/[a-zA-Z\s]{10,}/g)?.join(' ') || ''
  return readableText.slice(0, 5000) // Limit text length
}

// AI Resume Screening Logic
async function screenResume(resumeText: string, jobDescription: string) {
  // Mock AI screening logic
  // In production, integrate with AI service like Hugging Face, OpenAI, or Cohere
  
  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 
    'Kubernetes', 'SQL', 'MongoDB', 'Git', 'Agile', 'Scrum', 'REST API',
    'GraphQL', 'HTML', 'CSS', 'Vue.js', 'Angular', 'Express', 'Django',
    'Flask', 'Spring Boot', 'PostgreSQL', 'Redis', 'Elasticsearch'
  ]

  const jobSkills = extractSkills(jobDescription, commonSkills)
  const resumeSkills = extractSkills(resumeText, commonSkills)

  const matchedSkills = jobSkills.filter(skill => 
    resumeSkills.some(resumeSkill => 
      resumeSkill.toLowerCase().includes(skill.toLowerCase())
    )
  )

  const missingSkills = jobSkills.filter(skill => 
    !resumeSkills.some(resumeSkill => 
      resumeSkill.toLowerCase().includes(skill.toLowerCase())
    )
  )

  const matchScore = Math.round(
    jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 100 : 0
  )

  const improvementSuggestions = generateSuggestions(missingSkills, matchScore)

  return {
    matchScore,
    matchedSkills,
    missingSkills: missingSkills.slice(0, 5), // Limit to top 5
    improvementSuggestions
  }
}

function extractSkills(text: string, skillsList: string[]): string[] {
  const foundSkills: string[] = []
  const lowerText = text.toLowerCase()

  skillsList.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill)
    }
  })

  return foundSkills
}

function generateSuggestions(missingSkills: string[], matchScore: number): string[] {
  const suggestions: string[] = []

  if (matchScore < 50) {
    suggestions.push("Consider gaining experience in the key technologies mentioned in the job description")
  }

  if (missingSkills.length > 0) {
    suggestions.push(`Focus on learning: ${missingSkills.slice(0, 3).join(', ')}`)
  }

  if (matchScore >= 70) {
    suggestions.push("Great match! Consider highlighting relevant projects and achievements")
  } else if (matchScore >= 50) {
    suggestions.push("Good foundation! Consider strengthening skills in missing areas")
  }

  return suggestions
}