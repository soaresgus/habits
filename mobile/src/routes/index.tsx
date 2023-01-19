import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './app.routes';
import { ViewProps } from 'react-native';

interface IRoutesProps extends ViewProps {}

export function Routes({ ...props }: IRoutesProps) {
  return (
    <View className="flex-1 bg-background" {...props}>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </View>
  );
}
