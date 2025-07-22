import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { AuthProvider } from '../lib/auth'
import { ToastProvider } from '../lib/toast'
import ErrorBoundary from '../components/ErrorBoundary'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}