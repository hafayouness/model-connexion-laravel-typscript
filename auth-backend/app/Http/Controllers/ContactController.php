<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                "name" => "required|string|max:255",
                "email" => "required|email",
                "message" => "required|string",
            ]);

            // Spécifiez une adresse email de destination fixe
            $destinationEmail = 'ahfa.youness@gmail.com'; // Remplacez par votre email
            // OU utilisez celui de votre .env
            // $destinationEmail = env('MAIL_FROM_ADDRESS');

            Mail::to($destinationEmail)->send(new ContactFormMail($validated));

            return response()->json([
                'message' => 'Message envoyé avec succès'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur d\'envoi d\'email:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'error' => 'Erreur lors de l\'envoi du message',
                'details' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}