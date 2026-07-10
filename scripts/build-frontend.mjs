import { cpSync, existsSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const frontendDir = join(rootDir, 'ORIENTADOR UNES')
const frontendDist = join(frontendDir, 'dist')
const rootDist = join(rootDir, 'dist')

execSync('npm install', { cwd: frontendDir, stdio: 'inherit', shell: true })
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit', shell: true })

if (!existsSync(frontendDist)) {
  throw new Error(`No se encontro el build del frontend en ${frontendDist}`)
}

rmSync(rootDist, { recursive: true, force: true })
cpSync(frontendDist, rootDist, { recursive: true })
console.log(`Build listo en ${rootDist}`)
