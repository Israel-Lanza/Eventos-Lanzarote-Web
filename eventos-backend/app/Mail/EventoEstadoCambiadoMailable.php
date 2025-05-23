<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Carbon\Carbon;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Evento;
use Illuminate\Support\Facades\App;


class EventoEstadoCambiadoMailable extends Mailable
{
    use Queueable, SerializesModels;

    public $evento;

    public function __construct($evento)
    {
        $this->evento = $evento;
    }

    public function build()
    {
        setlocale(LC_TIME, 'es_ES.UTF-8');
        Carbon::setLocale('es');

        $fechaFormateada = \Carbon\Carbon::parse($this->evento->fecha)
        ->translatedFormat('d \d\e F \d\e Y');

        return $this->subject('Tu evento ha cambiado de estado')
            ->view('eventChange')
            ->with([
                'evento' => $this->evento,
                'estado' => Evento::ESTADOS[$this->evento->estado],
                'fecha_formateada' =>  $fechaFormateada,
            ]);
    }
}
