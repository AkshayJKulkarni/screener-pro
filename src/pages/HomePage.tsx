import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/FileUploader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, CheckCircle2, Target, Zap } from 'lucide-react';
import { screenResume } from '@/lib/supabase';
import type { ScreeningResult } from '@/types/screening';

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedFile || !jobDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please upload a resume and provide a job description.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call Supabase Edge Function
      const result: ScreeningResult = await screenResume(selectedFile, jobDescription);
      
      // Store results in sessionStorage for the results page
      const resultsWithFileName = {
        ...result,
        fileName: selectedFile.name
      };
      
      sessionStorage.setItem('screeningResults', JSON.stringify(resultsWithFileName));
      navigate('/results');

    } catch (error) {
      console.error('Screening failed:', error);
      toast({
        title: "Error",
        description: "Failed to screen resume. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-card shadow-elevated">
              <CardContent className="p-16">
                <LoadingSpinner 
                  size="lg" 
                  text="Analyzing your resume against the job requirements..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="/src/assets/hero-pattern.jpg" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI Resume Screener
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Get instant insights on how well your resume matches job requirements. 
            Powered by advanced AI analysis to help you land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Instant Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span>Match Score</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span>Actionable Insights</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Resume Upload */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
                <CardDescription>
                  Upload your resume in PDF or DOCX format to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader 
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                />
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Job Description</CardTitle>
                <CardDescription>
                  Paste the job description you want to match your resume against
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="job-description" className="text-base font-medium">
                  Job Requirements & Description
                </Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description here including required skills, qualifications, and responsibilities..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px] text-base resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Include specific skills, qualifications, and requirements for the best matching results.
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!selectedFile || !jobDescription.trim()}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 h-auto"
              >
                Analyze Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;