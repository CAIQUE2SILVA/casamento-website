# Configuração do EmailJS para Envio de Convites

## 📧 Passo a Passo para Configurar o EmailJS

### 1. Criar Conta no EmailJS

1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clique em **"Sign Up"** e crie sua conta gratuita
3. Confirme seu email

### 2. Configurar Serviço de Email

1. No painel do EmailJS, vá para **"Email Services"**
2. Clique em **"Add New Service"**
3. Escolha seu provedor de email (Gmail, Outlook, etc.)
4. Configure as credenciais do seu email
5. Anote o **Service ID** gerado

### 3. Criar Template de Email

1. Vá para **"Email Templates"**
2. Clique em **"Create New Template"**
3. Use o conteúdo do arquivo `emailjs-template.html` como base
4. Configure as variáveis do template:

   - `{{to_name}}` - Nome do convidado
   - `{{to_email}}` - Email do convidado
   - `{{wedding_date}}` - Data do casamento
   - `{{wedding_location}}` - Local do casamento
   - `{{confirmation_link}}` - Link para confirmação
   - `{{couple_names}}` - Nomes dos noivos
   - `{{sender_name}}` - Nome dos remetentes
   - `{{current_year}}` - Ano atual

5. Anote o **Template ID** gerado

### 4. Obter Chave Pública

1. Vá para **"Account"** > **"General"**
2. Copie sua **Public Key**

### 5. Configurar no Projeto

Edite o arquivo `src/app/services/emailjs.service.ts` e substitua:

```typescript
private readonly PUBLIC_KEY = 'SUA_CHAVE_PUBLICA_AQUI';
private readonly SERVICE_ID = 'SEU_SERVICE_ID_AQUI';
private readonly TEMPLATE_ID = 'SEU_TEMPLATE_ID_AQUI';
```

Por suas chaves reais:

```typescript
private readonly PUBLIC_KEY = 'sua_public_key_real';
private readonly SERVICE_ID = 'seu_service_id_real';
private readonly TEMPLATE_ID = 'seu_template_id_real';
```

## 🎨 Template de Email Personalizado

O template criado tem as seguintes características:

- **Design elegante** com gradientes azuis
- **Layout responsivo** para mobile e desktop
- **Tipografia sofisticada** com Google Fonts
- **Elementos decorativos** como ícones e ornamentos
- **Botão de confirmação** destacado
- **Assinatura personalizada** dos noivos

### Variáveis do Template

| Variável            | Descrição             | Exemplo                                  |
| ------------------- | --------------------- | ---------------------------------------- |
| `to_name`           | Nome do convidado     | "João Silva"                             |
| `to_email`          | Email do convidado    | "joao@email.com"                         |
| `wedding_date`      | Data do casamento     | "19 de Novembro de 2024"                 |
| `wedding_location`  | Local da cerimônia    | "Igreja São José - Centro"               |
| `confirmation_link` | Link para confirmação | "https://seusite.com/confirmacao?id=123" |
| `couple_names`      | Nomes dos noivos      | "Kauã & Kimily"                          |
| `sender_name`       | Remetente             | "Kauã & Kimily"                          |
| `current_year`      | Ano atual             | "2024"                                   |

## 🚀 Funcionalidades Implementadas

### No Componente de Convidados

1. **Envio Individual**: Botão para enviar convite para um convidado específico
2. **Envio em Lote**: Botão para enviar convites para todos os convidados pendentes
3. **Status Visual**: Badges mostrando se o convite foi enviado ou está pendente
4. **Validação**: Verificação se o EmailJS está configurado
5. **Feedback**: Alertas e spinners durante o envio

### Controles de Segurança

- Verificação se o convite já foi enviado
- Validação da configuração do EmailJS
- Tratamento de erros com mensagens amigáveis
- Delay entre envios em lote para não sobrecarregar o serviço

## 📊 Estatísticas

O dashboard agora mostra:

- **Total de Convidados**: Principais + acompanhantes
- **Presenças Confirmadas**: Confirmações recebidas
- **Presenças Pendentes**: Aguardando confirmação
- **Convites Enviados**: Quantos convites foram enviados por email

## 🔧 Personalização

### Alterar Data e Local do Casamento

No arquivo `src/app/admin/convidados/convidados.component.ts`, linha ~580:

```typescript
const dadosConvite: ConviteEmailData = {
  to_name: convidado.nome,
  to_email: convidado.email,
  wedding_date: "19 de Novembro de 2024", // ← Altere aqui
  wedding_location: "Local da Cerimônia - Endereço Completo", // ← Altere aqui
  confirmation_link: `${window.location.origin}/confirmacao?id=${convidado.id}`,
  couple_names: "Kauã & Kimily",
};
```

### Personalizar Template

1. Edite o arquivo `emailjs-template.html`
2. Ajuste cores, fontes e layout conforme desejado
3. Copie o HTML atualizado para o template no EmailJS

## 🎯 Próximos Passos

1. **Configure o EmailJS** seguindo os passos acima
2. **Execute o script SQL** no Supabase para criar as tabelas
3. **Teste o envio** com um convidado de teste
4. **Personalize o template** conforme sua preferência
5. **Configure a página de confirmação** para os convidados

## 📝 Notas Importantes

- O EmailJS tem limite de 200 emails/mês no plano gratuito
- Para mais emails, considere upgradar para um plano pago
- Teste sempre com emails reais antes de enviar para todos
- Mantenha suas chaves seguras e não as compartilhe publicamente
