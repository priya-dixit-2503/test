import { useState, useEffect } from 'react';

export default function PasswordStrength({ password }) {
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    calculateStrength(password);
  }, [password]);

  const calculateStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (!password) {
      setStrength(0);
      setMessage('');
      return;
    }

    // Length check
    if (password.length >= 8) {
      score += 25;
    } else {
      feedback.push('Use at least 8 characters');
    }

    // Uppercase letters check
    if (/[A-Z]/.test(password)) {
      score += 25;
    } else {
      feedback.push('Add uppercase letters');
    }

    // Numbers check
    if (/\d/.test(password)) {
      score += 25;
    } else {
      feedback.push('Add numbers');
    }

    // Special characters check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 25;
    } else {
      feedback.push('Add special characters');
    }

    setStrength(score);
    setMessage(feedback.join(', '));
  };

  const getStrengthColor = () => {
    if (strength >= 100) return 'bg-green-500';
    if (strength >= 75) return 'bg-blue-500';
    if (strength >= 50) return 'bg-yellow-500';
    if (strength >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthText = () => {
    if (strength >= 100) return 'Very Strong';
    if (strength >= 75) return 'Strong';
    if (strength >= 50) return 'Medium';
    if (strength >= 25) return 'Weak';
    return 'Very Weak';
  };

  return (
    <div className="mt-1">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getStrengthColor()} transition-all duration-300`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      {password && (
        <div className="mt-1">
          <span className={`text-xs ${getStrengthColor().replace('bg-', 'text-')}`}>
            {getStrengthText()}
          </span>
          {message && (
            <span className="text-xs text-gray-500 ml-2">
              ({message})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
