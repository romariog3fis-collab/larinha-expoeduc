# 🦜 Larinha ExpoEduc 2026 — Documentação Completa & Resumo de Projeto

Documento criado em **24/07/2026** contendo todas as informações essenciais, URLs, credenciais, arquitetura e instruções para consultas e conversas futuras.

---

## 📌 1. Links & Links de Produção (Vercel)

| Recurso | URL / Caminho |
|---|---|
| **Aplicação Pública (Vercel)** | [https://larinha-expoeduc.vercel.app](https://larinha-expoeduc.vercel.app) |
| **Painel Admin (Vercel)** | [https://larinha-expoeduc.vercel.app/admin](https://larinha-expoeduc.vercel.app/admin) |
| **Política de Privacidade** | [https://larinha-expoeduc.vercel.app/privacidade](https://larinha-expoeduc.vercel.app/privacidade) |
| **Termos de Uso** | [https://larinha-expoeduc.vercel.app/termos](https://larinha-expoeduc.vercel.app/termos) |
| **Repositório GitHub** | `https://github.com/romariog3fis-collab/larinha-expoeduc` |
| **Servidor Local (Node/Vite)** | `http://localhost:3000` |
| **Painel Admin Local** | `http://localhost:3000/admin` |

---

## 🔐 2. Credenciais de Acesso ao Painel Admin

- **Rota:** `/admin`
- **E-mail de Acesso:** `romariog3.fis@gmail.com`
- **Senha:** `Teachy@ExpoEduc26`
- **Chave de API Interna (`X-Admin-Key`):** `Teachy@ExpoEduc26`

> **Funcionalidades do Painel Admin:**
> - Visualização de estatísticas em tempo real (Total de cadastros, Professores, Gestores, Cadastros com E-mail)
> - Busca/filtro por nome, escola, cidade ou perfil
> - **Exportação de dados para CSV** (compatível com Excel via BOM UTF-8)

---

## 📋 3. Fluxo de Pré-Cadastro de Visitantes

### Comportamento do Usuário
1. Ao acessar a aplicação, se o usuário não possuir o registro de versão atualizado no navegador (`larinha_schema_v2`), um **modal com efeito Glassmorphism e avatar animado da Larinha** é exibido antes do chat.
2. O usuário preenche seus dados e envia.
3. O cadastro é enviado via `POST /api/register`.
4. Após confirmação, a Larinha inicia a conversa chamando o usuário pelo seu **primeiro nome** e personalizando as orientações com base no seu **perfil**.

### Campos do Formulário
- **Nome completo** (Obrigatório)
- **Escola / Instituição** (Obrigatório)
- **Cidade / Estado** (Obrigatório)
- **Perfil** (Obrigatório — Caixa de seleção: *Professor, Coordenador, Diretor, Gestor, Outro*)
- **Contato / WhatsApp / Telefone** (Obrigatório)
- **E-mail** (Opcional — para receber informações sobre o evento)

---

## 💾 4. Estrutura de Dados & Persistência

### Local (Servidor Node)
- Os cadastros são salvos no arquivo local `registrations.json` na raiz do projeto.
- O arquivo é ignorado no Git via `.gitignore`.

### Produção (Vercel Serverless)
- As requisições são processadas pelas Serverless Functions em `/api/`.
- Estrutura de arquivos serverless:
  - `api/chat.ts`: Handler do chat com OpenRouter e personalização de prompt pelo header `x-user-name`.
  - `api/register.ts`: Handler para novos pré-cadastros.
  - `api/admin/registrations.ts`: Handler seguro para a listagem do painel admin.
  - `api/_db.ts`: Utilitário de persistência que suporta **Vercel KV / Upstash Redis** (se as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN` forem configuradas) e fallback em `/tmp/registrations.json`.

### Formato do Objeto de Cadastro (`UserProfile`)
```json
{
  "id": "1753345876-abc12",
  "name": "Maria da Silva",
  "school": "EMEF João Paulo II",
  "city": "Natal/RN",
  "role": "Professor",
  "contact": "(84) 99999-0000",
  "email": "maria@escola.edu.br",
  "registeredAt": "2026-07-24T09:13:00.000Z"
}
```

---

## 🧠 5. Personagem & Prompt da Larinha (`server-prompt.ts`)

- **Nome:** Larinha Expoeduc 🦜
- **Identidade:** Mascote arara-azul-claro da Teachy, especialista na ExpoEduc 2026.
- **Tom de voz:** Pedagógico, acolhedor, entusiasmado e profissional.
- **Personalização Dinâmica:** Quando o frontend envia os headers `X-User-Name` e `X-User-Role`, o backend injeta automaticamente uma seção de personalização no System Prompt para que a Larinha trate o usuário pelo nome.

---

## 🚀 6. Comandos Úteis de Desenvolvimento & Deploy

```bash
# Iniciar servidor de desenvolvimento local (Express + Vite na porta 3000)
npm run dev

# Executar build de produção local
npm run build

# Deploy para a Vercel em produção
npx vercel --yes --scope romariog3fis-collabs-projects --name larinha-expoeduc
```

## 🔒 8. Adequação Jurídica & LGPD (Lei nº 13.709/2018)

- **Controlador dos Dados:** Romário Maia Ramos (Pessoa Física)
- **Marca Utilizada:** Teachy (autorização expressa de uso de marca/identidade visual)
- **Canal de Atendimento do Titular (DPO):** `romariog3.fis@gmail.com`
- **Foro Elegível:** Comarca de Natal/RN
- **Páginas Jurídicas:**
  - Política de Privacidade: `/privacidade`
  - Termos de Uso: `/termos`
- **Mecanismo de Consentimento:**
  - Checkbox obrigatório no formulário de pré-cadastro
  - Botão de envio desabilitado até a aceitação dos termos
  - Registro de auditoria no backend (`consentedAt`, `consentVersion` e `ipAddress`)
- **Política de Retenção:** Dados armazenados pelo período do evento + 90 dias, após os quais são permanentemente excluídos.

