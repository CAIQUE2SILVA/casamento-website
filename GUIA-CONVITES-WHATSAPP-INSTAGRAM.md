# 📱 Guia: Convites via WhatsApp e Instagram

## 🎯 Visão Geral

Agora você pode enviar convites de casamento de forma mais moderna e conveniente através do WhatsApp e Instagram! O sistema gera uma página bonita como uma carta de convite online.

## 🚀 Como Funciona

### 1. **Página de Convite**

- Acesse `/convite` no seu site para ver como fica
- Design elegante que simula uma carta de convite
- Formulário completo para confirmação de presença
- Responsivo (funciona bem no celular)

### 2. **Campos do Formulário**

O convidado deve preencher:

- ✅ Nome completo
- ✅ Email
- ✅ Telefone
- ✅ Confirmação de presença (Sim/Não)
- ✅ Se vai levar acompanhante
- ✅ Nome do acompanhante (se aplicável)
- ✅ Observações (opcional)

## 📋 Como Usar no Admin

### **Opção 1: Convite Individual**

1. Acesse `/admin/convidados`
2. Na lista de convidados, você verá novos botões:
   - 🟢 **WhatsApp**: Abre WhatsApp com mensagem pronta
   - 🔵 **Instagram**: Copia texto para colar no Instagram
   - ⚪ **Link**: Copia apenas o link do convite

### **Opção 2: Convite Genérico**

1. Clique em "Gerar Convite" no topo da página
2. Um modal aparecerá com:
   - Link do convite
   - Botão para WhatsApp
   - Botão para copiar texto do Instagram
   - Opção de copiar apenas o link

## 💬 WhatsApp

### **Como Enviar:**

1. Clique no botão verde do WhatsApp
2. Ele abrirá o WhatsApp com uma mensagem pronta
3. Escolha o contato e envie

### **Mensagem Padrão:**

```
💍 *Convite de Casamento* 💍

Olá [Nome]!

Kauã & Kimily têm a honra de convidá-lo(a) para celebrar o dia mais especial de suas vidas! 💕

📅 *Data:* 15 de Novembro de 2025
🕐 *Horário:* 19:00
📍 *Local:* Local da Cerimônia

Para confirmar sua presença, acesse o link abaixo:
👇 [link-do-convite]

Com amor e carinho,
Kauã & Kimily ❤️
```

## 📷 Instagram

### **Como Enviar:**

1. Clique no botão azul do Instagram
2. O texto será copiado automaticamente
3. Abra o Instagram
4. Vá para Direct (DM)
5. Escolha o contato
6. Cole a mensagem (Ctrl+V)

### **Dica:**

Você também pode postar nos Stories e marcar os convidados!

## 🔗 Link Direto

Use o botão cinza para copiar apenas o link. Útil para:

- Enviar por SMS
- Compartilhar em grupos
- Postar em redes sociais
- Enviar por email manual

## 🎨 Visual da Página

A página de convite tem:

- **Design elegante** que parece uma carta
- **Cores do tema** azul do casamento
- **Responsivo** para celular
- **Animações** suaves
- **Validação** de formulário
- **Página de sucesso** após confirmação

## 🔧 URLs Geradas

### **Formato:**

- Com token: `https://seusite.com/convite/abc123def456`
- Genérico: `https://seusite.com/convite`

### **Vantagens do Token:**

- Link único para cada convite
- Possibilita rastreamento (futuro)
- Mais profissional

## 📱 Testando

### **Para testar:**

1. Acesse `/convite` diretamente no navegador
2. Preencha o formulário
3. Veja a confirmação
4. Verifique se os dados chegaram no admin

### **URL de Exemplo:**

```
https://seusite.com/convite/xh8k2n7m9p
```

## 🎯 Vantagens

### **WhatsApp:**

- ✅ Mais pessoal e direto
- ✅ Notificação imediata
- ✅ Fácil de reenviar
- ✅ Funciona offline (depois que carrega)

### **Instagram:**

- ✅ Visual e moderno
- ✅ Pode marcar nos Stories
- ✅ Compartilhamento fácil
- ✅ Público mais jovem

### **Comparado ao Email:**

- ✅ Maior taxa de abertura
- ✅ Mais rápido
- ✅ Não vai para spam
- ✅ Interface familiar para todos

## 🚨 Dicas Importantes

1. **Teste sempre** antes de enviar em massa
2. **Personalize** o nome quando possível
3. **Acompanhe** as confirmações no admin
4. **Tenha backup** do link para reenviar se necessário
5. **Configure** o local correto da cerimônia

## 🔄 Próximos Passos

1. ✅ Implementado: Sistema básico
2. 🔄 Sugerido: Salvar tokens no banco
3. 🔄 Sugerido: Dashboard de estatísticas
4. 🔄 Sugerido: Lembretes automáticos
5. 🔄 Sugerido: QR Code para convites impressos

---

💡 **Dúvidas?** Teste primeiro em `/convite` e depois use o admin em `/admin/convidados`!
