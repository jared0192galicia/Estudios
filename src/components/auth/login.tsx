'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';


interface loginForm {
  user?: string;
  password?: string;
}

export default function Login() {
  const [form, setForm] = useState<loginForm>({ password: '', user: '' });

  const change = (key: keyof loginForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fetchLogin = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="">
      <section className="flex flex-col items-center justify-center gap-5 h-screen">
        <h1 className="text-4xl">Iniciar sesión</h1>

        {/* Campo de Usuario */}
        <div className="flex items-center gap-3 w-full max-w-md">
          <i className="pi pi-user" style={{fontSize: '2rem'}}></i>
          <InputText
            className="flex-1"
            value={form.user}
            onChange={(e) => change('user', e.target.value)}
            placeholder="Usuario"
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="flex items-center gap-3 w-full max-w-md">
          <i className="pi pi-lock" style={{fontSize: '2rem'}}></i>
          <InputText
            className="flex-1"
            value={form.password}
            onChange={(e) => change('password', e.target.value)}
            placeholder="Contraseña"
          />
        </div>

        {/* Botón */}
        <Button
          className="mt-9 w-[210px]"
          icon="pi pi-arrow-right"
          label="Entrar"
          onClick={() => console.log(form)}
        />
      </section>

    </main>
  );
}
