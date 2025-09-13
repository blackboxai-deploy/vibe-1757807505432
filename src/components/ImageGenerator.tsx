'use client';

import React, { useState, useEffect } from 'react';
import { GeneratedImage, ImageGenerationRequest, GenerationStatus } from '@/types/image';
import { SystemPromptConfig } from './SystemPromptConfig';
import { ImageGallery } from './ImageGallery';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const ASPECT_RATIOS = [
  { value: 'square', label: 'Square (1:1)' },
  { value: 'landscape', label: 'Landscape (16:9)' },
  { value: 'portrait', label: 'Portrait (9:16)' },
  { value: 'wide', label: 'Wide (21:9)' }
];

const STYLES = [
  { value: 'default', label: 'Default' },
  { value: 'photorealistic', label: 'Photorealistic' },
  { value: 'artistic', label: 'Artistic' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'vintage', label: 'Vintage' }
];

const STORAGE_KEY = 'ai-image-generator-data';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('square');
  const [style, setStyle] = useState('default');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    isGenerating: false
  });
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [error, setError] = useState<string>('');

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setGeneratedImages(parsed.images || []);
        setSystemPrompt(parsed.systemPrompt || '');
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const dataToSave = {
      images: generatedImages,
      systemPrompt: systemPrompt
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [generatedImages, systemPrompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for image generation');
      return;
    }

    setError('');
    setGenerationStatus({
      isGenerating: true,
      statusMessage: 'Preparing to generate image...'
    });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationStatus(prev => ({
          ...prev,
          progress: Math.min((prev.progress || 0) + Math.random() * 15, 85),
          statusMessage: 'Generating your image...'
        }));
      }, 1000);

      const request: ImageGenerationRequest = {
        prompt: prompt.trim(),
        systemPrompt: systemPrompt || undefined,
        aspectRatio,
        style
      };

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.imageUrl) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: data.imageUrl,
          prompt,
          timestamp: Date.now(),
          aspectRatio,
          style
        };

        setGeneratedImages(prev => [newImage, ...prev]);
        setPrompt('');
        toast.success('Image generated successfully!');
        
        setGenerationStatus({
          isGenerating: false,
          progress: 100,
          statusMessage: 'Image generated successfully!'
        });

        // Clear status after a delay
        setTimeout(() => {
          setGenerationStatus({ isGenerating: false });
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to generate image: ${errorMessage}`);
      toast.error('Failed to generate image');
      setGenerationStatus({ isGenerating: false });
    }
  };

  const handleDeleteImage = (id: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id));
    toast.success('Image deleted');
  };

  const handleClearAll = () => {
    setGeneratedImages([]);
    toast.success('All images cleared');
  };

  const isGenerateDisabled = !prompt.trim() || generationStatus.isGenerating;

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle>AI Image Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SystemPromptConfig
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
            isOpen={showSystemPrompt}
            onToggle={() => setShowSystemPrompt(!showSystemPrompt)}
          />

          <div>
            <label className="text-sm font-medium mb-2 block">
              Image Description
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate... (e.g., 'A serene mountain landscape at sunset with a crystal clear lake reflecting the sky')"
              className="min-h-24 resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {prompt.length}/500 characters
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Aspect Ratio
              </label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS.map((ratio) => (
                    <SelectItem key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Style
              </label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STYLES.map((styleOption) => (
                    <SelectItem key={styleOption.value} value={styleOption.value}>
                      {styleOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {generationStatus.isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{generationStatus.statusMessage}</span>
                <span>{Math.round(generationStatus.progress || 0)}%</span>
              </div>
              <Progress value={generationStatus.progress || 0} className="w-full" />
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className="w-full"
            size="lg"
          >
            {generationStatus.isGenerating ? 'Generating...' : 'Generate Image'}
          </Button>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      <ImageGallery
        images={generatedImages}
        onDeleteImage={handleDeleteImage}
        onClearAll={handleClearAll}
      />
    </div>
  );
};