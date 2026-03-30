export default function Footer() {
  return (
    <footer className="border-t border-border bg-white py-8 mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted">
            The Gourmet Quest - AI Recipe Generator
          </p>
          <p className="text-xs text-muted">
            Powered by Gemini Flash via OpenRouter
          </p>
        </div>
      </div>
    </footer>
  );
}
