import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationAPI } from '@/lib/imageApi';
import { ImageGenerationRequest } from '@/types/image';

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();
    
    // Validate required fields
    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate image using the API
    const result = await ImageGenerationAPI.generateImage(body);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        imageUrl: result.imageUrl,
        message: 'Image generated successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during image generation' 
      },
      { status: 500 }
    );
  }
}