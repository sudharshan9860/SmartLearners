export class DataTransformer {
  static CLASS_MAPPING = {
    'Minds_9th': { display: 'Minds (9MMB)', grade: '9th', school: 'Minds', expectedStudents: 34 },
    'Indus_8th': { display: 'Indus (8th class LB2)', grade: '8th', school: 'Indus', expectedStudents: 49 },
    'Montee_9th': { display: 'Montee 9th (9MEL3)', grade: '9th', school: 'Montee', expectedStudents: 36 },
    'Montee_8th': { display: 'Montee 8th (8MEL3)', grade: '8th', school: 'Montee', expectedStudents: 33 },
    'Pragnya_9th': { display: 'Pragna (9th Agni)', grade: '9th', school: 'Pragna', expectedStudents: 48 },
    'Pragnya_8th': { display: 'Pragna (8th Akash)', grade: '8th', school: 'Pragna', expectedStudents: 44 }
  };

  static ACTION_MAPPING = {
    'chatbot_query': { display: 'Chatbot Data Fetch', category: 'ai', icon: '🤖' },
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
    const today = new Date().toISOString().split('T')[0];
    const todayData = dailyRollups[today] || {};
    
    // Calculate insights
    const insights = this.calculateInsights(todayData, schoolLogs);
    
    // Generate school statistics
    const schoolStatistics = this.generateSchoolStatistics(todayData, schoolLogs);
    
    // Generate top performing schools (aggregate by actual school)
    const topPerformingSchools = this.generateTopPerformingSchools(schoolStatistics);
    
    // Generate participation chart data
    const participationChartData = this.generateParticipationChartData(schoolStatistics);
    
    return {
      insights,
      schoolStatistics,
      topPerformingSchools,
      participationChartData,
      summary: {
        totalActiveStudents: this.getTotalActiveStudents(todayData),
        totalActiveTeachers: this.getTotalActiveTeachers(schoolLogs),
        date: today
      }
    };
  }

  static calculateInsights(todayData, schoolLogs) {
    // Peak Activity Hour - Calculate from timestamps
    const peakHour = this.calculatePeakActivityHour(schoolLogs);
    
    // Top Performing Class
    const topClass = this.findTopPerformingClass(todayData);
    
    // AI Assistant Usage - Count chatbot queries
    const aiUsage = this.calculateAIUsage(todayData);
    
    // Most Active Feature (instead of subject)
    const mostActiveFeature = this.findMostActiveFeature(todayData);
    
    return {
      peakActivityHour: {
        time: peakHour.time,
        activeUsers: peakHour.count,
        trend: 'up',
        trendPercentage: 12.5
      },
      topPerformingSchool: {
        schoolName: topClass.displayName,
        engagementRate: topClass.participationRate,
        trend: topClass.participationRate > 80 ? 'up' : 'stable'
      },
      mostActiveFeature: {
        feature: mostActiveFeature.name,
        count: mostActiveFeature.count,
        icon: mostActiveFeature.icon
      },
      aiAssistantUsage: {
        queriesResolved: aiUsage,
        trend: 'up',
        resolvedToday: true
      }
    };
  }

  static calculatePeakActivityHour(schoolLogs) {
    const hourCounts = {};
    
    Object.values(schoolLogs).forEach(classData => {
      // Process student logs
      Object.values(classData.students || {}).forEach(events => {
        events.forEach(event => {
          if (event.timestamp) {
            const hour = new Date(event.timestamp).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
          }
        });
      });
      
      // Process teacher logs
      Object.values(classData.teachers || {}).forEach(events => {
        events.forEach(event => {
          if (event.timestamp) {
            const hour = new Date(event.timestamp).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
          }
        });
      });
    });
    
    let maxHour = 14;
    let maxCount = 0;
    
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxHour = parseInt(hour);
      }
    });
    
    return {
      time: `${maxHour}:00 - ${maxHour + 1}:00`,
      count: maxCount
    };
  }

  static findTopPerformingClass(todayData) {
    let topClass = null;
    let maxRate = 0;
    
    Object.entries(todayData).forEach(([classKey, data]) => {
      const mapping = this.CLASS_MAPPING[classKey];
      if (mapping) {
        const rate = (data.active_students / mapping.expectedStudents) * 100;
        if (rate > maxRate) {
          maxRate = rate;
          topClass = {
            key: classKey,
            displayName: mapping.display,
            participationRate: rate.toFixed(1)
          };
        }
      }
    });
    
    return topClass || { displayName: 'N/A', participationRate: 0 };
  }

  static calculateAIUsage(todayData) {
    let totalQueries = 0;
    
    Object.values(todayData).forEach(classData => {
      if (classData.actions?.chatbot_query) {
        totalQueries += classData.actions.chatbot_query;
      }
    });
    
    return totalQueries;
  }

  static findMostActiveFeature(todayData) {
    const featureCounts = {};
    
    Object.values(todayData).forEach(classData => {
      if (classData.actions) {
        Object.entries(classData.actions).forEach(([action, count]) => {
          const mapping = this.ACTION_MAPPING[action];
          if (mapping) {
            featureCounts[mapping.display] = (featureCounts[mapping.display] || 0) + count;
          }
        });
      }
    });
    
    let maxFeature = { name: 'Chatbot Data Fetch', count: 0, icon: '🤖' };
    Object.entries(featureCounts).forEach(([feature, count]) => {
      if (count > maxFeature.count) {
        maxFeature = { 
          name: feature, 
          count,
          icon: Object.values(this.ACTION_MAPPING).find(m => m.display === feature)?.icon || '📊'
        };
      }
    });
    
    return maxFeature;
  }

  static generateSchoolStatistics(todayData, schoolLogs) {
    const statistics = [];
    
    Object.entries(this.CLASS_MAPPING).forEach(([classKey, mapping]) => {
      const classData = todayData[classKey] || { active_students: 0, actions: {} };
      const activeStudents = classData.active_students || 0;
      const participationRate = (activeStudents / mapping.expectedStudents * 100).toFixed(1);
      
      // Count active teachers
      const teacherLogs = schoolLogs[classKey]?.teachers || {};
      const activeTeachers = Object.values(teacherLogs).filter(logs => logs.length > 0).length;
      
      statistics.push({
        schoolName: mapping.display,
        grade: mapping.grade,
        activeStudents,
        expectedStudents: mapping.expectedStudents,
        participationRate: parseFloat(participationRate),
        activeTeachers,
        status: participationRate >= 80 ? 'excellent' : 
                participationRate >= 60 ? 'good' : 
                participationRate >= 40 ? 'average' : 'critical',
        classKey
      });
    });
    
    return statistics;
  }

  static generateTopPerformingSchools(schoolStatistics) {
    // Aggregate by school name
    const schoolAggregates = {};
    
    schoolStatistics.forEach(stat => {
      const schoolName = stat.schoolName.split(' ')[0]; // Get school name (Minds, Indus, etc.)
      
      if (!schoolAggregates[schoolName]) {
        schoolAggregates[schoolName] = {
          schoolName,
          totalActive: 0,
          totalExpected: 0,
          totalTeachers: 0,
          classes: []
        };
      }
      
      schoolAggregates[schoolName].totalActive += stat.activeStudents;
      schoolAggregates[schoolName].totalExpected += stat.expectedStudents;
      schoolAggregates[schoolName].totalTeachers += stat.activeTeachers;
      schoolAggregates[schoolName].classes.push(stat);
    });
    
    // Calculate metrics and sort
    const schools = Object.values(schoolAggregates).map(school => {
      const participationRate = (school.totalActive / school.totalExpected * 100);
      return {
        schoolName: school.schoolName,
        studentActivity: school.totalActive,
        teacherEngagement: Math.min(95, participationRate + 5),
        assignmentCompletion: Math.min(90, participationRate - 2),
        averageScore: Math.min(91, participationRate),
        participationRate,
        trend: participationRate >= 80 ? 'up' : participationRate >= 50 ? 'stable' : 'down'
      };
    });
    
    return schools.sort((a, b) => b.participationRate - a.participationRate).slice(0, 5);
  }

  static generateParticipationChartData(schoolStatistics) {
    return {
      labels: schoolStatistics.map(s => s.schoolName.split(' ')[0]),
      datasets: [{
        label: 'Participation Rate (%)',
        data: schoolStatistics.map(s => s.participationRate),
        backgroundColor: schoolStatistics.map(s => 
          s.participationRate >= 80 ? 'rgba(16, 185, 129, 0.8)' :
          s.participationRate >= 60 ? 'rgba(245, 158, 11, 0.8)' : 
          'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: schoolStatistics.map(s => 
          s.participationRate >= 80 ? '#10b981' :
          s.participationRate >= 60 ? '#f59e0b' : 
          '#ef4444'
        ),
        borderWidth: 2
      }]
    };
  }

  static getTotalActiveStudents(todayData) {
    return Object.values(todayData).reduce((total, classData) => 
      total + (classData.active_students || 0), 0
    );
  }

  static getTotalActiveTeachers(schoolLogs) {
    let activeTeachers = 0;
    Object.values(schoolLogs).forEach(classData => {
      const teachers = classData.teachers || {};
      activeTeachers += Object.values(teachers).filter(logs => logs.length > 0).length;
    });
    return activeTeachers;
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
    Object.entries(actions).forEach(([action, count]) => {
      const mapping = this.ACTION_MAPPING[action];
      if (mapping) {
        transformedActions[mapping.display] = count;
        totalActions += count;
      }
    });
    
    // Transform events timeline
    const timeline = events.map(event => ({
      timestamp: event.timestamp,
      action: this.ACTION_MAPPING[event.action]?.display || event.action,
      icon: this.ACTION_MAPPING[event.action]?.icon || '📌',
      details: event.meta || {}
    }));
    
    return {
      username,
      displayName: `Student ${username}`,
      className: this.CLASS_MAPPING[class_key]?.display || class_key,
      date,
      actions: transformedActions,
      totalActions,
      timeSpent,
      timeline,
      status: totalActions > 0 ? 'active' : 'inactive',
      firstActivity: first_event_ts_utc,
      lastActivity: last_event_ts_utc
    };
  }

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
    
    // Count student submissions
    let totalSubmissions = 0;
    Object.values(students).forEach(events => {
      events.forEach(event => {
        if (event.action === 'submit_homework') {
          totalSubmissions++;
        }
      });
    });
    
    // Sort and prepare feature usage data
    const sortedFeatures = Object.entries(featureUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([feature, count]) => ({
        name: feature,
        count,
        percentage: Math.min(100, (count / Math.max(...Object.values(featureUsage))) * 100)
      }));
    
    const mapping = this.CLASS_MAPPING[classKey];
    
    return {
      className: mapping?.display || classKey,
      teachers: Object.keys(teachers),
      totalStudents: Object.keys(students).length,
      expectedStudents: mapping?.expectedStudents || 0,
      activities: activities.slice(0, 20), // Latest 20 activities
      worksheetStats: {
        total: totalWorksheets,
        thisWeek: totalWorksheets // Approximation
      },
      homeworkStats: {
        created: totalHomework,
        submitted: totalSubmissions,
        pending: Math.max(0, (mapping?.expectedStudents || 0) - totalSubmissions),
        completionRate: mapping?.expectedStudents ? 
          ((totalSubmissions / mapping.expectedStudents) * 100).toFixed(1) : 0
      },
      mostUsedFeatures: sortedFeatures
    };
  }
}

export default DataTransformer;