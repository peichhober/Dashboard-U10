
# ProTeam Performance Dashboard 2026

Ein modernes Dashboard für sportwissenschaftliche Leistungsdiagnostik, entwickelt für die **FC Academy**. Die App nutzt die **Google Gemini AI**, um individuelle Spieleranalysen basierend auf Quartalswerten zu erstellen.

## 🚀 Features
- **Team-Übersicht**: Visualisierung der Mannschaftsentwicklung (Q1-Q4).
- **Spieler-Details**: Detaillierte Profile für alle Spieler (Mittelfeld & Torwart).
- **Individuelle Metriken**: Tracking von Schnelligkeit, Technik, Kraft, Sprungkraft, Koordination und Ausdauer.
- **AI Analyst**: Automatische Generierung von sportwissenschaftlichen Einschätzungen via Gemini 3 Flash.
- **Modernes UI**: Basierend auf Tailwind CSS und Lucide Icons.

## 🛠 Installation & Deployment

### Lokal starten
1. Repository klonen.
2. Im Root-Verzeichnis einen lokalen Server starten (z.B. mit `npx serve .`).

### Vercel Deployment
Dieses Projekt ist für den Export via **Vercel** optimiert:
1. Projekt auf GitHub hochladen.
2. Mit Vercel verbinden.
3. **WICHTIG**: Unter `Settings > Environment Variables` eine neue Variable hinzufügen:
   - Key: `API_KEY`
   - Value: `DEIN_GEMINI_API_KEY` (Erstellbar unter [Google AI Studio](https://aistudio.google.com/))

## 📊 Datenstruktur
Die Leistungsdaten werden in der `constants.ts` verwaltet. Die App berechnet automatisch Trends und Durchschnittswerte für die Visualisierung in Recharts-Diagrammen.

---
Developed with ❤️ for ProTeam Excellence.
