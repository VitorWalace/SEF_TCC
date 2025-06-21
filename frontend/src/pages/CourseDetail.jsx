// File: frontend/src/pages/CourseDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { BookOpenIcon, ChatBubbleLeftRightIcon, StarIcon, CheckCircleIcon } from '../components/icons';
import ReactMarkdown from 'react-markdown';

// Componente para o botão de inscrição, que muda de estado
const EnrollmentButton = ({ isEnrolled, onEnroll, disabled }) => {
    if (isEnrolled) {
        return (
            <div className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-100 text-green-800 font-semibold rounded-lg">
                <CheckCircleIcon className="w-6 h-6" />
                <span>Você está inscrito!</span>
            </div>
        );
    }

    return (
        <button
            onClick={onEnroll}
            disabled={disabled}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Inscrever-se no Curso
        </button>
    );
};


// Componente para renderizar as estrelas de avaliação
const StarRating = ({ rating, onRating, readOnly = false }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    className={`w-6 h-6 ${readOnly ? '' : 'cursor-pointer'} ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} ${readOnly ? '' : 'hover:text-yellow-300'}`}
                    onClick={() => !readOnly && onRating(star)}
                />
            ))}
        </div>
    );
};

function CourseDetail() {
    const { courseId } = useParams();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [questions, setQuestions] = useState([]);
    
    // Estados para os formulários
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('content');

    const fetchData = async () => {
        if (!user || !courseId) return;
        try {
            const courseRes = await api.get(`/api/courses/${courseId}`);
            setCourse(courseRes.data);

            const enrollmentRes = await api.get(`/api/courses/${courseId}/enrollment-status/${user.id}`);
            setIsEnrolled(enrollmentRes.data.isEnrolled);

            const reviewsRes = await api.get(`/api/courses/${courseId}/reviews`);
            setReviews(reviewsRes.data);

            const questionsRes = await api.get(`/api/courses/${courseId}/questions`);
            setQuestions(questionsRes.data);

        } catch (err) {
            setError('Não foi possível carregar os dados do curso.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId, user]);

    const handleEnroll = async () => {
        try {
            await api.post('/api/enrollments', {
                user_id: user.id,
                course_id: courseId
            });
            setIsEnrolled(true);
            alert('Inscrição realizada com sucesso!');
        } catch (err) {
            console.error("Erro ao se inscrever:", err);
            alert(err.response?.data?.message || "Não foi possível realizar a inscrição.");
        }
    };

    const handlePostReview = async (e) => {
        e.preventDefault();
        if (newRating === 0 || !user) {
            alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
            return;
        }
        try {
            await api.post(`/api/courses/${courseId}/reviews`, {
                rating: newRating,
                comment: newComment,
                user_id: user.id
            });
            setNewRating(0);
            setNewComment('');
            fetchData();
        } catch (err) {
            console.error("Erro ao postar avaliação:", err);
            alert(err.response?.data?.message || "Não foi possível enviar sua avaliação.");
        }
    };

    const handlePostQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestion.trim() || !user) return;
        try {
            await api.post(`/api/courses/${courseId}/questions`, { title: newQuestion, user_id: user.id });
            setNewQuestion('');
            fetchData();
        } catch (err) {
            alert("Não foi possível enviar sua pergunta.");
        }
    };

    const handlePostAnswer = async (e, questionId) => {
        e.preventDefault();
        const answerBody = newAnswer[questionId];
        if (!answerBody || !answerBody.trim() || !user) return;
        try {
            await api.post(`/api/questions/${questionId}/answers`, { body: answerBody, user_id: user.id });
            setNewAnswer(prev => ({ ...prev, [questionId]: '' }));
            fetchData();
        } catch (err) {
            alert("Não foi possível enviar sua resposta.");
        }
    };

    const handleAnswerInputChange = (questionId, value) => {
        setNewAnswer(prev => ({ ...prev, [questionId]: value }));
    };

    if (loading) { return <Layout pageTitle="Carregando..."><div>Carregando...</div></Layout>; }
    if (error) { return <Layout pageTitle="Erro"><div className="text-red-500">{error}</div></Layout>; }
    if (!course) { return <Layout pageTitle="Não Encontrado"><div>Curso não encontrado.</div></Layout>; }

    // --- LINHA DE DEPURAÇÃO ---
    console.log(`DEBUG: ID do Usuário Logado: ${user?.id}, ID do Instrutor do Curso: ${course?.instructor_id}`);
    const isInstructor = user?.id === course.instructor_id;

    const TabButton = ({ tabName, label, icon: Icon }) => (
        <button onClick={() => setActiveTab(tabName)} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${ activeTab === tabName ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100' }`}>
            <Icon className="w-5 h-5 mr-2" />
            {label}
        </button>
    );

    return (
        <Layout pageTitle={course.title}>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <img className="h-64 w-full object-cover" src={course.course_image_url || 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070'} alt={`Capa de ${course.title}`} />
                    <div className="p-6 md:flex md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{course.title}</h1>
                            <p className="text-md lg:text-lg text-gray-600 mt-2">Criado por: {course.instructor_name}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            {!isInstructor && (
                                <EnrollmentButton 
                                    isEnrolled={isEnrolled} 
                                    onEnroll={handleEnroll} 
                                    disabled={isEnrolled}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <TabButton tabName="content" label="Conteúdo" icon={BookOpenIcon} />
                        <TabButton tabName="reviews" label="Avaliações" icon={StarIcon} />
                        <TabButton tabName="qna" label="Perguntas" icon={ChatBubbleLeftRightIcon} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    {activeTab === 'content' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sobre este Curso</h2>
                            <div className="prose max-w-none text-gray-700 mb-8"><p>{course.description || "Nenhuma descrição disponível."}</p></div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Conteúdo Principal</h2>
                            <div className="prose max-w-none text-gray-700"><ReactMarkdown>{course.content || "Nenhum conteúdo disponível."}</ReactMarkdown></div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Avaliações</h2>
                            {!isInstructor && isEnrolled && (
                                <form onSubmit={handlePostReview} className="mb-8 p-4 border rounded-lg bg-gray-50">
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">Deixe sua avaliação</h3>
                                    <div className="mb-3"><StarRating rating={newRating} onRating={setNewRating} /></div>
                                    <textarea rows="3" value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Escreva um comentário (opcional)..."></textarea>
                                    <button type="submit" className="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 shadow-sm">Enviar Avaliação</button>
                                </form>
                            )}
                            <div className="space-y-6">
                                {reviews.length > 0 ? reviews.map(review => (
                                    <div key={review.id} className="p-4 border-t">
                                        <div className="flex items-center mb-2">
                                            <StarRating rating={review.rating} readOnly={true} />
                                            <p className="ml-4 font-bold text-gray-800">{review.author_name}</p>
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                        <p className="text-xs text-gray-400 mt-1">em {new Date(review.created_at).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                )) : <p className="text-center text-gray-500 py-4">Este curso ainda não tem avaliações. Seja o primeiro a avaliar!</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'qna' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Perguntas e Respostas</h2>
                            <form onSubmit={handlePostQuestion} className="mb-8 p-4 border rounded-lg bg-gray-50">
                                <label htmlFor="new-question" className="block text-md font-medium text-gray-700 mb-2">Faça uma pergunta sobre o curso</label>
                                <textarea id="new-question" rows="3" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Digite sua dúvida aqui..."></textarea>
                                <button type="submit" className="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 shadow-sm">Enviar Pergunta</button>
                            </form>
                            <div className="space-y-6">
                                {questions.length > 0 ? questions.map(q => (
                                    <div key={q.id} className="p-4 border-t">
                                        <p className="font-bold text-lg text-gray-800">{q.title}</p>
                                        <p className="text-xs text-gray-500">por {q.author_name} em {new Date(q.created_at).toLocaleDateString('pt-BR')}</p>
                                        <div className="pl-6 mt-4 space-y-3">
                                            {q.answers.map(a => (
                                                <div key={a.id} className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-200">
                                                    <p className="text-gray-700">{a.body}</p>
                                                    <p className="text-xs text-gray-500 mt-1">respondido por {a.author_name} em {new Date(a.created_at).toLocaleDateString('pt-BR')}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <form onSubmit={(e) => handlePostAnswer(e, q.id)} className="pl-6 mt-4">
                                            <textarea rows="2" value={newAnswer[q.id] || ''} onChange={(e) => handleAnswerInputChange(q.id, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Escreva uma resposta..."></textarea>
                                            <button type="submit" className="mt-1 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-300">Responder</button>
                                        </form>
                                    </div>
                                )) : <p className="text-center text-gray-500 py-4">Nenhuma pergunta foi feita ainda. Seja o primeiro!</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default CourseDetail;