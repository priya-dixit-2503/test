import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth';
import PasswordStrength from '../components/PasswordStrength';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

export default function ResetPasswordConfirm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const validateForm = () => {
    const errors = {};
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    if (!token || !uid) {
      setError('Invalid password reset link. Please request a new one.');
      return;
    }

    setIsLoading(true);
    
    const resetPromise = authService.confirmPasswordReset(uid, token, password);
    
    toast.promise(resetPromise, {
      loading: 'Resetting your password...',
      success: 'Password reset successful!',
      error: (err) => err.message || 'Failed to reset password'
    });

    try {
      await resetPromise;
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Reset Your Password</h2>
        
        {!token || !uid ? (
          <div className="text-center">
            <p className="text-red-600 mb-4">Invalid password reset link.</p>
            <button
              type="button"
              onClick={() => navigate('/reset-password')}
              className="text-blue-600 hover:text-blue-800"
            >
              Request a new password reset
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <input
                type="password"
                placeholder="New Password"
                className={`w-full p-3 border rounded ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationErrors({ ...validationErrors, password: '' });
                }}
                required
              />
              <PasswordStrength password={password} />
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.password}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirm New Password"
                className={`w-full p-3 border rounded ${
                  validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setValidationErrors({ ...validationErrors, confirmPassword: '' });
                }}
                required
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {error && (
              <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-3 rounded text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        )}

        <div className="mt-4 text-center text-sm text-gray-600">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
