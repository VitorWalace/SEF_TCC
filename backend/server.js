// File: backend/server.js

const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const knexConfig = require('./knexfile.js');
const cloudinary = require('./cloudinary'); // Importa a configuração do Cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PUT"]
    }
});

const PORT = 3001;
const db = knex(knexConfig.development);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// --- CONFIGURAÇÃO DE UPLOAD PARA O CLOUDINARY ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'saber-em-fluxo-uploads',
    allowed_formats: ['jpeg', 'png', 'jpg', 'mp4', 'pdf'],
  },
});
const upload = multer({ storage: storage });


// --- LÓGICA DO SOCKET.IO ---
io.on('connection', (socket) => {
    console.log(`Utilizador conectado: ${socket.id}`);
    socket.on('join_room', (room) => socket.join(room));
    socket.on('send_message', (data) => socket.to(data.room).emit('receive_message', data));
    socket.on('disconnect', () => console.log(`Utilizador desconectado: ${socket.id}`));
});


// --- ROTA DE UPLOAD ---
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Nenhum ficheiro foi enviado.' });
  res.status(200).json({ fileUrl: req.file.path });
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
        console.error('Erro no registo:', error);
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


// --- ROTAS DE UTILIZADOR/PERFIL ---
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db('users').where({ id: id }).select('id', 'name', 'email', 'role', 'title', 'bio', 'avatarUrl', 'subjects', 'created_at').first();
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Utilizador não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.put('/api/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, title, bio, subjects } = req.body;
        await db('users').where({ id: id }).update({ name, title, bio, subjects });
        const updatedUser = await db('users').where({ id: id }).select('id', 'name', 'email', 'role', 'title', 'bio', 'avatarUrl', 'subjects', 'created_at').first();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});


// --- ROTAS DE CURSOS (ESTRUTURA DE MÓDULOS E AULAS) ---
app.post('/api/courses', async (req, res) => {
    try {
        const { title, description, instructor_id, course_image_url } = req.body;
        const [newCourse] = await db('courses').insert({
            title,
            description,
            instructor_id,
            course_image_url,
        }).returning('*');
        res.status(201).json(newCourse);
    } catch (error) {
        console.error("Erro ao criar curso:", error);
        res.status(500).json({ message: 'Erro interno ao criar o curso.' });
    }
});

app.post('/api/courses/:courseId/modules', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, order } = req.body;
        const [newModule] = await db('modules').insert({
            title,
            order,
            course_id: parseInt(courseId, 10),
        }).returning('*');
        res.status(201).json(newModule);
    } catch (error) {
        console.error("Erro ao criar módulo:", error);
        res.status(500).json({ message: 'Erro ao criar módulo.' });
    }
});

app.post('/api/modules/:moduleId/lessons', async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { title, content, order } = req.body;
        const [newLesson] = await db('lessons').insert({
            title,
            content,
            order,
            module_id: parseInt(moduleId, 10),
        }).returning('*');
        res.status(201).json(newLesson);
    } catch (error) {
        console.error("Erro ao criar aula:", error);
        res.status(500).json({ message: 'Erro ao criar aula.' });
    }
});

app.get('/api/courses', async (req, res) => {
    try {
        const courses = await db('courses').join('users', 'courses.instructor_id', '=', 'users.id').select('courses.id', 'courses.title', 'courses.description', 'courses.course_image_url', 'courses.created_at', 'users.id as instructor_id', 'users.name as instructor_name');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.get('/api/courses/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await db('courses')
            .join('users', 'courses.instructor_id', 'users.id')
            .where('courses.id', courseId)
            .select('courses.*', 'users.name as instructor_name')
            .first();
            
        if (!course) {
            return res.status(404).json({ message: 'Curso não encontrado.' });
        }
        
        const modules = await db('modules').where({ course_id: courseId }).orderBy('order', 'asc');
        for (const module of modules) {
            module.lessons = await db('lessons').where({ module_id: module.id }).orderBy('order', 'asc');
        }
        course.modules = modules;
        res.status(200).json(course);
    } catch (error) {
        console.error("Erro ao buscar detalhes do curso:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.get('/api/users/:userId/courses', async (req, res) => {
    try {
        const { userId } = req.params;
        const courses = await db('courses').where({ instructor_id: userId });
        res.status(200).json(courses);
    } catch (error) {
        console.error("Erro ao buscar os cursos do utilizador:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});


// --- ROTAS DE INSCRIÇÕES (ENROLLMENTS) ---
app.post('/api/enrollments', async (req, res) => {
    try {
        const { user_id, course_id } = req.body;
        if (!user_id || !course_id) {
            return res.status(400).json({ message: 'ID do utilizador e do curso são obrigatórios.' });
        }
        const [newEnrollment] = await db('enrollments').insert({ user_id, course_id }).returning('*');
        res.status(201).json({ message: 'Inscrição realizada com sucesso!', enrollment: newEnrollment });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'Utilizador já inscrito neste curso.' });
        }
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
            .select('courses.id', 'courses.title', 'courses.description', 'courses.course_image_url', 'instructor.name as instructor_name');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.get('/api/courses/:courseId/enrollment-status/:userId', async (req, res) => {
    try {
        const { courseId, userId } = req.params;
        const enrollment = await db('enrollments').where({ course_id: courseId, user_id: userId }).first();
        res.status(200).json({ isEnrolled: !!enrollment });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});


// --- ROTAS DE NOTIFICAÇÕES ---
app.get('/api/notifications/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await db('notifications').where({ user_id: userId }).orderBy('created_at', 'desc');
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar notificações.' });
    }
});

app.get('/api/notifications/:userId/unread-count', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await db('notifications').where({ user_id: userId, is_read: false }).count('id as unreadCount').first();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao contar notificações.' });
    }
});

app.post('/api/notifications/mark-as-read', async (req, res) => {
    try {
        const { notificationId } = req.body;
        await db('notifications').where({ id: notificationId }).update({ is_read: true });
        res.status(200).json({ message: 'Notificação marcada como lida.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao marcar notificação como lida.' });
    }
});

app.post('/api/notifications/mark-all-as-read/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await db('notifications').where({ user_id: userId, is_read: false }).update({ is_read: true });
        res.status(200).json({ message: 'Todas as notificações marcadas como lidas.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao marcar todas as notificações como lidas.' });
    }
});


// --- ROTAS DE AVALIAÇÕES (REVIEWS) ---
app.post('/api/courses/:courseId/reviews', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { rating, comment, user_id } = req.body;
        if (!rating || !user_id) {
            return res.status(400).json({ message: 'A nota e o ID do utilizador são obrigatórios.' });
        }
        const course = await db('courses').where({ id: courseId }).first();
        if (!course) {
            return res.status(404).json({ message: 'Curso não encontrado.' });
        }
        const [newReview] = await db('reviews').insert({ rating, comment, course_id: courseId, user_id }).returning('*');
        if (course.instructor_id !== user_id) {
            await db('notifications').insert({
                user_id: course.instructor_id,
                type: 'new_review',
                message: `Você recebeu uma nova avaliação de ${rating} estrelas no curso "${course.title}".`,
                link_to: `/courses/${courseId}?tab=reviews`
            });
        }
        res.status(201).json(newReview);
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'Você já avaliou este curso.' });
        }
        res.status(500).json({ message: 'Erro interno ao postar avaliação.' });
    }
});

app.get('/api/courses/:courseId/reviews', async (req, res) => {
    try {
        const { courseId } = req.params;
        const reviews = await db('reviews').join('users', 'reviews.user_id', 'users.id').where('reviews.course_id', courseId).select('reviews.*', 'users.name as author_name').orderBy('reviews.created_at', 'desc');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar avaliações.' });
    }
});


// --- ROTAS DE PERGUNTAS E RESPOSTAS (Q&A) ---
app.get('/api/courses/:courseId/questions', async (req, res) => {
    try {
        const { courseId } = req.params;
        const questions = await db('questions').join('users', 'questions.user_id', 'users.id').where('questions.course_id', courseId).select('questions.*', 'users.name as author_name').orderBy('questions.created_at', 'desc');
        for (const question of questions) {
            question.answers = await db('answers').join('users', 'answers.user_id', 'users.id').where('answers.question_id', question.id).select('answers.*', 'users.name as author_name').orderBy('answers.created_at', 'asc');
        }
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar perguntas.' });
    }
});

app.post('/api/courses/:courseId/questions', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, user_id } = req.body;
        if (!title || !user_id) {
            return res.status(400).json({ message: 'O conteúdo da pergunta e o ID do utilizador são obrigatórios.' });
        }
        const [newQuestion] = await db('questions').insert({ title, course_id: courseId, user_id }).returning('*');
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao postar pergunta.' });
    }
});

app.post('/api/questions/:questionId/answers', async (req, res) => {
    try {
        const { questionId } = req.params;
        const { body, user_id } = req.body;
        if (!body || !user_id) {
            return res.status(400).json({ message: 'O conteúdo da resposta e o ID do utilizador são obrigatórios.' });
        }
        const [newAnswer] = await db('answers').insert({ body, question_id: questionId, user_id }).returning('*');
        res.status(201).json(newAnswer);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao postar resposta.' });
    }
});


// --- ROTAS DE CHAT ---
app.get('/api/chat/conversations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const sentTo = db('messages').where('sender_id', userId).distinct('recipient_id as id');
        const receivedFrom = db('messages').where('recipient_id', userId).distinct('sender_id as id');
        const partnerIds = await sentTo.union(receivedFrom);
        const ids = partnerIds.map(p => p.id);
        const users = await db('users').whereIn('id', ids).select('id', 'name', 'avatarUrl');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar conversas.' });
    }
});

app.get('/api/chat/messages/:user1Id/:user2Id', async (req, res) => {
    try {
        const { user1Id, user2Id } = req.params;
        const messages = await db('messages')
            .where(builder => builder.where('sender_id', user1Id).andWhere('recipient_id', user2Id))
            .orWhere(builder => builder.where('sender_id', user2Id).andWhere('recipient_id', user1Id))
            .orderBy('created_at', 'asc');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar mensagens.' });
    }
});

app.post('/api/chat/messages', async (req, res) => {
    try {
        const { sender_id, recipient_id, body } = req.body;
        if (!sender_id || !recipient_id || !body) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }
        const [newMessage] = await db('messages').insert({ sender_id, recipient_id, body }).returning('*');
        const sender = await db('users').where({ id: sender_id }).first();
        if (sender) {
            await db('notifications').insert({
                user_id: recipient_id,
                type: 'new_message',
                message: `Você recebeu uma nova mensagem de ${sender.name}.`,
                link_to: `/chat/${sender_id}`
            });
        }
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.get('/api/users/search', async (req, res) => {
    try {
        const { q, currentUserId } = req.query;
        if (!q) {
            return res.status(200).json([]);
        }
        const users = await db('users')
            .where('name', 'ilike', `%${q}%`)
            .andWhere('id', '!=', currentUserId)
            .select('id', 'name', 'avatarUrl');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao pesquisar utilizadores.' });
    }
});

app.delete('/api/chat/conversations/:user1Id/:user2Id', async (req, res) => {
    try {
        const { user1Id, user2Id } = req.params;
        await db('messages')
            .where(builder => builder.where('sender_id', user1Id).andWhere('recipient_id', user2Id))
            .orWhere(builder => builder.where('sender_id', user2Id).andWhere('recipient_id', user1Id))
            .del();
        res.status(200).json({ message: 'Conversa excluída com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir conversa.' });
    }
});


// --- ROTAS DE ADMIN ---
app.get('/api/users', async (req, res) => {
    try {
        const users = await db('users').select('id', 'name', 'email', 'role', 'created_at');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar utilizadores.', error });
    }
});

app.get('/api/make-admin/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCount = await db('users').where({ id: id }).update({ role: 'admin' });
        if (updatedCount > 0) {
            res.status(200).send(`Utilizador com ID ${id} agora é admin! Faça logout e login novamente.`);
        } else {
            res.status(404).send(`Utilizador com ID ${id} não encontrado.`);
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao tornar utilizador admin.'});
    }
});

app.delete('/api/courses', async (req, res) => {
    try {
        await db('courses').truncate();
        res.status(200).json({ message: 'Todos os cursos foram deletados com sucesso!' });
    } catch (error) {
        console.error("Erro ao deletar todos os cursos:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});


// --- INICIA O SERVIDOR ---
server.listen(PORT, () => {
  console.log(`Servidor a rodar e a ouvir na porta ${PORT}`);
});