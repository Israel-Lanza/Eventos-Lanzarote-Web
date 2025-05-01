<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Verifica tu correo</title>
</head>

<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">

        <div style="text-align: center; margin-bottom: 30px;">
            <img src="{{ asset('images/logo4.png') }}" alt="Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #333333; font-size: 20px;">Recuperación de Contraseña</h2>
        <p style="color: #333;">¡Hola {{ $evento->autor }}!</p>

        <p style="font-size: 16px; color: #555;">
            Hemos recibido una solicitud para restablecer tu contraseña. <br> Haz clic en el botón para establecer una nueva contraseña.
        </p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="{{ $urlReset }}"
                style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px;">
                Recuperar Contraseña
            </a>
        </p>

        <p style="font-size: 14px; color: #999;">
            Gracias por usar nuestra plataforma.
        </p>
        <p style="color: #555555; font-size: 14px;">
            Si no lo has solicitado, puedes ignorar este correo y tu contraseña permanecerá segura.
        </p>
        <p style="color: #999999; font-size: 12px; margin-top: 40px;">
            © {{ date('Y') }} Eventos Lanzarote. Todos los derechos reservados.
        </p>
    </div>
</body>

</html>