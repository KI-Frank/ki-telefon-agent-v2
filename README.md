# KI Telefon-Agent – v2-Entwurf (Spiegel)

1:1-Kopie des v2-Designs von https://itisrob.github.io/ki-telefon-agent-v2/ (Stand 16.09.2026).

**Live ansehen:** https://ki-frank.github.io/ki-telefon-agent-v2/

- 25 statische HTML-Seiten, `assets/css/styles.css`, `assets/js/app.js`, Bilder unter `assets/img/`
- Alle Seiten auf `noindex,nofollow` gesetzt, damit die Kopie nicht mit ki-telefon-agent.com konkurriert

## Bekannte Lücken vor einem Go-Live
- Testanruf-Formular (`index.html`, `termin.html`) sendet nichts – `submitForm` in `assets/js/app.js` ist ein Platzhalter
- Keine Datenschutz-Checkbox und kein Spam-Schutz im Formular
- `loadTracking()` ist leer (kein GA4/Meta/Clarity)
- `canonical`, `og:url` und JSON-LD zeigen auf itisrob.github.io
