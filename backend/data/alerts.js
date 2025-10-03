module.exports = {
  active: [
    {
      id: 'a1',
      type: 'Flood',
      title: 'Active Alerts',
      severityTags: ['New', 'High'],
      issuedAgo: '50 s',
      color: '#ef4444'
    },
    {
      id: 'a2',
      type: 'Active Alerts',
      hours: '37.6h',
      severityTags: ['Low', 'High'],
      impacts: '254 lms',
      status: 'Issued',
      color: '#111827'
    },
    {
      id: 'a3',
      type: 'Cyclone',
      hours: '20.8h',
      severityTags: ['Low', 'High'],
      impacts: '189 lms',
      status: 'Issued',
      color: '#0ea5e9'
    }
  ],
  acuteMap: {
    label: 'Acute Alerts',
    points: [
      { x: 25, y: 30, color: '#fda4af' },
      { x: 70, y: 20, color: '#ef4444' },
      { x: 65, y: 60, color: '#fb923c' },
      { x: 55, y: 40, color: '#60a5fa' },
      { x: 35, y: 65, color: '#34d399' }
    ]
  },
  past: [
    {
      id: 'p1',
      type: 'Active Alerts',
      hours: '41.6h',
      severityTags: ['Low', 'High'],
      impacts: '330 lms',
      status: 'Issued'
    },
    {
      id: 'p2',
      name: 'Celeda',
      count: 50,
      icon: 'users'
    },
    {
      id: 'p3',
      name: 'Medium',
      count: 50,
      icon: 'dot'
    },
    {
      id: 'p4',
      name: 'Corporation',
      count: 32,
      icon: 'building'
    },
    {
      id: 'p5',
      name: 'Fick Alarm',
      count: 24,
      icon: 'bell'
    }
  ]
};



