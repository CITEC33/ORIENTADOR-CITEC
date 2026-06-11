import { Loader2, ShieldAlert } from 'lucide-react'
import { useGetLocation } from '../hooks/useGetLocation'
import { useIncidentes } from '../hooks/useIncidentes'
import { toast } from 'sonner'
import Swal from 'sweetalert2'

const darkSwal = Swal.mixin({
  customClass: {
    popup:
      'bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl shadow-black/50',
    title: 'text-xl font-bold text-white',
    htmlContainer: 'text-gray-400 text-sm',
    confirmButton:
      'bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-red-900/30 transition-all transform active:scale-95',
    cancelButton:
      'bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform active:scale-95',
    actions: 'gap-4 flex justify-center w-full px-4'
  },
  buttonsStyling: false,
  background: '#111827',
  color: '#f3f4f6'
})

export const PanicButton = ({ mode, handleModal, setMessage }) => {
  const { getFullLocation } = useGetLocation()
  const { activarSOS, isCreating } = useIncidentes()

  const getLocationAndAlert = async () => {
    darkSwal
      .fire({
        title:
          'Estas a punto de enviar tu ubicación actual para solicitar apoyo.',
        text: '¿Estas segura de que deseas activar el botón de pánico?',
        icon: 'warning',
        iconColor: '#ef4444',
        showCancelButton: true,
        confirmButtonText: 'SÍ, ENVIAR ALERTA',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          handleModal?.()
          setMessage('')

          try {
            const locationData = await getFullLocation()
            const data = await activarSOS(locationData)

            setMessage(
              `Tu folio de alerta es: #${data.folio}. Llama para recibir atención inmediata y proporciona este número de folio para dar seguimiento a tu caso.`
            )

            toast.success(
              `Tu folio de alerta es: #${data.folio}.
              Llama para recibir atención inmediata y proporciona este número de folio para dar seguimiento a tu caso.`,
              {
                duration: 10000,
                style: {
                  whiteSpace: 'pre-line'
                }
              }
            )
          } catch (err) {
            console.error('Error en proceso de SOS', err)
            toast.error('Error al enviar alerta. Verifique su GPS e internet.')
          }
        }
      })
  }

  return (
    <>
      <button
        onClick={getLocationAndAlert}
        className={`w-full py-2.5 px-4 rounded-md font-bold shadow-sm flex items-center justify-center gap-2 transition-all bg-red-600 text-white hover:bg-red-700 ${
          mode === 'sidebar' ? 'text-sm' : 'text-xl'
        }`}
      >
        {isCreating ? (
          <>
            <Loader2 className='w-6 h-6 animate-spin' />
            Enviando...
          </>
        ) : (
          <>
            <ShieldAlert className='w-6 h-6' />
            Activar SOS
          </>
        )}
      </button>
      <p className='text-red-500 text-xs underline text-center mt-3'>
        Al hacer click al botón, se mandará una alerta al sistema con tu
        ubicación actual
      </p>
    </>
  )
}
