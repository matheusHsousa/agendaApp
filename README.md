# AgendaApp

Aplicativo de agenda desenvolvido com Ionic e Angular.

## 🚀 Tecnologias

- **Framework:** Ionic 8 + Angular 20
- **Backend:** Firebase (Firestore, Authentication, Storage, Functions)
- **Push Notifications:** OneSignal
- **Plataformas:** Web, Android (Capacitor)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test
```

## 🔨 Build Android

```bash
# Sincronizar com Android
npx cap sync android

# Abrir no Android Studio
npx cap open android
```

## 🌐 Deploy

### Frontend (Firebase Hosting)
```bash
npm run build
firebase deploy --only hosting
```

### Funções (Firebase Functions)
```bash
firebase deploy --only functions
```

## 💰 Deploy Gratuito do Backend

Este projeto utiliza Firebase para o backend, que oferece um plano gratuito generoso. Para informações sobre opções de deploy gratuito do backend, consulte:

**📖 [DEPLOY_BACKEND_GRATUITO.md](DEPLOY_BACKEND_GRATUITO.md)**

Este documento inclui:
- Detalhes sobre o plano gratuito do Firebase (já utilizado)
- Outras plataformas gratuitas (Render, Railway, Fly.io, Vercel, Supabase, etc.)
- Comparação entre as plataformas
- Instruções de deploy para cada opção

## ⚙️ Configuração

### Firebase
O projeto está configurado para usar o Firebase:
- **Projeto:** agendacidadedutra
- **Configuração:** `src/environments/environment.ts`

### OneSignal
Configurado para push notifications.

## 📝 Scripts Disponíveis

- `npm start` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm test` - Executa testes
- `npm run lint` - Executa linter

## 📱 Plataformas Suportadas

- ✅ Web (PWA)
- ✅ Android
- ⚠️ iOS (requer configuração adicional)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto.

## 🆘 Suporte

Para dúvidas sobre deploy gratuito do backend, consulte o arquivo [DEPLOY_BACKEND_GRATUITO.md](DEPLOY_BACKEND_GRATUITO.md).
