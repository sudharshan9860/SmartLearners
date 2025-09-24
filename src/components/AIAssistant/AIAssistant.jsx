// src/components/AIAssistant/AIAssistant.jsx
import React, { useState, useEffect, useRef } from 'react';
import './AIAssistant.css';
import { 
  FiSend, 
  FiRefreshCw, 
  FiTrash2, 
  FiDatabase,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiUser,
  FiCpu
} from 'react-icons/fi';
import ApiService from '../../services/apiService';

const AIAssistant = ({ apiHealthy }) => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatStats, setChatStats] = useState(null);
  const [dataFreshness, setDataFreshness] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize chat session on mount
  useEffect(() => {
    if (apiHealthy) {
      initializeChatSession();
      loadChatStats();
    }
  }, [apiHealthy]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChatSession = async () => {
    try {
      console.log('Creating new chat session...');
      const response = await ApiService.createChatSession();
      console.log('Session created:', response);
      
      if (!response.session_id) {
        throw new Error('No session ID received from server');
      }
      
      setSessionId(response.session_id);
      setMessages([{
        id: Date.now(),
        type: 'system',
        content: 'Welcome to SmartLearners AI Assistant! Ask me about student activity data.',
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error('Failed to initialize chat session:', err);
      setError('Failed to start chat session. Please refresh and try again.');
    }
  };

  const loadChatStats = async () => {
    try {
      const stats = await ApiService.getChatbotStats();
      setChatStats(stats);
    } catch (err) {
      console.error('Failed to load chat stats:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending message with session ID:', sessionId);
      console.log('Message content:', userMessage.content);
      
      const response = await ApiService.sendChatMessage(sessionId, userMessage.content);
      
      console.log('Received response:', response);
      
      // Only use the answer from the response, ignore data and sql
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer, // Only show the answer text
        timestamp: new Date(),
        dataFreshness: response.data_freshness
      };

      setMessages(prev => [...prev, botMessage]);
      setDataFreshness(response.data_freshness);
      
      // Update stats after successful message
      loadChatStats();
    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to send message. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearSession = async () => {
    if (!sessionId) return;
    
    try {
      await ApiService.clearChatSession(sessionId);
      setMessages([]);
      initializeChatSession();
    } catch (err) {
      console.error('Failed to clear session:', err);
      setError('Failed to clear chat session.');
    }
  };

  const handleSyncData = async () => {
    try {
      setIsLoading(true);
      const apiKey = 'admin-secret-key-123';
      await ApiService.triggerDataSync(apiKey);
      
      const syncMessage = {
        id: Date.now(),
        type: 'system',
        content: 'Data sync initiated successfully. Fresh data will be available shortly.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, syncMessage]);
      
      setTimeout(loadChatStats, 5000);
    } catch (err) {
      console.error('Failed to sync data:', err);
      setError('Failed to trigger data sync. Admin privileges required.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getFreshnessColor = (hours) => {
    if (hours < 1) return '#48bb78'; // Green
    if (hours < 4) return '#f6ad55'; // Orange
    return '#f56565'; // Red
  };

  return (
    <div className="ai-assistant-container">
      {/* Header Section */}
      <div className="ai-header">
        <div className="ai-title-section">
          <FiCpu className="ai-icon" />
          <div>
            <h2>AI Assistant - Student Activity Analytics</h2>
            <p className="ai-subtitle">Ask questions about student data and get instant insights</p>
          </div>
        </div>
        
        <div className="ai-actions">
          <button 
            className="ai-action-btn sync-btn" 
            onClick={handleSyncData}
            disabled={isLoading}
            title="Sync Data"
          >
            <FiRefreshCw className={isLoading ? 'spinning' : ''} />
          </button>
          <button 
            className="ai-action-btn clear-btn" 
            onClick={handleClearSession}
            title="Clear Chat"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Stats Cards - Removed Active Students and Active Teachers, kept only Data Points and Freshness */}
      <div className="ai-stats-grid">
        <div className="ai-stat-card">
          <div className="stat-icon-wrapper purple">
            <FiDatabase />
          </div>
          <div className="stat-content">
            <span className="stat-label">Data Points</span>
            <span className="stat-value">
              {chatStats?.data_range ? 
                `${new Date(chatStats.data_range.earliest).toLocaleDateString()} - ${new Date(chatStats.data_range.latest).toLocaleDateString()}` 
                : 'Loading...'}
            </span>
          </div>
        </div>

        <div className="ai-stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: dataFreshness?.is_fresh ? '#e8f5e9' : '#ffebee' }}>
            <FiClock style={{ color: getFreshnessColor(dataFreshness?.hours_ago || 0) }} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Data Freshness</span>
            <span className="stat-value" style={{ color: getFreshnessColor(dataFreshness?.hours_ago || 0) }}>
              {dataFreshness ? `${dataFreshness.hours_ago.toFixed(1)} hours ago` : 'Checking...'}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="ai-chat-container">
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'user' ? <FiUser /> : 
                 message.type === 'bot' ? <FiCpu /> : 
                 message.type === 'error' ? <FiAlertCircle /> : 
                 <FiCheckCircle />}
              </div>
              <div className="message-content">
                {/* Only show the message content text, no data or SQL */}
                <div className="message-text">{message.content}</div>
                <span className="message-time">{formatTimestamp(message.timestamp)}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot loading">
              <div className="message-avatar"><FiCpu /></div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="chat-input-section">
          {error && (
            <div className="chat-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}
          <div className="chat-input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about student activity, attendance, or performance..."
              className="chat-input"
              rows="2"
              disabled={!sessionId || isLoading}
            />
            <button 
              onClick={handleSendMessage}
              className="send-button"
              disabled={!inputMessage.trim() || !sessionId || isLoading}
            >
              <FiSend />
            </button>
          </div>
          <div className="input-hints">
            <span>Try: "How many students are active today?"</span>
            <span>•</span>
            <span>"Show me the earliest data available"</span>
            <span>•</span>
            <span>"What's the total count of teachers?"</span>
          </div>
        </div>
      </div>

      {/* Sample Questions */}
      <div className="sample-questions">
        <h3>Quick Questions</h3>
        <div className="questions-grid">
          {[
            "How many teachers are there?",
            "From them, who was active today?",
            "What did they do?",
            "How many teachers created classwork?",
            "Which teachers created classwork?",
            "How many classwork were created?",
            "Show me all classwork submissions",
            "How many students were active today?",
            "Which students were active today?",
            "Who's using the AI chatbot today?",
            "What homework was assigned today?",
            "Show me teacher activities today",
            "Which teachers reviewed homework today?",
            "How many Grade 8 students used the Solve feature today?",
            "Show me Grade 9 students who submitted homework today",
            "List students in 8ILB who haven't been active this week",
            "How many times did students use the chatbot today?",
            "Which students used Auto-Correct today?",
            "What did mohan@mmb do today?",
            "Show me all teacher activities with counts",
            "List those teachers",
            "What are their IDs?"
          ].map((question, index) => (
            <button
              key={index}
              className="question-chip"
              onClick={() => setInputMessage(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;