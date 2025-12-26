/**
 * V2.e - Experimental (Conversational UI)
 * 
 * Optimizations:
 * - Chat-like interface
 * - One question at a time
 * - Natural language prompts
 * - Typing animation
 * - Personal feel
 */

import { useState, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  type: "bot" | "user" | "options";
  text?: string;
  options?: { id: string; label: string }[];
}

const QUESTIONS = [
  {
    id: "type",
    text: "Hallo! 👋 Was möchtest du umziehen?",
    options: [
      { id: "wohnung", label: "🏠 Wohnung" },
      { id: "haus", label: "🏡 Haus" },
      { id: "buero", label: "🏢 Büro" },
    ],
  },
  {
    id: "size",
    text: "Super! Wie gross ist es?",
    options: [
      { id: "klein", label: "Klein (1-2 Zi.)" },
      { id: "mittel", label: "Mittel (3-4 Zi.)" },
      { id: "gross", label: "Gross (5+ Zi.)" },
    ],
  },
  {
    id: "from",
    text: "Von wo ziehst du weg? (PLZ oder Ort)",
    input: true,
  },
  {
    id: "to",
    text: "Und wohin geht die Reise? 🚚",
    input: true,
  },
  {
    id: "name",
    text: "Fast geschafft! Wie heisst du?",
    input: true,
  },
  {
    id: "email",
    text: "Perfekt! Wohin darf ich die Offerten schicken? 📧",
    input: true,
    placeholder: "deine@email.ch",
  },
];

export const V2eExperimental = memo(function V2eExperimental() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [data, setData] = useState<Record<string, string>>({});

  // Add initial message
  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(QUESTIONS[0]);
    }
  }, []);

  const addBotMessage = (question: typeof QUESTIONS[0]) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const newMessages: Message[] = [
        ...messages,
        { id: Date.now(), type: "bot", text: question.text },
      ];
      
      if (question.options) {
        newMessages.push({
          id: Date.now() + 1,
          type: "options",
          options: question.options,
        });
      }
      
      setMessages(newMessages);
      setIsTyping(false);
    }, 800);
  };

  const handleOptionSelect = (optionId: string, label: string) => {
    const question = QUESTIONS[currentQuestion];
    
    // Add user response
    setMessages(prev => [
      ...prev.filter(m => m.type !== "options"),
      { id: Date.now(), type: "user", text: label },
    ]);
    
    // Save data
    setData(prev => ({ ...prev, [question.id]: optionId }));
    
    // Next question
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeout(() => {
        addBotMessage(QUESTIONS[currentQuestion + 1]);
      }, 500);
    }
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    
    const question = QUESTIONS[currentQuestion];
    
    // Add user response
    setMessages(prev => [
      ...prev,
      { id: Date.now(), type: "user", text: inputValue },
    ]);
    
    // Save data
    setData(prev => ({ ...prev, [question.id]: inputValue }));
    setInputValue("");
    
    // Next question or finish
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeout(() => {
        addBotMessage(QUESTIONS[currentQuestion + 1]);
      }, 500);
    } else {
      // Finish
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: Date.now(), type: "bot", text: "Perfekt! 🎉 Ich suche jetzt die besten Umzugsfirmen für dich..." },
        ]);
        setIsTyping(false);
        
        setTimeout(() => {
          navigate('/umzugsofferten-bestaetigung');
        }, 2000);
      }, 1000);
    }
  };

  const currentQ = QUESTIONS[currentQuestion];
  const isInputStep = currentQ && 'input' in currentQ && currentQ.input;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary/10 p-4 flex items-center gap-3 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Umzugs-Assistent</p>
            <p className="text-xs text-muted-foreground">
              {isTyping ? "schreibt..." : "online"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 h-[350px] overflow-y-auto space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.type === "bot" && (
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                )}
                
                {msg.type === "user" && (
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm">
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                )}
                
                {msg.type === "options" && msg.options && (
                  <div className="w-full flex flex-wrap gap-2 pl-10">
                    {msg.options.map((opt) => (
                      <Button
                        key={opt.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleOptionSelect(opt.id, opt.label)}
                        className="rounded-full"
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        {isInputStep && (
          <div className="p-4 border-t border-border bg-muted/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleInputSubmit();
              }}
              className="flex gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentQ && 'placeholder' in currentQ ? currentQ.placeholder as string : "Deine Antwort..."}
                className="flex-1"
                autoFocus
              />
              <Button type="submit" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
});

export default V2eExperimental;
