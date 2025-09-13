import { ImageGenerationRequest, ImageGenerationResponse } from '@/types/image';

const API_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const DEFAULT_MODEL = 'replicate/black-forest-labs/flux-1.1-pro';

export class ImageGenerationAPI {
  private static readonly HEADERS = {
    'customerId': 'cus_T19VZFkWRphXuW',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  };

  static async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      const prompt = this.buildPrompt(request);
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: this.HEADERS,
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        const imageUrl = data.choices[0].message.content.trim();
        
        // Validate that we received a valid image URL
        if (imageUrl.startsWith('http') && (imageUrl.includes('.jpg') || imageUrl.includes('.png') || imageUrl.includes('.jpeg') || imageUrl.includes('.webp'))) {
          return {
            success: true,
            imageUrl: imageUrl
          };
        } else {
          return {
            success: false,
            error: 'Invalid image URL received from API'
          };
        }
      } else {
        return {
          success: false,
          error: 'No image URL in API response'
        };
      }
    } catch (error) {
      console.error('Image generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private static buildPrompt(request: ImageGenerationRequest): string {
    let prompt = '';
    
    if (request.systemPrompt) {
      prompt += `${request.systemPrompt}\n\n`;
    }
    
    prompt += `Generate an image: ${request.prompt}`;
    
    if (request.aspectRatio && request.aspectRatio !== 'square') {
      prompt += ` (${request.aspectRatio} aspect ratio)`;
    }
    
    if (request.style && request.style !== 'default') {
      prompt += ` in ${request.style} style`;
    }
    
    return prompt;
  }
}

// Utility functions for image management
export const downloadImage = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download image');
  }
};

export const generateFilename = (prompt: string): string => {
  const cleanPrompt = prompt
    .substring(0, 30)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  return `ai_image_${cleanPrompt}_${timestamp}.jpg`;
};