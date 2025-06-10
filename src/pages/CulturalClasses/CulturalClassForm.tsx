import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Select, DatePicker, Space, message } from 'antd';
import dayjs from 'dayjs';
import { CulturalClassCategory, type CreateCulturalClassDto, type CulturalClass, type UpdateCulturalClassDto } from '../../interfaces/culturalClass';
import './index.css';

const { Option } = Select;

interface CulturalClassFormProps {
  onSubmit: (classData: CreateCulturalClassDto | UpdateCulturalClassDto) => void;
  initialData?: CulturalClass | null;
  onCancel: () => void;
}

const CulturalClassForm: React.FC<CulturalClassFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        startDateTime: dayjs(initialData.startDateTime),
        endDateTime: dayjs(initialData.endDateTime),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        maxCapacity: 1,
        category: CulturalClassCategory.DANCE
      });
    }
  }, [initialData, form]);

  const onFinish = (values: any) => {
    const startEpoch = values.startDateTime ? values.startDateTime.valueOf() : null;
    const endEpoch = values.endDateTime ? values.endDateTime.valueOf() : null;

    if (endEpoch <= startEpoch) {
      message.error('La fecha y hora de fin debe ser posterior a la de inicio.');
      return;
    }

    const classData: CreateCulturalClassDto | UpdateCulturalClassDto = {
      ...values,
      startDateTime: startEpoch,
      endDateTime: endEpoch,
    };

    onSubmit(classData);
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  const disabledEndDateTime = (current: dayjs.Dayjs) => {
    const startValue = form.getFieldValue('startDateTime');
    if (!current || !startValue) {
      return false;
    }
    return current.valueOf() <= startValue.valueOf();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Nombre"
        name="name"
        rules={[{ required: true, message: 'Por favor, ingresa el nombre de la clase!' }, { min: 3, message: 'Mínimo 3 caracteres.' }]}
      >
        <Input placeholder="Ej: Salsa Nivel 1" />
      </Form.Item>

      <Form.Item
        label="Categoría"
        name="category"
        rules={[{ required: true, message: 'Por favor, selecciona una categoría!' }]}
      >
        <Select placeholder="Selecciona una categoría">
          {Object.values(CulturalClassCategory).map((cat) => (
            <Option key={cat} value={cat}>
              {cat.replace(/_/g, ' ')}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Capacidad Máxima"
        name="maxCapacity"
        rules={[{ required: true, type: 'number', min: 1, message: 'La capacidad debe ser mayor que 0.' }]}
      >
        <InputNumber min={1} className="full-width-input" />
      </Form.Item>

      <Form.Item
        label="Fecha y Hora de Inicio"
        name="startDateTime"
        rules={[{ required: true, message: 'Por favor, selecciona la fecha y hora de inicio!' }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          className="full-width-input"
          disabledDate={disabledDate}
        />
      </Form.Item>

      <Form.Item
        label="Fecha y Hora de Fin"
        name="endDateTime"
        rules={[{ required: true, message: 'Por favor, selecciona la fecha y hora de fin!' }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          className="full-width-input"
          disabledDate={disabledEndDateTime}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {initialData ? 'Actualizar Clase' : 'Crear Clase'}
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            Cancelar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CulturalClassForm;