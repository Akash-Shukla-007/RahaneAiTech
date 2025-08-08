'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { AuthLayout, FormInput, SubmitButton, RoleSelector } from '@/components/auth';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'editor' | 'viewer';
}

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');
  const selectedRole = watch('role') || 'viewer';

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      toast.success('Account created successfully! Welcome aboard.');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      
      if (errorMessage.includes('already exists')) {
        if (errorMessage.includes('email')) {
          toast.error('An account with this email already exists.');
        } else if (errorMessage.includes('username')) {
          toast.error('This username is already taken. Please choose another.');
        } else {
          toast.error('User already exists with this email or username.');
        }
      } else if (errorMessage.includes('validation')) {
        toast.error('Please check your input and try again.');
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

  const handleRoleChange = (role: string) => {
    setValue('role', role as 'admin' | 'editor' | 'viewer');
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join us and start your journey"
      gradientFrom="from-green-600"
      gradientTo="to-blue-600"
    >
      <form className="space-y-4 sm:space-y-6" onSubmit={handleFormSubmit}>
        <FormInput
          label="Username"
          id="username"
          type="text"
          placeholder="Choose a username"
          icon={<User className="h-5 w-5 text-gray-400" />}
          error={errors.username?.message}
          register={register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
          })}
        />

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

        <RoleSelector
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
          error={errors.role?.message}
        />

        <FormInput
          label="Password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a password"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          error={errors.password?.message}
          register={register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          rightIcon={showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />

        <FormInput
          label="Confirm Password"
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          error={errors.confirmPassword?.message}
          register={register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
          rightIcon={showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <SubmitButton isLoading={isLoading} loadingText="Creating account...">
          Create account
        </SubmitButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-green-600 hover:text-green-500 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;

