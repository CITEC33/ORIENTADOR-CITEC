<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Agrega el campo `ciclo` (formato YYYY-N, N ∈ {1,2,3}) a la tabla users.
 *
 * UNES Durango es cuatrimestral (3 ciclos/año):
 *   - Ciclo 1: enero – abril
 *   - Ciclo 2: mayo – agosto
 *   - Ciclo 3: septiembre – diciembre
 *
 * El valor se deduce automáticamente a partir de `created_at` para todos los
 * registros existentes; en adelante se autollena en el registro y el admin
 * puede sobreescribirlo manualmente si lo requiere.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('ciclo', 10)->nullable()->after('telefono')->index();
        });

        // Backfill: calcular el ciclo a partir de created_at para cada usuario existente.
        DB::table('users')->orderBy('id')->chunkById(500, function ($rows) {
            foreach ($rows as $u) {
                $ts = $u->created_at ?? null;
                if (! $ts) continue;
                $ciclo = User::computeCicloForDate($ts);
                if ($ciclo) {
                    DB::table('users')->where('id', $u->id)->update(['ciclo' => $ciclo]);
                }
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['ciclo']);
            $table->dropColumn('ciclo');
        });
    }
};
