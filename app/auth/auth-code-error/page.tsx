import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Errore di Autenticazione
          </h1>
          <p className="text-muted-foreground mb-6">
            Si è verificato un problema durante l&apos;autenticazione. Riprova.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Torna al Login
          </Link>
        </div>
      </div>
    </div>
  )
}



