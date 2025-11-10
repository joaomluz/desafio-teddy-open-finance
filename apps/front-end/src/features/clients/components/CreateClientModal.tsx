import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/shared/components/Modal';
import api from '@/shared/lib/api';
import { CreateClientDto } from '@/shared/types';
import './CreateClientModal.css';

const clientSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  salary: z.string().min(1, 'Campo obrigatório').refine(
    (val) => {
      const num = parseFloat(val.replace(/[^\d,.-]/g, '').replace(',', '.'));
      return !isNaN(num) && num >= 0;
    },
    { message: 'Salário inválido' }
  ),
  companyValue: z.string().min(1, 'Campo obrigatório').refine(
    (val) => {
      const num = parseFloat(val.replace(/[^\d,.-]/g, '').replace(',', '.'));
      return !isNaN(num) && num >= 0;
    },
    { message: 'Valor da empresa inválido' }
  ),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateClientModal({ isOpen, onClose, onSuccess }: CreateClientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const formatCurrency = (value: string): string => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    
    // Converte para número e formata
    const num = parseFloat(numbers) / 100;
    if (isNaN(num)) return '';
    
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const parseCurrency = (value: string): number => {
    const num = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
    return isNaN(num) ? 0 : num;
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const clientData: CreateClientDto = {
        name: data.name.trim(),
        salary: parseCurrency(data.salary),
        companyValue: parseCurrency(data.companyValue),
      };

      await api.post('/clients', clientData);
      
      // Limpar formulário e fechar modal
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Falha ao criar cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSubmitError(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Criar cliente:">
      <form onSubmit={handleSubmit(onSubmit)} className="create-client-form">
        <div className="form-field">
          <input
            type="text"
            placeholder="Digite o nome:"
            className={`form-input ${errors.name ? 'error' : ''}`}
            {...register('name')}
          />
          {errors.name && (
            <span className="error-message">{errors.name.message}</span>
          )}
        </div>

        <div className="form-field">
          <input
            type="text"
            placeholder="Digite o salário:"
            className={`form-input ${errors.salary ? 'error' : ''}`}
            {...register('salary')}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              const formatted = formatCurrency(target.value);
              if (formatted !== target.value) {
                setValue('salary', formatted, { shouldValidate: true });
              }
            }}
          />
          {errors.salary && (
            <span className="error-message">{errors.salary.message}</span>
          )}
        </div>

        <div className="form-field">
          <input
            type="text"
            placeholder="Digite o valor da empresa:"
            className={`form-input ${errors.companyValue ? 'error' : ''}`}
            {...register('companyValue')}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              const formatted = formatCurrency(target.value);
              if (formatted !== target.value) {
                setValue('companyValue', formatted, { shouldValidate: true });
              }
            }}
          />
          {errors.companyValue && (
            <span className="error-message">{errors.companyValue.message}</span>
          )}
        </div>

        {submitError && (
          <div className="submit-error">{submitError}</div>
        )}

        <button
          type="submit"
          className="create-client-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Criando...' : 'Criar cliente'}
        </button>
      </form>
    </Modal>
  );
}

export default CreateClientModal;

