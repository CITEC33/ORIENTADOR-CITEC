import { execFileSync } from 'node:child_process'

const commitMessage = process.argv.slice(2).join(' ').trim()

if (!commitMessage || commitMessage === '--help' || commitMessage === '-h') {
  console.log('Uso: npm run commit:both -- "Mensaje del commit"')
  console.log('')
  console.log('Hace git add -A, crea commit si hay cambios y empuja main a:')
  console.log('- origin  -> Cacosbit99/ORIENTADOR-UNES')
  console.log('- citec   -> CITEC33/ORIENTADOR-CITEC')
  process.exit(commitMessage ? 0 : 1)
}

const run = (args, options = {}) => {
  execFileSync('git', args, { stdio: 'inherit', ...options })
}

const output = (args) =>
  execFileSync('git', args, { encoding: 'utf8' }).trim()

const branch = output(['branch', '--show-current'])
if (branch !== 'main') {
  throw new Error(`Estas en la rama "${branch}". Cambia a main antes de publicar a ambos remotos.`)
}

const remotes = output(['remote', '-v'])
if (!remotes.includes('Cacosbit99/ORIENTADOR-UNES.git')) {
  throw new Error('No encuentro el remoto origin de Cacosbit99/ORIENTADOR-UNES.')
}
if (!remotes.includes('CITEC33/ORIENTADOR-CITEC.git')) {
  throw new Error('No encuentro el remoto citec de CITEC33/ORIENTADOR-CITEC.')
}

run(['add', '-A'])

const staged = output(['diff', '--cached', '--name-only'])
if (staged) {
  run(['commit', '-m', commitMessage])
} else {
  console.log('No hay cambios nuevos para commitear; solo empujare la rama actual.')
}

run(['push', 'origin', 'main'])
run(['push', 'citec', 'main'])

const head = output(['log', '-1', '--oneline'])
console.log(`Listo en ambos remotos: ${head}`)
