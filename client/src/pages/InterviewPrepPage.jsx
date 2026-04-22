import { useState } from 'react';
<<<<<<< HEAD
import TechnicalQuiz from '../components/interview/TechnicalQuiz';
import HRInterview from '../components/interview/HRInterview';

const InterviewPrepPage = () => {
    const [mode, setMode] = useState(null); // null, 'technical', 'hr'

    if (mode === 'technical') {
        return <TechnicalQuiz onExit={() => setMode(null)} />;
    }

    if (mode === 'hr') {
        return <HRInterview onExit={() => setMode(null)} />;
=======
import axios from 'axios';

const InterviewPrepPage = () => {
    const [quizMode, setQuizMode] = useState(null); // null, 'loading', 'quiz', 'results'
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState(null);

    const startTechnicalQuiz = async () => {
        setQuizMode('loading');
        setError(null);

        try {
            const response = await axios.post('https://rahim-n8n.app.n8n.cloud/webhook/bd1fe569-0009-4ed3-bb14-6e05a6eazertyu');

            console.log('Full response:', response);
            console.log('Response data:', response.data);

            // Parse the response - the output comes in a specific format
            let parsedQuestions = [];

            // Try different parsing strategies
            if (response.data) {
                console.log('Response data type:', typeof response.data);
                console.log('Is array:', Array.isArray(response.data));

                // Strategy 0: Check if data is a string (most common from n8n)
                if (typeof response.data === 'string') {
                    try {
                        // Remove markdown code block markers
                        const jsonString = response.data.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                        console.log('Strategy 0: Cleaned JSON string:', jsonString);
                        const parsed = JSON.parse(jsonString);
                        parsedQuestions = parsed.questions || [];
                        console.log('Strategy 0: Parsed questions from string:', parsedQuestions);
                    } catch (parseErr) {
                        console.error('Strategy 0 - JSON parse error:', parseErr);
                    }
                }
                // Strategy 1: Check if data is already the questions array
                else if (response.data.questions && Array.isArray(response.data.questions)) {
                    parsedQuestions = response.data.questions;
                    console.log('Strategy 1: Found questions directly in response.data.questions');
                }
                // Strategy 2: Check if data is an array with output field
                else if (Array.isArray(response.data) && response.data.length > 0) {
                    const outputData = response.data[0]?.output;
                    console.log('Strategy 2: Output data:', outputData);

                    if (outputData) {
                        try {
                            // Remove markdown code block markers
                            const jsonString = outputData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                            console.log('Cleaned JSON string:', jsonString);
                            const parsed = JSON.parse(jsonString);
                            parsedQuestions = parsed.questions || [];
                            console.log('Strategy 2: Parsed questions:', parsedQuestions);
                        } catch (parseErr) {
                            console.error('JSON parse error:', parseErr);
                        }
                    }
                }
                // Strategy 3: Check if the entire response.data is a questions array
                else if (Array.isArray(response.data)) {
                    // Check if first element looks like a question
                    if (response.data[0]?.question_text) {
                        parsedQuestions = response.data;
                        console.log('Strategy 3: response.data is the questions array');
                    }
                }
            }

            console.log('Final parsed questions:', parsedQuestions);
            console.log('Number of questions:', parsedQuestions.length);

            if (parsedQuestions.length === 0) {
                throw new Error('Aucune question reçue. Vérifiez la console pour plus de détails.');
            }

            setQuestions(parsedQuestions);
            setQuizMode('quiz');
            setCurrentQuestionIndex(0);
            setUserAnswers({});
            setSelectedAnswer(null);
            setShowResult(false);
        } catch (err) {
            console.error('Error fetching questions:', err);
            console.error('Error details:', err.response?.data);
            setError(err.message || 'Erreur lors du chargement des questions. Veuillez réessayer.');
            setQuizMode(null);
        }
    };

    const handleAnswerSelect = (answer) => {
        if (!showResult) {
            setSelectedAnswer(answer);
        }
    };

    const handleSubmit = () => {
        if (selectedAnswer) {
            setUserAnswers({
                ...userAnswers,
                [currentQuestionIndex]: selectedAnswer
            });
            setShowResult(true);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(userAnswers[currentQuestionIndex + 1] || null);
            setShowResult(!!userAnswers[currentQuestionIndex + 1]);
        } else {
            // Show final results
            setQuizMode('results');
        }
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correct_answer) {
                correct++;
            }
        });
        return correct;
    };

    const getOptionText = (option) => {
        // Options come as objects like { "option1": "text" }
        return Object.values(option)[0];
    };

    const resetQuiz = () => {
        setQuizMode(null);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setSelectedAnswer(null);
        setShowResult(false);
        setError(null);
    };

    if (quizMode === 'loading') {
        return (
            <div className="dashboard-page">
                <div className="page-header">
                    <h2>Préparation aux entretiens</h2>
                    <p className="subtitle">Chargement des questions...</p>
                </div>
                <div className="content-card">
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                        </svg>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Préparation du quiz...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (quizMode === 'quiz' && questions.length > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = showResult && selectedAnswer === currentQuestion.correct_answer;
        const isIncorrect = showResult && selectedAnswer !== currentQuestion.correct_answer;

        return (
            <div className="dashboard-page">
                <div className="page-header">
                    <h2>Questions Techniques</h2>
                    <p className="subtitle">Question {currentQuestionIndex + 1} sur {questions.length}</p>
                </div>

                <div className="content-card">
                    <div style={{ padding: '2rem' }}>
                        {/* Progress Bar */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Progression</span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {Object.keys(userAnswers).length}/{questions.length} répondu
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                backgroundColor: '#e2e8f0',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                                    height: '100%',
                                    backgroundColor: 'var(--primary-color)',
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                        </div>

                        {/* Question */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                {currentQuestion.question_text}
                            </h3>

                            {/* Options */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {currentQuestion.options.map((option, idx) => {
                                    const optionText = getOptionText(option);
                                    const isSelected = selectedAnswer === optionText;
                                    const isThisCorrect = optionText === currentQuestion.correct_answer;

                                    let backgroundColor = 'white';
                                    let borderColor = '#cbd5e1';
                                    let textColor = '#1e293b';

                                    if (showResult) {
                                        if (isThisCorrect) {
                                            backgroundColor = '#dcfce7';
                                            borderColor = '#16a34a';
                                            textColor = '#16a34a';
                                        } else if (isSelected && !isThisCorrect) {
                                            backgroundColor = '#fee2e2';
                                            borderColor = '#dc2626';
                                            textColor = '#dc2626';
                                        }
                                    } else if (isSelected) {
                                        backgroundColor = '#eff6ff';
                                        borderColor = 'var(--primary-color)';
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswerSelect(optionText)}
                                            disabled={showResult}
                                            style={{
                                                padding: '1.25rem',
                                                borderRadius: '12px',
                                                border: `2px solid ${borderColor}`,
                                                backgroundColor,
                                                color: textColor,
                                                textAlign: 'left',
                                                cursor: showResult ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s ease',
                                                fontWeight: isSelected ? '600' : '400',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem'
                                            }}
                                        >
                                            <span style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                border: `2px solid ${borderColor}`,
                                                backgroundColor: isSelected ? borderColor : 'white',
                                                color: isSelected ? 'white' : borderColor,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                flexShrink: 0
                                            }}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span style={{ flex: 1 }}>{optionText}</span>
                                            {showResult && isThisCorrect && (
                                                <span style={{ fontSize: '1.5rem' }}>✓</span>
                                            )}
                                            {showResult && isSelected && !isThisCorrect && (
                                                <span style={{ fontSize: '1.5rem' }}>✗</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Result Message */}
                        {showResult && (
                            <div style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                backgroundColor: isCorrect ? '#dcfce7' : '#fee2e2',
                                border: `1px solid ${isCorrect ? '#16a34a' : '#dc2626'}`,
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>
                                    {isCorrect ? '✅' : '❌'}
                                </span>
                                <span style={{
                                    color: isCorrect ? '#16a34a' : '#dc2626',
                                    fontWeight: 600
                                }}>
                                    {isCorrect
                                        ? 'Bonne réponse !'
                                        : `Mauvaise réponse. La bonne réponse était : "${currentQuestion.correct_answer}"`
                                    }
                                </span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                            <button
                                onClick={resetQuiz}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: 'white',
                                    color: '#475569',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Quitter
                            </button>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {!showResult ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!selectedAnswer}
                                        className="btn-primary"
                                        style={{
                                            padding: '0.75rem 2rem',
                                            opacity: !selectedAnswer ? 0.5 : 1,
                                            cursor: !selectedAnswer ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Soumettre
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        className="btn-primary"
                                        style={{ padding: '0.75rem 2rem' }}
                                    >
                                        {currentQuestionIndex < questions.length - 1 ? 'Suivant' : 'Voir les résultats'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                `}</style>
            </div>
        );
    }

    if (quizMode === 'results') {
        const score = calculateScore();
        const percentage = (score / questions.length) * 100;

        return (
            <div className="dashboard-page">
                <div className="page-header">
                    <h2>Résultats du Quiz</h2>
                    <p className="subtitle">Voici vos performances</p>
                </div>

                <div className="content-card">
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                        {/* Score Circle */}
                        <div style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            border: `12px solid ${percentage >= 70 ? '#16a34a' : percentage >= 50 ? '#d97706' : '#dc2626'}`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem',
                            backgroundColor: '#f8fafc'
                        }}>
                            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: percentage >= 70 ? '#16a34a' : percentage >= 50 ? '#d97706' : '#dc2626' }}>
                                {score}/{questions.length}
                            </div>
                            <div style={{ fontSize: '1.2rem', color: '#64748b', marginTop: '0.5rem' }}>
                                {percentage.toFixed(0)}%
                            </div>
                        </div>

                        {/* Performance Message */}
                        <h3 style={{ marginBottom: '1rem' }}>
                            {percentage >= 80 ? '🎉 Excellent travail !' :
                                percentage >= 60 ? '👍 Bon travail !' :
                                    percentage >= 40 ? '💪 Continuez à pratiquer !' :
                                        '📚 Besoin de plus de pratique'}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Vous avez répondu correctement à {score} question{score > 1 ? 's' : ''} sur {questions.length}.
                        </p>

                        {/* Detailed Results */}
                        <div style={{
                            textAlign: 'left',
                            backgroundColor: '#f8fafc',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            marginBottom: '2rem'
                        }}>
                            <h4 style={{ marginBottom: '1rem' }}>Détails des réponses</h4>
                            {questions.map((q, idx) => {
                                const isCorrect = userAnswers[idx] === q.correct_answer;
                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '0.75rem',
                                            borderLeft: `4px solid ${isCorrect ? '#16a34a' : '#dc2626'}`,
                                            backgroundColor: 'white',
                                            marginBottom: '0.75rem',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <span>{isCorrect ? '✅' : '❌'}</span>
                                            <strong>Question {idx + 1}</strong>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                                            {q.question_text.substring(0, 80)}...
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={startTechnicalQuiz}
                                className="btn-primary"
                                style={{ padding: '0.75rem 2rem' }}
                            >
                                Recommencer
                            </button>
                            <button
                                onClick={resetQuiz}
                                style={{
                                    padding: '0.75rem 2rem',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: 'white',
                                    color: '#475569',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Retour au menu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
>>>>>>> ec2df8a35ebb85af696663c0f933c21b55327c67
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h2>Préparation aux entretiens</h2>
<<<<<<< HEAD
                <p className="subtitle">Choisissez votre mode d'entraînement</p>
            </div>

            <div className="content-card">
                <div style={{ padding: '2rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginTop: '1rem'
                    }}>
                        {/* Technical Quiz Card */}
                        <div style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            backgroundColor: 'white'
                        }}
                            className="hover:shadow-lg hover:border-blue-400"
                        >
                            <div style={{
                                fontSize: '4rem',
                                marginBottom: '1.5rem',
                                background: '#eff6ff',
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                🧠
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
                                Quiz Technique
                            </h3>
                            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Testez vos connaissances techniques avec des questions générées par IA adaptées à votre profil.
                            </p>
                            <button
                                onClick={() => setMode('technical')}
                                className="btn-primary"
                                style={{ width: '100%', padding: '1rem' }}
                            >
                                Démarrer le Quiz
                            </button>
                        </div>

                        {/* HR Interview Card */}
                        <div style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            backgroundColor: 'white'
                        }}
                            className="hover:shadow-lg hover:border-indigo-400"
                        >
                            <div style={{
                                fontSize: '4rem',
                                marginBottom: '1.5rem',
                                background: '#f5f3ff',
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                🤝
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
                                Entretien RH
                            </h3>
                            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Simulez un entretien comportemental avec notre chatbot RH intelligent et recevez du feedback.
                            </p>
                            <button
                                onClick={() => setMode('hr')}
                                className="btn-primary" // Keeping same class for consistency but could be different color
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: '#4f46e5'
                                }}
                            >
                                Démarrer l'Entretien
                            </button>
=======
                <p className="subtitle">Entraînez-vous avec des questions d&apos;entretien personnalisées</p>
            </div>

            <div className="content-card">
                <div className="interview-prep-content">
                    <div className="prep-section">
                        <div className="info-icon" style={{ margin: '0 auto 1.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Système d&apos;entraînement</h3>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Préparez-vous aux entretiens avec des questions adaptées à votre profil
                        </p>

                        {error && (
                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                border: '1px solid #fecaca'
                            }}>
                                <strong>Erreur:</strong> {error}
                            </div>
                        )}

                        <div className="quiz-categories">
                            <div className="category-card">
                                <div className="category-header">
                                    <div className="info-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 18 22 12 16 6"></polyline>
                                            <polyline points="8 6 2 12 8 18"></polyline>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4>Questions techniques</h4>
                                        <p>Testez vos compétences techniques</p>
                                    </div>
                                </div>
                                <button className="btn-primary" onClick={startTechnicalQuiz}>
                                    Commencer
                                </button>
                            </div>

                            <div className="category-card">
                                <div className="category-header">
                                    <div className="info-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4>Questions comportementales</h4>
                                        <p>Préparez vos soft skills</p>
                                    </div>
                                </div>
                                <button className="btn-primary">
                                    Commencer
                                </button>
                            </div>

                            <div className="category-card">
                                <div className="category-header">
                                    <div className="info-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4>Études de cas</h4>
                                        <p>Résolvez des problèmes réels</p>
                                    </div>
                                </div>
                                <button className="btn-primary">
                                    Commencer
                                </button>
                            </div>
                        </div>

                        <div className="security-info" style={{ marginTop: '2rem' }}>
                            <h3>💡 Conseil</h3>
                            <p>Pratiquez régulièrement pour améliorer vos performances lors des entretiens. Nos questions sont conçues pour simuler des situations réelles.</p>
>>>>>>> ec2df8a35ebb85af696663c0f933c21b55327c67
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewPrepPage;
