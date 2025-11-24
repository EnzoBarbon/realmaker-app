import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowLeftIcon,
  BuildingOffice2Icon as Building2Icon,
  CheckCircleIcon as CheckCircle2Icon,
  LockClosedIcon as LockIcon,
  EnvelopeIcon as MailIcon,
  PhoneIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

import Checkbox from '@/components/ui/Checkbox';
import { useAuth } from '@/store/auth';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // Form states
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
    acceptedMarketing: false,
  });

  const [registerErrors, setRegisterErrors] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });

  const [registerErrorMessage, setRegisterErrorMessage] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const trialDays = 14;

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
    } catch (error) {
      console.error(error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegisterErrorMessage('');
    // Reset errors
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      company: '',
      password: '',
      confirmPassword: '',
      terms: '',
    };

    let hasErrors = false;

    if (!registerData.name.trim()) {
      newErrors.name = t('auth.errorNameRequired');
      hasErrors = true;
    }
    if (!registerData.email.trim()) {
      newErrors.email = t('auth.errorEmailRequired');
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = t('auth.errorEmailInvalid');
      hasErrors = true;
    }
    if (!registerData.phone.trim()) {
      newErrors.phone = t('auth.errorPhoneRequired');
      hasErrors = true;
    }
    if (!registerData.company.trim()) {
      newErrors.company = t('auth.errorCompanyRequired');
      hasErrors = true;
    }
    if (!registerData.password.trim()) {
      newErrors.password = t('auth.errorPasswordRequired');
      hasErrors = true;
    } else if (registerData.password.length < 8) {
      newErrors.password = t('auth.errorPasswordLength');
      hasErrors = true;
    }
    if (!registerData.confirmPassword.trim()) {
      newErrors.confirmPassword = t('auth.errorConfirmPasswordRequired');
      hasErrors = true;
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errorPasswordsMismatch');
      hasErrors = true;
    }
    if (!registerData.acceptedTerms) {
      newErrors.terms = t('auth.errorTermsRequired');
      hasErrors = true;
    }

    setRegisterErrors(newErrors);

    if (hasErrors) return;

    setRegisterLoading(true);
    try {
      await register({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
        companyName: registerData.company.trim() || undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : t('auth.registerFailed');
      setRegisterErrorMessage(message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setResetEmailSent(true);
    setTimeout(() => {
      setResetEmailSent(false);
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    }, 3000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="flex-grow">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 items-center justify-center p-4"
        >
          <View className="w-full max-w-md">
            {/* Header */}
            <View className="mb-8 space-y-6">
              <Pressable
                onPress={() => router.back()}
                className="flex-row items-center self-start py-2 px-2 -ml-2"
              >
                <ArrowLeftIcon size={20} color="#4b5563" />
                <Text className="text-gray-600 ml-2 font-medium">{t('auth.back')}</Text>
              </Pressable>

              <View className="items-center">
                {/* Text Logo Placeholder */}
                <Text className="text-3xl font-bold text-gray-900">
                  RealMaker <Text className="text-yellow-500">AI</Text>
                </Text>
                <Text className="text-xs text-gray-500 mt-1">by Betterplace</Text>
              </View>

              {/* Language Selector */}
              <View className="flex-row justify-center">
                <View className="flex-row bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm">
                  {(['es', 'en', 'it'] as const).map((lang) => (
                    <Pressable
                      key={lang}
                      onPress={() => changeLanguage(lang)}
                      className={`flex-row items-center px-3 py-2 rounded-lg ${
                        i18n.language === lang ? 'bg-yellow-500 shadow-sm' : 'bg-transparent'
                      }`}
                    >
                      <Text className="text-xl mr-2">
                        {lang === 'es' ? '🇪🇸' : lang === 'en' ? '🇬🇧' : '🇮🇹'}
                      </Text>
                      <Text
                        className={`text-sm font-medium ${
                          i18n.language === lang ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : 'Italiano'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* Main Card */}
            <View className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <View className="p-6 pb-4 space-y-1">
                <Text className="text-center text-2xl font-bold text-gray-900">
                  {activeTab === 'login'
                    ? t('auth.welcomeBack')
                    : t('auth.freeTrial', { count: trialDays })}
                </Text>
                <Text className="text-center text-gray-500 px-4">
                  {activeTab === 'login'
                    ? t('auth.loginDescription')
                    : t('auth.registerDescription')}
                </Text>
              </View>

              <View className="px-6">
                {/* Tabs */}
                <View className="flex-row w-full bg-gray-100 rounded-lg p-1 mb-6">
                  <Pressable
                    onPress={() => setActiveTab('login')}
                    className={`flex-1 py-2 rounded-md items-center ${
                      activeTab === 'login' ? 'bg-white shadow-sm' : ''
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${activeTab === 'login' ? 'text-gray-900' : 'text-gray-500'}`}
                    >
                      {t('auth.loginTab')}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setActiveTab('register')}
                    className={`flex-1 py-2 rounded-md items-center ${
                      activeTab === 'register' ? 'bg-white shadow-sm' : ''
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${activeTab === 'register' ? 'text-gray-900' : 'text-gray-500'}`}
                    >
                      {t('auth.registerTab')}
                    </Text>
                  </Pressable>
                </View>

                {/* Login Form */}
                {activeTab === 'login' && (
                  <View className="space-y-4 pb-6">
                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-1.5">
                        {t('auth.email')}
                      </Text>
                      <View className="relative">
                        <View className="absolute left-3 top-3 z-10">
                          <MailIcon size={20} color="#9ca3af" />
                        </View>
                        <TextInput
                          className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          placeholder={t('auth.emailPlaceholder')}
                          value={loginData.email}
                          onChangeText={(text) => setLoginData({ ...loginData, email: text })}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    <View>
                      <View className="flex-row justify-between items-center mb-1.5">
                        <Text className="text-sm font-medium text-gray-700">
                          {t('auth.password')}
                        </Text>
                        <Pressable onPress={() => setShowForgotPassword(true)}>
                          <Text className="text-xs text-yellow-600 font-medium">
                            {t('auth.forgotPassword')}
                          </Text>
                        </Pressable>
                      </View>
                      <View className="relative">
                        <View className="absolute left-3 top-3 z-10">
                          <LockIcon size={20} color="#9ca3af" />
                        </View>
                        <TextInput
                          className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          placeholder={t('auth.passwordPlaceholder')}
                          value={loginData.password}
                          onChangeText={(text) => setLoginData({ ...loginData, password: text })}
                          secureTextEntry
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      className="bg-yellow-500 rounded-md py-2 items-center mt-2"
                      onPress={handleLogin}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-white font-medium">{t('auth.loginButton')}</Text>
                      )}
                    </TouchableOpacity>

                    <View className="flex-row items-center my-4">
                      <View className="flex-1 h-px bg-gray-200" />
                      <Text className="mx-4 text-xs uppercase text-gray-500 bg-white px-2">
                        {t('auth.continueWith')}
                      </Text>
                      <View className="flex-1 h-px bg-gray-200" />
                    </View>

                    <View className="flex-row gap-3">
                      <Pressable className="flex-1 flex-row items-center justify-center border border-gray-300 rounded-md py-2">
                        <Text className="text-sm font-medium text-gray-700 ml-2">Google</Text>
                      </Pressable>
                      <Pressable className="flex-1 flex-row items-center justify-center border border-gray-300 rounded-md py-2">
                        <Text className="text-sm font-medium text-gray-700 ml-2">Facebook</Text>
                      </Pressable>
                    </View>
                  </View>
                )}

                {/* Register Form */}
                {activeTab === 'register' && (
                  <View className="space-y-4 pb-6">
                    <>
                      <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1.5">
                          {t('auth.fullName')}
                        </Text>
                        <View className="relative">
                          <View className="absolute left-3 top-3 z-10">
                            <UserIcon size={20} color="#9ca3af" />
                          </View>
                          <TextInput
                            className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                            placeholder={t('auth.namePlaceholder')}
                            value={registerData.name}
                            onChangeText={(text) =>
                              setRegisterData({ ...registerData, name: text })
                            }
                          />
                        </View>
                        {registerErrors.name ? (
                          <Text className="text-red-500 text-xs mt-1">{registerErrors.name}</Text>
                        ) : null}
                      </View>

                      <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1.5">
                          {t('auth.email')}
                        </Text>
                        <View className="relative">
                          <View className="absolute left-3 top-3 z-10">
                            <MailIcon size={20} color="#9ca3af" />
                          </View>
                          <TextInput
                            className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                            placeholder={t('auth.emailPlaceholder')}
                            value={registerData.email}
                            onChangeText={(text) =>
                              setRegisterData({ ...registerData, email: text })
                            }
                            autoCapitalize="none"
                          />
                        </View>
                        {registerErrors.email ? (
                          <Text className="text-red-500 text-xs mt-1">{registerErrors.email}</Text>
                        ) : null}
                      </View>

                      <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1.5">
                          {t('auth.phone')}
                        </Text>
                        <View className="relative">
                          <View className="absolute left-3 top-3 z-10">
                            <PhoneIcon size={20} color="#9ca3af" />
                          </View>
                          <TextInput
                            className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                            placeholder={t('auth.phonePlaceholder')}
                            value={registerData.phone}
                            onChangeText={(text) =>
                              setRegisterData({ ...registerData, phone: text })
                            }
                            keyboardType="phone-pad"
                          />
                        </View>
                        {registerErrors.phone ? (
                          <Text className="text-red-500 text-xs mt-1">{registerErrors.phone}</Text>
                        ) : null}
                      </View>

                      <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1.5">
                          {t('auth.company')}
                        </Text>
                        <View className="relative">
                          <View className="absolute left-3 top-3 z-10">
                            <Building2Icon size={20} color="#9ca3af" />
                          </View>
                          <TextInput
                            className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                            placeholder={t('auth.companyPlaceholder')}
                            value={registerData.company}
                            onChangeText={(text) =>
                              setRegisterData({ ...registerData, company: text })
                            }
                          />
                        </View>
                        {registerErrors.company ? (
                          <Text className="text-red-500 text-xs mt-1">
                            {registerErrors.company}
                          </Text>
                        ) : null}
                      </View>

                      <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1.5">
                          {t('auth.password')}
                        </Text>
                        <View className="relative">
                          <View className="absolute left-3 top-3 z-10">
                            <LockIcon size={20} color="#9ca3af" />
                          </View>
                          <TextInput
                            className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                            placeholder={t('auth.passwordField')}
                            value={registerData.password}
                            onChangeText={(text) =>
                              setRegisterData({ ...registerData, password: text })
                            }
                            secureTextEntry
                          />
                        </View>
                        {registerErrors.password ? (
                          <Text className="text-red-500 text-xs mt-1">
                            {registerErrors.password}
                          </Text>
                        ) : null}
                      </View>

                      <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1.5">
                          {t('auth.confirmPassword')}
                        </Text>
                        <View className="relative">
                          <View className="absolute left-3 top-3 z-10">
                            <LockIcon size={20} color="#9ca3af" />
                          </View>
                          <TextInput
                            className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                            placeholder={t('auth.confirmPasswordPlaceholder')}
                            value={registerData.confirmPassword}
                            onChangeText={(text) =>
                              setRegisterData({ ...registerData, confirmPassword: text })
                            }
                            secureTextEntry
                          />
                        </View>
                        {registerErrors.confirmPassword ? (
                          <Text className="text-red-500 text-xs mt-1">
                            {registerErrors.confirmPassword}
                          </Text>
                        ) : null}
                      </View>

                      <View className="flex-row items-start mt-2 gap-2">
                        <Checkbox
                          checked={registerData.acceptedTerms}
                          onChange={(checked) =>
                            setRegisterData({ ...registerData, acceptedTerms: checked })
                          }
                        />
                        <View className="flex-1">
                          <Text className="text-sm text-gray-600">
                            {t('auth.termsText1')}{' '}
                            <Text className="text-blue-600">{t('auth.termsLink')}</Text>{' '}
                            {t('auth.termsText2')}{' '}
                            <Text className="text-blue-600">{t('auth.privacyLink')}</Text>
                          </Text>
                          {registerErrors.terms ? (
                            <Text className="text-red-500 text-xs mt-1">
                              {registerErrors.terms}
                            </Text>
                          ) : null}
                        </View>
                      </View>

                      <View className="flex-row items-start gap-2">
                        <Checkbox
                          checked={registerData.acceptedMarketing}
                          onChange={(checked) =>
                            setRegisterData({ ...registerData, acceptedMarketing: checked })
                          }
                        />
                        <Text className="text-sm text-gray-600 flex-1">
                          {t('auth.marketingText')}
                        </Text>
                      </View>

                      {registerErrorMessage ? (
                        <View className="bg-red-50 border border-red-200 rounded-md p-3">
                          <Text className="text-xs text-red-600">{registerErrorMessage}</Text>
                        </View>
                      ) : null}

                      <TouchableOpacity
                        className="bg-yellow-500 rounded-md py-2 items-center mt-2"
                        onPress={handleRegister}
                        disabled={registerLoading}
                      >
                        {registerLoading ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text className="text-white font-medium">{t('auth.continueButton')}</Text>
                        )}
                      </TouchableOpacity>

                      <View className="flex-row items-center my-4">
                        <View className="flex-1 h-px bg-gray-200" />
                        <Text className="mx-4 text-xs uppercase text-gray-500 bg-white px-2">
                          {t('auth.registerWith')}
                        </Text>
                        <View className="flex-1 h-px bg-gray-200" />
                      </View>

                      <View className="flex-row gap-3">
                        <Pressable className="flex-1 flex-row items-center justify-center border border-gray-300 rounded-md py-2">
                          <Text className="text-sm font-medium text-gray-700 ml-2">Google</Text>
                        </Pressable>
                        <Pressable className="flex-1 flex-row items-center justify-center border border-gray-300 rounded-md py-2">
                          <Text className="text-sm font-medium text-gray-700 ml-2">Facebook</Text>
                        </Pressable>
                      </View>
                    </>
                  </View>
                )}
              </View>
            </View>

            {/* Footer */}
            <View className="mt-6 mb-10 items-center">
              <Text className="text-xs text-gray-400">© 2025 RealMaker AI • By Betterplace</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showForgotPassword}
        onRequestClose={() => setShowForgotPassword(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white rounded-lg p-6 w-full max-w-sm">
            <Text className="text-lg font-semibold mb-2">{t('auth.recoverPassword')}</Text>
            <Text className="text-sm text-gray-500 mb-4">
              {t('auth.recoverPasswordDescription')}
            </Text>

            {!resetEmailSent ? (
              <>
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">
                    {t('auth.email')}
                  </Text>
                  <View className="relative">
                    <View className="absolute left-3 top-3 z-10">
                      <MailIcon size={20} color="#9ca3af" />
                    </View>
                    <TextInput
                      className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      placeholder={t('auth.emailPlaceholder')}
                      value={forgotPasswordEmail}
                      onChangeText={setForgotPasswordEmail}
                    />
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 border border-gray-300 rounded-md py-2 items-center"
                    onPress={() => setShowForgotPassword(false)}
                  >
                    <Text className="text-gray-700">{t('auth.cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-yellow-500 rounded-md py-2 items-center"
                    onPress={handleForgotPassword}
                  >
                    <Text className="text-white">{t('auth.sendLink')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View className="items-center py-4">
                <View className="h-16 w-16 rounded-full bg-green-100 items-center justify-center mb-4">
                  <CheckCircle2Icon size={32} color="#16a34a" />
                </View>
                <Text className="font-medium text-gray-900 mb-2">{t('auth.emailSent')}</Text>
                <Text className="text-sm text-gray-500 text-center">{t('auth.checkInbox')}</Text>
                <TouchableOpacity
                  className="mt-4 w-full bg-gray-100 rounded-md py-2 items-center"
                  onPress={() => setShowForgotPassword(false)}
                >
                  <Text className="text-gray-700">OK</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
