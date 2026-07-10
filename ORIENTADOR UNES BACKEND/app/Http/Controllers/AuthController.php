<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Auth SIN CONTRASEÑA para UNES Orienta IA.
 *
 * - /api/auth/login   → recibe email, si existe devuelve token
 * - /api/auth/register → crea usuario nuevo con nombre, apellidos, email, teléfono
 * - /api/auth/me       → datos del usuario logueado
 * - /api/auth/logout   → revoca token
 *
 * Nota de seguridad: al no haber contraseña, el email es un IDENTIFICADOR
 * no una credencial secreta. Para mitigar suplantación:
 * - rate limiting agresivo en las rutas de auth
 * - los tokens Sanctum se pueden revocar
 * - los datos son solicitados en cada registro
 * En una fase posterior se puede añadir OTP por SMS/email.
 */
class AuthController extends Controller
{
    /**
     * Login por email (usuario existente).
     */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email|max:190',
        ]);

        $user = User::where('email', strtolower($data['email']))->first();
        if (! $user) {
            return response()->json([
                'ok' => false,
                'code' => 'user_not_found',
                'message' => 'No existe una cuenta con ese correo. Crea una nueva cuenta.',
            ], 404);
        }

        $user->update(['last_login_at' => now()]);
        // Revocamos tokens previos por si el usuario cambió de dispositivo
        $user->tokens()->delete();
        $token = $user->createToken('aquila-app')->plainTextToken;

        return response()->json([
            'ok' => true,
            'token' => $token,
            'user' => $this->presentUser($user),
        ]);
    }

    /**
     * Crear cuenta nueva.
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre'    => 'required|string|min:2|max:80',
            'apellidos' => 'required|string|min:2|max:120',
            'email'     => 'required|email|max:190|unique:users,email',
            'telefono'  => ['required', 'string', 'min:8', 'max:30', 'regex:/^[0-9+\-\s()]+$/'],
        ], [
            'email.unique' => 'Ya existe una cuenta con ese correo. Inicia sesión.',
            'telefono.regex' => 'El teléfono solo puede contener números, espacios, +, - y ()',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'ok' => false,
                'code' => 'validation_error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['email'] = strtolower($data['email']);
        $data['last_login_at'] = now();
        // Auto-asignar ciclo (YYYY-N) según la fecha actual.
        $data['ciclo'] = User::currentCiclo();

        $user = User::create($data);
        $token = $user->createToken('aquila-app')->plainTextToken;

        return response()->json([
            'ok' => true,
            'token' => $token,
            'user' => $this->presentUser($user),
        ], 201);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'ok' => true,
            'user' => $this->presentUser($request->user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['ok' => true]);
    }

    private function presentUser(User $user): array
    {
        return [
            'id' => $user->id,
            'nombre' => $user->nombre,
            'apellidos' => $user->apellidos,
            'nombre_completo' => $user->nombre_completo,
            'email' => $user->email,
            'telefono' => $user->telefono,
        ];
    }
}
