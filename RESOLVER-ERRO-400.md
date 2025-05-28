# 🚨 Resolvendo Erro 400 - Supabase

## ✅ Verificações Realizadas

O teste de conexão confirmou que:

- ✅ **Credenciais corretas**: URL e chave do Supabase funcionando
- ✅ **Tabela existe**: `convidados` está criada e funcionando
- ✅ **Inserção funciona**: Conseguimos inserir dados diretamente
- ✅ **Estrutura correta**: Campos estão alinhados

## 🔍 Passos para Testar

### 1. **Verificar se o problema persiste**

1. Acesse: `http://localhost:4201/convite`
2. Preencha o formulário de convite
3. Tente confirmar a presença
4. Abra o Console do navegador (F12) para ver os logs

### 2. **Verificar dados enviados**

No console, você deve ver:

```
🔍 Dados que serão enviados: {
  "nome": "Nome do Convidado",
  "email": "email@exemplo.com",
  "telefone": "(11) 99999-9999",
  "confirmado": true,
  "convite_enviado": false,
  "observacoes": null
}
```

### 3. **Verificar resposta do Supabase**

Se der erro, você verá:

```
❌ Erro detalhado do Supabase: { código, mensagem, detalhes }
```

### 4. **Testar admin**

1. Acesse: `http://localhost:4201/admin/convidados`
2. Tente adicionar um convidado pelo painel admin
3. Verifique se funciona

## 🔧 Possíveis Soluções

### **Se o erro 400 persistir:**

#### **Solução 1: Verificar RLS (Row Level Security)**

Execute no SQL Editor do Supabase:

```sql
-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'convidados';

-- Se rowsecurity = true, desabilitar temporariamente
ALTER TABLE public.convidados DISABLE ROW LEVEL SECURITY;
```

#### **Solução 2: Recriar políticas**

```sql
-- Remover políticas existentes
DROP POLICY IF EXISTS "Permitir inserção pública de convidados" ON public.convidados;
DROP POLICY IF EXISTS "Permitir leitura pública de convidados" ON public.convidados;
DROP POLICY IF EXISTS "Permitir atualização pública de convidados" ON public.convidados;
DROP POLICY IF EXISTS "Permitir exclusão pública de convidados" ON public.convidados;

-- Recriar políticas mais permissivas
CREATE POLICY "Allow all for convidados" ON public.convidados
    USING (true) WITH CHECK (true);
```

#### **Solução 3: Verificar constraints**

```sql
-- Verificar se há constraints que podem estar causando problemas
SELECT
    conname,
    contype,
    conkey,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.convidados'::regclass;
```

### **Se nada funcionar:**

#### **Solução 4: Recriar tabela**

```sql
-- Backup dados existentes (se houver)
CREATE TABLE convidados_backup AS SELECT * FROM convidados;

-- Dropar e recriar tabela
DROP TABLE IF EXISTS public.convidados CASCADE;

CREATE TABLE public.convidados (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome text NOT NULL,
    email text NOT NULL,
    telefone text,
    confirmado boolean DEFAULT false,
    convite_enviado boolean DEFAULT false,
    data_envio_convite timestamp with time zone,
    data_confirmacao timestamp with time zone,
    observacoes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.convidados ENABLE ROW LEVEL SECURITY;

-- Criar política permissiva
CREATE POLICY "Allow all for convidados" ON public.convidados
    USING (true) WITH CHECK (true);
```

## 📋 Checklist de Verificação

- [ ] Console do navegador mostra dados enviados
- [ ] Erro 400 ainda acontece?
- [ ] Testou pelo admin também?
- [ ] RLS está configurado corretamente?
- [ ] Políticas permitem inserção?
- [ ] Constraints não estão bloqueando?

## 🆘 Se nada resolver

1. **Exportar dados atuais** (se houver)
2. **Executar script completo** `supabase-setup.sql`
3. **Verificar no Supabase Dashboard** se as tabelas foram criadas
4. **Testar novamente**

## 📞 Debug Adicional

Se quiser mais logs, altere no `supabase.service.ts`:

```typescript
async adicionarConvidado(convidado: any) {
  console.log('🔍 URL:', this.supabase.supabaseUrl);
  console.log('🔍 Dados:', convidado);

  const { data, error } = await this.supabase
    .from('convidados')
    .insert(convidado)
    .select()
    .single();

  console.log('🔍 Resposta:', { data, error });

  // resto do código...
}
```

---

💡 **Lembre-se**: O teste direto funcionou, então o problema deve estar na aplicação Angular ou configuração RLS!
