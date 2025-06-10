import React, { useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, Space, message } from 'antd';
import dayjs from 'dayjs';
import type { CreateEnrollmentDto } from '../../interfaces/enrollment';
import type { CulturalClass } from '../../interfaces/culturalClass';

const { Option } = Select;

import './index.css';

interface EnrollmentFormProps {
  onSubmit: (enrollmentData: CreateEnrollmentDto) => void;
  culturalClasses: CulturalClass[];
  onCancel: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ onSubmit, culturalClasses, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      enrollmentDateTime: dayjs()
    });
  }, [form]);

  const onFinish = (values: any) => {
    const enrollmentDateTimeEpoch = values.enrollmentDateTime ? values.enrollmentDateTime.valueOf() : null;

    if (!enrollmentDateTimeEpoch) {
      message.error('La fecha de inscripción es obligatoria.');
      return;
    }

    const enrollmentData: CreateEnrollmentDto = {
      studentName: values.studentName,
      classId: values.classId,
      enrollmentDateTime: enrollmentDateTimeEpoch,
    };

    onSubmit(enrollmentData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ enrollmentDateTime: dayjs() }}
    >
      <Form.Item
        label="Nombre del Estudiante"
        name="studentName"
        rules={[{ required: true, message: 'Por favor, ingresa el nombre del estudiante!' }, { min: 3, message: 'Mínimo 3 caracteres.' }]}
      >
        <Input placeholder="Ej: Juan Pérez" />
      </Form.Item>

      <Form.Item
        label="Clase Cultural"
        name="classId"
        rules={[{ required: true, message: 'Por favor, selecciona una clase!' }]}
      >
        <Select placeholder="Selecciona una clase para inscribirte" className="full-width-select">
          {culturalClasses.map(cls => (
            <Option key={cls.id} value={cls.id}>
              {cls.name} ({cls.category.replace(/_/g, ' ')})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Fecha y Hora de Inscripción"
        name="enrollmentDateTime"
        rules={[{ required: true, message: 'Por favor, selecciona la fecha y hora de inscripción!' }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          className="full-width-input"
          disabledDate={(current) => current && current > dayjs().endOf('day')}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Inscribir
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            Cancelar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default EnrollmentForm;