import { useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export const FileUploader = ({ onFileSelect, selectedFile }: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const removeFile = useCallback(() => {
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <Card className={cn(
      "relative transition-all duration-300 bg-gradient-card shadow-card",
      isDragOver && "shadow-elevated border-primary bg-primary/5"
    )}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
          isDragOver ? "border-primary bg-primary/5" : "border-border",
          "hover:border-primary/50 hover:bg-muted/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="flex items-center justify-center space-x-4">
            <File className="h-12 w-12 text-primary" />
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">
                Drop your resume here
              </h3>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF and DOCX files
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>
    </Card>
  );
};