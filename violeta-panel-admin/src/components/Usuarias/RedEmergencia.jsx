export const RedEmergencia = ({ emergencyContacts }) => {
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between px-1'>
        <h3 className='text-xs font-black text-gray-500 uppercase tracking-widest'>
          Red de Emergencia
        </h3>
        <span className='text-[10px] font-bold bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700'>
          {emergencyContacts.length}
        </span>
      </div>

      {emergencyContacts.length > 0 ? (
        <div className='grid gap-3'>
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className='flex items-center gap-3 p-3 bg-red-900/10 border border-red-500/20 rounded-xl'
            >
              <div className='w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-400 font-bold text-xs shadow-sm border border-red-500/20'>
                {contact.nombre_completo?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className='text-sm font-bold text-white'>
                  {contact.nombre_completo}
                </p>
                <p className='text-xs text-gray-400 font-medium'>
                  <span className='text-gray-400'>{contact.telefono}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='p-4 bg-gray-800 rounded-2xl border border-dashed border-gray-600 text-center'>
          <p className='text-xs text-gray-500 font-medium'>
            No ha designado contactos de emergencia
          </p>
        </div>
      )}
    </div>
  )
}
