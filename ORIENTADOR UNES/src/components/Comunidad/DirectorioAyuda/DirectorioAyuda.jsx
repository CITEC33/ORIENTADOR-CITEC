import { AnimatePresence } from 'framer-motion'
import { CardsDirectorioAyuda } from './CardsDirectorioAyuda'
import { OrgsDirectorioAyuda } from './OrgsDirectorioAyuda'
import { organizaciones } from '../../../lib/directorio-ayuda'

export const DirectorioAyuda = () => {
  return (
    <>
      <div className='max-w-7xl mx-auto px-0 sm:px-4 py-4'>
        <div className='mb-8 text-center md:text-left'>
          <h2 className='text-xl sm:text-2xl font-bold text-center mx-auto md:mx-0 mb-2 text-white'>
            Instituciones verificadas en Durango y guía legal esencial.
          </h2>
        </div>

        <CardsDirectorioAyuda />

        <div className='grid grid-cols-1 gap-8 items-start'>
          <div className='flex-1 w-full space-y-6 md:col-span-2'>
            <AnimatePresence mode='popLayout'>
              {organizaciones.map((org) => (
                <OrgsDirectorioAyuda key={org.id} org={org} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}
