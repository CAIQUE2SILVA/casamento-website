# Casamento Website

Um site elegante e responsivo para casamentos, construído com Angular.

## Recursos

- Página inicial com contagem regressiva para a data do casamento
- Lista de presentes para os convidados
- RSVP para confirmar presença
- Galeria de fotos
- Painel administrativo para gerenciar convidados, lista de presentes e fotos
- Responsivo para dispositivos móveis e desktop

## Tecnologias

- Angular
- Bootstrap 5
- Supabase (banco de dados e armazenamento de imagens)
- Netlify (hospedagem)

## Requisitos

- Node.js 14+
- Angular CLI 14+

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/casamento-website.git
cd casamento-website
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
   - Copie `src/environments/environment.example.ts` para `src/environments/environment.ts`
   - Edite o arquivo com suas configurações do Supabase

4. Execute o projeto localmente
```bash
ng serve
```

5. Acesse o projeto em `http://localhost:4200`

## Deploy

Veja o arquivo [DEPLOY.md](DEPLOY.md) para instruções detalhadas sobre como implantar o site usando Supabase e Netlify.

## Personalização

### Cores e Tema

O tema do site pode ser facilmente alterado modificando as variáveis CSS em `src/styles.scss`.

### Conteúdo

- Edite os textos no componente correspondente a cada página
- As imagens podem ser substituídas na pasta `src/assets/images/`
- Altere as informações do casal no arquivo `src/app/shared/data/wedding-details.ts`

## Recursos de Administração

O site inclui um painel administrativo protegido por senha (localizado em `/admin`) que permite:

- Gerenciar a lista de convidados
- Adicionar/remover itens da lista de presentes
- Fazer upload de fotos para a galeria

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
