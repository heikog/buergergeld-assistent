import ChatWizard from '@/components/ChatWizard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Bürgergeld-Antrag Assistent</h1>
              <p className="text-sm text-gray-500">Formulare einfach und kostenlos ausfüllen</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <ChatWizard />
      </div>

      <footer className="border-t bg-gray-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>
            Dieses Tool hilft beim Ausfüllen der offiziellen Bürgergeld-Formulare der Bundesagentur für Arbeit.
          </p>
          <p className="mt-1">
            Keine Gewähr für Vollständigkeit oder Richtigkeit. Bitte prüfen Sie die ausgefüllten Formulare vor der Abgabe.
          </p>
          <p className="mt-2 text-gray-400">
            Ihre Daten werden nur in Ihrem Browser verarbeitet und nicht gespeichert.
          </p>
        </div>
      </footer>
    </main>
  );
}
