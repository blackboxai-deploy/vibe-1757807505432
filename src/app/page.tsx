import { ImageGenerator } from '@/components/ImageGenerator';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              AI Image Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Create stunning images with the power of artificial intelligence
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <ImageGenerator />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border/40">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Powered by advanced AI models for high-quality image generation
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}