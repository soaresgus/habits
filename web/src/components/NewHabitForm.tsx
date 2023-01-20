import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Check, CheckCircle } from 'phosphor-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { api } from '../libs/aixos';
import { Checkbox } from './Checkbox';
import { Checkboxes } from './Checkboxes';

const weekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

interface IFormInputs {
  commitment: string;
  weekDays: string[];
}

interface INewHabitData {
  title: string;
  weekDays: number[];
}

export function NewHabitForm() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>();

  const { isLoading, mutateAsync, isSuccess } = useMutation({
    mutationFn: (data: INewHabitData) => {
      return api.post<INewHabitData>('/habits', data);
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const weekDaysNumbers = data.weekDays
      .filter((value) => value)
      .map((day) => weekDays.indexOf(day));

    await mutateAsync({ weekDays: weekDaysNumbers, title: data.commitment });
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
    <form
      className="w-full flex flex-col mt-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu comprometimento?
      </label>
      <input
        type="text"
        id="title"
        placeholder="Ex.: Exercícios, dormir bem, etc..."
        autoFocus
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
        {...register('commitment', { required: 'Campo obrigatório' })}
      />
      <span className="mt-2 text-red-500">
        {errors.commitment && errors.commitment.message}
      </span>

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        <Checkboxes control={control} name="weekDays" options={weekDays} />
        <span className="mt-2 text-red-500">
          {errors.weekDays && errors.weekDays.message}
        </span>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={clsx(
          'mt-6 rounded-lg p-4 gap-3 flex items-center justify-center font-semibold bg-green-600 hover:bg-green-500',
          {
            'bg-green-800 hover:bg-green-800 hover:cursor-not-allowed':
              isLoading,
          }
        )}
      >
        {isLoading ? (
          <div className="border-2 border-l-transparent border-b-transparent border-white rounded-full w-4 h-4 animate-spin" />
        ) : (
          <>
            <Check size={20} weight="bold" />
            <span>Confirmar</span>
          </>
        )}
      </button>
    </form>
  );
}
