# ARPA Front

Frontend de ARPA construido con Next.js, Tailwind CSS y shadcn/ui.

## Desarrollo

Copia las variables de entorno antes de iniciar:

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

El registro de usuarios en `/signin` utiliza `NEXT_PUBLIC_API_URL` para conectarse al backend.

## Autenticación

El login en `/login` crea una sesión mediante una cookie `HttpOnly` emitida por el backend. El archivo `proxy.ts` realiza una comprobación optimista antes de permitir navegación hacia las rutas privadas y cada petición de datos sigue siendo validada por los guards de NestJS.

Rutas públicas:

- `/`
- `/login`
- `/signin`
- `/forgot-password`

Rutas privadas:

- `/home`
- `/explore`
- `/checkout`
- `/registrations`
- `/teams`
- `/locations`
- `/live`
- `/profile`

La opción **Mi perfil** del menú de usuario abre `/profile`. Ahí se puede consultar el correo, editar información personal y gustos, y cambiar la contraseña. Los campos de foto de perfil y portada solo generan una vista previa local en esta versión.

`SESSION_COOKIE_NAME` debe coincidir con el valor configurado en el backend.

## Componentes

Añade componentes de shadcn/ui con:

```bash
npx shadcn@latest add <componente>
```
