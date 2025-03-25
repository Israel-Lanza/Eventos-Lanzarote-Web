<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Evento;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class EventSubmitted extends Notification implements ShouldQueue
{
    use Queueable;
    public $evento;
   
    public function __construct(Evento $evento)
    {
        $this->evento = $evento;
    }

    
    public function via($notifiable)
    {
        return ['mail'];
    }

    
    public function toMail($notifiable)
    {
      
        return (new MailMessage)
            ->subject('Nuevo evento pendiente de revisión')
            ->greeting('Hola Administrador,')
            ->line('Un nuevo evento ha sido enviado para revisión.')
            ->line('Título: ' . $this->evento->nombre)
            ->line('Descripción: ' . $this->evento->descripcion)
            ->line('Autor: ' . $this->evento->autor)
            ->line('Fecha de Creación: ' . $this->evento->created_at->format('d/m/Y H:i'))
            ->line('Por favor, revisa el evento y apruébalo si es necesario.');
    }

    
    public function toArray(object $notifiable): array
    {
        return [
            
        ];
    }
}