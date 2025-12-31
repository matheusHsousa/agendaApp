# Opções de Deploy Gratuito para Backend

Este documento lista as principais plataformas para deploy gratuito de backend, incluindo a solução já utilizada neste projeto e outras alternativas.

## 🔥 Firebase (Solução Atual)

**Status:** ✅ Já configurado neste projeto

O projeto já utiliza Firebase, que oferece um plano gratuito generoso (Spark Plan):

### Recursos Gratuitos do Firebase:
- **Firebase Functions**: 2 milhões de invocações/mês
- **Firestore Database**: 1 GB de armazenamento, 50k leituras/dia, 20k escritas/dia
- **Firebase Authentication**: Ilimitado
- **Firebase Storage**: 5 GB de armazenamento, 1 GB de transferência/dia
- **Firebase Hosting**: 10 GB de armazenamento, 360 MB/dia de transferência

### Como Usar:
O projeto já está configurado com Firebase. Para fazer deploy das funções:

```bash
# Instalar Firebase CLI (se ainda não tiver)
npm install -g firebase-tools

# Fazer login
firebase login

# Deploy das funções
# Nota: Crie a pasta 'push-functions' se precisar adicionar Cloud Functions
firebase deploy --only functions
```

### Configuração Atual:
- Projeto Firebase: `agendacidadedutra`
- Configuração em: `firebase.json` e `.firebaserc`

**Documentação:** https://firebase.google.com/pricing

---

## 🚀 Outras Plataformas Gratuitas

### 1. **Render**
Excelente alternativa para Node.js, Python, Go, Ruby, etc.

**Recursos Gratuitos:**
- 750 horas de computação/mês
- Aplicações adormecem após inatividade (acordam ao receber requisição)
- 100 GB de largura de banda/mês
- Suporta PostgreSQL gratuito (90 dias)

**Deploy:**
```bash
# Conectar repositório GitHub e Render faz deploy automático
# Interface web: https://render.com
```

**Site:** https://render.com
**Melhor para:** APIs REST, aplicações Node.js, Python backends

---

### 2. **Railway**
Plataforma moderna com $5 de crédito gratuito mensal.

**Recursos Gratuitos:**
- $5 de crédito/mês (aproximadamente 500 horas)
- Deploy direto do GitHub
- Suporta múltiplas linguagens
- Banco de dados PostgreSQL, MySQL, Redis

**Deploy:**
```bash
# Via Railway CLI
npm i -g @railway/cli
railway login
railway init
railway up
```

**Site:** https://railway.app
**Melhor para:** Projetos full-stack, APIs com banco de dados

---

### 3. **Fly.io**
Ótimo para aplicações que precisam rodar em múltiplas regiões.

**Recursos Gratuitos:**
- 3 VMs compartilhadas (256 MB RAM cada)
- 3 GB de armazenamento persistente
- 160 GB de tráfego de saída/mês

**Deploy:**
```bash
# Via Fly CLI
curl -L https://fly.io/install.sh | sh
fly auth login
fly launch
fly deploy
```

**Site:** https://fly.io
**Melhor para:** Aplicações containerizadas (Docker)

---

### 4. **Vercel (Backend Serverless)**
Principalmente para frontend, mas suporta Serverless Functions.

**Recursos Gratuitos:**
- Funções serverless ilimitadas
- 100 GB de largura de banda/mês
- Integrações automáticas com GitHub

**Deploy:**
```bash
npm i -g vercel
vercel login
vercel
```

**Site:** https://vercel.com
**Melhor para:** APIs serverless, Next.js com backend

---

### 5. **Netlify Functions**
Similar ao Vercel, ótimo para funções serverless.

**Recursos Gratuitos:**
- 125k requisições/mês para funções
- 100 GB de largura de banda/mês
- Deploy automático do GitHub

**Site:** https://www.netlify.com
**Melhor para:** JAMstack, funções serverless

---

### 6. **Supabase**
Alternativa open-source ao Firebase.

**Recursos Gratuitos:**
- Banco de dados PostgreSQL (500 MB)
- Autenticação integrada
- Storage (1 GB)
- API REST automática
- Realtime subscriptions

**Site:** https://supabase.com
**Melhor para:** Aplicações que precisam de PostgreSQL

---

### 7. **Heroku (Limitado)**
**⚠️ Nota:** Heroku eliminou seu plano gratuito em novembro de 2022. Atualmente, oferece créditos através do GitHub Student Developer Pack para estudantes.

**Site:** https://www.heroku.com
**Melhor para:** Estudantes com acesso ao GitHub Student Pack

---

### 8. **Oracle Cloud (Always Free)**
Recursos mais robustos, mas mais complexo de configurar.

**Recursos Gratuitos:**
- 2 VMs AMD (1/8 OCPU, 1 GB RAM cada)
- 4 VMs ARM Ampere A1 (24 GB RAM total)
- 2 bancos de dados Oracle Autonomous
- 200 GB de storage

**Site:** https://www.oracle.com/cloud/free/
**Melhor para:** Aplicações que precisam de VMs dedicadas

---

## 📊 Comparação Rápida

| Plataforma | Melhor Para | Complexidade | Adormece? |
|------------|-------------|--------------|-----------|
| **Firebase** (Atual) | Apps mobile, serverless | Baixa | Não |
| **Render** | APIs REST, backends simples | Baixa | Sim |
| **Railway** | Full-stack com DB | Média | Não* |
| **Fly.io** | Apps containerizadas | Média | Não |
| **Vercel** | Funções serverless | Baixa | Não |
| **Supabase** | Apps com PostgreSQL | Baixa | Não |
| **Oracle Cloud** | VMs dedicadas | Alta | Não |

*Com crédito mensal limitado

---

## 💡 Recomendação para este Projeto

Como o projeto **já utiliza Firebase**, a recomendação é:

1. **Continuar com Firebase** - Já está configurado e funciona bem com Ionic/Angular
2. **Se precisar de backend adicional:** Considere **Render** ou **Railway** para APIs REST
3. **Se precisar de PostgreSQL:** Considere **Supabase** como complemento ao Firebase

---

## 🔗 Links Úteis

- [Firebase Pricing](https://firebase.google.com/pricing)
- [Comparação de Plataformas Cloud](https://github.com/255kb/stack-on-a-budget)
- [Free for Dev - Lista completa](https://free-for.dev/)

---

## ⚙️ Configuração Atual do Projeto

Este projeto usa:
- **Frontend:** Ionic/Angular (pode ser hospedado no Firebase Hosting gratuitamente)
- **Backend:** Firebase (Functions, Firestore, Auth, Storage)
- **Push Notifications:** OneSignal
- **Projeto:** `agendacidadedutra`

Para fazer deploy do frontend no Firebase Hosting:
```bash
# Build do projeto
npm run build

# Deploy no Firebase Hosting
firebase deploy --only hosting
```

---

**Última atualização:** Dezembro 2024
