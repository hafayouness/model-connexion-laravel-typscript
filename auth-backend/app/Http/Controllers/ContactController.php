<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;


class ContactController extends Controller
{
    //
    public function showForm()
    {
        return view('contact');
    }

    public function handleForm(Request $request){

        $validated = $request->validate([
            "name" => "required|string|max:255",
            "email"=> " required|email",
            "message" =>"required|string",
        ]);

        $contact = Contact::create([
            "name"=> $validated["name"],
            "email"=> $validated["email"],
            "message"=> $validated["message"],
        ]);
        Mail::to('ahfa.youness@gmail.com')->send(new ContactFormMail($contact));;
        return response()->json(['success' => 'Message envoyé avec succès!']);

    }
}
