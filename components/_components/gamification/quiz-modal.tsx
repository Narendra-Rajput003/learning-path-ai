import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizModalProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function QuizModal({ questions, onComplete }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete(score);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <Progress value={(currentQuestion / questions.length) * 100} className="h-2 mt-2" />
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold">{questions[currentQuestion].question}</h3>
        
        <div className="space-y-2">
          {questions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option 
                ? option === questions[currentQuestion].correctAnswer 
                  ? "success" 
                  : "destructive"
                : "outline"
              }
              className="w-full justify-start text-left"
              onClick={() => handleAnswer(option)}
              disabled={showExplanation}
            >
              {option}
            </Button>
          ))}
        </div>

        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-muted rounded-lg"
          >
            <p className="text-sm">{questions[currentQuestion].explanation}</p>
            <Button className="mt-4" onClick={nextQuestion}>
              {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Quiz"}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
}