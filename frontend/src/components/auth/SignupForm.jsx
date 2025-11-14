import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCountries } from '../../hooks/useCountries';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Eye, EyeOff, User, Mail, Phone, MapPin } from 'lucide-react';

const SignupForm = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuth();
  const { countries, states, fetchStates, loading: countriesLoading } = useCountries();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('India');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      country: 'India'
    }
  });

  const watchedCountry = watch('country');

  // Load states for India when component mounts and countries are loaded
  useEffect(() => {
    if (countries.length > 0 && countries.includes('India')) {
      // Ensure country is set to India
      if (!watchedCountry || watchedCountry !== 'India') {
        setValue('country', 'India');
      }
      // Fetch states for India if not already loaded and country is India
      if ((watchedCountry === 'India' || !watchedCountry) && states.length === 0) {
        fetchStates('India');
        setSelectedCountry('India');
      }
    }
  }, [countries, fetchStates, setValue, states.length, watchedCountry]);

  // Update states when country changes
  useEffect(() => {
    if (watchedCountry && watchedCountry !== selectedCountry) {
      setSelectedCountry(watchedCountry);
      fetchStates(watchedCountry);
      setValue('state', ''); // Reset state when country changes
    }
  }, [watchedCountry, selectedCountry, fetchStates, setValue]);

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const countryOptions = countries.map(country => ({
    value: country,
    label: country
  }));

  const stateOptions = states.map(state => ({
    value: state,
    label: state
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                required
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  },
                  maxLength: {
                    value: 50,
                    message: 'Name cannot exceed 50 characters'
                  },
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: 'Name can only contain letters and spaces'
                  }
                })}
              />
              <User className="absolute right-3 top-9 h-5 w-5 text-gray-400" />
            </div>

            {/* Email Field */}
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                required
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
              <Mail className="absolute right-3 top-9 h-5 w-5 text-gray-400" />
            </div>

            {/* Country Field */}
            <Select
              label="Country"
              placeholder="Select your country"
              required
              options={countryOptions}
              error={errors.country?.message}
              disabled={countriesLoading}
              {...register('country', {
                required: 'Country is required'
              })}
            />

            {/* State Field */}
            <Select
              label="State/Province"
              placeholder="Select your state"
              required
              options={stateOptions}
              error={errors.state?.message}
              disabled={!selectedCountry || countriesLoading}
              {...register('state', {
                required: 'State is required'
              })}
            />

            {/* Phone Number Field */}
            <div className="relative">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                required
                error={errors.phoneNumber?.message}
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[\+]?[1-9][\d]{0,15}$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
              />
              <Phone className="absolute right-3 top-9 h-5 w-5 text-gray-400" />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                  }
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                required
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => {
                    const password = watch('password');
                    return value === password || 'Passwords do not match';
                  }
                })}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting || loading}
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
