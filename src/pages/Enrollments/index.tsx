import React, { useState, useEffect } from 'react';
import { Button, message, Table, Modal, Typography, Space, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { createEnrollment, cancelEnrollment, getEnrollmentsByClassId } from '../../api/enrollments';
import { getAllCulturalClasses } from '../../api/culturalClasses';

import './index.css';
import type { CreateEnrollmentDto, Enrollment } from '../../interfaces/enrollment';
import type { CulturalClass } from '../../interfaces/culturalClass';
import EnrollmentForm from './EnrollmentForm';

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const EnrollmentsPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [culturalClasses, setCulturalClasses] = useState<CulturalClass[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  useEffect(() => {
    fetchCulturalClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchEnrollmentsByClass(selectedClassId);
    } else {
      setEnrollments([]);
    }
  }, [selectedClassId]);

  const fetchCulturalClasses = async () => {
    try {
      const data = await getAllCulturalClasses();
      setCulturalClasses(data);
    } catch (err: any) {
      message.error(`Error al cargar las clases culturales: ${err.message}`);
    }
  };

  const fetchEnrollmentsByClass = async (classId: number) => {
    setLoading(true);
    try {
      const data = await getEnrollmentsByClassId(classId);
      setEnrollments(data);
    } catch (err: any) {
      message.error(`Error al cargar las inscripciones para la clase: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEnrollment = async (enrollmentData: CreateEnrollmentDto) => {
    try {
      await createEnrollment(enrollmentData);
      message.success('Inscripción realizada con éxito!');
      setIsModalVisible(false);
      if (selectedClassId === enrollmentData.classId) {
        fetchEnrollmentsByClass(selectedClassId);
      }
    } catch (err: any) {
      message.error(`Error al inscribir: ${err.message}`);
    }
  };

  const handleCancelEnrollment = (id: number) => {
    confirm({
      title: '¿Estás seguro de cancelar esta inscripción?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, Cancelar',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await cancelEnrollment(id);
          message.success('Inscripción cancelada con éxito!');
          if (selectedClassId) {
            fetchEnrollmentsByClass(selectedClassId);
          }
        } catch (err: any) {
          message.error(`Error al cancelar la inscripción: ${err.message}`);
        }
      },
    });
  };

  const handleAddEnrollment = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'ID Inscripción', dataIndex: 'id', key: 'id' },
    { title: 'Nombre Estudiante', dataIndex: 'studentName', key: 'studentName' },
    { title: 'ID Clase', dataIndex: 'classId', key: 'classId' },
    {
      title: 'Fecha Inscripción',
      dataIndex: 'enrollmentDateTime',
      key: 'enrollmentDateTime',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Enrollment) => (
        <Space size="middle">
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleCancelEnrollment(record.id)}
          >
            Cancelar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Gestión de Inscripciones</Title>

      <Space className="enrollments-header-space">
        <Space className="enrollments-class-select-group">
          <Typography.Text strong>Clase:</Typography.Text>
          <Select
            placeholder="Selecciona una clase"
            style={{ width: 250 }}
            onChange={(value) => setSelectedClassId(value)}
            allowClear
          >
            {culturalClasses.map(cls => (
              <Option key={cls.id} value={cls.id}>
                {cls.name} ({cls.category.replace(/_/g, ' ')})
              </Option>
            ))}
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEnrollment}>
          Inscribir Estudiante
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={enrollments}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: selectedClassId ? 'No hay inscripciones para esta clase.' : 'Selecciona una clase para ver las inscripciones.' }}
      />

      <Modal
        title="Inscribir Estudiante"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        destroyOnHidden
        className="enrollment-form-modal"
      >
        <EnrollmentForm
          onSubmit={handleCreateEnrollment}
          culturalClasses={culturalClasses}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
};

export default EnrollmentsPage;