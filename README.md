# clinic-manual

Manual do usuário do J.A. Clinics, para a equipe da clínica consultar o passo a passo das telas sem acionar o suporte.

Mesma base do painel: Next.js 15, React 19, TypeScript e Tailwind CSS 4.

```bash
npm install
npm run dev
```

O manual abre em http://localhost:3002.

## Atualizar os prints

O script abre o painel, tira as capturas e grava em `public/prints`.

Telas de entrada (login e recuperação de senha) não precisam de conta. As telas internas só são capturadas se você informar um usuário:

```bash
# PowerShell
$env:APP_URL="https://clinic-web-app-q4mc.onrender.com"
$env:MANUAL_EMAIL="seu-email"
$env:MANUAL_SENHA="sua-senha"
npm run prints
```
