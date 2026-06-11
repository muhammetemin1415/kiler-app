'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface HealthProfile {
  id: string;
  heightCm: number;
  weightKg: number;
  age: number;
  gender: string;
  activityLevel: string;
  goal: string;
  bmi: number;
  bmiCategory: string;
  dailyCaloricNeeds: number;
}

export default function HealthProfileForm() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    heightCm: '',
    weightKg: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHealthProfile();
  }, [token]);

  async function fetchHealthProfile() {
    if (!token) return;

    try {
      const response = await fetch('/api/v1/health/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success && data.data) {
        setProfile(data.data);
        setFormData({
          heightCm: String(data.data.heightCm || ''),
          weightKg: String(data.data.weightKg || ''),
          age: String(data.data.age || ''),
          gender: data.data.gender || 'male',
          activityLevel: data.data.activityLevel || 'moderate',
          goal: data.data.goal || 'maintain',
        });
      }
    } catch (err) {
      console.error('Failed to fetch health profile:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Not authenticated');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/v1/health/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          heightCm: Number(formData.heightCm),
          weightKg: Number(formData.weightKg),
          age: Number(formData.age),
          gender: formData.gender,
          activityLevel: formData.activityLevel,
          goal: formData.goal,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error?.message || 'Failed to save health profile');
        return;
      }

      setProfile(data.data);
      alert('Health profile saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="card max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Health Profile</h2>

      {profile && (
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded">
          <div>
            <p className="text-sm text-gray-600">BMI</p>
            <p className="text-2xl font-bold">{profile.bmi}</p>
            <p className="text-xs text-gray-500">{profile.bmiCategory}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Daily Caloric Needs</p>
            <p className="text-2xl font-bold">{profile.dailyCaloricNeeds}</p>
            <p className="text-xs text-gray-500">calories/day</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Height (cm)</label>
            <input
              type="number"
              name="heightCm"
              className="form-input"
              value={formData.heightCm}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              name="weightKg"
              className="form-input"
              value={formData.weightKg}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="age"
              className="form-input"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select name="gender" className="form-input" value={formData.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Activity Level</label>
            <select
              name="activityLevel"
              className="form-input"
              value={formData.activityLevel}
              onChange={handleChange}
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="very_active">Very Active</option>
              <option value="extremely_active">Extremely Active</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Goal</label>
            <select name="goal" className="form-input" value={formData.goal} onChange={handleChange}>
              <option value="lose_weight">Lose Weight</option>
              <option value="maintain">Maintain</option>
              <option value="gain_weight">Gain Weight</option>
            </select>
          </div>
        </div>

        {error && <div className="form-error mb-4">{error}</div>}

        <button type="submit" className="btn btn-primary w-full" disabled={saving}>
          {saving ? 'Saving...' : 'Save Health Profile'}
        </button>
      </form>
    </div>
  );
}
