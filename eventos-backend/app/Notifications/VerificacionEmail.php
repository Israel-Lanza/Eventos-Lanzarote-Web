<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;

class VerificacionEmail extends Notification
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    // ✅ Aquí generamos la URL firmada
    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(60),
            [
                'id'   => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }

    public function toMail(object $notifiable): MailMessage
    {
        $verificacionUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Confirma tu correo para activar tu cuenta')
            ->greeting('¡Hola ' . $notifiable->nombre . '!')
            ->line('Gracias por registrarte. Solo falta un paso.')
            ->action('Verificar correo', $verificacionUrl)
            ->line('Si no creaste esta cuenta, puedes ignorar este mensaje.');
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
