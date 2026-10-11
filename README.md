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

## Equipos

`/teams/create` permite elegir una disciplina y crear un equipo persistido en MongoDB. El usuario autenticado queda como `owner`; `/teams`, el detalle y el menú lateral consumen `GET /api/v1/teams/mine` para mostrar solamente sus equipos.

El detalle del equipo permite consultar integrantes e historial, y al owner enviar invitaciones por correo. Los enlaces públicos `/invitations/[token]` conducen al registro o login cuando es necesario y después permiten aceptar la membresía.

El owner también puede editar información, logo y portada desde el detalle. La zona de peligro exige escribir exactamente el nombre antes de realizar la baja lógica; al completarla, el equipo desaparece del menú de todos sus integrantes.

`/events` administra eventos persistidos y `/explore` permite descubrirlos e inscribirse. Cada evento admite tipo, disciplina, cupo, imagen y una agenda de varias fechas con nombre y ubicación independiente. El nombre predeterminado es `Fecha #N` y puede personalizarse. Las fechas usan un calendario construido con los componentes accesibles de Base UI, no el selector de fecha del navegador. `/registrations` consume el historial activo del usuario y permite consultar o cancelar su inscripción.

La edición de un evento incluye transferencia de propiedad por correo y una zona de peligro para su baja lógica. `/event-ownership-transfers/[token]` permite que el usuario invitado revise y acepte la propiedad con la cuenta correspondiente.

`SESSION_COOKIE_NAME` debe coincidir con el valor configurado en el backend.

## Componentes

Añade componentes de shadcn/ui con:

```bash
npx shadcn@latest add <componente>
```
