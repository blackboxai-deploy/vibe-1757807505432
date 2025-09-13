export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio?: string;
  style?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  systemPrompt?: string;
  aspectRatio?: string;
  style?: string;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  message?: string;
}

export interface GenerationStatus {
  isGenerating: boolean;
  progress?: number;
  statusMessage?: string;
}