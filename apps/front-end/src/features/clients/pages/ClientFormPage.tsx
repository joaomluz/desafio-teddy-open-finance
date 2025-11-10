import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/shared/lib/api';
import { CreateClientDto } from '@/shared/types';
import './ClientFormPage.css';

const clientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  salary: z.number({
    required_error: 'Salário é obrigatório',
    invalid_type_error: 'Salário deve ser um número',
  }).min(0, 'Salário deve ser maior ou igual a zero'),
  companyValue: z.number({
    required_error: 'Valor da empresa é obrigatório',
    invalid_type_error: 'Valor da empresa deve ser um número',
  }).min(0, 'Valor da empresa deve ser maior ou igual a zero'),
});

type ClientFormData = z.infer<typeof clientSchema>;

function ClientFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    if (isEdit && id) {
      loadClient(id);
    }
  }, [id, isEdit]);

  const loadClient = async (clientId: string) => {
    try {
      const response = await api.get(`/clients/${clientId}`);
      const client = response.data;
      setValue('name', client.name);
      setValue('salary', parseFloat(client.salary) || 0);
      setValue('companyValue', parseFloat(client.companyValue) || 0);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao carregar cliente');
      navigate('/clients');
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (isEdit && id) {
        await api.put(`/clients/${id}`, data);
      } else {
        await api.post('/clients', data);
      }
      navigate('/clients');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao salvar cliente');
    }
  };

  return (
    <div className="client-form-page">
      <div className="form-header">
        <h1>{isEdit ? 'Editar Cliente' : 'Novo Cliente'}</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit(onSubmit)} className="client-form">
          <div className="form-group">
            <label htmlFor="name">Nome *</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Nome completo"
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salário (R$) *</label>
            <input
              id="salary"
              type="number"
              step="0.01"
              min="0"
              {...register('salary', { valueAsNumber: true })}
              placeholder="0,00"
            />
            {errors.salary && (
              <span className="error-message">{errors.salary.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="companyValue">Valor da Empresa (R$) *</label>
            <input
              id="companyValue"
              type="number"
              step="0.01"
              min="0"
              {...register('companyValue', { valueAsNumber: true })}
              placeholder="0,00"
            />
            {errors.companyValue && (
              <span className="error-message">{errors.companyValue.message}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? 'Atualizar' : 'Criar'} Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientFormPage;

