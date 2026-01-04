import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, MessageSquare, Loader2, Sparkles, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useParams } from 'react-router-dom';
import { backend } from '../services/backend';
import { Product, ChatMessage } from '../types';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: 'Hello! I am Meski. How can I assist you with your equipment search today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contextProduct, setContextProduct] = useState<Product | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const params = useParams<{ id: string }>();

  // Detect Context (Are we on a product page?)
  useEffect(() => {
    const checkContext = async () => {
      // Check if URL matches /product/:id
      const match = location.pathname.match(/\/product\/([^\/]+)/);
      if (match && match[1]) {
        const productId = match[1];
        try {
          const product = await backend.getProductById(productId);
          if (product) {
            setContextProduct(product);
            // Optionally add a context-aware greeting if it's the first switch
            // For now, we silently switch context so the next question is aware
          }
        } catch (e) {
          console.error("Failed to load context for AI", e);
        }
      } else {
        setContextProduct(null);
      }
    };
    checkContext();
  }, [location.pathname]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const responseText = await backend.sendAiMessage(userMsg.text, contextProduct);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: "I'm having trouble connecting to the kitchen network. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full copper-gradient flex items-center justify-center shadow-2xl shadow-copper/30 border border-white/20 group"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
             <Bot className="w-7 h-7 text-white" />
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
             </span>
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm h-[500px] flex flex-col bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900/80 border-b border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-copper/20 flex items-center justify-center border border-copper/30">
                <ChefHat className="w-5 h-5 text-copper" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Meski AI</h3>
                <p className="text-xs text-silver flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 
                  Online • {contextProduct ? 'Viewing Product' : 'Marketplace Assistant'}
                </p>
              </div>
            </div>

            {/* Context Indicator */}
            {contextProduct && (
              <div className="bg-blue-500/10 border-b border-blue-500/10 px-4 py-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <p className="text-xs text-blue-200 truncate">
                  Context: <span className="font-bold">{contextProduct.title}</span>
                </p>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-copper text-white rounded-tr-none' 
                        : 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                     <span className="w-1.5 h-1.5 bg-silver rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                     <span className="w-1.5 h-1.5 bg-silver rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                     <span className="w-1.5 h-1.5 bg-silver rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-slate-900/50 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about price, specs..."
                className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-copper"
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-2 bg-copper rounded-xl text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;