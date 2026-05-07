import { Brain, Sparkles, Send, Zap, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { aiApi } from '../lib/api';

const SUGGESTIONS = [
  "Explain Stokes' Theorem simply",
  'Create a quiz on Neural Networks',
  'Summarize my weak points',
  'Build a 3-day study plan for Calculus',
];

export default function AILab() {
  const [conversations, setConversations] = useState([]);
  const [activeId,      setActiveId]      = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [input,         setInput]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [loadingConvs,  setLoadingConvs]  = useState(true);
  const bottomRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    aiApi.listConversations()
      .then(({ data }) => {
        const convs = data.data?.conversations ?? [];
        setConversations(convs);
        if (convs.length > 0) loadConversation(convs[0].id);
        else setLoadingConvs(false);
      })
      .catch(() => setLoadingConvs(false));
  }, []);

  const loadConversation = async (id) => {
    setActiveId(id);
    setLoadingConvs(true);
    try {
      const { data } = await aiApi.getConversation(id);
      setMessages(data.data?.messages ?? []);
    } finally {
      setLoadingConvs(false);
    }
  };

  const newConversation = async () => {
    const { data } = await aiApi.createConversation('New Conversation');
    const conv = data.data;
    setConversations(prev => [conv, ...prev]);
    setActiveId(conv.id);
    setMessages([]);
  };

  const send = async (text) => {
    if (!text.trim() || loading) return;

    // Ensure we have an active conversation
    let convId = activeId;
    if (!convId) {
      const { data } = await aiApi.createConversation(text.slice(0, 60));
      convId = data.data.id;
      setConversations(prev => [data.data, ...prev]);
      setActiveId(convId);
    }

    // Optimistic user message
    const tempId = `temp-${Date.now()}`;
    setMessages(prev => [...prev, { id: tempId, sender: 'user', content: text, createdAt: new Date().toISOString() }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await aiApi.sendMessage(convId, text);
      setMessages(prev => [...prev, data.data]);
    } catch {
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, sender: 'ai', content: 'Sorry, something went wrong. Please try again.', createdAt: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--t-text)' }}>AI Lab</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--t-text-muted)' }}>
          Your personal AI study engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat */}
        <div className="lg:col-span-2">
          <Card glow className="p-5 flex flex-col" style={{ height: '520px' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
              {messages.length === 0 && !loadingConvs && (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-60">
                  <Brain size={40} style={{ color: 'var(--t-primary)' }} />
                  <p className="text-sm" style={{ color: 'var(--t-text-muted)' }}>
                    Ask me anything about your studies
                  </p>
                </div>
              )}

              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: msg.sender === 'ai' ? 'linear-gradient(135deg, var(--t-primary), var(--t-secondary))' : 'var(--t-surface-high)', border: msg.sender === 'user' ? '1px solid var(--t-border)' : 'none' }}>
                    {msg.sender === 'ai'
                      ? <Brain size={14} style={{ color: 'var(--t-bg)' }} />
                      : <span className="text-[10px] font-bold" style={{ color: 'var(--t-primary)' }}>ME</span>}
                  </div>
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ background: msg.sender === 'ai' ? 'var(--t-surface-high)' : 'var(--t-primary-soft)', color: 'var(--t-text)',
                      border: `1px solid ${msg.sender === 'user' ? 'var(--t-primary-border)' : 'var(--t-border)'}`,
                      borderTopLeftRadius: msg.sender === 'ai' ? '4px' : undefined,
                      borderTopRightRadius: msg.sender === 'user' ? '4px' : undefined }}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--t-primary), var(--t-secondary))' }}>
                    <Brain size={14} style={{ color: 'var(--t-bg)' }} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl" style={{ background: 'var(--t-surface-high)', border: '1px solid var(--t-border)' }}>
                    <div className="flex gap-1.5 items-center h-4">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{ background: 'var(--t-primary)', animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--t-border)' }}>
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                placeholder="Ask your AI study engine…"
                className="flex-1 recessed rounded-xl px-4 py-2.5 text-sm border focus:outline-none theme-transition"
                style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                onBlur={e => e.target.style.borderColor = 'var(--t-border)'} />
              <Button size="icon" onClick={() => send(input)} disabled={!input.trim() || loading}>
                <Send size={16} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick prompts */}
          <Card className="p-5">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--t-text)' }}>
              <Sparkles size={15} style={{ color: 'var(--t-primary)' }} /> Quick Prompts
            </h3>
            <div className="space-y-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs border theme-transition"
                  style={{ color: 'var(--t-text-muted)', borderColor: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-primary-soft)'; e.currentTarget.style.color = 'var(--t-primary)'; e.currentTarget.style.borderColor = 'var(--t-primary-border)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t-text-muted)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                  {s}
                </button>
              ))}
            </div>
          </Card>

          {/* Conversations */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: 'var(--t-text)' }}>Conversations</h3>
              <button onClick={newConversation} className="p-1.5 rounded-lg theme-transition"
                style={{ color: 'var(--t-primary)', background: 'var(--t-primary-soft)' }}>
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {conversations.length === 0
                ? <p className="text-xs" style={{ color: 'var(--t-text-muted)' }}>No conversations yet</p>
                : conversations.map(c => (
                  <button key={c.id} onClick={() => loadConversation(c.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs truncate theme-transition"
                    style={{ background: c.id === activeId ? 'var(--t-primary-soft)' : 'transparent',
                      color: c.id === activeId ? 'var(--t-primary)' : 'var(--t-text-muted)' }}>
                    {c.title}
                  </button>
                ))
              }
            </div>
          </Card>

          {/* Status */}
          <Card glow className="p-5">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--t-primary)' }}>
              <Zap size={15} /> AI Engine Status
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Status',    value: '● Online' },
                { label: 'Sessions',  value: `${conversations.length} total` },
                { label: 'Messages',  value: `${messages.length} in session` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span style={{ color: 'var(--t-text-muted)' }}>{label}</span>
                  <span className="font-bold" style={{ color: 'var(--t-text)' }}>{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
