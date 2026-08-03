import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, FileText, Download, PieChart, Activity } from 'lucide-react';

const DEMO_REPLIES = [
  "I'll analyze your institution's data and generate the NAAC Self Study Report. Based on your Digital Twin, I can see you have 5 departments and 12 programs.\\n\\n**Starting NAAC SSR Generation...**\\n\\n✅ Chapter 1: Institutional Information — Complete\\n✅ Chapter 2: Teaching-Learning — 87% Complete\\n⚠️ Chapter 3: Research — Missing 4 publications data\\n⚠️ Chapter 4: Infrastructure — Lab utilization data needed\\n\\nShall I generate the complete draft with available data and mark gaps for your team to fill?",
  "I've identified **7 critical gaps** in your accreditation documentation:\\n\\n1. 🔴 Faculty PhD completion certificates — 3 missing\\n2. 🔴 Lab equipment purchase invoices — 2026 missing\\n3. 🟡 Student feedback forms — Last 2 semesters\\n4. 🟡 Alumni survey reports — 2024-25 missing\\n5. 🟡 Industry collaboration MoUs — 3 expired\\n6. 🟢 Research publications — Only 2 indexed\\n7. 🟢 Extension activities — Documentation incomplete\\n\\nWould you like me to create a **remediation action plan** with deadlines?",
  "Your estimated NAAC score based on current documentation is **2.87 CGPA** (B+ Grade).\\n\\nTo reach **A Grade (3.01+)**, you need to:\\n\\n📈 Research: Add 8 more Scopus-indexed papers (+0.08 CGPA)\\n📈 Student Support: Complete mentoring records (+0.04 CGPA)\\n📈 Governance: Update BoG meeting minutes (+0.02 CGPA)\\n\\n**Estimated consulting cost to achieve A Grade:** ₹3,50,000\\n**Using EduFlow AI OS:** ₹0 — I'll generate all documentation.\\n\\nShall I start the improvement plan?",
];

export default function AccreditationOfficer() {
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

    // Simulate network delay
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

  const handleGenerateReport = async (reportName) => {
    // Add user message asking to generate
    setMessages(prev => [...prev, { role: 'user', content: `Generate ${reportName}` }]);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3000/api/v1/officers/accreditation/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reportType: reportName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ **${reportName}** has been generated successfully.\n\n[Download PDF](${data.reportUrl})` 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Error generating report: ${err.message}` 
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
              <span style={{ fontSize: '1.5rem' }}>🏛️</span> Accreditation Officer
            </h1>
            <span style={{
              background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6',
              padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold'
            }}>AI Active</span>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 'bold' }}>
            Generate Reports
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              "NAAC Self Study Report",
              "NBA Outcome Based Education Report",
              "AICTE Compliance Report",
              "UGC Recognition Report"
            ].map((report, idx) => (
              <button key={idx} onClick={() => handleGenerateReport(report)} style={{
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: 'white', padding: '0.75rem 1rem', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', fontSize: '0.9rem'
              }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)'; }}>
                <FileText size={18} color="#8B5CF6" /> {report}
              </button>
            ))}
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />

          <h3 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 'bold' }}>
            Accreditation Readiness
          </h3>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%', border: '8px solid #8B5CF6',
              borderTopColor: 'rgba(255,255,255,0.1)', borderRightColor: 'rgba(255,255,255,0.1)',
              margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(45deg)'
            }}>
              <div style={{ transform: 'rotate(-45deg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>78%</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Score</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10B981' }}>●</span> Teaching & Learning</span>
                <span>85%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#2563EB' }}>●</span> Research</span>
                <span>72%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#F59E0B' }}>●</span> Infrastructure</span>
                <span>81%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#EF4444' }}>●</span> Student Support</span>
                <span>68%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#8B5CF6' }}>●</span> Governance</span>
                <span>79%</span>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />

          <h3 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 'bold' }}>
            Recent Reports
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'NAAC SSR Draft v2', time: '2 hrs ago' },
              { name: 'NBA OBE Report', time: 'Yesterday' },
              { name: 'AICTE Compliance 2026', time: '3 days ago' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{r.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{r.time}</div>
                </div>
                <button style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                  width: '32px', height: '32px', borderRadius: '4px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} title="Download">
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
            padding: '1rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex', alignItems: 'center', gap: '1rem'
          }}>
            <Sparkles color="#8B5CF6" size={24} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROI Tracker</div>
              <div style={{ fontWeight: 'bold' }}>₹2,50,000 consulting fees saved</div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Panel: Chat Interface */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
        
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '1.5rem',
              border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)'
            }}>
              🏛️
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Accreditation Officer</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '400px', textAlign: 'center', marginBottom: '2rem' }}>
              I can analyze your data, generate compliance reports, and identify documentation gaps. How can I help today?
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
                  background: msg.role === 'user' ? '#2563EB' : 'rgba(139, 92, 246, 0.2)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(139, 92, 246, 0.5)'
                }}>
                  {msg.role === 'user' ? 'SA' : '🏛️'}
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
            {["Generate NAAC SSR", "Find missing documents", "Check NBA compliance", "Estimate readiness score"].map((chip, i) => (
              <button key={i} onClick={() => handleSend(chip)} style={{
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
              placeholder="Ask me to generate NAAC report, identify gaps, check compliance..."
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
                background: inputValue.trim() ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
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
    </div>
  );
}
