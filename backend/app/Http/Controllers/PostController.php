<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('user','reactions')->get();
        return response()->json($posts);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $fields = $request->validate([
                'title' => 'required|max:100',
                'user_id' => 'required|exists:users,id',
                'description' => 'required',
                'image' => 'required|image'//required|image
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
    
            $post = Post::create($fields);
            return response()->json([
                'post' => $post,
                'message'=>'added succesfuly !'
            ],200);
        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
            ], 422); 
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $find = Post::find($id);
        if ($find) {
            return response()->json([
                'post'=>$find
            ],200);
        }else{
            return response()->json([
                'error'=>'not found resource'
            ],423);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        try{
            $fields = $request->validate([
                'title' => 'required|max:100',
                'description' => 'required',
                'image' => 'nulable'//required|image
            ]);
    
            // Vérifier si une image a été téléchargée
            if ($request->hasFile('image')) {
                $path = public_path($post->image);
                unlink($path);
                $randomString = Str::random(10);
                $image = $request->file('image');
                $imageName = $randomString . '_' . time() . '.' . $image->getClientOriginalExtension();
    
                // Déplacer l'image vers le dossier public/images
                $image->move(public_path('images'), $imageName);
    
                // Ajouter le nom du fichier image aux données à enregistrer
                $fields['image'] = 'images/' . $imageName;
            }
    
            $post->update($fields);
            return response()->json([
                'post' => $post,
                'message'=>'added succesfuly !'
            ],200);
        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
            ], 422); 
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();
        $path = public_path($post->image);
        unlink($path);
        return response()->json([
            'message'=>'post deleted succesfuly'
        ],200);
    }
}
