import React, { useEffect, useState } from 'react';
import {
  Layout, Menu, Table, Typography, Input, Tag, Spin, Button, Modal, Tooltip, Space, Popconfirm, message
} from 'antd';
import {
  FileTextOutlined, PieChartOutlined, DesktopOutlined, CarryOutOutlined,
  AuditOutlined, UserOutlined, MessageOutlined, SearchOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { sugerenciasService } from '../services/sugerencia.services.js';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function MisSugerencias() {
  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeActivo, setMensajeActivo] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);
  const navigate = useNavigate();

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleString('es-CL', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
  };

  // Función para determinar si fue editada
  const fueEditada = (createdAt, updatedAt) => {
    if (!createdAt || !updatedAt) return false;
    const created = new Date(createdAt).getTime();
    const updated = new Date(updatedAt).getTime();
    return updated > created;
  };

  // Función para eliminar sugerencia
  const eliminarSugerencia = async (id, titulo) => {
    try {
      setEliminandoId(id);
      await sugerenciasService.eliminarSugerencia(id);
      
      // Actualizar la lista local eliminando la sugerencia
      setSugerencias(prevSugerencias => 
        prevSugerencias.filter(s => s.id !== id)
      );
      
      message.success(`Sugerencia "${titulo}" eliminada exitosamente`);
    } catch (error) {
      console.error("Error al eliminar sugerencia:", error);
      message.error(error.message || 'Error al eliminar la sugerencia');
    } finally {
      setEliminandoId(null);
    }
  };

  useEffect(() => {
    const cargarMisSugerencias = async () => {
      try {
        const res = await sugerenciasService.obtenerMisSugerencias();
        setSugerencias(res.data.data || []);
      } catch (error) {
        console.error("Error al obtener mis sugerencias:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarMisSugerencias();
  }, []);

  const filtered = sugerencias.filter(s => {
    const texto = `${s.titulo} ${s.categoria} ${s.estado}`.toLowerCase();
    return texto.includes(searchText.toLowerCase());
  });

  const columns = [
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo'
    },
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria'
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => {
        const colores = {
          pendiente: 'orange',
          'en proceso': 'blue',
          resuelta: 'green',
          archivada: 'default'
        };
        return <Tag color={colores[estado] || 'default'}>{estado.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Fecha',
      key: 'fecha',
      render: (_, record) => {
        const editada = fueEditada(record.createdAt, record.updatedAt);
        const fechaMostrar = editada ? record.updatedAt : record.createdAt;
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {editada && (
                <Tooltip title="Esta sugerencia fue editada">
                  <EditOutlined style={{ color: '#1890ff', fontSize: 12 }} />
                </Tooltip>
              )}
              <Text style={{ fontSize: 12 }}>
                {formatearFecha(fechaMostrar)}
              </Text>
            </div>
            {editada && (
              <Text type="secondary" style={{ fontSize: 10 }}>
                Creada: {formatearFecha(record.createdAt)}
              </Text>
            )}
          </div>
        );
      }
    },
    {
      title: 'Mensaje',
      key: 'mensaje',
      render: (_, record) => (
        <Button
          icon={<MessageOutlined />} 
          type="link"
          onClick={() => {
            setMensajeActivo(record.mensaje);
            setModalVisible(true);
          }}
        >
          Ver
        </Button>
      )
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />} 
            type="link"
            onClick={() => navigate(`/sugerencias/${record.id}/editar`, {
              state: { sugerencia: record }
            })}
          >
            Editar
          </Button>
          
          <Popconfirm
            title="¿Eliminar sugerencia?"
            description={`¿Estás seguro de que quieres eliminar "${record.titulo}"?`}
            onConfirm={() => eliminarSugerencia(record.id, record.titulo)}
            okText="Sí, eliminar"
            cancelText="Cancelar"
            okType="danger"
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              danger
              loading={eliminandoId === record.id}
              style={{ color: '#ff4d4f' }}
            >
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const menuItems = [
    { key: '0', icon: <FileTextOutlined />, label: 'Inicio' },
    { key: '1', icon: <PieChartOutlined />, label: 'Votaciones' },
    { key: '2', icon: <DesktopOutlined />, label: 'Crear Votación' },
    { key: '3', icon: <CarryOutOutlined />, label: 'Eventos' },
    { key: '4', icon: <FileTextOutlined />, label: 'Sugerencias' },
    { key: '6', icon: <UserOutlined />, label: 'Mis sugerencias' },
    { key: '5', icon: <AuditOutlined />, label: 'Dashboard' }
  ];

  const onMenuClick = (item) => {
    if (item.key === '0') navigate('/noticias');
    if (item.key === '1') navigate('/votaciones');
    if (item.key === '2') navigate('/crear');
    if (item.key === '3') navigate('/eventos');
    if (item.key === '4') navigate('/sugerencias');
    if (item.key === '5') navigate('/dashboard');
    if (item.key === '6') navigate('/mis-sugerencias');
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#1e3a8a' }}>
      <Sider theme="dark" collapsible>
        <Menu mode="inline" theme="dark" defaultSelectedKeys={['6']} items={menuItems} onClick={onMenuClick} />
      </Sider>
      <Layout>
        <Content style={{ padding: '48px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Title level={2} style={{ color: '#1e3a8a', marginBottom: 24 }}>
              Mis Sugerencias
            </Title>

            <Input
              placeholder="Buscar sugerencias..."
              prefix={<SearchOutlined style={{ color: '#1e3a8a' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300, marginBottom: 16, borderRadius: 8 }}
              allowClear
            />

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                  <Text>Cargando sugerencias...</Text>
                </div>
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={filtered}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                bordered
                locale={{
                  emptyText: 'Aún no has creado ninguna sugerencia',
                }}
              />
            )}

            <Modal
              title="Mensaje de la sugerencia"
              open={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={null}
            >
              <p>{mensajeActivo}</p>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}