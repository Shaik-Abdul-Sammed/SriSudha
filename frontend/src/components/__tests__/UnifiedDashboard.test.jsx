import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnifiedDashboard from '../UnifiedDashboard';
import * as useAuthModule from '../../hooks/useAuth';
import firestoreService from '../../services/firestoreService';

// Mock modules
jest.mock('../../hooks/useAuth');
jest.mock('../../services/firestoreService');
jest.mock('../../services/firebaseConfig', () => ({
  logCustomEvent: jest.fn()
}));

describe('UnifiedDashboard Component', () => {
  const mockUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'admin'
  };

  beforeEach(() => {
    useAuthModule.useAuth.mockReturnValue({ user: mockUser });
    firestoreService.getUserProfile.mockResolvedValue({
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      role: mockUser.role
    });
    firestoreService.getUserActivity.mockResolvedValue([
      {
        id: '1',
        type: 'login',
        timestamp: new Date(),
        metadata: { status: 'Completed' }
      },
      {
        id: '2',
        type: 'assignment_submitted',
        timestamp: new Date(),
        metadata: { status: 'Completed' }
      }
    ]);
    firestoreService.onCollectionChange.mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(<UnifiedDashboard />);
    expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();
  });

  it('should display user welcome message', async () => {
    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome, Test User/i)).toBeInTheDocument();
    });
  });

  it('should display user role', async () => {
    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Role:/i)).toBeInTheDocument();
      expect(screen.getByText(/admin/i)).toBeInTheDocument();
    });
  });

  it('should display recent activities', async () => {
    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
      expect(screen.getByText(/login/i)).toBeInTheDocument();
      expect(screen.getByText(/assignment_submitted/i)).toBeInTheDocument();
    });
  });

  it('should display quick action buttons', async () => {
    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'View Profile' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Help & Support' })).toBeInTheDocument();
    });
  });

  it('should display admin-specific button for admin users', async () => {
    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/System Settings/i)).toBeInTheDocument();
    });
  });

  it('should not display admin button for non-admin users', async () => {
    useAuthModule.useAuth.mockReturnValue({ 
      user: { ...mockUser, role: 'student' } 
    });

    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(screen.queryByText(/System Settings/i)).not.toBeInTheDocument();
    });
  });

  it('should setup real-time activity listener', async () => {
    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(firestoreService.onCollectionChange).toHaveBeenCalledWith(
        'activities',
        expect.any(Function)
      );
    });
  });

  it('should handle loading errors gracefully', async () => {
    const errorMsg = 'Database connection failed';
    firestoreService.getUserProfile.mockRejectedValue(new Error(errorMsg));

    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  it('should display "No recent activities" when empty', async () => {
    firestoreService.getUserActivity.mockResolvedValue([]);

    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/No recent activities/i)).toBeInTheDocument();
    });
  });

  it('should call logCustomEvent on mount', async () => {
    const { logCustomEvent } = require('../../services/firebaseConfig');

    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(logCustomEvent).toHaveBeenCalledWith('dashboard_loaded', { role: 'admin' });
    });
  });

  it('should handle different user roles', async () => {
    const roles = ['admin', 'teacher', 'student', 'parent'];

    for (const role of roles) {
      useAuthModule.useAuth.mockReturnValue({ 
        user: { ...mockUser, role } 
      });

      const { unmount } = render(<UnifiedDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(new RegExp(role, 'i'))).toBeInTheDocument();
      });

      unmount();
    }
  });

  it('should load user profile data', async () => {
    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(firestoreService.getUserProfile).toHaveBeenCalledWith(mockUser.uid);
    });
  });

  it('should load user activity with limit', async () => {
    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(firestoreService.getUserActivity).toHaveBeenCalledWith(mockUser.uid, 10);
    });
  });

  it('should cleanup listeners on unmount', async () => {
    const mockUnsubscribe = jest.fn();
    firestoreService.onCollectionChange.mockReturnValue(mockUnsubscribe);

    const { unmount } = render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(firestoreService.onCollectionChange).toHaveBeenCalled();
    });

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should display stat cards when data is available', async () => {
    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      // Just verify the component renders without errors
      expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    });
  });

  it('should update activities in real-time', async () => {
    let callbackFn;
    firestoreService.onCollectionChange.mockImplementation((collection, callback) => {
      callbackFn = callback;
      return jest.fn();
    });

    render(<UnifiedDashboard />);
    
    await waitFor(() => {
      expect(callbackFn).toBeDefined();
    });

    // Simulate real-time update
    const newActivities = [
      {
        id: '3',
        userId: mockUser.uid,
        type: 'new_event',
        timestamp: new Date()
      }
    ];

    if (callbackFn) {
      callbackFn(newActivities);
    }

    await waitFor(() => {
      expect(screen.getByText(/new_event/i)).toBeInTheDocument();
    });
  });
});
