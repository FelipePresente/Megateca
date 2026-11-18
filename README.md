# Megateca API

API REST para gerenciamento de uma livraria. Permite cadastrar, listar, atualizar e remover livros, associando cada livro a um autor e a um gênero (relacionamento 1:N entre Autor → Livros e Gênero → Livros).

O sistema resolve o problema de organizar o acervo de uma livraria, mantendo o catálogo de livros vinculado aos seus respectivos autores e gêneros, com validação e sanitização de dados por meio de middlewares.

## Integrantes do Grupo

- Nome Completo 1
- Nome Completo 2

## Tecnologias Utilizadas

- Node.js + NestJS (TypeScript)
- Prisma ORM + PostgreSQL
- Postman (Testes de API)
- JWT + bcryptjs (autenticação)

## Como Rodar o Projeto

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd Megateca
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
   - Crie o banco `megateca_db` no PostgreSQL.
   - Ajuste o `DATABASE_URL` em `server/.env` se necessário.
   - Execute as migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Inicie o servidor:
```bash
npm run dev:server
# ou
npm start
```

O servidor ficará disponível em `http://localhost:8000` (cliente em `http://localhost:5173`).

## Rotas Principais da API

Base: `http://localhost:8000`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/books` | Lista todos os livros (inclui autor e gênero) |
| `GET` | `/books/:id` | Busca um livro por ID |
| `POST` | `/books` | Cadastra um novo livro |
| `PUT` | `/books/:id` | Atualiza um livro existente |
| `DELETE` | `/books/:id` | Remove um livro |

Exemplo de corpo para `POST /books`:
```json
{
  "title": "Dom Casmurro",
  "units": 10,
  "year": "2000-01-01T00:00:00.000Z",
  "authorId": 1,
  "genreId": "uuid-do-genero"
}
```

## Middlewares de Segurança

- `LoggerMiddleware`: registra no terminal todas as requisições recebidas (`[data] METHOD URL`).
- `ValidarDadosMiddleware`: valida e sanitiza os campos obrigatórios antes de salvar via Prisma (título com ≥ 5 caracteres, authorId e genreId obrigatórios).
- `ValidarIdMiddleware`: protege rotas `GET /:id`, `PUT /:id` e `DELETE /:id` contra IDs inválidos.

## Testes no Postman

A collection exportada está em `collection-postman.json`. Ela contém requisições para POST, GET (todos e por ID), PUT, DELETE e testes de erro (dados inválidos / ID inválido), que retornam `400 Bad Request`.

Importar no Postman:
1. Abra o Postman → Collections → Importar
2. Selecione `collection-postman.json`

## Publicação no Git

```bash
git init
git add .
git commit -m "Versao final da API com middlewares, README e collection do Postman"
git branch -M main
git remote add origin <LINK_DO_SEU_REPOSITORIO_NO_GITHUB>
git push -u origin main
```

## Licença

Este projeto está sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
