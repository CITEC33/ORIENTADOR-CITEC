import { levels } from '../lib/levels-violentometro'
import { CardViolentometro } from '../components/Violentometro/CardViolentometro'
import { HeaderViolentometro } from '../components/Violentometro/HeaderViolentometro'
import { IdentificacionViolentometro } from '../components/Violentometro/IdentificacionViolentometro'
import { InformacionViolentometro } from '../components/Violentometro/InformacionViolentometro'
import { useEffect } from 'react'

const ViolentometroPage = () => {
  useEffect(() => {
    document.title = 'Violentómetro - Fuerza Violeta'
  }, [])

  return (
    <div>
      <HeaderViolentometro />

      <div className='max-w-7xl mx-auto px-2 sm:px-6 py-12 space-y-8'>
        <div className='grid md:grid-cols-3 gap-4 -mt-24'>
          {levels.map((level, idx) => (
            <CardViolentometro key={level.level} level={level} idx={idx} />
          ))}
        </div>

        <IdentificacionViolentometro />

        <div className='bg-gray-800 rounded-2xl shadow-xl shadow-black/20 border border-gray-700 p-4 sm:p-6 md:p-8 '>
          <InformacionViolentometro />
        </div>
      </div>
    </div>
  )
}

export default ViolentometroPage
