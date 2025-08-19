import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { ArrowLeft, Download, RefreshCw, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ScreeningResults {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  fileName: string;
}

const ResultsPage = () => {
  const [results, setResults] = useState<ScreeningResults | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResults = sessionStorage.getItem('screeningResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // Redirect to home if no results found
      navigate('/');
    }
  }, [navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="py-12 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-bold mb-2">Resume Analysis Results</h1>
            <p className="text-muted-foreground text-lg">
              Analysis for: <span className="font-medium text-foreground">{results.fileName}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Overall Score */}
            <Card className="bg-gradient-card shadow-elevated">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl flex items-center justify-center gap-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  Overall Match Score
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {results.score}%
                  </div>
                  <div className="space-y-2">
                    <Progress 
                      value={results.score} 
                      className="h-3 w-full max-w-md mx-auto"
                    />
                    <p className={`text-lg font-medium ${
                      getScoreColor(results.score) === 'success' ? 'text-success' :
                      getScoreColor(results.score) === 'warning' ? 'text-warning' :
                      'text-destructive'
                    }`}>
                      {getScoreDescription(results.score)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Matched Skills */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="h-5 w-5" />
                    Matched Skills
                  </CardTitle>
                  <CardDescription>
                    Skills from your resume that match the job requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.matchedSkills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-success-light text-success border-success/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Missing Skills */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-warning">
                    <AlertTriangle className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                  <CardDescription>
                    Skills mentioned in the job description that could strengthen your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.missingSkills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-warning-light text-warning border-warning/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Strengths */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Key Strengths
                </CardTitle>
                <CardDescription>
                  What makes your resume stand out for this position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-primary">
                <Link to="/">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Analyze Another Resume
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ResultsPage;