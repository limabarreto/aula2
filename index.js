import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());

// ============================
// GET /users -> lista todos os usuários, com filtros opcionais
// ============================
app.get("/users", async (req, res) => {
    try {
        const { name, sort = "name", order = "asc", skip = 0, take = 100 } = req.query;

        // Busca usuários, permite filtro por nome, ordenação e paginação
        const users = await prismaClient.user.findMany({
            where: name ? { name: { contains: name, mode: "insensitive" } } : {},
            orderBy: { [sort]: order },
            skip: parseInt(skip),
            take: parseInt(take),
        });

        return res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

// ============================
// GET /users/count -> retorna a quantidade total de usuários
// ============================
app.get("/users/count", async (req, res) => {
    try {
        const count = await prismaClient.user.count();
        return res.json({ count });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao contar usuários" });
    }
});

// ============================
// POST /user -> cria um novo usuário
// ============================
app.post("/user", async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const existingUser = await prismaClient.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email já cadastrado" });

        const user = await prismaClient.user.create({ data: { name, email, phone } });
        return res.status(201).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao criar usuário" });
    }
});

// ============================
// PUT /user/:id -> atualiza usuário
// ============================
app.put("/user/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    try {
        const userExist = await prismaClient.user.findUnique({ where: { id } });
        if (!userExist) return res.status(404).json("Usuário não encontrado");

        const user = await prismaClient.user.update({
            where: { id },
            data: { name, email, phone },
        });
        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

// ============================
// DELETE /user/:id -> deleta usuário
// ============================
app.delete("/user/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const userExist = await prismaClient.user.findUnique({ where: { id } });
        if (!userExist) return res.status(404).json("Usuário não encontrado");

        await prismaClient.user.delete({ where: { id } });
        return res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao deletar usuário" });
    }
});

// ============================
// POST /post -> cria um post para um usuário
// ============================
app.post("/post", async (req, res) => {
    const { title, content, userId } = req.body;

    try {
        // Verifica se usuário existe
        const userExist = await prismaClient.user.findUnique({ where: { id: userId } });
        if (!userExist) return res.status(404).json("Usuário não encontrado");

        const post = await prismaClient.post.create({ data: { title, content, userId } });
        return res.status(201).json(post);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao criar post" });
    }
});

// ============================
// GET /user/:id/posts -> lista todos os posts de um usuário
// ============================
app.get("/user/:id/posts", async (req, res) => {
    const { id } = req.params;

    try {
        const userWithPosts = await prismaClient.user.findUnique({
            where: { id },
            include: { posts: true },
        });

        if (!userWithPosts) return res.status(404).json("Usuário não encontrado");
        return res.json(userWithPosts.posts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao buscar posts" });
    }
});

// ============================
// Inicialização do servidor
// ============================
app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});

/*
💡 Comentários gerais:

- Cada rota está comentada ou nomeada para explicar o que faz.
- CRUD de usuários (GET, POST, PUT, DELETE) usando Prisma ORM.
- Novas funcionalidades adicionadas:
  1. Criação de posts vinculados a um usuário.
  2. Listagem de posts de um usuário específico.
  3. Busca de usuários por nome (query params), com ordenação e paginação.
  4. Endpoint para contar usuários.
- Tratamento de erros com try/catch para evitar crash do servidor.
*/
