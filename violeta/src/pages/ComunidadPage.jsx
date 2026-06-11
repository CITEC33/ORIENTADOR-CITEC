import { useEffect, useState } from 'react'
import { SeccionEventosComunidad } from '../components/Comunidad/Eventos/SeccionEventosComunidad'
import { SECCIONES, SECCIONES_NOVEDADES } from '../lib/pilas-comunidad'
import { DirectorioAyuda } from '../components/Comunidad/DirectorioAyuda/DirectorioAyuda'
import { GuiasBienestar } from '../components/Comunidad/Bienestar/GuiasBienestar'
import { AlertasCards } from '../components/Comunidad/Alertas/AlertasCards'
import { ArticulosCards } from '../components/Comunidad/Articulos/ArticulosCards'
import { RefreshWrapper } from '../components/RefreshWrapper'

const ComunidadPage = () => {
  const [activeSection, setActiveSection] = useState(SECCIONES.novedades.id)
  const [activeSectionNovedades, setActiveSectionNovedades] = useState(
    SECCIONES_NOVEDADES.alertas.id
  )

  useEffect(() => {
    if (activeSection === SECCIONES.novedades.id) {
      document.title = 'Comunidad - Fuerza Violeta'
    } else if (activeSection === SECCIONES.directorio.id) {
      document.title = 'Directorio de ayuda - Fuerza Violeta'
    } else if (activeSection === SECCIONES.bienestar.id) {
      document.title = 'Bienestar - Fuerza Violeta'
    }

    if (activeSectionNovedades === SECCIONES_NOVEDADES.eventos.id) {
      document.title = 'Eventos - Fuerza Violeta'
    } else if (activeSectionNovedades === SECCIONES_NOVEDADES.articulos.id) {
      document.title = 'Artículos - Fuerza Violeta'
    }
  }, [activeSection, activeSectionNovedades])

  return (
    <RefreshWrapper key={activeSection}>
      <div className='min-h-full pb-20'>
        <div className='max-w-6xl mx-auto p-2 sm:p-6 mt-10 lg:mt-0'>
          <div className='bg-gray-800 rounded-2xl p-5 sm:p-10 mb-10 shadow-xl shadow-black/20 border border-gray-700'>
            <div className='text-center mb-10'>
              <h1 className='text-3xl font-bold text-white mb-2'>
                Comunidad Violeta
              </h1>
              <p className='text-gray-400'>
                Conecta con redes de apoyo seguras en tu ciudad.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 md:w-fit md:mx-auto'>
              {Object.values(SECCIONES).map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id)
                    if (section.id === SECCIONES.novedades.id) {
                      setActiveSectionNovedades(SECCIONES_NOVEDADES.alertas.id)
                    } else {
                      setActiveSectionNovedades(null)
                    }
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    activeSection === section.id
                      ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/50'
                      : 'bg-gray-900 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {activeSection === SECCIONES.novedades.id && (
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 sm:w-fit sm:mx-auto mt-5'>
                {Object.values(SECCIONES_NOVEDADES).map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSectionNovedades(section.id)}
                    className={`px-5 py-2.5 rounded-full active:rounded-full selection:rounded-full  text-sm font-bold transition-all border ${
                      activeSectionNovedades === section.id
                        ? 'bg-purple-900/50 text-purple-200 border-purple-500/50 shadow-inner'
                        : 'bg-transparent text-gray-400 border-transparent hover:bg-gray-700/50 hover:text-gray-300'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className='grid gap-6 bg-gray-800 rounded-3xl p-3 sm:p-6 shadow-xl shadow-black/20 border border-gray-700'>
            {activeSectionNovedades === SECCIONES_NOVEDADES.alertas.id && (
              <AlertasCards />
            )}

            {activeSectionNovedades === SECCIONES_NOVEDADES.eventos.id && (
              <SeccionEventosComunidad />
            )}

            {activeSectionNovedades === SECCIONES_NOVEDADES.articulos.id && (
              <ArticulosCards />
            )}

            {activeSection === SECCIONES.directorio.id && <DirectorioAyuda />}

            {activeSection === SECCIONES.bienestar.id && <GuiasBienestar />}
          </div>
        </div>
      </div>
    </RefreshWrapper>
  )
}

export default ComunidadPage
