'use client';

import React, { useState } from 'react';
import { GeneratedImage } from '@/types/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { downloadImage, generateFilename } from '@/lib/imageApi';
import { toast } from 'sonner';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onDeleteImage: (id: string) => void;
  onClearAll: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onDeleteImage,
  onClearAll
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingDownload, setLoadingDownload] = useState<string | null>(null);

  const handleDownload = async (image: GeneratedImage) => {
    setLoadingDownload(image.id);
    try {
      const filename = generateFilename(image.prompt);
      await downloadImage(image.url, filename);
      toast.success('Image downloaded successfully');
    } catch (error) {
      toast.error('Failed to download image');
      console.error('Download error:', error);
    } finally {
      setLoadingDownload(null);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImageClick = (imageId: string) => {
    setSelectedImage(selectedImage === imageId ? null : imageId);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="text-lg font-medium mb-2">No images generated yet</div>
        <p>Create your first AI-generated image using the form above</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Generated Images ({images.length})
        </h3>
        {images.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-destructive hover:text-destructive"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card 
            key={image.id} 
            className={`overflow-hidden transition-all duration-200 cursor-pointer ${
              selectedImage === image.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}
            onClick={() => handleImageClick(image.id)}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                <Badge variant="secondary" className="text-xs">
                  {formatTimestamp(image.timestamp)}
                </Badge>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-medium line-clamp-2">
                  {image.prompt}
                </p>
                {image.style && image.style !== 'default' && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {image.style}
                  </Badge>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image);
                  }}
                  disabled={loadingDownload === image.id}
                >
                  {loadingDownload === image.id ? 'Downloading...' : 'Download'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteImage(image.id);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected image modal overlay */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={images.find(img => img.id === selectedImage)?.url}
              alt={images.find(img => img.id === selectedImage)?.prompt}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};