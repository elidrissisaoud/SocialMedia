<?php

namespace App\Http\Controllers;

use App\Models\Reaction;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reactions = Reaction::with('user')->get();
        return response()->json($reactions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $fields = $request->validate([
                'text' => 'required',
                'user_id' => 'required|exists:users,id',
                'post_id' => 'required|exists:posts,id',
            ]);
            $reaction = Reaction::create($fields);
            return response()->json([
                'reaction' => $reaction,
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
    public function show(Reaction $reaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reaction $reaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reaction $reaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reaction $reaction)
    {
        Reaction::delete($reaction);
        return response()->json([
            'message' => "comment delete succesfuly !",
        ], 200); 
    }
}
