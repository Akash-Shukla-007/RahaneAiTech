'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { AuthLayout, FormInput, SubmitButton } from '@/components/auth';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back! Login successful.');
      router.push('/dashboard');
    } catch (error: any) {
      console.log('Login error:', error);
      const errorMessage = error.message || 'Login failed';
      
      if (errorMessage.includes('Invalid credentials')) {
        toast.error('Invalid email or password. Please try again.');
      } else if (errorMessage.includes('User not found')) {
        toast.error('No account found with this email address.');
      } else if (errorMessage.includes('inactive')) {
        toast.error('Your account has been deactivated. Please contact an administrator.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      gradientFrom="from-blue-600"
      gradientTo="to-indigo-600"
    >
      <form className="space-y-4 sm:space-y-6" onSubmit={handleFormSubmit}>
        <FormInput
          label="Email address"
          id="email"
          type="email"
          placeholder="Enter your email"
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          error={errors.email?.message}
          register={register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address',
            },
          })}
          autoComplete="email"
        />

        <FormInput
          label="Password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          error={errors.password?.message}
          register={register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          autoComplete="current-password"
          rightIcon={showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />

        <SubmitButton isLoading={isLoading} loadingText="Signing in...">
          Sign in
        </SubmitButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Create one here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

