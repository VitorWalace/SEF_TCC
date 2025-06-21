// File: backend/server.js

const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const knexConfig = require('./knexfile.js');

const app = express();
const PORT = 3001;
const db = knex(knexConfig.development);

app.use(cors());
app.use(express.json());

// Torna a pasta 'uploads' pública para que o navegador possa acessar as imagens
app.use('/uploads', express.static('uploads'));

// Configuração do Multer para o armazenamento de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- ROTA DE UPLOAD ---
app.post('/api/upload', upload.single('courseImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Nenhum arquivo foi enviado.' });
  }
  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl: imageUrl });
});


// --- ROTAS DE AUTENTICAÇÃO ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const trimmedEmail = email ? email.trim().toLowerCase() : '';
        const trimmedPassword = password ? password.trim() : '';
        if (!name || !trimmedEmail || !trimmedPassword) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        const [newUserId] = await db('users').insert({ name, email: trimmedEmail, password: hashedPassword });
        const user = await db('users').where({ id: newUserId }).first();
        const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
        res.status(201).json({ user: userData, token: 'jwt_token_simulado_12345' });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const trimmedEmail = email ? email.trim().toLowerCase() : '';
        const trimmedPassword = password ? password.trim() : '';
        if (!trimmedEmail || !trimmedPassword) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }
        const user = await db('users').whereRaw('lower(email) = ?', [trimmedEmail]).first();
        if (!user) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
        const isPasswordCorrect = await bcrypt.compare(trimmedPassword, user.password);
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


// --- ROTAS DE USUÁRIO/PERFIL ---
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db('users')
            .where({ id: id })
            .select('id', 'name', 'email', 'role', 'title', 'bio', 'avatarUrl', 'subjects', 'created_at')
            .first();
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.put('/api/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, title, bio, subjects } = req.body;
        await db('users').where({ id: id }).update({
            name,
            title,
            bio,
            subjects,
        });
        const updatedUser = await db('users')
            .where({ id: id })
            .select('id', 'name', 'email', 'role', 'title', 'bio', 'avatarUrl', 'subjects', 'created_at')
            .first();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});


// --- ROTAS DE CURSOS ---
app.post('/api/courses', async (req, res) => {
    try {
        const { title, description, instructor_id, course_image_url, content } = req.body;
        if (!title || !description || !instructor_id) {
            return res.status(400).json({ message: 'Título, descrição e ID do instrutor são obrigatórios.' });
        }
        const [newCourseId] = await db('courses').insert({
            title,
            description,
            instructor_id,
            course_image_url,
            content,
        });
        res.status(201).json({ message: 'Curso criado com sucesso!', courseId: newCourseId });
    } catch (error) {
        console.error("Erro ao criar curso:", error);
        res.status(500).json({ message: 'Erro interno ao criar o curso.' });
    }
});

app.get('/api/courses', async (req, res) => {
    try {
        const courses = await db('courses')
            .join('users', 'courses.instructor_id', '=', 'users.id')
            .select(
                'courses.id',
                'courses.title',
                'courses.description',
                'courses.course_image_url',
                'courses.created_at',
                'users.name as instructor_name'
            );
        res.status(200).json(courses);
    } catch (error) {
        console.error("Erro ao buscar todos os cursos:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.get('/api/courses/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await db('courses')
            .join('users', 'courses.instructor_id', '=', 'users.id')
            .where('courses.id', courseId)
            .select('courses.*', 'users.name as instructor_name')
            .first();
        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Curso não encontrado.' });
        }
    } catch (error) {
        console.error("Erro ao buscar detalhes do curso:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.put('/api/courses/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, course_image_url, content } = req.body;
        const updatedCount = await db('courses')
            .where({ id: courseId })
            .update({
                title,
                description,
                course_image_url,
                content
            });
        if (updatedCount > 0) {
            const updatedCourse = await db('courses').where({ id: courseId }).first();
            res.status(200).json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Curso não encontrado.' });
        }
    } catch (error) {
        console.error("Erro ao atualizar curso:", error);
        res.status(500).json({ message: 'Erro interno ao atualizar o curso.' });
    }
});

app.get('/api/users/:userId/courses', async (req, res) => {
    try {
        const { userId } = req.params;
        const courses = await db('courses').where({ instructor_id: userId });
        res.status(200).json(courses);
    } catch (error) {
        console.error("Erro ao buscar os cursos do usuário:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.delete('/api/courses/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const deletedCount = await db('courses').where({ id: courseId }).del();
        if (deletedCount > 0) {
            res.status(200).json({ message: 'Curso excluído com sucesso.' });
        } else {
            res.status(404).json({ message: 'Curso não encontrado.' });
        }
    } catch (error) {
        console.error("Erro ao excluir curso:", error);
        res.status(500).json({ message: 'Erro interno ao excluir o curso.' });
    }
});


// --- ROTAS DE INSCRIÇÕES (ENROLLMENTS) ---
app.post('/api/enrollments', async (req, res) => {
    try {
        const { user_id, course_id } = req.body;
        if (!user_id || !course_id) {
            return res.status(400).json({ message: 'ID do usuário e do curso são obrigatórios.' });
        }
        const [newEnrollment] = await db('enrollments').insert({
            user_id,
            course_id,
        }).returning('*');
        res.status(201).json({ message: 'Inscrição realizada com sucesso!', enrollment: newEnrollment });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'Usuário já inscrito neste curso.' });
        }
        console.error("Erro ao criar inscrição:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.get('/api/users/:userId/enrolled-courses', async (req, res) => {
    try {
        const { userId } = req.params;
        const courses = await db('courses')
            .join('enrollments', 'courses.id', '=', 'enrollments.course_id')
            .join('users as instructor', 'courses.instructor_id', '=', 'instructor.id')
            .where('enrollments.user_id', userId)
            .select(
                'courses.id',
                'courses.title',
                'courses.description',
                'courses.course_image_url',
                'instructor.name as instructor_name'
            );
        res.status(200).json(courses);
    } catch (error) {
        console.error("Erro ao buscar cursos inscritos:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.get('/api/courses/:courseId/enrollment-status/:userId', async (req, res) => {
    try {
        const { courseId, userId } = req.params;
        const enrollment = await db('enrollments')
            .where({
                course_id: courseId,
                user_id: userId,
            })
            .first();
        res.status(200).json({ isEnrolled: !!enrollment });
    } catch (error) {
        console.error("Erro ao verificar status de inscrição:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});


// --- ROTAS DE Q&A E REVIEWS ---
app.get('/api/courses/:courseId/reviews', async (req, res) => {
    try {
        const { courseId } = req.params;
        const reviews = await db('reviews')
            .join('users', 'reviews.user_id', 'users.id')
            .where('reviews.course_id', courseId)
            .select('reviews.*', 'users.name as author_name')
            .orderBy('reviews.created_at', 'desc');
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.post('/api/courses/:courseId/reviews', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { rating, comment, user_id } = req.body;
        if (!rating || !user_id) {
            return res.status(400).json({ message: 'A nota e o ID do usuário são obrigatórios.' });
        }
        const [newReview] = await db('reviews').insert({
            rating,
            comment,
            course_id: courseId,
            user_id,
        }).returning('*');
        res.status(201).json(newReview);
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'Você já avaliou este curso.' });
        }
        console.error("Erro ao postar avaliação:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.get('/api/courses/:courseId/questions', async (req, res) => {
    try {
        const { courseId } = req.params;
        const questions = await db('questions')
            .join('users', 'questions.user_id', 'users.id')
            .where('questions.course_id', courseId)
            .select('questions.*', 'users.name as author_name')
            .orderBy('questions.created_at', 'desc');

        for (const question of questions) {
            question.answers = await db('answers')
                .join('users', 'answers.user_id', 'users.id')
                .where('answers.question_id', question.id)
                .select('answers.*', 'users.name as author_name')
                .orderBy('answers.created_at', 'asc');
        }
        res.status(200).json(questions);
    } catch (error) {
        console.error("Erro ao buscar perguntas:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.post('/api/courses/:courseId/questions', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, user_id } = req.body;
        if (!title || !user_id) {
            return res.status(400).json({ message: 'O conteúdo da pergunta e o ID do usuário são obrigatórios.' });
        }
        const [newQuestion] = await db('questions').insert({
            title,
            course_id: courseId,
            user_id,
        }).returning('*');
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error("Erro ao postar pergunta:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.post('/api/questions/:questionId/answers', async (req, res) => {
    try {
        const { questionId } = req.params;
        const { body, user_id } = req.body;
        if (!body || !user_id) {
            return res.status(400).json({ message: 'O conteúdo da resposta e o ID do usuário são obrigatórios.' });
        }
        const [newAnswer] = await db('answers').insert({
            body,
            question_id: questionId,
            user_id,
        }).returning('*');
        res.status(201).json(newAnswer);
    } catch (error) {
        console.error("Erro ao postar resposta:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});


// --- ROTAS DE ADMIN ---
app.get('/api/users', async (req, res) => {
    try {
        const users = await db('users').select('id', 'name', 'email', 'role', 'created_at');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários.', error });
    }
});

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
        res.status(500).json({ message: 'Erro ao tornar usuário admin.'});
    }
});


// --- INICIA O SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});