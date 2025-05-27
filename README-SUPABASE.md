# Configuração do Supabase para o Site de Casamento

## Problemas Atuais

Você está enfrentando erros 404 porque as tabelas `presentes` e `fotos` não existem no seu banco de dados Supabase.

## Solução

### 1. Acesse o Painel do Supabase

1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Acesse o projeto: `vvrsjznlpzklfizdxqmj`

### 2. Execute o Script SQL

1. No painel do Supabase, vá para **SQL Editor**
2. Copie e cole o conteúdo do arquivo `supabase-setup.sql`
3. Execute o script clicando em **Run**

### 3. Verificar as Tabelas Criadas

Após executar o script, você deve ter as seguintes tabelas:

- **presentes**: Para gerenciar a lista de presentes
- **fotos**: Para gerenciar a galeria de fotos
- **convidados**: Para gerenciar os convidados
- **acompanhantes**: Para gerenciar os acompanhantes dos convidados

### 4. Verificar o Bucket de Storage

O script também cria um bucket chamado `produtos-fotos` para armazenar as imagens.

## Estrutura das Tabelas

### Tabela `presentes`

```sql
- id (uuid, primary key)
- nome (text, not null)
- descricao (text)
- preco (numeric, not null)
- reservado (boolean, default false)
- reservado_por (text)
- imagem (text)
- link (text)
- data_reserva (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

### Tabela `fotos`

```sql
- id (uuid, primary key)
- titulo (text, not null)
- descricao (text)
- url (text, not null)
- created_at (timestamp)
- updated_at (timestamp)
```

### Tabela `convidados`

```sql
- id (uuid, primary key)
- nome (text, not null)
- email (text, not null)
- telefone (text)
- confirmado (boolean, default false)
- convite_enviado (boolean, default false)
- observacoes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Tabela `acompanhantes`

```sql
- id (uuid, primary key)
- convidado_id (uuid, foreign key)
- nome (text, not null)
- confirmado (boolean, default false)
- created_at (timestamp)
- updated_at (timestamp)
```

## Funcionalidades Implementadas

### Presentes

- ✅ Listar presentes
- ✅ Adicionar novos presentes
- ✅ **Editar presentes existentes** (NOVO!)
- ✅ Excluir presentes
- ✅ Reservar presentes

### Fotos

- ✅ Upload de fotos
- ✅ Listar fotos na galeria
- ✅ Excluir fotos

### Convidados

- ✅ Gerenciar lista de convidados
- ✅ Adicionar acompanhantes
- ✅ Confirmar presenças

## Melhorias na Interface de Presentes

- **Botão de Editar**: Agora cada presente tem um botão de editar
- **Formulário Dinâmico**: O mesmo formulário serve para adicionar e editar
- **Feedback Visual**: Linha destacada quando um presente está sendo editado
- **Melhor UX**: Botões organizados e tooltips informativos

## Próximos Passos

1. Execute o script SQL no Supabase
2. Teste o upload de fotos
3. Teste a funcionalidade de editar presentes
4. Adicione alguns presentes de exemplo

## Suporte

Se ainda houver problemas após executar o script SQL, verifique:

1. Se as políticas RLS estão configuradas corretamente
2. Se o bucket `produtos-fotos` foi criado
3. Se as tabelas têm as colunas corretas
