# 🔧 Teste de Conexão - Supabase

## ✅ Verificações Necessárias

### 1. **Tabelas no Supabase**

Verifique se as seguintes tabelas existem no seu projeto Supabase:

```sql
-- Verificar se as tabelas existem
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('convidados', 'acompanhantes', 'presentes', 'fotos');
```

### 2. **Estrutura da Tabela `convidados`**

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'convidados'
ORDER BY ordinal_position;
```

### 3. **Estrutura da Tabela `acompanhantes`**

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'acompanhantes'
ORDER BY ordinal_position;
```

## 🚨 Se as tabelas não existirem:

Execute o script `supabase-setup.sql` no SQL Editor do Supabase:

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá para `SQL Editor`
3. Cole o conteúdo do arquivo `supabase-setup.sql`
4. Execute o script

## 🔧 Configuração das Políticas RLS

Certifique-se de que as políticas estão configuradas corretamente:

```sql
-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('convidados', 'acompanhantes');
```

## 📝 Teste Manual

### 1. **Inserir um convidado de teste:**

```sql
INSERT INTO convidados (nome, email, telefone, confirmado, convite_enviado)
VALUES ('Teste Manual', 'teste@exemplo.com', '(11) 99999-9999', false, false);
```

### 2. **Verificar se foi inserido:**

```sql
SELECT * FROM convidados WHERE email = 'teste@exemplo.com';
```

### 3. **Deletar o teste:**

```sql
DELETE FROM convidados WHERE email = 'teste@exemplo.com';
```

## 🐛 Problemas Comuns

### **Erro de Autenticação:**

- Verifique se as chaves no `environment.ts` estão corretas
- Confirme se o projeto Supabase está ativo

### **Erro de Política RLS:**

- As políticas devem permitir `INSERT`, `SELECT`, `UPDATE`, `DELETE`
- Execute novamente as políticas do `supabase-setup.sql`

### **Erro de Tabela não encontrada:**

- Execute o script completo `supabase-setup.sql`
- Verifique se está executando no schema `public`

## ✨ Teste da Aplicação

### **1. Teste do Admin:**

1. Acesse `/admin/convidados`
2. Tente adicionar um convidado
3. Verifique se aparece na lista

### **2. Teste do Convite:**

1. Acesse `/convite`
2. Preencha o formulário
3. Confirme a presença
4. Verifique se aparece no admin

## 🚀 Status das Funcionalidades

- ✅ **ConvidadosService**: Refatorado para Supabase
- ✅ **Modelo atualizado**: Campos alinhados com banco
- ✅ **Admin Interface**: Botões WhatsApp/Instagram
- ✅ **Página de Convite**: Formulário completo
- ⚠️ **Dados mockados**: Removidos

## 📋 Campos Mapeados

### **Tabela `convidados`:**

- `id` (uuid, PK)
- `nome` (text)
- `email` (text)
- `telefone` (text, nullable)
- `confirmado` (boolean, default false)
- `convite_enviado` (boolean, default false)
- `data_envio_convite` (timestamp, nullable)
- `data_confirmacao` (timestamp, nullable)
- `observacoes` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### **Tabela `acompanhantes`:**

- `id` (uuid, PK)
- `convidado_id` (uuid, FK)
- `nome` (text)
- `confirmado` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

💡 **Se ainda não funcionar**, verifique o console do navegador para erros específicos!
