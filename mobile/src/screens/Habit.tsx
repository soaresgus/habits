import { useRoute } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ScrollView, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import colors from 'tailwindcss/colors';
import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';
import { HabitsEmpty } from '../components/HabitsEmpty';
import { ProgressBar } from '../components/ProgressBar';
import { api } from '../libs/axios';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';

interface IRouteParams {
  date: string;
}
interface IHabitsByDateData {
  possibleHabits: [{ id: string; title: string; created_at: 'string' }];
  completedHabits: string[];
}

export function Habit() {
  const route = useRoute();
  const { date } = route.params as IRouteParams;

  const {
    data: habitsList,
    isLoading,
    isSuccess,
  } = useQuery<IHabitsByDateData>([`${date}-habitsList`], () =>
    getHabitsByDate(date)
  );
  const queryClient = useQueryClient();
  const habitsByDateCache = queryClient.getQueryData<IHabitsByDateData>([
    `${date}-habitsList`,
  ]);

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');
  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

  async function handleToggleHabits(habitId: string) {
    const isHabitAlreadyCompleted =
      habitsByDateCache?.completedHabits.includes(habitId);

    let completedHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsByDateCache!.completedHabits.filter(
        (habit) => habit !== habitId
      );
    } else {
      completedHabits = [...habitsByDateCache!.completedHabits, habitId];
    }

    queryClient.setQueryData([`${date}-habitsList`], {
      possibleHabits: habitsByDateCache!.possibleHabits,
      completedHabits: completedHabits,
    });

    await api.patch(`/habits/${habitId}/toggle`);
  }

  async function getHabitsByDate(date: string) {
    const response = await api.get('/day', {
      params: {
        date: dayjs(date).startOf('day'),
      },
    });

    return response.data as IHabitsByDateData;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        {isLoading ? (
          <ActivityIndicator color={colors.purple[500]} />
        ) : (
          <>
            <ProgressBar
              progress={
                habitsList!.possibleHabits.length > 0
                  ? generateProgressPercentage(
                      habitsList!.possibleHabits.length,
                      habitsList!.completedHabits.length
                    )
                  : 0
              }
            />

            <View className="mt-6">
              {habitsList!.possibleHabits.length > 0
                ? habitsList?.possibleHabits.map((habit) => (
                    <Checkbox
                      key={habit.id}
                      title={habit.title}
                      checked={habitsByDateCache!.completedHabits.includes(
                        habit.id
                      )}
                      disabled={isDateInPast}
                      onPress={() => handleToggleHabits(habit.id)}
                    />
                  ))
                : !isDateInPast && <HabitsEmpty />}
              {isDateInPast && (
                <Text className="text-zinc-400 font-semibold text-center mt-4">
                  Modificações encerradas
                </Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
