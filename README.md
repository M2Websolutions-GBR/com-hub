🌐 com-hub

com-hub ist eine moderne Plattform, die als zentrale Content-Upload- und Private-Space-Plattform entwickelt wurde.
Das Projekt kombiniert Microservice-Architektur, Containerisierung mit Docker & Kubernetes sowie CI/CD-Pipelines über GitLab, um eine skalierbare und produktionsreife Lösung bereitzustellen.

📂 Projektstruktur

Die wichtigsten Komponenten sind in getrennte Verzeichnisse organisiert:

backend/ – REST-API, Middleware und Business-Logik

frontend/ – React + Vite basierte Benutzeroberfläche mit TailwindCSS

runner/ – CI/CD Runner-Definitionen für GitLab

terraform/ – Infrastrukturautomatisierung mit Terraform (Cloud-Deployment)

k8s/ – Kubernetes-Manifeste für Deployment, Ingress, ConfigMaps etc.

middleware/ – zusätzliche Services, z. B. Authentifizierung und API-Gateway

Auth/, Data/, Video/, Lambda-thumbs/ – weitere Services zur Authentifizierung, Datenhaltung, Videomanagement und Thumbnail-Generierung

Zusätzlich enthalten:

docker-compose.yml – Lokale Entwicklungsumgebung

Jest-Konfiguration – automatisierte Tests (jest.config.js, jest.setup.js)

CI/CD-Konfiguration – .gitlab-ci.yml, tf.gitlab-ci.yml

⚙️ Features

Auth-Service → Benutzerregistrierung, Login, JWT-basierte Authentifizierung

Data-Service → Speicherung und Verwaltung von Anwendungsdaten

Video-Service → Upload, Verarbeitung und Bereitstellung von Videos

Lambda-thumbs → Automatische Thumbnail-Generierung

Middleware → API-Gateway, Versionierung & Request-Handling

Frontend → Moderne Web-App mit React, TailwindCSS & Vite

CI/CD-Pipeline → GitLab CI mit Build, Test, Deployment und Secrets-Check

Infrastructure as Code → Terraform-Skripte für Cloud-Deployment

Kubernetes-Support → Skalierbares Deployment mit Ingress & Rolling Updates

🚀 Lokale Entwicklung
Voraussetzungen

Docker
 & Docker Compose

Node.js
 (für Frontend & Tests)

GitLab Runner (optional, für lokale CI-Tests)

🧪 Tests

Unit- und Integrationstests sind mit Jest konfiguriert.

npm run test

☁️ Deployment

Docker → Services werden als Container gebaut (1_build_image.sh)

Push → Images können ins Registry hochgeladen werden (2_push_image.sh)

Kubernetes → Rolling Updates (3_rolling_update.sh)

Terraform → Automatisierte Bereitstellung von Infrastrukturkomponenten

🔐 Sicherheit

CSRF- und CORS-Schutz implementiert

GitLab CI prüft Secrets vor jedem Deployment

TLS aktiviert (Ingress + HTTPS)

📖 Dokumentation

README.md im Frontend → Nutzer-Dokumentation

terraform/ → IaC-Beispiele

k8s/ → Cluster-Deployments

📅 Status

Aktueller Status: Plattform Offline und getrennt von AWS

Letzte große Änderung: Umstellung auf Kubernetes + Terraform-Deployment

Projektgröße: ~516 Commits, 16 Branches

Speicher: ~127 MB
