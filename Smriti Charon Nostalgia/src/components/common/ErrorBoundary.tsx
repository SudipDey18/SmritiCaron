import { Component, type ErrorInfo, type ReactNode } from "react";

/** Nostalgic error boundary used to wrap heavy, lazily-loaded surfaces. */
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { error: Error | null }
> {
  override state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Smritocharon boundary:", error, info.componentStack);
  }

  override render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/[0.06] px-6 py-10 text-center animate-unfurl"
          >
            <p className="font-display text-xl text-destructive">
              কিছু ভুল হয়েছে · Something went wrong
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="mt-5 rounded-md border border-border px-4 py-2 text-sm transition hover:border-primary/50"
            >
              আবার চেষ্টা · Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
