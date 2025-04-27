<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Recuperación de Contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table style="width: 100%; background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td style="text-align: center">
                <table style="width: 600; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <tr>
                        <td style=" text-align: center; background-color: #4f46e5; padding: 20px 0; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Eventos Lanzarote</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2 style="color: #333333; font-size: 20px;">Recuperación de Contraseña</h2>
                            <p style="color: #555555; font-size: 16px;">Hola, {{ $nombre }}</p>
                            <p style="color: #555555; font-size: 16px;">
                                Hemos recibido una solicitud para restablecer tu contraseña. 
                                Haz clic en el botón para establecer una nueva contraseña.
                            </p>
                            <p style="text-align: center; margin: 30px 0;">
                                <a href="{{ $urlReset }}" 
                                   style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px;">
                                    Recuperar Contraseña
                                </a>
                            </p>
                            <p style="color: #555555; font-size: 14px;">
                                Si no lo has solicitado, puedes ignorar este correo y tu contraseña permanecerá segura.
                            </p>
                            <p style="color: #999999; font-size: 12px; margin-top: 40px;">
                                © {{ date('Y') }} Eventos Lanzarote. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
