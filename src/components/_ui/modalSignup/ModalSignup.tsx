import { TextInput, PasswordInput, Button, LoadingOverlay } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaSignup } from '../../../schemas/schemaSignup';
import PasswordStrength, { requirements } from '../passwordStrength/PasswordStrength';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import usePostAuth from '../../../hooks/usePostAuth';
import { useAuth } from '../../../contexts/AuthContext';

interface SignupFormValues {
  USER_EMAIL?: string;
  USER_NAME?: string;
  USER_PASSWORD?: string;
}

function validatePassword(password: string): string[] {
  const errors = [];
  if (password.length <= 5) {
    errors.push("Password must be at least 6 characters long");
  }
  requirements.forEach(requirement => {
    if (!requirement.re.test(password)) {
      errors.push(requirement.label);
    }
  });
  return errors;
}

export default function ModalSignup() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaSignup)
  });

  const { login } = useAuth();
  const watchPassword = watch("USER_PASSWORD", "");
  const [posted, setPosted] = useState(false);
  const [data, setData] = useState<SignupFormValues>({ USER_EMAIL: '', USER_NAME: '', USER_PASSWORD: '' });

  const { token, isPosted, isPosting, error, error409 } = usePostAuth<SignupFormValues>(`${import.meta.env.VITE_BASE_URL}/user/create`, data, posted);

  const submitForm: SubmitHandler<SignupFormValues> = (formData) => {
    const passwordErrors = validatePassword(formData.USER_PASSWORD || '');
    if (passwordErrors.length > 0) {
      notifications.show({
        title: 'Invalid Password',
        message: `${passwordErrors.join(', ')}`,
        autoClose: 7000,
        color: 'red',
        icon: <IconX />,
      });
      return;
    }
    setData(formData);
    setPosted(true);
  };

  useEffect(() => {
    if (error409) {
      setPosted(false)
      notifications.show({
        title: error409?.error,
        message: error409?.message,
        autoClose: 7000,
        color: 'red',
        icon: <IconX />,
      })
    }
    if (error) {
      setPosted(false)
      notifications.show({
        title: error?.error,
        message: error?.message,
        autoClose: 7000,
        color: 'red',
        icon: <IconX />,
      })
    }
    if (isPosted) {
      setPosted(false)
      localStorage.setItem('token', token?.token as string)
      login()
    }
  }, [error409, error, isPosted]);

  if (isPosting) {
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{
          radius: "sm",
          blur: 2
        }}
      />
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <TextInput
          {...register('USER_EMAIL')}
          autoComplete='username'
          label="Email"
          placeholder="your@email.com"
          required
          error={errors.USER_EMAIL?.message}
        />
        <TextInput
          {...register('USER_NAME')}
          autoComplete='name'
          label="Name"
          placeholder="Your Name"
          required
          error={errors.USER_NAME?.message}
        />
        <PasswordInput
          {...register('USER_PASSWORD')}
          autoComplete='new-password'
          label="Password"
          placeholder="Your password"
          required
          error={errors.USER_PASSWORD && errors.USER_PASSWORD.type === "required" ? errors.USER_PASSWORD.message : undefined}
        />
        <PasswordStrength value={watchPassword} />
        <Button type='submit' fullWidth mt="xl" fw={500}>
          Register
        </Button>
      </form>
    </>
  );
}
