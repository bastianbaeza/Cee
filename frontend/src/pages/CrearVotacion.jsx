import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { votacionService } from '../services/votacion.services';
import Swal from 'sweetalert2';
import MainLayout from '../components/MainLayout.jsx';

import {
  Layout,
  Card,
  Input,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Divider,
  Breadcrumb,
  message 
} from 'antd';

import {
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext.jsx';

const { Title, Text } = Typography;

function CrearVotacion() {
  const [titulo, setTitulo] = useState('');
  const [opciones, setOpciones] = useState(['', '']); // Comienza con 2 opciones mínimas
  const [loading, setLoading] = useState(false);

  const handleOpcionChange = (index, value) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index] = value;
    setOpciones(nuevasOpciones);
  };

  const agregarOpcion = () => {
    if (opciones.length < 10) {
      setOpciones([...opciones, '']);
    }
  };

  const eliminarOpcion = (index) => {
    if (opciones.length > 2) {
      const nuevasOpciones = opciones.filter((_, i) => i !== index);
      setOpciones(nuevasOpciones);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const opcionesValidas = opciones.filter(op => op.trim() !== '');

    try {
      const response = await votacionService.crearVotacion(titulo, opcionesValidas);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Votación creada exitosamente',
          text: 'La votación ha sido creada correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          navigate('/votaciones'); // Redirigir a la lista de votaciones
        })
      }
      setTitulo('');
      setOpciones(['', '']);
    } catch (err) {
     await Swal.fire({
        icon: 'error',
        title: 'Error al crear votación',
        text: err.message
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <MainLayout breadcrumb={<Breadcrumb style={{ margin: '14px 0' }}/>}>
          <div >
             <div style={{ maxWidth: 800, margin: '0 auto',  }}> 
            {/* Header de la página */}
            <div style={{ textAlign: 'center', marginBottom: 48 , }}>
              <Title level={1} style={{ color: '#1e3a8a', marginBottom: 8 }}>
                Crear Nueva Votación
              </Title>
              <Text style={{ fontSize: 16, color: '#64748b' }}>
                Configura los detalles de tu nueva votación
              </Text>
            </div>

            {/* Formulario */}
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              bodyStyle={{ padding: 40 }}
            >
              <div>
                {/* Título de la votación */}
                <div style={{ marginBottom: 32 }}>
                  <Text strong style={{ fontSize: 16, color: '#1e3a8a', display: 'block', marginBottom: 8 }}>
                    Título de la Votación
                  </Text>
                  <Input
                    size="large"
                    placeholder="Ingresa el título de la votación"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    style={{
                      borderRadius: 8,
                      fontSize: 16
                    }}
                  />
                </div>

                <Divider style={{ margin: '32px 0' }} />

                {/* Opciones */}
                <div style={{ marginBottom: 32 }}>
                  <Title level={4} style={{ color: '#1e3a8a', marginBottom: 24 }}>
                    Opciones de Votación
                  </Title>
                  <Text style={{ color: '#64748b', marginBottom: 24, display: 'block' }}>
                    Agrega las opciones que los usuarios podrán elegir (mínimo 2, máximo 10)
                  </Text>

                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {opciones.map((opcion, index) => (
                      <Row key={index} gutter={12} align="middle">
                        <Col flex="auto">
                          <Input
                            size="large"
                            placeholder={`Opción ${index + 1}`}
                            value={opcion}
                            onChange={(e) => handleOpcionChange(index, e.target.value)}
                            style={{
                              borderRadius: 8,
                              fontSize: 16
                            }}
                            prefix={
                              <div style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: '#1e3a8a',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                fontWeight: 'bold'
                              }}>
                                {index + 1}
                              </div>
                            }
                          />
                        </Col>
                        {opciones.length > 2 && (
                          <Col>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => eliminarOpcion(index)}
                              style={{
                                borderRadius: 8,
                                height: 40,
                                width: 40
                              }}
                            />
                          </Col>
                        )}
                      </Row>
                    ))}
                  </Space>

                  {/* Botón agregar opción */}
                  {opciones.length < 10 && (
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={agregarOpcion}
                      style={{
                        width: '100%',
                        height: 48,
                        marginTop: 16,
                        borderRadius: 8,
                        borderColor: '#1e3a8a',
                        color: '#1e3a8a',
                        fontSize: 16
                      }}
                    >
                      Agregar Opción ({opciones.length}/10)
                    </Button>
                  )}
                </div>

                <Divider style={{ margin: '32px 0' }} />

                {/* Botones de acción */}
                <Row gutter={16} justify="end">
                  <Col>
                    <Button
                      size="large"
                      onClick={() => window.history.back()}
                      style={{
                        borderRadius: 8,
                        height: 48,
                        paddingLeft: 24,
                        paddingRight: 24,
                        fontSize: 16
                      }}
                    >
                      Cancelar
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleSubmit}
                      loading={loading}
                      icon={<CheckOutlined />}
                      style={{
                        backgroundColor: '#1e3a8a',
                        borderColor: '#1e3a8a',
                        borderRadius: 8,
                        height: 48,
                        paddingLeft: 24,
                        paddingRight: 24,
                        fontSize: 16,
                        fontWeight: 500
                      }}
                    >
                      {loading ? 'Creando...' : 'Crear Votación'}
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card>

            {/* Información adicional */}
            <Card
              style={{
                marginTop: 24,
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: 12
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Title level={5} style={{ color: '#1e3a8a', marginBottom: 12 }}>
                💡 Consejos para crear una buena votación
              </Title>
              <ul style={{ color: '#64748b', marginBottom: 0 }}>
                <li>Usa un título claro y descriptivo</li>
                <li>Las opciones deben ser específicas y diferentes entre sí</li>
                <li>Evita opciones muy largas o confusas</li>
                <li>Puedes agregar hasta 10 opciones diferentes</li>
              </ul>
            </Card>
          </div>
      </div>
    </MainLayout>
    </>
  );
}

export default CrearVotacion;