// Exporta unesCareers.js + careerPlans.js a JSON consumibles por el Artisan seeder.
// Uso: node database/seeders/data/export-unes-data.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const orientadorData = resolve(__dirname, '../../../../orientador-unes/src/data')

const careers = await import(`${orientadorData}/unesCareers.js`)
const plans = await import(`${orientadorData}/careerPlans.js`)

const payload = {
  contact: careers.unesContact,
  modalidades: careers.unesModalidades,
  areas: careers.unesCareerAreas,
  index: careers.unesCareerIndex,
  details: careers.unesCareerDetails,
  maestrias: careers.unesMaestrias,
  doctorados: careers.unesDoctorados,
  plans: plans.careerPlans,
  counts: {
    licenciaturas: careers.unesCareerCount,
    maestrias: careers.unesMaestriasCount,
    doctorados: careers.unesDoctoradosCount
  }
}

const outPath = resolve(__dirname, 'unes-data.json')
writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8')
console.log(`✅ Exported UNES data → ${outPath}`)
console.log(`   ${payload.counts.licenciaturas} licenciaturas · ${payload.counts.maestrias} maestrías · ${payload.counts.doctorados} doctorados`)
console.log(`   ${Object.keys(payload.plans).length} planes detallados`)
