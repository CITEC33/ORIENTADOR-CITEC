import { cpSync, existsSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const frontendDir = join(rootDir, 'ORIENTADOR UNES')
const frontendDist = join(frontendDir, 'dist')
const rootDist = join(rootDir, 'dist')
const deployDir = join(rootDir, 'deploy-hostinger')
const apiBridge = join(rootDir, 'api')
const hostingerPublicRoot = '/home/u215694980/domains/orientador.xn--sistemaespaa-khb.com/public_html'
const legacyMainBundles = ['index-00534c21.js']

execSync('npm install', { cwd: frontendDir, stdio: 'inherit', shell: true })
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit', shell: true })

if (!existsSync(frontendDist)) {
  throw new Error(`No se encontro el build del frontend en ${frontendDist}`)
}

const isHostinger = process.platform !== 'win32' && rootDir === hostingerPublicRoot

if (!isHostinger) {
  rmSync(rootDist, { recursive: true, force: true })
}
cpSync(frontendDist, rootDist, { recursive: true })
const indexHtml = readFileSync(join(rootDist, 'index.html'), 'utf8')
const mainBundle = indexHtml.match(/\/assets\/(index-[a-f0-9]+\.js)/)?.[1]
if (mainBundle) {
  for (const legacyBundle of legacyMainBundles) {
    cpSync(join(rootDist, 'assets', mainBundle), join(rootDist, 'assets', legacyBundle))
  }
}
rmSync(apiBridge, { recursive: true, force: true })
cpSync(join(deployDir, 'api'), apiBridge, { recursive: true })
cpSync(join(deployDir, 'root.htaccess'), join(rootDir, '.htaccess'))
console.log(`Build listo en ${rootDist}`)

if (isHostinger) {
  console.log('Hostinger detectado: preparando runtime Laravel...')
  execSync('bash deploy-hostinger/setup-backend-runtime.sh', {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  })
}
