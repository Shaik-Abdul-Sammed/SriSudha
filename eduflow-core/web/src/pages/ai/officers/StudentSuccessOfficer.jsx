import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, AlertTriangle, AlertCircle, CheckCircle2, Users, BookOpen, CreditCard, Activity } from 'lucide-react';
import { getApiBaseURL } from '../../../config/apiConfig';

const DEMO_REPLIES = [
  "I've analyzed **847 students** across all departments. Here's the risk summary:\\n\\n🔴 **HIGH RISK — Immediate Action Required (12 students)**\\nThese students have 3+ risk factors: attendance <60%, 2+ backlogs, and disengagement signals.\\n\\n🟡 **MEDIUM RISK — Monitor Closely (34 students)**\\nAttendance between 60-75%, minor academic issues.\\n\\n🟢 **ON TRACK (801 students)**\\nPerforming within acceptable parameters.\\n\\nShall I generate **individual intervention plans** for the 12 high-risk students and notify their faculty mentors?",
  "**Intervention Plan Generated for High-Risk Students:**\\n\\n**Student: Ravi Kumar (CS-3rd Year)**\\n- Risk Score: 87/100 (Critical)\\n- Attendance: 54% (Required: 75%)\\n- Backlogs: 3 subjects\\n- Fee Status: 2 months overdue\\n\\n**Recommended Actions:**\\n1. ✅ Faculty mentor meeting scheduled\\n2. ✅ Parent WhatsApp alert sent\\n3. ✅ Counsellor appointment booked\\n4. ✅ Fee concession application triggered\\n5. ✅ Remedial class enrollment initiated\\n\\nAll 12 high-risk students have been processed. Total time saved: **14 hours** vs manual processing.",
];

export default function StudentSuccessOfficer() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [demoIndex, setDemoIndex] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      const reply = DEMO_REPLIES[demoIndex % DEMO_REPLIES.length];
      setDemoIndex(prev => prev + 1);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  const handlePredictRisk = async (actionName) => {
    setMessages(prev => [...prev, { role: 'user', content: actionName }]);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiBaseURL()}/v1/officers/student-success/predict-risk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: actionName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to predict risk');
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
              <span style={{ fontSize: '1.5rem' }}>📊</span> Student Success Officer
            </h1>
            <span style={{
              background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444',
              padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', gap: '0.25rem'
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', animation: 'pulse 2s infinite' }} />
              Monitoring
            </span>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 'bold' }}>
            Risk Overview
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#EF4444' }}>
                <AlertCircle size={20} /> <span style={{ fontWeight: 500 }}>High Risk</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>12</span>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#F59E0B' }}>
                <AlertTriangle size={20} /> <span style={{ fontWeight: 500 }}>Medium Risk</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>34</span>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10B981' }}>
                <CheckCircle2 size={20} /> <span style={{ fontWeight: 500 }}>On Track</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>801</span>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />

          <h3 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 'bold' }}>
            Risk Factors Detected
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Attendance below 75%', count: 28, icon: <Users size={16} /> },
              { label: '3+ backlogs', count: 14, icon: <BookOpen size={16} /> },
              { label: 'Fee default', count: 19, icon: <CreditCard size={16} /> },
              { label: 'Low engagement', count: 31, icon: <Activity size={16} /> }
            ].map((factor, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{factor.icon}</span> {factor.label}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' }}>
                  {factor.count} students
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />

          <h3 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 'bold' }}>
            Recent Interventions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              "Faculty notified for 12 at-risk students",
              "Parents alerted via WhatsApp for 8 students",
              "Counsellor sessions scheduled for 5 students"
            ].map((intervention, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', marginTop: '0.375rem' }} />
                {intervention}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(245, 158, 11, 0.2))',
            padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex', alignItems: 'center', gap: '1rem'
          }}>
            <Sparkles color="#EF4444" size={24} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROI Tracker</div>
              <div style={{ fontWeight: 'bold' }}>15% retention improvement predicted</div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Panel: Chat Interface */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
        
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '1.5rem',
              border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)'
            }}>
              📊
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Student Success Officer</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '400px', textAlign: 'center', marginBottom: '2rem' }}>
              I can predict dropout risk, generate intervention plans, and analyze student performance. How can I help today?
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
                  background: msg.role === 'user' ? '#2563EB' : 'rgba(239, 68, 68, 0.2)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(239, 68, 68, 0.5)'
                }}>
                  {msg.role === 'user' ? 'SA' : '📊'}
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
            {["Show at-risk students", "Generate intervention plan", "Predict placement readiness", "Attendance analysis"].map((chip, i) => (
              <button key={i} onClick={() => handlePredictRisk(chip)} style={{
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
              placeholder="Ask me to predict dropout risk, generate intervention plans, analyze student performance..."
              style={{
                flex: 1, background: 'transparent', border: 'none', color: 'white',
                padding: '0.75rem', fontSize: '1rem', resize: 'none', outline: 'none', minHeight: '44px', maxHeight: '120px'
              }}
              rows={1}
            />
            <button 
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim()}
              style={{
                background: inputValue.trim() ? '#EF4444' : 'rgba(255,255,255,0.1)',
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
