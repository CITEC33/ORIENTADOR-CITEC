import dayjs from 'dayjs'
import { toast } from 'sonner'

export const useExportToCSV = (data) => {
  const exportToCSV = () => {
    if (!data.length) {
      toast.warning('No hay incidentes para exportar')
      return
    }

    const headers = [
      'Folio',
      'Usuaria',
      'Teléfono',
      'Dirección del perfil',
      'Estatus del incidente',
      'Fecha Activación',
      'Mapa (URL)',
      'Primer contacto de emergencia',
      'Segundo contacto de emergencia',
      'Coordenadas'
    ]

    const rows = data.map((inc) => {
      const clean = (text) => `"${String(text || '').replace(/"/g, '""')}"`

      const contacto1 = inc.usuarias?.contactos_emergencia?.[0]
      const contacto2 = inc.usuarias?.contactos_emergencia?.[1]

      return [
        clean(inc.folio),
        clean(
          `${inc.usuarias?.nombre_completo} ${inc.usuarias?.apellido_p} ${inc.usuarias?.apellido_m}`
        ),
        clean(inc.usuarias?.telefono || 'Sin información'),
        clean(inc.usuarias?.direccion || 'Sin información'),
        clean(inc.estado || 'Sin información'),
        clean(dayjs(inc.fecha_activacion).format('DD/MM/YYYY HH:mm:ss [hrs]')),
        clean(`https://www.google.com/maps?q=${inc.latitud},${inc.longitud}`),
        clean(
          contacto1
            ? `${contacto1.nombre_completo} - ${contacto1.telefono}`
            : 'Sin registro'
        ),
        clean(
          contacto2
            ? `${contacto2.nombre_completo} - ${contacto2.telefono}`
            : 'Sin registro'
        ),
        clean(`${inc.latitud}, ${inc.longitud}`)
      ].join(',')
    })
    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;'
    })

    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `reporte_incidentes_${dayjs().format('YYYY-MM-DD_HH-mm')}.csv`
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return { exportToCSV }
}
