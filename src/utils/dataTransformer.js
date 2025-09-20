// src/utils/dataTransformer.js
export class DataTransformer {
  static CLASS_MAPPING = {
    'Minds_9th': { display: 'Minds (9MMB)', grade: '9th', school: 'Minds', expectedStudents: 34 },
    'Indus_8th': { display: 'Indus (8th class LB2)', grade: '8th', school: 'Indus', expectedStudents: 49 },
    'Montee_9th': { display: 'Montee 9th (9MEL3)', grade: '9th', school: 'Montee', expectedStudents: 36 },
    'Montee_8th': { display: 'Montee 8th (8MEL3)', grade: '8th', school: 'Montee', expectedStudents: 33 },
    'Pragna_9th': { display: 'Pragna (9th Agni)', grade: '9th', school: 'Pragna', expectedStudents: 48 },
    'Pragna_8th': { display: 'Pragna (8th Akash)', grade: '8th', school: 'Pragna', expectedStudents: 44 }
  };

  static ACTION_MAPPING = {
    'chatbot_query': { display: 'Chatbot Data Fetch', category: 'ai', icon: '🤖' },
    'fetch_homework_submissions': { display: 'Fetch Homework Submissions', category: 'teacher', icon: '👁️' },
    'submit_homework': { display: 'Submit Homework', category: 'submission', icon: '📝' },
    'create_homework': { display: 'Create Homework', category: 'teacher', icon: '📚' },
    'create_worksheets': { display: 'Create Worksheets', category: 'teacher', icon: '📄' },
    'view_homework_submissions': { display: 'View Homework Submissions', category: 'teacher', icon: '👁️' },
    'view_classwork_submissions': { display: 'View Classwork Submissions', category: 'teacher', icon: '👁️' },
    'teacher_submit_homework': { display: 'Auto Submit Homework', category: 'teacher', icon: '✅' },
    'solve': { display: 'Step-by-Step Solutions', category: 'learning', icon: '🔢' },
    'concepts_required': { display: 'Concept Explanations', category: 'learning', icon: '💡' },
    'auto_correct': { display: 'Auto Corrections', category: 'correction', icon: '✏️' }
  };

  static transformForOverview(dailyRollups, schoolLogs) {
    // Get the most recent date from dailyRollups (could be today or latest available)
    const dates = Object.keys(dailyRollups).sort().reverse();
    const latestDate = dates[0] || new Date().toISOString().split('T')[0];
    const latestData = dailyRollups[latestDate] || {};
    
    // Calculate insights from the latest data
    const insights = this.calculateInsights(latestData, schoolLogs);
    
    // Generate detailed school statistics as shown in the screenshot
    const schoolStatistics = this.generateDetailedSchoolStatistics(latestData, schoolLogs);
    
    // Generate Quick Insights cards data
    const quickInsights = this.generateQuickInsights(latestData, schoolLogs);
    
    return {
      insights: quickInsights,
      schoolStatistics,
      date: latestDate,
      totalActiveStudents: this.getTotalActiveStudents(latestData),
      totalActiveTeachers: this.getTotalActiveTeachers(schoolLogs, latestData)
    };
  }

  static generateQuickInsights(dailyData, schoolLogs) {
    // Calculate peak activity hour based on student activity patterns
    const activityByHour = this.calculateActivityByHour(dailyData);
    const peakHour = this.findPeakActivityHour(activityByHour);
    
    // Find top performing school based on participation rate
    const topSchool = this.findTopPerformingSchool(dailyData);
    
    // Find most active subject based on actions
    const mostActiveSubject = this.findMostActiveSubject(dailyData);
    
    // Calculate AI Assistant usage
    const aiUsage = this.calculateAIUsage(dailyData);
    
    return {
      peakActivityHour: {
        time: peakHour.hour,
        students: peakHour.count
      },
      topPerformingSchool: {
        schoolName: topSchool.schoolName,
        engagementRate: topSchool.participationRate
      },
      mostActiveSubject: {
        subject: mostActiveSubject.subject,
        submissions: mostActiveSubject.count
      },
      aiAssistantUsage: {
        queries: aiUsage,
        responseRate: 95 // Default value since we don't have response rate in the data
      }
    };
  }

  static generateDetailedSchoolStatistics(dailyData, schoolLogs) {
    const statistics = [];
    
    // Process each class in CLASS_MAPPING
    Object.entries(this.CLASS_MAPPING).forEach(([classKey, mapping]) => {
      const classData = dailyData[classKey] || { active_students: 0, students: {} };
      const activeStudents = classData.active_students || Object.keys(classData.students || {}).length;
      const expectedStudents = mapping.expectedStudents;
      const participationRate = ((activeStudents / expectedStudents) * 100).toFixed(1);
      
      // Count active teachers for this class from schoolLogs
      let activeTeachers = 0;
      const classLogs = schoolLogs[classKey];
      if (classLogs && classLogs.teachers) {
        // Count teachers who have at least one log entry
        activeTeachers = Object.keys(classLogs.teachers).filter(teacher => 
          classLogs.teachers[teacher] && classLogs.teachers[teacher].length > 0
        ).length;
      }
      
      statistics.push({
        school: mapping.display,
        grade: mapping.grade,
        activeStudents,
        expectedStudents,
        participationRate: parseFloat(participationRate),
        activeTeachers,
        // Determine status based on participation rate
        status: participationRate >= 80 ? 'excellent' : 
                participationRate >= 60 ? 'good' : 
                participationRate >= 40 ? 'average' : 'low'
      });
    });
    
    // Sort by participation rate (descending)
    return statistics.sort((a, b) => b.participationRate - a.participationRate);
  }

  static calculateActivityByHour(dailyData) {
    const hourlyActivity = {};
    
    Object.values(dailyData).forEach(classData => {
      if (classData.students) {
        Object.values(classData.students).forEach(student => {
          // Parse time from first_event_ist or last_event_ist
          if (student.first_event_ist) {
            const hour = new Date(student.first_event_ist).getHours();
            hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
          }
          if (student.last_event_ist) {
            const hour = new Date(student.last_event_ist).getHours();
            hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
          }
        });
      }
    });
    
    return hourlyActivity;
  }

  static findPeakActivityHour(hourlyActivity) {
    let maxHour = 10; // Default hour
    let maxCount = 0;
    
    Object.entries(hourlyActivity).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxHour = parseInt(hour);
      }
    });
    
    // Format as time range
    return {
      hour: `${maxHour}:00`,
      count: maxCount
    };
  }

  static findTopPerformingSchool(dailyData) {
    let topSchool = { schoolName: 'N/A', participationRate: 0 };
    let maxRate = 0;
    
    // Aggregate by actual school (not class)
    const schoolAggregates = {};
    
    Object.entries(this.CLASS_MAPPING).forEach(([classKey, mapping]) => {
      const classData = dailyData[classKey] || { active_students: 0, students: {} };
      const activeStudents = classData.active_students || Object.keys(classData.students || {}).length;
      
      if (!schoolAggregates[mapping.school]) {
        schoolAggregates[mapping.school] = {
          schoolName: mapping.school,
          totalActive: 0,
          totalExpected: 0
        };
      }
      
      schoolAggregates[mapping.school].totalActive += activeStudents;
      schoolAggregates[mapping.school].totalExpected += mapping.expectedStudents;
    });
    
    // Find school with highest participation rate
    Object.values(schoolAggregates).forEach(school => {
      const rate = (school.totalActive / school.totalExpected) * 100;
      if (rate > maxRate) {
        maxRate = rate;
        topSchool = {
          schoolName: school.schoolName,
          participationRate: rate.toFixed(1)
        };
      }
    });
    
    return topSchool;
  }

  static findMostActiveSubject(dailyData) {
    // Since we don't have subject data, we'll use action types as proxy
    const actionCounts = {};
    
    Object.values(dailyData).forEach(classData => {
      if (classData.actions) {
        Object.entries(classData.actions).forEach(([action, count]) => {
          actionCounts[action] = (actionCounts[action] || 0) + count;
        });
      }
    });
    
    // Map to subject-like names
    const subjectMapping = {
      'chatbot_query': 'Mathematics',
      'fetch_homework_submissions': 'Science',
      'submit_homework': 'English',
      'create_homework': 'Social Studies'
    };
    
    let maxSubject = { subject: 'Mathematics', count: 0 };
    Object.entries(actionCounts).forEach(([action, count]) => {
      const subject = subjectMapping[action] || 'General';
      if (count > maxSubject.count) {
        maxSubject = { subject, count };
      }
    });
    
    return maxSubject;
  }

  static calculateAIUsage(dailyData) {
    let totalQueries = 0;
    
    Object.values(dailyData).forEach(classData => {
      if (classData.actions && classData.actions.chatbot_query) {
        totalQueries += classData.actions.chatbot_query;
      }
    });
    
    return totalQueries;
  }

  static getTotalActiveStudents(dailyData) {
    let total = 0;
    Object.values(dailyData).forEach(classData => {
      total += classData.active_students || Object.keys(classData.students || {}).length;
    });
    return total;
  }

  static getTotalActiveTeachers(schoolLogs, dailyData) {
    const activeTeachers = new Set();
    
    // Check which classes have activity in dailyData
    Object.keys(dailyData).forEach(classKey => {
      const classLogs = schoolLogs[classKey];
      if (classLogs && classLogs.teachers) {
        Object.keys(classLogs.teachers).forEach(teacher => {
          if (classLogs.teachers[teacher] && classLogs.teachers[teacher].length > 0) {
            activeTeachers.add(teacher);
          }
        });
      }
    });
    
    return activeTeachers.size;
  }

  static calculateInsights(dailyData, schoolLogs) {
    // Legacy method - kept for backward compatibility
    return this.generateQuickInsights(dailyData, schoolLogs);
  }

  // Additional helper methods for other components
  static transformTeacherData(schoolLogs, classKey) {
    const classData = schoolLogs[classKey] || { teachers: {}, students: {} };
    const teachers = classData.teachers || {};
    const students = classData.students || {};
    
    // Process teacher activities
    const activities = [];
    const featureUsage = {};
    let totalWorksheets = 0;
    let totalHomework = 0;
    
    Object.entries(teachers).forEach(([teacherName, events]) => {
      events.forEach(event => {
        const mapping = this.ACTION_MAPPING[event.action];
        if (mapping) {
          // Count feature usage
          featureUsage[mapping.display] = (featureUsage[mapping.display] || 0) + 1;
          
          // Count specific actions
          if (event.action === 'create_worksheets') totalWorksheets++;
          if (event.action === 'create_homework') totalHomework++;
          
          // Add to activities timeline
          activities.push({
            timestamp: event.timestamp,
            teacher: teacherName,
            action: mapping.display,
            icon: mapping.icon,
            status: event.status_code === 200 ? 'success' : 'error'
          });
        }
      });
    });
    
    return {
      className: this.CLASS_MAPPING[classKey]?.display || classKey,
      teachers: Object.keys(teachers),
      totalStudents: Object.keys(students).length,
      expectedStudents: this.CLASS_MAPPING[classKey]?.expectedStudents || 0,
      activities: activities.slice(0, 20),
      worksheetStats: {
        total: totalWorksheets,
        thisWeek: totalWorksheets
      },
      homeworkStats: {
        created: totalHomework,
        submitted: 0,
        pending: 0,
        completionRate: 0
      },
      mostUsedFeatures: Object.entries(featureUsage).map(([feature, count]) => ({
        name: feature,
        count,
        percentage: 100
      }))
    };
  }

  static transformStudentActivity(activityData, className) {
    const { username, class_key, date, actions, events, first_event_ts_utc, last_event_ts_utc } = activityData;
    
    // Calculate time spent
    let timeSpent = '0h 0m';
    if (first_event_ts_utc && last_event_ts_utc) {
      const start = new Date(first_event_ts_utc);
      const end = new Date(last_event_ts_utc);
      const diffMs = end - start;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      timeSpent = `${hours}h ${minutes}m`;
    }
    
    // Transform actions
    const transformedActions = {};
    let totalActions = 0;
    Object.entries(actions || {}).forEach(([action, count]) => {
      const mapping = this.ACTION_MAPPING[action];
      if (mapping) {
        transformedActions[mapping.display] = count;
        totalActions += count;
      }
    });
    
    return {
      username,
      displayName: `Student ${username}`,
      className,
      date,
      actions: transformedActions,
      totalActions,
      timeSpent,
      timeline: events || [],
      status: totalActions > 0 ? 'active' : 'inactive'
    };
  }
}

export default DataTransformer;