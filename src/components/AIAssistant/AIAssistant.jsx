// AIAssistant.jsx
import React, { useState } from 'react';
import './AIAssistant.css';
import { aiAssistantData } from '../../data/mockData';
import { FiSend, FiMic, FiPaperclip, FiThumbsUp, FiCopy } from 'react-icons/fi';

const AIAssistant = ({ filters }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'assistant',
      message: "Hello! I'm your SmartLearners AI Assistant. I can help you with:\n• Analyzing student performance data\n• Understanding teacher engagement metrics\n• Identifying trends and patterns\n• Generating insights and recommendations\n• Answering questions about platform usage",
      time: new Date().toLocaleTimeString()
    }
  ]);

  const { quickQuestions, insights } = aiAssistantData;

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add user message
      setChatHistory(prev => [...prev, {
        type: 'user',
        message: message,
        time: new Date().toLocaleTimeString()
      }]);

      // Simulate AI response
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          type: 'assistant',
          message: `I've analyzed your query about "${message}". Based on the current data, here are my findings...`,
          time: new Date().toLocaleTimeString()
        }]);
      }, 1000);

      setMessage('');
    }
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-header">
        <div className="ai-avatar">
          <span className="ai-icon">🤖</span>
        </div>
        <div className="ai-info">
          <h2 className="ai-title">AI Assistant for SmartLearners Analytics</h2>
          <p className="ai-subtitle">Ask me anything about your platform data, student performance, teacher activities, or get insights!</p>
        </div>
      </div>

      <div className="ai-content">
        <div className="chat-section">
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div 
                key={index} 
                className={`chat-message ${chat.type}`}
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className="message-avatar">
                  {chat.type === 'assistant' ? '🤖' : '👤'}
                </div>
                <div className="message-content">
                  <p className="message-text">{chat.message}</p>
                  <div className="message-actions">
                    <span className="message-time">{chat.time}</span>
                    {chat.type === 'assistant' && (
                      <>
                        <button className="action-btn" title="Copy">
                          <FiCopy />
                        </button>
                        <button className="action-btn" title="Like">
                          <FiThumbsUp />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask me anything about your SmartLearners data..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <div className="input-actions">
                <button className="input-btn" title="Attach file">
                  <FiPaperclip />
                </button>
                <button className="input-btn" title="Voice input">
                  <FiMic />
                </button>
                <button 
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="assistant-sidebar">
          <div className="quick-questions">
            <h3 className="sidebar-title">Quick Questions:</h3>
            <div className="questions-list">
              {quickQuestions.map((q) => (
                <button
                  key={q.id}
                  className="question-btn"
                  onClick={() => handleQuickQuestion(q.question)}
                >
                  <span className="question-icon">{q.icon}</span>
                  <span className="question-text">{q.question}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ai-insights">
            <h3 className="sidebar-title">Latest Insights</h3>
            <div className="insights-list">
              {insights.map((insight, index) => (
                <div 
                  key={index}
                  className={`insight-card ${insight.type}`}
                >
                  <h4 className="insight-title">{insight.title}</h4>
                  <p className="insight-description">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-capabilities">
            <h3 className="sidebar-title">What I Can Do</h3>
            <ul className="capabilities-list">
              <li>📊 Analyze performance trends across schools</li>
              <li>🎯 Identify at-risk students needing support</li>
              <li>📈 Generate detailed performance reports</li>
              <li>💡 Provide actionable recommendations</li>
              <li>🔍 Find patterns in learning behaviors</li>
              <li>📅 Predict future performance trends</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;