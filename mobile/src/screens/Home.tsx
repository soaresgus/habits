import { View, Text, ScrollView } from 'react-native';

import { Header } from '../components/Header';
import { HabitDay, daySize } from '../components/HabitDay';
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateDatesFromYearBeginning();
const minimumSummaryDatesSize = 12 * 7; //12 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

export function Home() {
  return (
    <View className="bg-background px-8 pt-16 w-screen h-screen">
      <Header />

      <View className="flex-row mt-6">
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: daySize, height: daySize }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map((date) => (
            <HabitDay key={date.toString()} />
          ))}

          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, index) => (
              <View
                key={index}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: daySize, height: daySize }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
