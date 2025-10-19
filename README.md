# 🚀 API de Gerenciamento de Usuários e Posts

Uma API REST simples e funcional desenvolvida com Node.js, Express e Prisma ORM para gerenciamento básico de usuários (CRUD) e seus respectivos posts.

## 🛠️ Tecnologias Utilizadas

* **Node.js**: Plataforma de execução do código.
* **Express**: Framework web para Node.js, usado para roteamento e middlewares.
* **Prisma ORM**: ORM (Object-Relational Mapper) moderno para acesso ao banco de dados.

## ✨ Funcionalidades

A API oferece os seguintes endpoints:

### Usuários

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/users` | Lista todos os usuários. Suporta **filtros** por `name`, **ordenação** por `sort` (padrão: `name`), `order` (padrão: `asc`), e **paginação** com `skip` e `take`. |
| `GET` | `/users/count` | Retorna a quantidade total de usuários cadastrados. |
| `POST` | `/user` | Cria um novo usuário. Requer `name`, `email` (único) e `phone` no corpo da requisição. |
| `PUT` | `/user/:id` | Atualiza um usuário existente pelo `id`. Requer `name`, `email` ou `phone` no corpo da requisição. |
| `DELETE` | `/user/:id` | Deleta um usuário existente pelo `id`. |
| `GET` | `/user/:id/posts` | Lista todos os posts criados por um usuário específico. |

### Posts

| Método | Endpoint | Descrição |
| :---   | :---    | :--- |
| `POST` | `/post` | Cria um novo post. Requer `title`, `content` e `userId` (ID do usuário autor) no corpo da requisição. |

## ⚙️ Configuração e Execução

### Pré-requisitos

* [Node.js](https://nodejs.org/en/)
* [Prisma CLI](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql#install-prisma-cli)
* Banco de Dados configurado (por exemplo, PostgreSQL, MySQL, SQLite, etc.) conforme a `DATABASE_URL` no seu arquivo `.env` e `schema.prisma`.

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone [LINK_DO_SEU_REPOSITORIO]
    cd [NOME_DA_PASTA]
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure o Banco de Dados:**
    * Crie um arquivo `.env` na raiz do projeto e configure a variável `DATABASE_URL` com as credenciais do seu banco de dados.

4.  **Execute as Migrações do Prisma:**
    * Isso criará as tabelas de `User` e `Post` no seu banco de dados.
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Inicie o Servidor:**
    ```bash
    node [NOME_DO_ARQUIVO_PRINCIPAL].js
    # (Exemplo: node server.js)
    ```

O servidor estará rodando em `http://localhost:8080`.

## 🔬 Exemplos de Requisição

Você pode usar ferramentas como Insomnia ou Postman para testar os endpoints.

### 1. Criar um Usuário (`POST /user`)

**Body (JSON):**
```json
{
    "name": "João Silva",
    "email": "joao.silva@exemplo.com",
    "phone": "999999999"
}