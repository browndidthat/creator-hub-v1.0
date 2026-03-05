import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static getDerivedStateFromError(_error: Error): State {
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-6 bg-charcoal border border-ruby/20 rounded-xl text-center space-y-4">
                    <div className="text-4xl">⚠️</div>
                    <h2 className="text-xl font-bold text-cream">Something went wrong</h2>
                    <p className="text-sm text-muted max-w-sm mx-auto">
                        The application encountered an unexpected error. Try refreshing the page or navigating back.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-ruby/10 hover:bg-ruby/20 text-ruby text-sm font-medium rounded-lg transition-colors border border-ruby/20"
                    >
                        Refresh Page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
