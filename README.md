# SEO Dashboard

Dashboard de SEO com análise de clusters, insights por IA e sazonalidade por país.

## Como fazer deploy no Vercel

### 1. Suba o projeto no GitHub
- Crie um repositório no [github.com](https://github.com)
- Faça upload de todos os arquivos desta pasta (incluindo a pasta `src/`)

### 2. Conecte ao Vercel
- Acesse [vercel.com](https://vercel.com) → **New Project**
- Clique em **Continue with GitHub** e selecione o repositório
- O Vercel detecta automaticamente que é um projeto **Vite + React**
- Clique em **Deploy** — sem nenhuma configuração extra!

### 3. Pronto!
Você receberá uma URL pública do tipo `seo-dashboard-xxx.vercel.app`.

## Estrutura do projeto

```
seo-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── src/
    ├── main.jsx
    └── SEODashboard.jsx
```

## Rodando localmente (opcional)

```bash
npm install
npm run dev
```
