-- Script para criar as tabelas necessárias no Supabase

-- Criar tabela de presentes
CREATE TABLE IF NOT EXISTS public.presentes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome text NOT NULL,
    descricao text,
    preco numeric NOT NULL,
    reservado boolean DEFAULT false,
    reservado_por text,
    imagem text,
    link text,
    data_reserva timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de fotos
CREATE TABLE IF NOT EXISTS public.fotos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo text NOT NULL,
    descricao text,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de convidados
CREATE TABLE IF NOT EXISTS public.convidados (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome text NOT NULL,
    email text NOT NULL,
    telefone text,
    confirmado boolean DEFAULT false,
    convite_enviado boolean DEFAULT false,
    observacoes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de acompanhantes
CREATE TABLE IF NOT EXISTS public.acompanhantes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    convidado_id uuid REFERENCES public.convidados(id) ON DELETE CASCADE,
    nome text NOT NULL,
    confirmado boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.presentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.convidados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acompanhantes ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso público (você pode ajustar conforme necessário)
CREATE POLICY "Permitir leitura pública de presentes" ON public.presentes
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de presentes" ON public.presentes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de presentes" ON public.presentes
    FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão pública de presentes" ON public.presentes
    FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de fotos" ON public.fotos
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de fotos" ON public.fotos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de fotos" ON public.fotos
    FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão pública de fotos" ON public.fotos
    FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de convidados" ON public.convidados
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de convidados" ON public.convidados
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de convidados" ON public.convidados
    FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão pública de convidados" ON public.convidados
    FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de acompanhantes" ON public.acompanhantes
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de acompanhantes" ON public.acompanhantes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de acompanhantes" ON public.acompanhantes
    FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão pública de acompanhantes" ON public.acompanhantes
    FOR DELETE USING (true);

-- Criar bucket para armazenamento de imagens (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos-fotos', 'produtos-fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Criar política para o bucket
CREATE POLICY "Permitir upload público" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'produtos-fotos');

CREATE POLICY "Permitir leitura pública" ON storage.objects
    FOR SELECT USING (bucket_id = 'produtos-fotos');

CREATE POLICY "Permitir exclusão pública" ON storage.objects
    FOR DELETE USING (bucket_id = 'produtos-fotos');
