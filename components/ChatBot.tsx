
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, CloseIcon } from './icons';

interface ChatBotProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isBotTyping: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ messages, onSendMessage, isBotTyping, onClose }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isBotTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-[calc(100%-3rem)] max-w-md h-[60vh] bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 flex flex-col z-40">
      <header className="flex items-center justify-between p-4 border-b border-slate-700">
        <h3 className="font-bold text-lg">AI Assistant</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <CloseIcon />
        </button>
      </header>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-lg p-3 max-w-xs">
              <p>Hello! How can I help you today?</p>
            </div>
          </div>
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${msg.role === 'user' ? 'bg-purple-600' : 'bg-slate-700'} rounded-lg p-3 max-w-xs`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isBotTyping && (
             <div className="flex justify-start">
              <div className="bg-slate-700 rounded-lg p-3 max-w-xs">
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
        <div className="flex items-center bg-slate-800 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-transparent px-4 py-2 text-white focus:outline-none"
            disabled={isBotTyping}
          />
          <button type="submit" disabled={isBotTyping || !input.trim()} className="p-3 text-purple-400 disabled:text-slate-500 hover:text-purple-300 disabled:cursor-not-allowed">
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;
