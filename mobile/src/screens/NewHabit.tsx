import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from 'tailwindcss/colors';
import { Feather } from '@expo/vector-icons';

import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';
import {
  Controller,
  SubmitHandler,
  useController,
  useForm,
} from 'react-hook-form';
import { api } from '../libs/axios';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Snackbar } from 'react-native-paper';

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
  weekDays: number[];
}

interface INewHabitData {
  title: string;
  weekDays: number[];
}

export function NewHabit() {
  const [activeWeekDays, setActiveWeekDays] = useState<number[]>([]);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>({
    defaultValues: {
      commitment: '',
    },
  });

  const { field } = useController({
    name: 'weekDays',
    control: control,
    rules: { required: 'Escolha ao menos 1 dia' },
  });

  const { isLoading, mutateAsync, isSuccess } = useMutation({
    mutationFn: (data: INewHabitData) => {
      return api.post('/habits', data);
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    await mutateAsync({ title: data.commitment, weekDays: data.weekDays });
    reset();
    setActiveWeekDays([]);
    setSnackBarVisible(true);
  };

  function handleToggleWeekDay(weekDayIndex: number) {
    if (activeWeekDays.includes(weekDayIndex)) {
      setActiveWeekDays((state) =>
        state.filter((weekDay) => weekDay !== weekDayIndex)
      );
      return;
    }
    setActiveWeekDays((state) => [...state, weekDayIndex]);
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento?
        </Text>

        <Controller
          control={control}
          rules={{ required: 'Campo obrigatório' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
              placeholder="Ex.: Beber água, praticar exercícios, etc..."
              placeholderTextColor={colors.zinc[400]}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          name="commitment"
        />
        {errors.commitment && (
          <Text className="mt-2 text-red-500">{errors.commitment.message}</Text>
        )}

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual a recorrência?
        </Text>

        {weekDays.map((weekDay) => (
          <Checkbox
            key={weekDay}
            title={weekDay}
            checked={activeWeekDays.includes(weekDays.indexOf(weekDay))}
            onPress={() => {
              let activeWeekDaysCopy = [...activeWeekDays];
              const weekDayIndex = weekDays.indexOf(weekDay);

              if (activeWeekDaysCopy.includes(weekDayIndex)) {
                activeWeekDaysCopy = activeWeekDaysCopy.filter(
                  (weekDay) => weekDay !== weekDayIndex
                );
              } else {
                activeWeekDaysCopy = [...activeWeekDaysCopy, weekDayIndex];
              }
              field.onChange(activeWeekDaysCopy);

              handleToggleWeekDay(weekDays.indexOf(weekDay));
            }}
          />
        ))}

        {errors.weekDays && (
          <Text className="mt-2 text-red-500">{errors.weekDays.message}</Text>
        )}

        <TouchableOpacity
          className={clsx(
            'flex-row w-full h-14 items-center justify-center bg-green-600 rounded-md mt-6',
            { 'bg-green-800': isLoading }
          )}
          activeOpacity={0.7}
          disabled={isLoading}
          onPress={handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Feather name="check" size={20} color={colors.white} />
              <Text className="font-semibold text-base text-white ml-2">
                Confirmar
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
      {isSuccess && (
        <Snackbar
          visible={snackBarVisible}
          onDismiss={() => setSnackBarVisible(false)}
          action={{
            label: 'OK',
            onPress: () => setSnackBarVisible(false),
          }}
          className="fixed left-1/2"
        >
          Hábito criado com sucesso!
        </Snackbar>
      )}
    </View>
  );
}
