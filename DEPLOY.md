# Guia de Implantação do Site de Casamento

Este guia contém instruções para configurar e implantar o site de casamento usando Supabase para armazenamento de dados/imagens e Netlify para hospedagem.

## 1. Configuração do Supabase

### 1.1 Criar uma conta no Supabase

1. Acesse [supabase.com](https://supabase.com) e clique em "Start your project"
2. Faça login com sua conta GitHub ou crie uma conta
3. Crie um novo projeto, dando um nome (ex: "casamento-website")
4. Anote a URL e a chave anônima (anon key) para usar na configuração

### 1.2 Configurar o banco de dados

No Supabase, você precisará criar as seguintes tabelas:

#### Tabela `fotos`

```sql
CREATE TABLE fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  url TEXT NOT NULL,
  caminho_storage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabela `presentes`

```sql
CREATE TABLE presentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL,
  imagem TEXT,
  link TEXT,
  reservado BOOLEAN DEFAULT FALSE,
  reservado_por TEXT,
  data_reserva TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabela `convidados`

```sql
CREATE TABLE convidados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  observacoes TEXT,
  confirmado BOOLEAN DEFAULT FALSE,
  convite_enviado BOOLEAN DEFAULT FALSE,
  data_confirmacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabela `acompanhantes`

```sql
CREATE TABLE acompanhantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  convidado_id UUID REFERENCES convidados(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  confirmado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.3 Configurar Storage

1. No Supabase Dashboard, acesse "Storage" 
2. Crie um novo bucket chamado "casamento-fotos"
3. Configure as permissões do bucket para permitir acesso público às imagens:
   - Vá para a aba "Policies"
   - Adicione uma nova policy para permitir leitura pública
   - Use a seguinte policy: `(bucket_id = 'casamento-fotos'::text)`

## 2. Configuração do Ambiente

Atualize os arquivos de ambiente com suas credenciais do Supabase:

### 2.1 Arquivo `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  supabase: {
    url: 'https://SEU-ID.supabase.co',
    key: 'SUA-CHAVE-ANON-KEY',
    bucketName: 'casamento-fotos'
  }
};
```

### 2.2 Arquivo `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.seusite.com/api',
  supabase: {
    url: 'https://SEU-ID.supabase.co',
    key: 'SUA-CHAVE-ANON-KEY',
    bucketName: 'casamento-fotos'
  }
};
```

## 3. Implantação no Netlify

### 3.1 Conectar ao GitHub (recomendado)

1. Crie um repositório no GitHub para o seu projeto
2. Faça push do código para o repositório
3. Acesse [netlify.com](https://netlify.com) e crie uma conta ou faça login
4. Clique em "New site from Git"
5. Escolha GitHub e selecione o repositório
6. Configure as opções de build:
   - Build command: `ng build`
   - Publish directory: `dist/casamento-website`
7. Clique em "Deploy site"

### 3.2 Deploy manual

Se preferir fazer o deploy manual:

1. Construa o projeto: `ng build`
2. Instale a CLI do Netlify: `npm install -g netlify-cli`
3. Faça login no Netlify: `netlify login`
4. Inicie o deploy: `netlify deploy --prod`
5. Quando solicitado, especifique a pasta `dist/casamento-website`

## 4. Solução de Problemas

### 4.1 Problemas de CORS

Se encontrar problemas de CORS ao acessar o Supabase, verifique:

1. No Supabase, vá para Authentication > URL Configuration
2. Adicione seu domínio do Netlify à lista de URLs permitidas

### 4.2 Problemas de Navegação

Se tiver problemas com rotas não funcionando (404 em rotas específicas):

1. Verifique se o arquivo `netlify.toml` está configurado corretamente
2. Certifique-se de que o redirecionamento para `index.html` está funcionando

## 5. Manutenção

Para atualizar o site após a implantação inicial:

1. Faça suas alterações no código
2. Se estiver usando GitHub, apenas faça push das alterações para o repositório, e o Netlify fará o deploy automaticamente
3. Se estiver usando deploy manual, execute novamente os comandos de build e deploy 
