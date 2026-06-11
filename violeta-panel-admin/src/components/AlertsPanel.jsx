import { useState } from 'react';
import { Bell, Check, CheckCheck, Siren, MapPin, TestTube, X, Loader2, AlertTriangle } from 'lucide-react';
import { Card, Badge, Button, Modal } from './ui';
import { useAlerts } from '../hooks/useAlerts';
import { formatTimeAgo } from '../lib/utils';

export function AlertsPanel({ isOpen, onClose }) {
  const { alerts, unreadCount, loading, markAsRead, markAllAsRead, createTestAlert } = useAlerts();
  const [showPanel, setShowPanel] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Si se pasa isOpen como prop, usarlo; sino usar estado local
  const panelIsOpen = isOpen !== undefined ? isOpen : showPanel;
  const handleClose = onClose || (() => setShowPanel(false));

  const handleMarkAsRead = async (alertId) => {
    await markAsRead(alertId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleCreateTest = async (type) => {
    setTestLoading(true);
    await createTestAlert(type);
    setTestLoading(false);
  };

  const getSeverityBadge = (severity) => {
    const map = {
      critical: { tone: 'red', label: 'Crítica', icon: Siren },
      high: { tone: 'orange', label: 'Alta', icon: AlertTriangle },
      medium: { tone: 'yellow', label: 'Media', icon: Bell },
      low: { tone: 'green', label: 'Baja', icon: Check }
    };
    return map[severity] || map.low;
  };

  const getTypeIcon = (type) => {
    const icons = {
      panic_button: Siren,
      location_update: MapPin,
      test: TestTube
    };
    return icons[type] || Bell;
  };

  return (
    <>
      {/* Botón flotante de alertas */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="relative w-14 h-14 rounded-full gradient-violeta-pink shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
        >
          <Bell className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-black">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
      </div>

      {/* Panel de alertas */}
      <Modal isOpen={panelIsOpen} onClose={handleClose} title="Centro de Alertas">
        <div className="space-y-4">
          {/* Controles */}
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              {unreadCount === 0 ? (
                <span className="text-green-600 font-medium">✅ Todo al día</span>
              ) : (
                <span className="text-red-600 font-bold">{unreadCount} sin leer</span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button size="sm" variant="secondary" onClick={handleMarkAllAsRead}>
                <CheckCheck className="w-4 h-4" />
                Marcar todas
              </Button>
            )}
          </div>

          {/* Simulador de alertas */}
          <Card className="p-4 bg-violet-50 border-2 border-dashed border-violeta-300">
            <div className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TestTube className="w-4 h-4 text-violeta-600" />
              Simulador de Alertas (Testing)
            </div>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleCreateTest('panic_button')}
                disabled={testLoading}
                className="w-full justify-start"
              >
                {testLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Siren className="w-4 h-4" />
                )}
                Simular Botón de Pánico
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleCreateTest('location_update')}
                disabled={testLoading}
                className="w-full justify-start"
              >
                {testLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                Simular Actualización de Ubicación
              </Button>
              <Button
                size="sm"
                onClick={() => handleCreateTest('test')}
                disabled={testLoading}
                className="w-full justify-start"
              >
                {testLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4" />
                )}
                Alerta de Prueba Genérica
              </Button>
            </div>
          </Card>

          {/* Lista de alertas */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-violeta-600" />
              <span className="ml-3 text-gray-600">Cargando alertas...</span>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <div className="text-gray-600">No hay alertas todavía</div>
              <div className="text-xs text-gray-500 mt-1">
                Prueba el simulador para generar alertas de prueba
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {alerts.map((alert) => {
                const severityInfo = getSeverityBadge(alert.severity);
                const TypeIcon = getTypeIcon(alert.type);
                const SeverityIcon = severityInfo.icon;

                return (
                  <Card
                    key={alert.id}
                    className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                      !alert.read ? 'border-l-4 border-l-violeta-600 bg-violet-50' : ''
                    }`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          alert.severity === 'critical' ? 'bg-red-100' :
                          alert.severity === 'high' ? 'bg-orange-100' :
                          alert.severity === 'medium' ? 'bg-yellow-100' :
                          'bg-green-100'
                        }`}
                      >
                        <TypeIcon
                          className={`w-5 h-5 ${
                            alert.severity === 'critical' ? 'text-red-600' :
                            alert.severity === 'high' ? 'text-orange-600' :
                            alert.severity === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-sm text-gray-900">{alert.title}</div>
                          {!alert.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(alert.id);
                              }}
                              className="text-violeta-600 hover:text-violeta-700 flex-shrink-0"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{alert.message}</div>
                        {alert.profiles && (
                          <div className="text-xs text-gray-500 mt-2">
                            👤 {alert.profiles.full_name}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge tone={severityInfo.tone}>
                            <SeverityIcon className="w-3 h-3" />
                            {severityInfo.label}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(alert.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de detalle */}
      {selectedAlert && (
        <Modal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title="Detalle de Alerta"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selectedAlert.severity === 'critical' ? 'bg-red-100' :
                  selectedAlert.severity === 'high' ? 'bg-orange-100' :
                  selectedAlert.severity === 'medium' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}
              >
                {(() => {
                  const TypeIcon = getTypeIcon(selectedAlert.type);
                  return (
                    <TypeIcon
                      className={`w-6 h-6 ${
                        selectedAlert.severity === 'critical' ? 'text-red-600' :
                        selectedAlert.severity === 'high' ? 'text-orange-600' :
                        selectedAlert.severity === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}
                    />
                  );
                })()}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-900">{selectedAlert.title}</div>
                <div className="text-sm text-gray-600 mt-1">{selectedAlert.message}</div>
              </div>
            </div>

            {selectedAlert.profiles && (
              <Card className="p-4 bg-gray-50">
                <div className="text-xs font-bold text-gray-500 mb-2">USUARIA</div>
                <div className="text-sm font-bold text-gray-900">
                  {selectedAlert.profiles.full_name}
                </div>
                {selectedAlert.profiles.phone && (
                  <div className="text-sm text-gray-600 mt-1">
                    📞 {selectedAlert.profiles.phone}
                  </div>
                )}
              </Card>
            )}

            {selectedAlert.incidents && (
              <Card className="p-4 bg-gray-50">
                <div className="text-xs font-bold text-gray-500 mb-2">INCIDENTE</div>
                <div className="text-sm font-bold text-gray-900">
                  {selectedAlert.incidents.folio}
                </div>
                <Badge tone="blue" className="mt-2">
                  {selectedAlert.incidents.status}
                </Badge>
              </Card>
            )}

            {selectedAlert.metadata?.test && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
                ⚠️ Esta es una alerta de prueba generada desde el simulador
              </div>
            )}

            <div className="pt-4 border-t flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {formatTimeAgo(selectedAlert.created_at)}
              </div>
              {!selectedAlert.read && (
                <Button
                  size="sm"
                  onClick={() => {
                    handleMarkAsRead(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                >
                  <Check className="w-4 h-4" />
                  Marcar como leída
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
