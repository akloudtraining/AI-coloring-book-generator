import React, { useState, useCallback, useRef } from 'react';
import { Chat } from '@google/genai';
import type { ChatMessage } from './types';
import ColoringBookForm from './components/ColoringBookForm';
import ImagePreview from './components/ImagePreview';
import ChatBot from './components/ChatBot';
import { generateColoringPage, createChat } from './services/geminiService';
import { createColoringBookPdf } from './services/pdfService';
import { ChatIcon, CloseIcon, DownloadIcon } from './components/icons';

interface GeneratedImages {
  cover: string | null;
  pages: string[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<GeneratedImages>({ cover: null, pages: [] });

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);

  const handleGenerateBook = useCallback(async (theme: string, childName: string) => {
    setIsLoading(true);
    setError(null);
    setImages({ cover: null, pages: [] });
    const totalImages = 6; // 1 cover + 5 pages
    
    try {
      // Generate Cover
      setLoadingMessage(`Creating a magical cover for ${childName}... (1/${totalImages})`);
      const coverPrompt = `A beautiful coloring book cover for a child named "${childName}". The theme is "${theme}". The art style must be a black and white coloring book page with very thick, bold, clean lines, suitable for a young child. Centered main subject. Do not include any text other than the name "${childName}".`;
      const coverImage = await generateColoringPage(coverPrompt);
      setImages(prev => ({ ...prev, cover: coverImage }));

      // Generate Pages
      const generatedPages: string[] = [];
      for (let i = 0; i < 5; i++) {
        const pageNum = i + 1;
        
        // Add delay *before* each page generation call to avoid rate limiting
        setLoadingMessage(`Giving the AI artist a moment of rest... (Page ${pageNum}/5 is next)`);
        await delay(31000); // 31-second delay to safely stay within a 2 RPM limit

        setLoadingMessage(`Drawing page ${pageNum} of 5... (${pageNum + 1}/${totalImages})`);
        const pagePrompt = `A full coloring book page for a child. The theme is "${theme}". Create a fun and simple scene related to the theme. The art style must be black and white with very thick, bold, clean lines, suitable for a young child. Do not include any text.`;
        const pageImage = await generateColoringPage(pagePrompt);
        generatedPages.push(pageImage);
        setImages(prev => ({ ...prev, pages: [...generatedPages] }));
      }
    } catch (err) {
      console.error(err);
      setError('Oops! We hit a snag. This is likely due to API rate limits. The app has a built-in delay to prevent this, but demand might be high. Please wait a minute before trying again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleDownloadPdf = useCallback(() => {
    if (images.cover && images.pages.length === 5) {
      createColoringBookPdf(images.cover, images.pages);
    }
  }, [images]);

  const handleSendMessage = useCallback(async (message: string) => {
    setChatMessages(prev => [...prev, { role: 'user', text: message }]);
    setIsBotTyping(true);

    try {
      if (!chatRef.current) {
        chatRef.current = createChat();
      }
      const chat = chatRef.current;
      const result = await chat.sendMessageStream({ message });

      let botResponse = '';
      for await (const chunk of result) {
        botResponse += chunk.text;
      }

      setChatMessages(prev => [...prev, { role: 'model', text: botResponse }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'model', text: 'Sorry, I seem to be having trouble connecting. Please try again later.' }]);
    } finally {
      setIsBotTyping(false);
    }
  }, []);

  const canDownload = images.cover !== null && images.pages.length === 5 && !isLoading;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            AI Coloring Book Generator
          </h1>
          <p className="mt-2 text-slate-400">
            Turn your ideas into printable coloring masterpieces for kids!
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 h-fit">
            <ColoringBookForm onSubmit={handleGenerateBook} isLoading={isLoading} />
            {canDownload && (
              <button
                onClick={handleDownloadPdf}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
              >
                <DownloadIcon />
                Download PDF
              </button>
            )}
          </div>

          <div className="lg:col-span-8">
            <ImagePreview 
              cover={images.cover} 
              pages={images.pages}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              error={error} 
            />
          </div>
        </main>

        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transform hover:scale-110 transition-transform duration-200"
            aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
          >
            {isChatOpen ? <CloseIcon /> : <ChatIcon />}
          </button>
        </div>

        {isChatOpen && (
          <ChatBot 
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isBotTyping={isBotTyping}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;