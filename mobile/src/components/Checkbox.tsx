import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import clsx from 'clsx';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

interface ICheckboxProps extends TouchableOpacityProps {
  title: string;
  checked?: boolean;
}

export function Checkbox({ checked = false, title, ...props }: ICheckboxProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row mb-2 items-center group"
      {...props}
    >
      {checked ? (
        <Animated.View
          className="w-8 h-8 bg-green-500 rounded-lg items-center justify-center"
          entering={ZoomIn}
          exiting={ZoomOut}
        >
          <Feather name="check" size={20} color={colors.white} />
        </Animated.View>
      ) : (
        <View className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
          {props.disabled && (
            <Feather name="x" size={20} color={colors.zinc[500]} />
          )}
        </View>
      )}

      <Text
        className={clsx('text-white text-base ml-3 font-semibold', {
          'text-zinc-500': props.disabled,
          'text-zinc-400 line-through': checked,
        })}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
