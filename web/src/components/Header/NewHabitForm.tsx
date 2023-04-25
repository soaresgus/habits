import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Check, CheckCircle } from 'phosphor-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../libs/axios';
import { Checkboxes } from '../General/Checkboxes';
import { Input } from '../General/Input';

const weekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const createNewHabitFormSchema = z.object({
  title: z
    .string()
    .nonempty({ message: 'Campo obrigatório' })
    .min(3, 'O título deve possuir ao menos 3 letras'),
  weekDays: z.array(z.number()).min(1, 'Escolha ao menos 1 dia'),
});

type CreateNewHabitFormData = z.infer<typeof createNewHabitFormSchema>;

export function NewHabitForm() {
  const createNewHabitForm = useForm<CreateNewHabitFormData>({
    resolver: zodResolver(createNewHabitFormSchema),
    defaultValues: {
      weekDays: [],
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = createNewHabitForm;

  const { isLoading, mutateAsync, isSuccess } = useMutation({
    mutationFn: (data) => {
      return api.post<CreateNewHabitFormData>('/habits', data);
    },
  });

  const onSubmit: SubmitHandler<CreateNewHabitFormData> = async (data) => {
    /* await mutateAsync({ weekDays: weekDaysNumbers, title: data.title }); */
    console.log(data);
    /*     console.log(weekDaysNumbers); */
  };

  if (isSuccess) {
    return (
      <div className="w-full min-h-[320px] flex flex-col items-center justify-center">
        <CheckCircle size={120} weight="thin" className="text-green-500" />
        <span className="text-2xl font-medium">Hábito criado com sucesso!</span>
      </div>
    );
  }

  return (
    <FormProvider {...createNewHabitForm}>
      <form
        className="w-full flex flex-col mt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="title"
          type="text"
          placeholder="Ex.: Exercícios, dormir bem, etc..."
          autoFocus
          label="Qual seu comprometimento?"
        />

        {errors.title && (
          <span className="mt-2 text-red-500">{errors.title.message}</span>
        )}

        <label htmlFor="" className="font-semibold leading-tight mt-4">
          Qual a recorrência?
        </label>

        <div className="flex flex-col gap-2 mt-3">
          <Checkboxes
            name="weekDays"
            labels={weekDays}
            values={weekDays.map((_, index) => index)}
          />

          {errors.weekDays && (
            <span className="mt-2 text-red-500">{errors.weekDays.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            'mt-6 rounded-lg p-4 gap-3 flex items-center justify-center font-semibold bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all',
            {
              'bg-green-800 hover:bg-green-800 hover:cursor-not-allowed':
                isLoading,
            }
          )}
        >
          {isLoading ? (
            <div
              className="border-2 border-l-transparent border-b-transparent border-white rounded-full w-4 h-4 animate-spin"
              data-testid="submit-loading"
            />
          ) : (
            <>
              <Check size={20} weight="bold" />
              <span>Confirmar</span>
            </>
          )}
        </button>
      </form>
    </FormProvider>
  );
}
