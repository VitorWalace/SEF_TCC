// File: frontend/src/pages/CreateCourse.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { PlusIcon, BookOpenIcon } from '../components/icons';
import AddLessonModal from '../components/AddLessonModal.jsx';

// --------------- COMPONENTE DA ETAPA 2: O CONSTRUTOR DE CURSOS ---------------
function CourseBuilder() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [newModuleName, setNewModuleName] = useState('');
    const [loading, setLoading] = useState(true);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [currentModule, setCurrentModule] = useState(null);

    const fetchCourseStructure = async () => {
        try {
            const response = await api.get(`/api/courses/${courseId}`);
            setCourse(response.data);
            setModules(response.data.modules || []);
        } catch (error) {
            console.error("Erro ao buscar estrutura do curso:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchCourseStructure();
        }
    }, [courseId]);

    const handleAddModule = async (e) => {
        e.preventDefault();
        if (!newModuleName.trim()) return;
        try {
            await api.post(`/api/courses/${courseId}/modules`, {
                title: newModuleName,
                order: modules.length + 1,
            });
            setNewModuleName('');
            fetchCourseStructure(); // Recarrega para mostrar o novo módulo
        } catch (error) {
            console.error("Erro ao adicionar módulo:", error);
        }
    };

    const openLessonModal = (module) => {
        setCurrentModule(module);
        setIsLessonModalOpen(true);
    };

    const handleAddLesson = async ({ title, content }) => {
        if (!currentModule) return;
        try {
            await api.post(`/api/modules/${currentModule.id}/lessons`, {
                title,
                content,
                order: currentModule.lessons ? currentModule.lessons.length + 1 : 1,
            });
            fetchCourseStructure(); // Recarrega para mostrar a nova aula
        } catch (error) {
            console.error("Erro ao adicionar aula:", error);
        }
    };

    if (loading) return <Layout pageTitle="Carregando..."><div>Carregando construtor de curso...</div></Layout>;

    return (
        <Layout pageTitle={`Construtor: ${course?.title}`}>
            {isLessonModalOpen && (
                <AddLessonModal
                    module={currentModule}
                    onClose={() => setIsLessonModalOpen(false)}
                    onLessonAdd={handleAddLesson}
                />
            )}
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
                    <p>Curso criado com sucesso! Agora, adicione os módulos e aulas abaixo.</p>
                </div>
                {modules.map(module => (
                    <div key={module.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{module.title}</h3>
                        <div className="mt-4 space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                           {module.lessons && module.lessons.length > 0 ? module.lessons.map(lesson => (
                               <div key={lesson.id} className="flex items-center text-gray-700 dark:text-gray-300">
                                   <BookOpenIcon className="w-5 h-5 mr-3 text-gray-400" />
                                   {lesson.title}
                               </div>
                           )) : <p className="text-sm text-gray-400 italic">Nenhuma aula neste módulo ainda.</p>}
                            <button onClick={() => openLessonModal(module)} className="flex items-center text-sm text-indigo-600 hover:underline pt-2">
                                <PlusIcon className="w-4 h-4 mr-1" /> Adicionar Aula
                            </button>
                        </div>
                    </div>
                ))}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                     <form onSubmit={handleAddModule} className="flex items-center gap-4">
                        <input
                            type="text"
                            value={newModuleName}
                            onChange={(e) => setNewModuleName(e.target.value)}
                            placeholder="Título do novo módulo..."
                            className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        />
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                            Adicionar Módulo
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

// --------------- COMPONENTE DA ETAPA 1: DETALHES INICIAIS ---------------
function CreateCourseInitialStep() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({ title: '', description: '', course_image_url: '' });
    const [loading, setLoading] = useState(false);

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("Você precisa estar logado!");
        setLoading(true);
        const payload = { ...formData, instructor_id: user.id };
        try {
            const response = await api.post('/api/courses', payload);
            const newCourse = response.data[0] || response.data;
            navigate(`/edit-course/${newCourse.id}`);
        } catch (error) {
            console.error("Erro ao criar o curso inicial:", error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    return (
        <Layout pageTitle="Criar Novo Curso (Passo 1 de 2)">
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleInitialSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Detalhes Iniciais do Curso</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título do Curso</label>
                            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label htmlFor="course_image_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL da Imagem de Capa</label>
                            <input type="text" name="course_image_url" id="course_image_url" value={formData.course_image_url} onChange={handleChange} placeholder="https://exemplo.com/imagem.png" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição Curta</label>
                            <textarea name="description" id="description" rows="3" value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required></textarea>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                            {loading ? "Criando..." : "Próximo: Adicionar Módulos"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

// --------------- COMPONENTE PRINCIPAL QUE DECIDE QUAL ETAPA MOSTRAR ---------------
function CreateOrEditCourse() {
    const { courseId } = useParams();
    // Se há um ID na URL, estamos editando (mostra o construtor).
    // Se não, estamos criando (mostra a etapa inicial).
    return courseId ? <CourseBuilder /> : <CreateCourseInitialStep />;
}

export default CreateOrEditCourse;