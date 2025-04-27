<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMailable extends Mailable
{
    use Queueable, SerializesModels;

    public $urlReset;
    public $nombre;

    /**
     * Create a new message instance.
     */
    public function __construct($urlReset, $nombre)
    {
        $this->urlReset = $urlReset;
        $this->nombre = $nombre;
    }

    public function build()
    {
        return $this->subject('Recupera tu contraseña')
                    ->view('passwordReset')
                    ->with([
                        'urlReset' => $this->urlReset,
                        'nombre' => $this->nombre,
                    ]);
    }

}
