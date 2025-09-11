// App.jsx
import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Overview from './components/Overview/Overview';
import StudentActivity from './components/StudentActivity/StudentActivity';
import TeacherAction from './components/TeacherAction/TeacherAction';
import AIAssistant from './components/AIAssistant/AIAssistant';
import Header from './components/common/Header';

function App() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'studentActivity':
        return <StudentActivity />;
      case 'teacherAction':
        return <TeacherAction />;
      case 'aiAssistant':
        return <AIAssistant />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="App">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="main-content">
        <Header title="SmartLearners.ai - Comprehensive Analytics Dashboard" />
        <div className="content-wrapper">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default App;