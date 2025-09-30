import { Redirect } from 'expo-router';

//On mobile we go straight to (tabs)
export default function Index() {
  return <Redirect href="/(tabs)/dashboard" />;
}
