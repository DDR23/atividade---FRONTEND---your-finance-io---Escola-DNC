import { TextInput, PasswordInput, Button, LoadingOverlay, rem } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaSignup } from '../../../schemas/schemaSignup';
import PasswordStrength from '../passwordStrength/PasswordStrength';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import usePostAuth from '../../../services/usePostAuth';
import { useAuth } from '../../../services/AuthContext';

interface SignupFormValues {
  USER_EMAIL?: string;
  USER_NAME?: string;
  USER_PASSWORD?: string;
}

export default function ModalSignin() {
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
      localStorage.setItem('token', token)
      notifications.show({
        title: 'Success',
        message: 'User registered successfully.',
        autoClose: 7000,
        color: 'green',
        icon: <IconCheck />,
      })
      login()
    }
  }, [error409, error, isPosted]);

  if (isPosting) {
    return (
      <>
        <div style={{ padding: rem(100) }}>
          <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{
              radius: "sm",
              blur: 2
            }}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <TextInput
          {...register('USER_EMAIL')}
          label="Email"
          placeholder="your@email.com"
          required
          error={errors.USER_EMAIL?.message}
        />
        <TextInput
          {...register('USER_NAME')}
          label="Name"
          placeholder="Your Name"
          required
          error={errors.USER_NAME?.message}
        />
        <PasswordInput
          {...register('USER_PASSWORD')}
          label="Password"
          placeholder="Your password"
          required
          error={errors.USER_PASSWORD && errors.USER_PASSWORD.type === "required" ? errors.USER_PASSWORD.message : undefined}
        />
        <PasswordStrength value={watchPassword} />
        <Button type='submit' fullWidth mt="xl">
          Register
        </Button>
      </form>
    </>
  );
}
