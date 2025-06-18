import api from '@/services/axios';
import { addLocale, locale } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

interface props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
interface accountForm {
  name?: string;
  username?: string;
  password?: string;
}
export default function CreateAccount({ visible, setVisible }: props) {
  const [form, setForm] = useState<accountForm>({
    password: '',
    username: '',
    name: '',
  });
  const toast = useRef(null);

  addLocale('es', {
    weak: 'Débil',
    medium: 'Media',
    strong: 'Fuerte',
    passwordPrompt: 'Introduce una contraseña',
  });

  locale('es');

  const change = (key: keyof accountForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const postAccount = async () => {
    try {
      if (!form.name || !form.password || !form.username) {
        toast.current.show({
          severity: 'warn',
          summary: 'Error',
          detail: 'Llene todos los campos para continuar.',
          life: 3000,
        });
        return;
      }

      await api.post('/sesion/account', { ...form });

      toast.current.show({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: 'Cuenta creada correctamente.',
        life: 3000,
      });
    } catch (error) {
      console.log(error);
      if (error.response.status == 409) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: `El usuario ${form.username} ya existe.`,
          life: 3000,
        });
      }
    }
  };

  return (
    <>
      <Toast ref={toast}></Toast>
      <Dialog
        header="Crear cuenta"
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="w-full flex justify-center py-6">
          <div className="w-full max-w-4xl grid gap-y-4 gap-x-8 grid-cols-1 lg:grid-cols-2 place-items-center px-4">
            <FloatLabel>
              <InputText
                className="w-full"
                value={form.name}
                onChange={(e) => change('name', e.target.value)}
                autoFocus
              />
              <label htmlFor="username">Nombre</label>
            </FloatLabel>

            <FloatLabel>
              <InputText
                className="w-full"
                value={form.username}
                onChange={(e) => change('username', e.target.value)}
                autoFocus
              />
              <label htmlFor="username">Usuario</label>
            </FloatLabel>

            <FloatLabel>
              <Password
                name="enter-password"
                value={form.password || ''}
                inputClassName="w-full"
                onChange={(e) => change('password', e.target.value)}
                toggleMask
              />
              <label htmlFor="enter-password">Contraseña</label>
            </FloatLabel>

            <button
              className="p-3 rounded-md bg-sky-700 cursor-pointer text-white font-medium w-full max-w-[248px]
                     hover:rounded-xl hover:bg-sky-900 transition-all duration-500"
              onClick={postAccount}
            >
              Crear Cuenta
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
