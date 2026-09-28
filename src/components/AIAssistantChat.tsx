import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
}

const DEFAULT_WEBHOOK_URL = 'https://barlasrija.app.n8n.cloud/webhook/5dc9a444-27e1-47a6-87d8-715f2e53eeaf/chat';

export const AIAssistantChat: React.FC = () => {
  const { items, currentUser, setSelectedItem, setCurrentTab } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'agent',
      text: "👋 Hi! I'm your FindIt Campus AI Assistant, connected live to your n8n workflow. Ask me about any lost or found belongings, search campus locations, or ask how to claim an item!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [sessionId] = useState(() => 'sess-' + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      // Build relevant campus context to supply to the webhook
      const campusContext = {
        totalReportsCount: items.length,
        userRole: currentUser?.role || 'guest',
        userName: currentUser?.name || 'Anonymous Student',
        recentSampleItems: items.slice(0, 5).map(i => ({
          id: i.id,
          title: i.title,
          type: i.type,
          category: i.category,
          location: i.location,
          date: i.date,
          status: i.status
        }))
      };

      const response = await fetch(DEFAULT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
          chatInput: text,
          message: text,
          sessionId: sessionId,
          userId: currentUser?.id || 'guest',
          context: campusContext
        })
      });

      let agentResponseText = '';

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          // Support multiple typical n8n AI agent response formats
          agentResponseText = 
            data.output || 
            data.text || 
            data.response || 
            data.message || 
            (typeof data === 'string' ? data : JSON.stringify(data));
        } else {
          agentResponseText = await response.text();
        }
      } else {
        agentResponseText = `Webhook responded with status ${response.status}. I'm also searching our local database for "${text}".`;
      }

      // If response text is still empty or generic, provide local intelligent fallback
      if (!agentResponseText || agentResponseText.trim() === '') {
        const matches = items.filter(i => 
          i.title.toLowerCase().includes(text.toLowerCase()) ||
          i.location.toLowerCase().includes(text.toLowerCase()) ||
          i.category.toLowerCase().includes(text.toLowerCase())
        );
        if (matches.length > 0) {
          agentResponseText = `I found ${matches.length} matching report(s) in FindIt:\n• ${matches.map(m => `"${m.title}" (${m.type.toUpperCase()}) at ${m.location}`).join('\n• ')}`;
        } else {
          agentResponseText = `Message received by n8n. If you lost an item, feel free to submit a report using the "Report Lost" button or check the Browse page!`;
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          text: agentResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.warn('n8n Webhook direct connection notice:', err);
      
      // Smart offline fallback querying local database
      const query = text.toLowerCase();
      const localMatches = items.filter(i => 
        i.title.toLowerCase().includes(query) ||
        i.location.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query)
      );

      let fallbackText = '';
      if (localMatches.length > 0) {
        fallbackText = `Here are the top matches from FindIt campus records for "${text}":\n` +
          localMatches.slice(0, 3).map(m => `• [${m.type.toUpperCase()}] ${m.title} at ${m.location} (${m.date})`).join('\n') +
          `\n\nYou can click on any card on the search page to view full details.`;
      } else {
        fallbackText = `I couldn't find an existing report matching "${text}". Would you like to file a new report under "Report Lost" or "Report Found"?`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Did anyone turn in AirPods in the library?",
    "Lost blue North Face backpack",
    "Where is the campus safe drop-off desk?",
    "How do I claim a found student ID?"
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group border border-white/20"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white"></span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-200">AI Campus Agent</p>
            <p className="text-sm font-bold leading-tight">Ask FindIt AI</p>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-5 right-5 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 ${
            isMinimized ? 'w-80 h-16' : 'w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight">FindIt AI Agent</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-slate-300 font-mono flex items-center gap-1">
                  <span>n8n Webhook Live</span>
                  <span className="text-emerald-400">• Active</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-xs sm:text-sm">
                
                {/* Integration Info Banner */}
                <div className="p-2.5 bg-indigo-50/90 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="leading-tight">
                    <span className="font-bold">Connected Agent:</span> Trained on FindIt campus records, active items, and safe drop-off procedures.
                  </div>
                </div>

                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-2xs ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    <span>AI Agent is analyzing campus records...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Suggestions */}
              {messages.length <= 2 && (
                <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200/80 flex gap-1.5 overflow-x-auto text-[11px]">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-slate-600 font-medium whitespace-nowrap transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about lost AirPods, backpacks, keys, or safety..."
                    className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || loading}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold transition-all shadow-xs shrink-0"
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
