interface ToolLayoutProps {
  title: string;
  description?: string;
  leftPanel: React.ReactNode;
  rightPanel?: React.ReactNode;
  children?: React.ReactNode;
}

export default function ToolLayout({ title, description, leftPanel, rightPanel, children }: ToolLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" data-testid="page-title">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Controls */}
        <div className="space-y-4">
          {leftPanel}
        </div>

        {/* Right column - Info/Visualizations */}
        {rightPanel && (
          <div className="space-y-4">
            {rightPanel}
          </div>
        )}
      </div>

      {/* Full-width content below if provided */}
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
}
