<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
public function register(Request $request){
    try{
        $fields = $request->validate([
            'name' => 'required|max:20',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'image' => 'nullable|image'
        ]);

        $randomString = Str::random(10);

        // Vérifier si une image a été téléchargée
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = $randomString . '_' . time() . '.' . $image->getClientOriginalExtension();

            // Déplacer l'image vers le dossier public/images
            $image->move(public_path('images'), $imageName);

            // Ajouter le nom du fichier image aux données à enregistrer
            $fields['image'] = 'images/' . $imageName;
        }

        $user = User::create($fields);

        $token = $user->createToken($request->name)->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ],200);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
            'message'=>"message general"
        ], 422); 
    }
}
public function login(Request $request){
    try {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        $user = User::where('email',$request->email)->first();
        if (! $user || $user->password !== $request->password) {
            return response()->json([
                'error'=>'anvalid password or email'
            ],423);
        } else {
            $token = $user->createToken($user->name);
            return response()->json([
                'user'=>$user,
                'token'=>$token->plainTextToken
            ],200);
        }
    } catch (ValidationException $exc) {
        return response()->json([
            "errors"=>$exc->errors()
        ],422);
    }
    
}
public function logout(Request $request)
{
    $request->user()->tokens()->delete();
    return response()->json([
        'message'=> 'you are logged out'
    ]);
}

public function user(){
    return User::getSpecificAttributes();
}

public function userPosts($id){
    return User::find($id)->posts;
}

}