'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputText';

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
      <section className="flex flex-col items-center gap-3">
     <h1>Entrar</h1>
        <InputText
          value={form.user}
          onChange={(e) => change('user', e.target.value)}
          placeholder="Usuario"
        ></InputText>
        <InputText
          value={form.password}
          onChange={(e) => change('password', e.target.value)}
          placeholder="Constraseña"
        ></InputText>
        <Button
          className="mt-5 w-[210px]"
          // severity='info'
          label="Entrar"
          onClick={() => {
            console.log(form);
          }}
        ></Button>
      </section>
    </main>
  );
}
