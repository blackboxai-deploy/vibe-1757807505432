'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SystemPromptConfigProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const DEFAULT_PROMPTS = [
  {
    name: "Photorealistic",
    prompt: "Create a highly detailed, photorealistic image with professional lighting and composition. Focus on realistic textures, colors, and natural lighting."
  },
  {
    name: "Artistic",
    prompt: "Create an artistic interpretation with creative style, vibrant colors, and unique composition. Emphasize artistic elements and creative expression."
  },
  {
    name: "Cinematic",
    prompt: "Create a cinematic-style image with dramatic lighting, depth of field, and movie-like composition. Use professional camera angles and cinematic color grading."
  },
  {
    name: "Minimalist",
    prompt: "Create a clean, minimalist image with simple composition, balanced elements, and focus on essential details. Use subtle colors and elegant simplicity."
  }
];

export const SystemPromptConfig: React.FC<SystemPromptConfigProps> = ({
  systemPrompt,
  onSystemPromptChange,
  isOpen,
  onToggle
}) => {
  const [tempPrompt, setTempPrompt] = useState(systemPrompt);

  const handleSave = () => {
    onSystemPromptChange(tempPrompt);
    onToggle();
  };

  const handleReset = () => {
    setTempPrompt(systemPrompt);
  };

  const handlePresetSelect = (preset: typeof DEFAULT_PROMPTS[0]) => {
    setTempPrompt(preset.prompt);
  };

  if (!isOpen) {
    return (
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={onToggle}
          className="text-sm"
        >
          Customize System Prompt
        </Button>
        {systemPrompt && (
          <Badge variant="secondary" className="ml-2">
            Custom prompt active
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">System Prompt Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize how the AI interprets and generates your images. This affects the overall style and approach.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            System Prompt
          </label>
          <Textarea
            value={tempPrompt}
            onChange={(e) => setTempPrompt(e.target.value)}
            placeholder="Enter custom instructions for the AI image generator..."
            className="min-h-24 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Quick Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_PROMPTS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => handlePresetSelect(preset)}
                className="justify-start text-left h-auto p-3"
              >
                <div>
                  <div className="font-medium text-xs">{preset.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {preset.prompt.substring(0, 60)}...
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={onToggle}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Apply Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};