<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Verifica tu correo</title>
</head>

<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">

        {{-- Logo --}}
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="{{ asset('images/logo4.png') }}" alt="Logo" style="max-width: 150px;">
        </div>

        {{-- Contenido --}}
        <h2 style="color: #333;">¡Hola {{ $user->nombre }}!</h2>

        <p style="font-size: 16px; color: #555;">
            Gracias por registrarte. Haz clic en el botón para verificar tu dirección de correo electrónico.
        </p>

        <div style="text-align: center; margin: 40px 0;">
            <a href="{{ $url }}"
                style="background-color: #6366F1; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-size: 16px;">
                Verificar
            </a>
        </div>

        <p style="font-size: 14px; color: #999;">
            Si no creaste esta cuenta, puedes ignorar este mensaje.
        </p>
        <p style="color: #999999; font-size: 12px; margin-top: 40px;">
            © {{ date('Y') }} Eventos Lanzarote. Todos los derechos reservados.
        </p>
    </div>
</body>

</html>