import React, { useState, useEffect } from 'react';
import { Button, message, Table, Modal, Typography, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { getAllCulturalClasses, createCulturalClass, updateCulturalClass, deleteCulturalClass } from '../../api/culturalClasses';
import type { CulturalClass, CulturalClassCategory, CreateCulturalClassDto, UpdateCulturalClassDto } from '../../interfaces/culturalClass';
import ClassCategoryBadge from '../../components/ui/ClassCategoryBadge';

import './index.css';
import CulturalClassForm from './CulturalClassForm';

const { Title } = Typography;
const { confirm } = Modal;

const CulturalClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<CulturalClass[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<CulturalClass | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await getAllCulturalClasses();
      setClasses(data);
    } catch (err: any) {
      message.error(`Error al cargar las clases: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClass = async (classData: CreateCulturalClassDto | UpdateCulturalClassDto) => {
    try {
      if (editingClass) {
        await updateCulturalClass(editingClass.id, classData as UpdateCulturalClassDto);
        message.success('Clase actualizada con éxito!');
      } else {
        await createCulturalClass(classData as CreateCulturalClassDto);
        message.success('Clase creada con éxito!');
      }
      setIsModalVisible(false);
      setEditingClass(null);
      fetchClasses();
    } catch (err: any) {
      message.error(`Error al guardar la clase: ${err.message}`);
    }
  };

  const handleDeleteClass = (id: number) => {
    confirm({
      title: '¿Estás seguro de eliminar esta clase?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer y solo se permite si no tiene inscripciones activas.',
      okText: 'Sí, Eliminar',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteCulturalClass(id);
          message.success('Clase eliminada con éxito!');
          fetchClasses();
        } catch (err: any) {
          message.error(`Error al eliminar la clase: ${err.message}`);
        }
      },
    });
  };

  const handleEditClass = (classToEdit: CulturalClass) => {
    setEditingClass(classToEdit);
    setIsModalVisible(true);
  };

  const handleAddClass = () => {
    setEditingClass(null);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingClass(null);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
      render: (category: CulturalClassCategory) => (
        <ClassCategoryBadge category={category} />
      ),
    },
    { title: 'Cap. Máx.', dataIndex: 'maxCapacity', key: 'maxCapacity' },
    {
      title: 'Inicio',
      dataIndex: 'startDateTime',
      key: 'startDateTime',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: 'Fin',
      dataIndex: 'endDateTime',
      key: 'endDateTime',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: 'Disponible',
      dataIndex: 'available',
      key: 'available',
      render: (available: boolean) => (available ? <Tag color="success">Sí</Tag> : <Tag color="error">No</Tag>),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: CulturalClass) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEditClass(record)}>
            Editar
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteClass(record.id)}
            disabled={!record.available}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Gestión de Clases Culturales</Title>
      <div className="cultural-classes-header">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClass}>
          Crear Clase
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={classes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingClass ? 'Editar Clase Cultural' : 'Crear Nueva Clase Cultural'}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        destroyOnHidden
        className="cultural-class-form-modal"
      >
        <CulturalClassForm
          onSubmit={handleSaveClass}
          initialData={editingClass}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
};

export default CulturalClassesPage;