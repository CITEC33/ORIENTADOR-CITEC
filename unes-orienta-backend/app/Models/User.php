<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\HasApiTokens;

/**
 * Usuario de UNES Orienta IA — auth sin contraseña.
 *
 * Se identifica por email único + nombre + apellidos + teléfono.
 * NO hereda de un modelo con password: no lo usamos, pero mantenemos
 * la interfaz Authenticatable para poder emitir tokens Sanctum.
 *
 * Campo `ciclo` (formato YYYY-N):
 *   UNES Durango es cuatrimestral, 3 ciclos por año:
 *     - Ciclo 1: enero – abril
 *     - Ciclo 2: mayo – agosto
 *     - Ciclo 3: septiembre – diciembre
 *   Se autollena en el registro; el admin puede editarlo.
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nombre',
        'apellidos',
        'email',
        'telefono',
        'ciclo',
        'last_login_at',
    ];

    protected $hidden = [
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'last_login_at' => 'datetime',
        ];
    }

    /** Nombre completo para mostrar en UI. */
    public function getNombreCompletoAttribute(): string
    {
        return trim($this->nombre.' '.$this->apellidos);
    }

    public function chatLogs()
    {
        return $this->hasMany(ChatLog::class);
    }

    /**
     * Calcula el ciclo (YYYY-N) a partir de una fecha dada.
     * Devuelve null si la fecha no es válida.
     */
    public static function computeCicloForDate($date): ?string
    {
        try {
            $c = $date instanceof Carbon ? $date : Carbon::parse((string) $date);
        } catch (\Throwable $e) {
            return null;
        }
        $month = (int) $c->format('n'); // 1-12
        if ($month >= 1 && $month <= 4) {
            $n = 1;
        } elseif ($month >= 5 && $month <= 8) {
            $n = 2;
        } else {
            $n = 3;
        }
        return $c->format('Y').'-'.$n;
    }

    /** Ciclo actual basado en la fecha de hoy (formato YYYY-N). */
    public static function currentCiclo(): string
    {
        return self::computeCicloForDate(now());
    }

    /**
     * Auto-asigna el ciclo si aún no tiene, usando created_at (o ahora si es nuevo).
     */
    public function ensureCiclo(): void
    {
        if (! empty($this->ciclo)) return;
        $base = $this->created_at ?? now();
        $this->ciclo = self::computeCicloForDate($base);
    }
}
