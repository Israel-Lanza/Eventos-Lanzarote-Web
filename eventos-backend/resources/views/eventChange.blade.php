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

        <h2 style="color: #333;">¡Hola {{ $evento->autor }}!</h2>

        <p style="font-size: 16px; color: #555;">
            Su evento <strong>{{ $evento->nombre }}</strong> del día <strong>{{ $fecha_formateada }}</strong> ha sido cambiado a <strong>{{ $estado }}</strong>.

        </p>

        <p style="font-size: 14px; color: #999;">
            Gracias por usar nuestra plataforma.
        </p>
        <p style="color: #999999; font-size: 12px; margin-top: 40px;">
            © {{ date('Y') }} Eventos Lanzarote. Todos los derechos reservados.
        </p>
    </div>
</body>

</html>