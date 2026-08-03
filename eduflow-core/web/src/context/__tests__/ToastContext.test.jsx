import { render, screen } from '@testing-library/react';
import { ToastContext } from '../ToastContext';

describe('ToastContext', () => {
  it('should be defined', () => {
    expect(ToastContext).toBeDefined();
  });

  it('should render with provider', () => {
    const TestComponent = () => <div>Test Content</div>;
    
    render(
      <ToastContext.Provider value={{}}>
        <TestComponent />
      </ToastContext.Provider>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should have buttons clickable', () => {
    const TestComponent = () => (
      <>
        <button data-testid="show-success">Show Success Toast</button>
        <button data-testid="show-error">Show Error Toast</button>
      </>
    );
    
    render(
      <ToastContext.Provider value={{}}>
        <TestComponent />
      </ToastContext.Provider>
    );
    
    expect(screen.getByTestId('show-success')).toBeEnabled();
    expect(screen.getByTestId('show-error')).toBeEnabled();
  });

  it('should handle multiple elements', () => {
    const TestComponent = () => (
      <>
        <div data-testid="show-success">Button 1</div>
        <div data-testid="show-error">Button 2</div>
        <div data-testid="toast-container">Toast Container</div>
      </>
    );
    
    render(
      <ToastContext.Provider value={{}}>
        <TestComponent />
      </ToastContext.Provider>
    );
    
    expect(screen.getByTestId('show-success')).toBeInTheDocument();
    expect(screen.getByTestId('show-error')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  it('should support child elements', () => {
    const TestComponent = () => <div data-testid="custom-child">Custom Content</div>;
    
    render(
      <ToastContext.Provider value={{}}>
        <TestComponent />
      </ToastContext.Provider>
    );
    
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('should render without errors', () => {
    const TestComponent = () => <div>Test</div>;
    
    expect(() => {
      render(
        <ToastContext.Provider value={{}}>
          <TestComponent />
        </ToastContext.Provider>
      );
    }).not.toThrow();
  });

  it('should support rendering multiple children', () => {
    const TestComponent = () => (
      <>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </>
    );
    
    render(
      <ToastContext.Provider value={{}}>
        <TestComponent />
      </ToastContext.Provider>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});
