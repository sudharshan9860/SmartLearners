// chartConfig.js
export const chartConfig = {
  // Default chart options
  defaultOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    }
  },
  
  // Line chart specific options
  lineChartOptions: {
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  },
  
  // Bar chart specific options
  barChartOptions: {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  },
  
  // Radar chart specific options
  radarChartOptions: {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  },
  
  // Chart color schemes
  colorSchemes: {
    primary: [
      '#667eea',
      '#764ba2',
      '#f093fb',
      '#4facfe',
      '#43e97b',
      '#fa709a'
    ],
    secondary: [
      '#48bb78',
      '#4299e1',
      '#f6ad55',
      '#ed64a6',
      '#9f7aea',
      '#38b2ac'
    ],
    gradient: [
      {
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)'
      },
      {
        borderColor: '#764ba2',
        backgroundColor: 'rgba(118, 75, 162, 0.1)'
      },
      {
        borderColor: '#4facfe',
        backgroundColor: 'rgba(79, 172, 254, 0.1)'
      }
    ]
  }
};