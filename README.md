# 🌐 com-hub

**com-hub** ist eine moderne Plattform für **Content-Upload** und **Private Spaces**.  
Sie nutzt **Microservices**, **Docker/Kubernetes** und **GitLab CI/CD** für eine skalierbare, produktionsreife Bereitstellung.

---

## 📂 Projektstruktur

- **backend/** – REST-API, Middleware, Business-Logik  
- **frontend/** – React + Vite UI mit TailwindCSS  
- **runner/** – GitLab CI/CD Runner-Definitionen  
- **terraform/** – Infrastruktur als Code (Cloud-Deployment)  
- **k8s/** – Kubernetes-Manifeste (Deployments, Ingress, ConfigMaps, Rolling Updates)  
- **middleware/** – z. B. Auth, API-Gateway  
- **Auth/**, **Data/**, **Video/**, **Lambda-thumbs/** – Authentifizierung, Datenhaltung, Videoverarbeitung, Thumbnail-Generierung  

Zusätzlich:
- **docker-compose.yml** – lokale Entwicklungsumgebung  
- **jest.config.js**, **jest.setup.js** – Testkonfiguration  
- **.gitlab-ci.yml**, **tf.gitlab-ci.yml** – CI/CD-Pipelines

---

## ⚙️ Features

- **Auth-Service** → Registrierung, Login, JWT  
- **Data-Service** → Persistenz & Verwaltung von App-Daten  
- **Video-Service** → Upload, Verarbeitung, Auslieferung  
- **Lambda-thumbs** → automatische Thumbnail-Erzeugung  
- **Middleware** → API-Gateway, Versionierung, Request-Handling  
- **Frontend** → moderne SPA mit React, Vite, TailwindCSS  
- **CI/CD** → Build, Test, Deploy, Secrets-Checks via GitLab  
- **IaC** → Terraform-Skripte für reproduzierbare Infrastruktur  
- **Kubernetes** → Ingress, TLS, Rolling Updates, Skalierung

---

## 🚀 Lokale Entwicklung

**Voraussetzungen**
- Docker & Docker Compose  
- Node.js (für Frontend & Tests)  
- GitLab Runner (optional, für lokale CI-Tests)

**Start (Beispiel)**
```bash
# Repo klonen
git clone <REPO_URL>
cd com-hub

# Lokale Umgebung
docker compose up --build
🧪 Tests
bash
Code kopieren
npm run test
```

# 🔐 Sicherheit
- CSRF- & CORS-Schutz

- Secrets-Checks in GitLab CI

- TLS über Ingress (HTTPS)

# 📖 Dokumentation
- frontend/README.md → Nutzer:innen-Doku

- terraform/ → IaC-Beispiele

- k8s/ → Cluster-Deployments

# 📅 Status
- Aktuell: Plattform offline und von AWS getrennt

- Letzte große Änderung: Migration auf Kubernetes + Terraform

- Größe: ~516 Commits, 16 Branches

- Repo-Speicher: ~127 MB
