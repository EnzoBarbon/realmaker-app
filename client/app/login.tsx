import { useAuth } from '@/store/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const { login, status } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">
      <View className="w-full max-w-sm gap-4">
        <Text className="text-2xl font-semibold text-gray-900">Iniciar sesión</Text>
        <View>
          <Text className="text-xs text-gray-600 mb-1">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View>
          <Text className="text-xs text-gray-600 mb-1">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
        <Pressable
          className="bg-amber-500 rounded-lg py-3 items-center"
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium">Entrar</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
