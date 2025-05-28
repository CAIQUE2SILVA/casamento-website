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
    data_envio_convite timestamp with time zone,
    data_confirmacao timestamp with time zone,
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

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO public.presentes (nome, descricao, preco, imagem, link) VALUES
('Jogo de Panelas', 'Jogo de panelas antiaderente 5 peças', 299.90, 'https://via.placeholder.com/300x200', 'https://exemplo.com/panelas'),
('Liquidificador', 'Liquidificador 3 velocidades 2L', 149.90, 'https://via.placeholder.com/300x200', 'https://exemplo.com/liquidificador'),
('Conjunto de Taças', 'Conjunto 6 taças de cristal para vinho', 89.90, 'https://via.placeholder.com/300x200', 'https://exemplo.com/tacas');

INSERT INTO public.fotos (titulo, descricao, url) VALUES
('Ensaio Pré-Wedding', 'Fotos do ensaio romântico no parque', 'https://via.placeholder.com/800x600'),
('Pedido de Casamento', 'O momento especial do pedido', 'https://via.placeholder.com/800x600'),
('Preparativos', 'Preparativos para o grande dia', 'https://via.placeholder.com/800x600');

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_presentes_updated_at BEFORE UPDATE ON public.presentes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_fotos_updated_at BEFORE UPDATE ON public.fotos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_convidados_updated_at BEFORE UPDATE ON public.convidados FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_acompanhantes_updated_at BEFORE UPDATE ON public.acompanhantes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
