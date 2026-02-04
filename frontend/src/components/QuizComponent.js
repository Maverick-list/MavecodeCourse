import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, Award } from 'lucide-react';
import { Button } from './ui/button';

const questions = [
    {
        question: "Apa singkatan dari DOM?",
        options: [
            "Document Object Model",
            "Data Object Model",
            "Document Orientation Method",
            "Digital Ordinance Model"
        ],
        correct: 0
    },
    {
        question: "Manakah yang bukan tipe data di JavaScript?",
        options: [
            "String",
            "Boolean",
            "Float",
            "Undefined"
        ],
        correct: 2
    },
    {
        question: "Keyword untuk mendeklarasikan variabel constant?",
        options: [
            "var",
            "let",
            "const",
            "fix"
        ],
        correct: 2
    }
];

const QuizComponent = ({ onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (index) => {
        setSelectedOption(index);
        const correct = index === questions[currentQuestion].correct;
        setIsCorrect(correct);
        if (correct) setScore(score + 1);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            setShowResult(true);
            if (onComplete) onComplete(score);
        }
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in">
                <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
                    <Award className="w-12 h-12 text-yellow-500" />
                </div>
                <h2 className="text-3xl font-heading font-bold mb-2">Quiz Selesai!</h2>
                <p className="text-muted-foreground mb-8">Kamu berhasil menyelesaikan kuis ini.</p>
                <div className="text-6xl font-black text-primary mb-2">{Math.round((score / questions.length) * 100)}%</div>
                <p className="text-sm text-slate-500 mb-8">Benar {score} dari {questions.length} soal</p>
                <Button onClick={onComplete} className="bg-primary text-primary-foreground">
                    Lanjutkan Materi
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto h-full flex flex-col justify-center p-6">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground font-mono">SOAL {currentQuestion + 1} / {questions.length}</span>
                    <span className="text-sm font-bold text-primary">Score: {score}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-white/5 rounded-3xl p-8 mb-8"
            >
                <h3 className="text-xl font-bold mb-6">{questions[currentQuestion].question}</h3>
                <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => !selectedOption && handleAnswer(index)}
                            disabled={selectedOption !== null}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 
                ${selectedOption === null
                                    ? 'border-white/10 hover:bg-white/5 hover:border-primary/50'
                                    : selectedOption === index
                                        ? isCorrect
                                            ? 'border-green-500 bg-green-500/20 text-green-500'
                                            : 'border-red-500 bg-red-500/20 text-red-500'
                                        : index === questions[currentQuestion].correct
                                            ? 'border-green-500 bg-green-500/20 text-green-500'
                                            : 'border-white/5 opacity-50'
                                }
              `}
                        >
                            <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {selectedOption === index && (
                                    isCorrect
                                        ? <CheckCircle className="w-5 h-5 text-green-500" />
                                        : <XCircle className="w-5 h-5 text-red-500" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>

            <div className="flex justify-end">
                <Button
                    onClick={nextQuestion}
                    disabled={selectedOption === null}
                    className="bg-white text-black hover:bg-slate-200 transition-colors"
                >
                    {currentQuestion === questions.length - 1 ? 'Selesai' : 'Lanjut'} <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default QuizComponent;
