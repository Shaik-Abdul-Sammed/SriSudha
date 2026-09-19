import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, DollarSign, PieChart } from 'lucide-react';
import { getApiBaseURL } from '../../../config/apiConfig';

export default function FinanceOfficer() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReconcile = async (actionName) => {
    setMessages(prev => [...prev, { role: 'user', content: actionName }]);
    setInputValue('');
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiBaseURL()}/v1/officers/finance/reconcile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: actionName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reconcile finances');
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Error: ${err.message}` 
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReconcile(inputValue);
    }
  };

  const formatMessage = (text) => {
    return text.split('\\n').map((line, i) => (
      <span key={i}>
        {line.split('**').map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
        <br />
      </span>
    ));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0E27',
      color: 'white',
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      overflow: 'hidden'
    }}>
      {/* Left Panel */}
      <div style={{
        width: '380px',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.02)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/officers-dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem'
          }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span> Finance Officer
            </h1>
            <span style={{
              background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B',
              padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', gap: '0.25rem'
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', animation: 'pulse 2s infinite' }} />
              Monitoring
            </span>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 'bold' }}>
            Daily Overview
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                <DollarSign size={20} /> <span style={{ fontWeight: 500 }}>Unmatched Payments</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#F59E0B' }}>4</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                <PieChart size={20} /> <span style={{ fontWeight: 500 }}>Reconciled Today</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>₹8.4L</span>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />

          <h3 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 'bold' }}>
            Automated Tasks
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              "Matched 138 UPI transactions with student records",
              "Generated 31 fee payment receipts",
              "Drafted salary slip emails for 120 staff"
            ].map((task, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', marginTop: '0.375rem' }} />
                {task}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2))',
            padding: '1rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex', alignItems: 'center', gap: '1rem'
          }}>
            <Sparkles color="#F59E0B" size={24} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROI Tracker</div>
              <div style={{ fontWeight: 'bold' }}>₹30k manual accounting saved</div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Panel: Chat Interface */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
        
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '1.5rem',
              border: '1px solid rgba(245, 158, 11, 0.3)', boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)'
            }}>
              💰
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Finance Officer</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '400px', textAlign: 'center', marginBottom: '2rem' }}>
              I can reconcile fee payments, analyze bank statements, and automate payroll processing instantly.
            </p>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', gap: '1rem', marginBottom: '1.5rem',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                  background: msg.role === 'user' ? '#2563EB' : 'rgba(245, 158, 11, 0.2)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(245, 158, 11, 0.5)'
                }}>
                  {msg.role === 'user' ? 'SA' : '💰'}
                </div>
                <div style={{
                  background: msg.role === 'user' ? '#2563EB' : 'rgba(255,255,255,0.05)',
                  padding: '1rem', borderRadius: '12px', maxWidth: '80%',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  lineHeight: '1.6'
                }}>
                  {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div style={{ padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: '#0A0E27' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {["Reconcile yesterday's UPI payments", "Generate payroll for April", "Identify fee defaulters", "Match scholarship funds"].map((chip, i) => (
              <button key={i} onClick={() => handleReconcile(chip)} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)',
                padding: '0.375rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s'
              }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                {chip}
              </button>
            ))}
          </div>
          
          <div style={{
            display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '0.5rem'
          }}>
            <textarea 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to reconcile accounts or generate financial reports..."
              style={{
                flex: 1, background: 'transparent', border: 'none', color: 'white',
                padding: '0.75rem', fontSize: '1rem', resize: 'none', outline: 'none', minHeight: '44px', maxHeight: '120px'
              }}
              rows={1}
            />
            <button 
              onClick={() => handleReconcile(inputValue)}
              disabled={!inputValue.trim()}
              style={{
                background: inputValue.trim() ? '#F59E0B' : 'rgba(255,255,255,0.1)',
                color: inputValue.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                border: 'none', width: '44px', height: '44px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
