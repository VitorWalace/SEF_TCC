// File: backend/server.js (Versão Completa com TODAS as rotas)

const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const knexConfig = require('./knexfile.js');

const app = express();
const PORT = 3001;
const db = knex(knexConfig.development);

app.use(cors());
app.use(express.json());

// --- ROTAS DE AUTENTICAÇÃO ---

// Rota de Cadastro
app.post('/api/auth/register', async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
        const password = req.body.password ? req.body.password.trim() : '';
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [newUserId] = await db('users').insert({ name, email, password: hashedPassword });
        const user = await db('users').where({ id: newUserId }).first();
        const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
        res.status(201).json({ user: userData, token: 'jwt_token_simulado_12345' });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// Rota de Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
        const password = req.body.password ? req.body.password.trim() : '';
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }
        const user = await db('users').whereRaw('lower(email) = ?', [email]).first();
        if (!user) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
        const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
        res.status(200).json({ user: userData, token: 'jwt_token_simulado_12345' });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});


// --- ROTAS DE ADMIN ---

// Rota para o Admin ver os usuários
app.get('/api/users', async (req, res) => {
    try {
        const users = await db('users').select('id', 'name', 'email', 'role', 'created_at', 'updated_at');
        res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: 'Erro ao buscar usuários.', error });
    }
});

// Rota temporária para tornar um usuário admin
app.get('/api/make-admin/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCount = await db('users').where({ id: id }).update({ role: 'admin' });
        if (updatedCount > 0) {
            res.status(200).send(`Usuário com ID ${id} agora é admin! Faça logout e login novamente.`);
        } else {
            res.status(404).send(`Usuário com ID ${id} não encontrado.`);
        }
    } catch (error) {
        console.error("Erro ao tornar usuário admin:", error);
        res.status(500).json({ message: 'Erro ao tornar usuário admin.' });
    }
});


// --- INICIA O SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});