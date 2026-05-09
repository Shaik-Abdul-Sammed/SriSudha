import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import firestoreService from '../services/firestoreService';
import { logCustomEvent } from '../services/firebaseConfig';

// Role-specific data loaders kept at module scope to keep stable identity
async function loadAdminDashboard() {
  const stats = {
    totalUsers: 0,
    activeToday: 0,
    systemHealth: 'Good',
    pendingApprovals: 0
  };
  return { stats };
}

async function loadTeacherDashboard() {
  const stats = {
    studentCount: 0,
    assignmentsPending: 0,
    submissionsToGrade: 0,
    classesScheduled: 0
  };
  return { stats };
}

async function loadStudentDashboard() {
  const stats = {
    assignmentsCompleted: 0,
    avgGrade: 0,
    attendancePercentage: 0,
    upcomingDeadlines: 0
  };
  return { stats };
}

async function loadParentDashboard() {
  const stats = {
    childrenEnrolled: 0,
    avgPerformance: 0,
    attendanceOverall: 0,
    communicationsReceived: 0
  };
  return { stats };
}

async function loadRoleSpecificData(role) {
  switch (role) {
    case 'admin':
      return await loadAdminDashboard();
    case 'teacher':
      return await loadTeacherDashboard();
    case 'student':
      return await loadStudentDashboard();
    case 'parent':
      return await loadParentDashboard();
    default:
      return {};
  }
}

/**
 * Unified Dashboard Component
 * Integrates both PostgreSQL backend and Firebase Firestore
 * Provides role-based views and real-time updates
 */
const UnifiedDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: {},
    activities: [],
    recentUpdates: [],
    alerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!user?.uid) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load user profile from Firestore
        const profile = await firestoreService.getUserProfile(user.uid);
        
        // Load user activity from Firestore
        const activities = await firestoreService.getUserActivity(user.uid, 10);
        
        // Load role-specific data
        const roleData = await loadRoleSpecificData(user.role);
        
        // Compile dashboard data
        setData({
          profile,
          activities,
          ...roleData
        });

        logCustomEvent('dashboard_loaded', { role: user.role });
      } catch (err) {
        setError(err.message);
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Setup real-time listeners
    const unsubscribeActivity = firestoreService.onCollectionChange('activities', (docs) => {
      const userActivities = docs.filter(d => d.userId === user.uid);
      setData(prev => ({ ...prev, activities: userActivities }));
    });

    return () => {
      unsubscribeActivity();
    };
  }, [user?.uid, user?.role]);


  const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <span className="text-3xl text-blue-500">{icon}</span>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center justify-between p-3 border-b border-gray-200">
      <div>
        <p className="font-medium text-gray-800">{activity.type}</p>
        <p className="text-xs text-gray-500">
          {activity.timestamp ? new Date(activity.timestamp.toDate?.() || activity.timestamp).toLocaleString() : 'N/A'}
        </p>
      </div>
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
        {activity.metadata?.status || 'Completed'}
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <p className="text-red-800"><strong>Error:</strong> {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {data.profile?.displayName || 'User'}
          </h1>
          <p className="text-gray-600 mt-2">
            Role: <span className="font-semibold capitalize">{user?.role}</span>
          </p>
        </div>

        {/* Statistics */}
        {Object.keys(data.stats || {}).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(data.stats).map(([key, value]) => (
              <StatCard 
                key={key}
                title={key.replace(/([A-Z])/g, ' $1').trim()}
                value={value}
                icon="📊"
              />
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activities Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {data.activities && data.activities.length > 0 ? (
                data.activities.map((activity) => (
                  <ActivityItem key={activity.id || activity.timestamp} activity={activity} />
                ))
              ) : (
                <p className="p-4 text-gray-500">No recent activities</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                View Profile
              </button>
              <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                Settings
              </button>
              <button className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition">
                Help & Support
              </button>
              {user?.role === 'admin' && (
                <button className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                  System Settings
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
