'use client';

import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import api from '@/services/axios';
import { Toast } from 'primereact/toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { FloatLabel } from 'primereact/floatlabel';

interface loginForm {
  user?: string;
  password?: string;
}

export default function Login() {
  const [form, setForm] = useState<loginForm>({ password: '', user: '' });
  const toast = useRef(null);
  const router = useRouter();

  const change = (key: keyof loginForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchLogin();
    }
  };  

  const fetchLogin = async () => {
    try {
      const response = await api.post('/sesion/login', {
        username: form.user,
        password: form.password,
      });

      const status: number = response.status;

      if (status == 200) {
        const { accessToken } = response.data;

        Cookies.set('unsisToken', accessToken);
        router.push('/dashboard');
      }
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Usuario o contraseña incorrectos',
        life: 3000,
      });
    }
  };

  return (
    <main className="">
      <Toast ref={toast}></Toast>
      <section className="flex flex-col items-center justify-center gap-5 h-screen">
        <h1 className="text-4xl">Iniciar sesión</h1>

        {/* Campo de Usuario */}
        <div className="flex items-center gap-3 w-full max-w-md">
          <i className="pi pi-user" style={{ fontSize: '2rem' }}></i>
          <FloatLabel>
            <InputText
              className="flex-1"
              value={form.user}
              onChange={(e) => change('user', e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <label htmlFor="username">Usuario</label>
          </FloatLabel>
        </div>

        {/* Campo de Contraseña */}
        <div className="flex items-center gap-3 w-full max-w-md">
          <i className="pi pi-lock" style={{ fontSize: '2rem' }}></i>
          <FloatLabel>
            <InputText
              className="flex-1"
              value={form.password}
              onChange={(e) => change('password', e.target.value)}
              type="password"
              onKeyDown={handleKeyDown}
            />{' '}
            <label htmlFor="username">Contraseña</label>
          </FloatLabel>
        </div>

        {/* Botón */}
        <Button
          className="mt-9 w-[210px]"
          icon="pi pi-arrow-right"
          label="Entrar"
          onClick={fetchLogin}
        />
      </section>
    </main>
  );
}
