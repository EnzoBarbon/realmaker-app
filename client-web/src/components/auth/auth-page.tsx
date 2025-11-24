import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { ArrowLeft, Loader2, Mail, Lock, User, Phone, Building2, CheckCircle2, ArrowRight, Contact, Clock, X } from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { InstagramIcon } from "../icons/instagram-icon";
import { MessengerIcon } from "../icons/messenger-icon";
import { TikTokIcon } from "../icons/tiktok-icon";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from "../ui/dialog";
import { useTrialDays } from "../../contexts/trial-days-context";
import RealMakerLogo from "../../imports/RealMakerLogo";
import { SpainFlag } from "../icons/spain-flag";
import { UKFlag } from "../icons/uk-flag";
import { ItalyFlag } from "../icons/italy-flag";

type AuthPageProps = {
  onBack: () => void;
  onLogin: (payload: { email: string; password: string }) => Promise<void>;
  onRegister: (payload: { name: string; email: string; password: string; company: string }) => Promise<void>;
  defaultTab?: "login" | "register";
  onLanguageChange?: (language: 'es' | 'en' | 'it') => void;
};

export function AuthPage({ onBack, onLogin, onRegister, defaultTab = "login", onLanguageChange }: AuthPageProps) {
  const { trialDays } = useTrialDays();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [showFacebookPopup, setShowFacebookPopup] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en' | 'it'>('es');
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
    acceptedMarketing: false
  });

  // Estados de errores de validación
  const [registerErrors, setRegisterErrors] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
    terms: ""
  });

  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  // Traducciones
  const translations = {
    es: {
      back: "Volver",
      welcomeBack: "Bienvenido de nuevo",
      freeTrial: `Prueba gratis ${trialDays} días`,
      loginDescription: "Inicia sesión para acceder a tus asistentes de IA",
      registerDescription: "Cualifica leads automáticamente 24/7 y dedica tu tiempo a lo que realmente importa",
      loginTab: "Iniciar Sesión",
      registerTab: "Registrarse",
      email: "Correo electrónico",
      emailPlaceholder: "tu@email.com",
      password: "Contraseña",
      passwordPlaceholder: "••••••••",
      forgotPassword: "¿Olvidaste tu contraseña?",
      loginButton: "Iniciar Sesión",
      continueWith: "O continúa con",
      registerWith: "O regístrate con",
      fullName: "Nombre completo",
      namePlaceholder: "Juan Pérez",
      phone: "Teléfono",
      phonePlaceholder: "+34 600 000 000",
      company: "Agencia inmobiliaria",
      companyPlaceholder: "Mi Inmobiliaria S.L.",
      confirmPassword: "Confirmar contraseña",
      confirmPasswordPlaceholder: "Confirmar contraseña",
      termsText1: "He leído y acepto las",
      termsLink: "condiciones generales",
      termsText2: "del servicio y la",
      privacyLink: "política de privacidad",
      marketingText: "Deseo recibir información sobre las mejoras, actualizaciones, cambios en la aplicación y comunicaciones promocionales",
      continueButton: "Continuar",
      registrationComplete: "¡Registro completado!",
      registrationSuccess: "Tu cuenta ha sido creada exitosamente. Haz clic en continuar para configurar tu asistente.",
      recoverPassword: "Recuperar contraseña",
      recoverPasswordDescription: "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.",
      cancel: "Cancelar",
      sendLink: "Enviar enlace",
      emailSent: "¡Correo enviado!",
      checkInbox: "Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.",
      connectGoogle: "Conectar con Google",
      connectFacebook: "Conectar con Facebook",
      aboutToConnect: "Estás a punto de conectarte con tu cuenta de",
      googleName: "Google",
      facebookName: "Facebook",
      secureAuth: "Autenticación segura",
      permissionsText: "Al continuar, RealMaker AI podrá:",
      viewProfile: "Ver tu información de perfil básica",
      viewProfilePublic: "Ver tu información de perfil público",
      viewEmail: "Ver tu dirección de correo electrónico",
      connectButton: "Conectar",
      thanksRegistration: "¡Gracias por registrarte! Uno de nuestros asesores se pondrá en contacto contigo para activar tu prueba gratuita.",
      scheduleTitle: "Horario de atención:",
      scheduleMondayThursday: "Lunes a Jueves: 9:00h a 14:00h y 15:00h a 18:30h",
      scheduleFriday: "Viernes: 08:30h a 14:30h",
      passwordsMismatch: "Las contraseñas no coinciden",
      passwordLabel: "Contraseña",
      passwordField: "Contraseña",
      errorNameRequired: "Introduce un nombre",
      errorEmailRequired: "Introduce un e-mail",
      errorEmailInvalid: "Introduce un email válido.",
      errorPhoneRequired: "Introduce un número de teléfono",
      errorCompanyRequired: "Introduce el nombre de tu agencia",
      errorPasswordRequired: "Introduce una contraseña",
      errorPasswordLength: "Introduce una contraseña de al menos 8 caracteres.",
      errorConfirmPasswordRequired: "Confirma tu contraseña",
      errorPasswordsMismatch: "Las contraseñas no coinciden",
      errorTermsRequired: "Debes aceptar las condiciones generales para poder utilizar la herramienta."
    },
    en: {
      back: "Back",
      welcomeBack: "Welcome back",
      freeTrial: `Try free for ${trialDays} days`,
      loginDescription: "Sign in to access your AI assistants",
      registerDescription: "Qualify leads automatically 24/7 and dedicate your time to what really matters",
      loginTab: "Sign In",
      registerTab: "Sign Up",
      email: "Email",
      emailPlaceholder: "you@email.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      forgotPassword: "Forgot your password?",
      loginButton: "Sign In",
      continueWith: "Or continue with",
      registerWith: "Or sign up with",
      fullName: "Full name",
      namePlaceholder: "John Doe",
      phone: "Phone",
      phonePlaceholder: "+1 555 000 000",
      company: "Real estate agency",
      companyPlaceholder: "My Real Estate LLC",
      confirmPassword: "Confirm password",
      confirmPasswordPlaceholder: "Confirm password",
      termsText1: "I have read and accept the",
      termsLink: "terms and conditions",
      termsText2: "and the",
      privacyLink: "privacy policy",
      marketingText: "I want to receive information about improvements, updates, changes to the application and promotional communications",
      continueButton: "Continue",
      registrationComplete: "Registration complete!",
      registrationSuccess: "Your account has been created successfully. Click continue to set up your assistant.",
      recoverPassword: "Recover password",
      recoverPasswordDescription: "Enter your email and we will send you a link to reset your password.",
      cancel: "Cancel",
      sendLink: "Send link",
      emailSent: "Email sent!",
      checkInbox: "Check your inbox and follow the instructions to reset your password.",
      connectGoogle: "Connect with Google",
      connectFacebook: "Connect with Facebook",
      aboutToConnect: "You are about to connect with your",
      googleName: "Google",
      facebookName: "Facebook",
      secureAuth: "Secure authentication",
      permissionsText: "By continuing, RealMaker AI will be able to:",
      viewProfile: "View your basic profile information",
      viewProfilePublic: "View your public profile information",
      viewEmail: "View your email address",
      connectButton: "Connect",
      thanksRegistration: "Thank you for signing up! One of our advisors will contact you to activate your free trial.",
      scheduleTitle: "Office hours:",
      scheduleMondayThursday: "Monday to Thursday: 9:00 AM to 2:00 PM and 3:00 PM to 6:30 PM",
      scheduleFriday: "Friday: 8:30 AM to 2:30 PM",
      passwordsMismatch: "Passwords do not match",
      passwordLabel: "Password",
      passwordField: "Password",
      errorNameRequired: "Enter a name",
      errorEmailRequired: "Enter an email",
      errorEmailInvalid: "Enter a valid email.",
      errorPhoneRequired: "Enter a phone number",
      errorCompanyRequired: "Enter the name of your agency",
      errorPasswordRequired: "Enter a password",
      errorPasswordLength: "Enter a password of at least 8 characters.",
      errorConfirmPasswordRequired: "Confirm your password",
      errorPasswordsMismatch: "Passwords do not match",
      errorTermsRequired: "You must accept the general terms to use the tool."
    },
    it: {
      back: "Indietro",
      welcomeBack: "Bentornato",
      freeTrial: `Prova gratuita per ${trialDays} giorni`,
      loginDescription: "Accedi per accedere ai tuoi assistenti AI",
      registerDescription: "Qualifica i lead automaticamente 24/7 e dedica il tuo tempo a ciò che conta davvero",
      loginTab: "Accedi",
      registerTab: "Registrati",
      email: "Email",
      emailPlaceholder: "tua@email.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      forgotPassword: "Hai dimenticato la password?",
      loginButton: "Accedi",
      continueWith: "O continua con",
      registerWith: "O registrati con",
      fullName: "Nome completo",
      namePlaceholder: "Mario Rossi",
      phone: "Telefono",
      phonePlaceholder: "+39 333 000 000",
      company: "Agenzia immobiliare",
      companyPlaceholder: "La Mia Agenzia Immobiliare",
      confirmPassword: "Conferma password",
      confirmPasswordPlaceholder: "Conferma password",
      termsText1: "Ho letto e accetto i",
      termsLink: "termini e condizioni",
      termsText2: "e la",
      privacyLink: "informativa sulla privacy",
      marketingText: "Desidero ricevere informazioni su miglioramenti, aggiornamenti, modifiche all'applicazione e comunicazioni promozionali",
      continueButton: "Continua",
      registrationComplete: "Registrazione completata!",
      registrationSuccess: "Il tuo account è stato creato con successo. Clicca su continua per configurare il tuo assistente.",
      recoverPassword: "Recupera password",
      recoverPasswordDescription: "Inserisci la tua email e ti invieremo un link per reimpostare la password.",
      cancel: "Annulla",
      sendLink: "Invia link",
      emailSent: "Email inviata!",
      checkInbox: "Controlla la tua casella di posta e segui le istruzioni per reimpostare la password.",
      connectGoogle: "Connetti con Google",
      connectFacebook: "Connetti con Facebook",
      aboutToConnect: "Stai per connetterti con il tuo account",
      googleName: "Google",
      facebookName: "Facebook",
      secureAuth: "Autenticazione sicura",
      permissionsText: "Continuando, RealMaker AI potrà:",
      viewProfile: "Visualizzare le informazioni del tuo profilo di base",
      viewProfilePublic: "Visualizzare le informazioni del tuo profilo pubblico",
      viewEmail: "Visualizzare il tuo indirizzo email",
      connectButton: "Connetti",
      thanksRegistration: "Grazie per esserti registrato! Uno dei nostri consulenti ti contatterà per attivare la tua prova gratuita.",
      scheduleTitle: "Orari di apertura:",
      scheduleMondayThursday: "Lunedì a Giovedì: 9:00 alle 14:00 e 15:00 alle 18:30",
      scheduleFriday: "Venerdì: 08:30 alle 14:30",
      passwordsMismatch: "Le password non corrispondono",
      passwordLabel: "Password",
      passwordField: "Password",
      errorNameRequired: "Inserisci un nome",
      errorEmailRequired: "Inserisci un'email",
      errorEmailInvalid: "Inserisci un'email valida.",
      errorPhoneRequired: "Inserisci un numero di telefono",
      errorCompanyRequired: "Inserisci il nome della tua agenzia",
      errorPasswordRequired: "Inserisci una password",
      errorPasswordLength: "Inserisci una password di almeno 8 caratteri.",
      errorConfirmPasswordRequired: "Conferma la tua password",
      errorPasswordsMismatch: "Le password non corrispondono",
      errorTermsRequired: "Devi accettare i termini generali per utilizzare lo strumento."
    }
  };

  const t = translations[language];

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await onLogin({ email: loginData.email.trim(), password: loginData.password });
    } catch (err) {
      const message = err instanceof Error ? err.message : "No pudimos iniciar sesión.";
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    // Limpiar errores previos
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      company: "",
      password: "",
      confirmPassword: "",
      terms: ""
    };

    let hasErrors = false;

    // Validar nombre
    if (!registerData.name.trim()) {
      newErrors.name = t.errorNameRequired;
      hasErrors = true;
    }

    // Validar email
    if (!registerData.email.trim()) {
      newErrors.email = t.errorEmailRequired;
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = t.errorEmailInvalid;
      hasErrors = true;
    }

    // Validar teléfono
    if (!registerData.phone.trim()) {
      newErrors.phone = t.errorPhoneRequired;
      hasErrors = true;
    }

    // Validar empresa
    if (!registerData.company.trim()) {
      newErrors.company = t.errorCompanyRequired;
      hasErrors = true;
    }

    // Validar contraseña
    if (!registerData.password.trim()) {
      newErrors.password = t.errorPasswordRequired;
      hasErrors = true;
    } else if (registerData.password.length < 8) {
      newErrors.password = t.errorPasswordLength;
      hasErrors = true;
    }

    // Validar confirmación de contraseña
    if (!registerData.confirmPassword.trim()) {
      newErrors.confirmPassword = t.errorConfirmPasswordRequired;
      hasErrors = true;
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = t.errorPasswordsMismatch;
      hasErrors = true;
    }

    // Validar términos
    if (!registerData.acceptedTerms) {
      newErrors.terms = t.errorTermsRequired;
      hasErrors = true;
    }

    // Actualizar estado de errores
    setRegisterErrors(newErrors);

    // Si hay errores, no continuar
    if (hasErrors) {
      return;
    }

    setRegisterLoading(true);
    try {
      await onRegister({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
        company: registerData.company.trim(),
      });
      setRegistrationSuccess(true);
      setShowRegistrationDialog(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No pudimos registrar tu cuenta.";
      setRegisterError(message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleCloseRegistrationDialog = () => {
    setShowRegistrationDialog(false);
  };
  
  const handleStartOnboarding = () => {
    setShowRegistrationDialog(false);
  };
  
  const handleSocialLogin = (provider: string) => {
    // Si estamos en el tab de registro, ir directo al onboarding sin popup
    if (activeTab === "register") {
      onRegister();
    } else {
      // Si estamos en login, mostrar el popup de OAuth correspondiente
      if (provider === "Google") {
        setShowGooglePopup(true);
      } else if (provider === "Facebook") {
        setShowFacebookPopup(true);
      }
    }
  };

  const handleForgotPassword = (e: FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de envío de email
    setResetEmailSent(true);
    setTimeout(() => {
      setResetEmailSent(false);
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    }, 3000);
  };

  const handleSocialConnect = (provider: string) => {
    // Simular conexión
    setTimeout(() => {
      if (provider === "Google") {
        setShowGooglePopup(false);
      } else if (provider === "Facebook") {
        setShowFacebookPopup(false);
      }
      // Si está en tab de login, va directo al dashboard
      // Si está en tab de register, mostrar popup de confirmación
      // Mostrar popup de confirmación de registro
      setShowRegistrationDialog(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header con logo y botón volver */}
        <div className="mb-8 space-y-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.back}
          </Button>
          
          <div className="flex justify-center">
            <div className="w-64">
              <RealMakerLogo />
            </div>
          </div>
          
          {/* Selector de idiomas */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 p-1.5 bg-white rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => {
                  setLanguage('es');
                  onLanguageChange?.('es');
                }}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                  ${language === 'es' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                aria-label="Español"
              >
                <SpainFlag className="h-4 w-6 rounded-sm flex-shrink-0" />
                <span className={`text-sm font-medium ${language === 'es' ? 'text-white' : 'text-gray-700'}`}>
                  Español
                </span>
              </button>
              <button
                onClick={() => {
                  setLanguage('en');
                  onLanguageChange?.('en');
                }}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                  ${language === 'en' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                aria-label="English"
              >
                <UKFlag className="h-4 w-6 rounded-sm flex-shrink-0" />
                <span className={`text-sm font-medium ${language === 'en' ? 'text-white' : 'text-gray-700'}`}>
                  English
                </span>
              </button>
              <button
                onClick={() => {
                  setLanguage('it');
                  onLanguageChange?.('it');
                }}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                  ${language === 'it' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                aria-label="Italiano"
              >
                <ItalyFlag className="h-4 w-6 rounded-sm flex-shrink-0" />
                <span className={`text-sm font-medium ${language === 'it' ? 'text-white' : 'text-gray-700'}`}>
                  Italiano
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Card principal con tabs */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-2xl text-gray-900">
              {activeTab === "login" ? t.welcomeBack : t.freeTrial}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login" 
                ? t.loginDescription 
                : t.registerDescription}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">{t.loginTab}</TabsTrigger>
                <TabsTrigger value="register">{t.registerTab}</TabsTrigger>
              </TabsList>

              {/* Tab de Login */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="text"
                        placeholder={t.emailPlaceholder}
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">{t.password}</Label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs text-primary hover:underline"
                      >
                        {t.forgotPassword}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder={t.passwordPlaceholder}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {loginError ? (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {loginError}
                    </div>
                  ) : null}

                  <Button type="submit" className="w-full" disabled={loginLoading}>
                    {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.loginButton}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">{t.continueWith}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin("Google")}
                    className="w-full"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin("Facebook")}
                    className="w-full"
                  >
                    <svg className="h-4 w-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </TabsContent>

              {/* Tab de Registro */}
              <TabsContent value="register" className="space-y-4">
                {!registrationSuccess ? (
                  <>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">{t.fullName}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-name"
                            type="text"
                            placeholder={t.namePlaceholder}
                            value={registerData.name}
                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                        {registerErrors.name && <p className="text-red-500 text-sm">{registerErrors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">{t.email}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-email"
                            type="text"
                            placeholder={t.emailPlaceholder}
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                        {registerErrors.email && <p className="text-red-500 text-sm">{registerErrors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-phone">{t.phone}</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-phone"
                            type="tel"
                            placeholder={t.phonePlaceholder}
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                        {registerErrors.phone && <p className="text-red-500 text-sm">{registerErrors.phone}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-company">{t.company}</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-company"
                            type="text"
                            placeholder={t.companyPlaceholder}
                            value={registerData.company}
                            onChange={(e) => setRegisterData({ ...registerData, company: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                        {registerErrors.company && <p className="text-red-500 text-sm">{registerErrors.company}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">{t.passwordLabel}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-password"
                            type="password"
                            placeholder={t.passwordField}
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            className="pl-10"
                            required
                            minLength={8}
                          />
                        </div>
                        {registerErrors.password && <p className="text-red-500 text-sm">{registerErrors.password}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-confirm-password">{t.confirmPassword}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-confirm-password"
                            type="password"
                            placeholder={t.confirmPasswordPlaceholder}
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            className="pl-10"
                            required
                            minLength={8}
                          />
                        </div>
                        {registerErrors.confirmPassword && <p className="text-red-500 text-sm">{registerErrors.confirmPassword}</p>}
                      </div>

                      <div className="flex items-start gap-3 pt-2">
                        <Checkbox
                          id="terms"
                          checked={registerData.acceptedTerms}
                          onCheckedChange={(checked) => 
                            setRegisterData({ ...registerData, acceptedTerms: checked as boolean })
                          }
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor="terms"
                            className="text-sm text-gray-600 leading-snug cursor-pointer"
                          >
                            {t.termsText1}{" "}
                            <button 
                              type="button"
                              className="text-[#2563eb] hover:underline"
                              onClick={(e) => {
                                e.preventDefault();
                                // Aquí se abriría el modal o página de condiciones
                              }}
                            >
                              {t.termsLink}
                            </button>{" "}
                            {t.termsText2}{" "}
                            <button 
                              type="button"
                              className="text-[#2563eb] hover:underline"
                              onClick={(e) => {
                                e.preventDefault();
                                // Aquí se abriría el modal o página de política
                              }}
                            >
                              {t.privacyLink}
                            </button>
                          </label>
                          {registerErrors.terms && <p className="text-red-500 text-sm mt-1">{registerErrors.terms}</p>}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="marketing"
                          checked={registerData.acceptedMarketing}
                          onCheckedChange={(checked) => 
                            setRegisterData({ ...registerData, acceptedMarketing: checked as boolean })
                          }
                          className="mt-0.5"
                        />
                        <label
                          htmlFor="marketing"
                          className="text-sm text-gray-600 leading-snug cursor-pointer"
                        >
                          {t.marketingText}
                        </label>
                      </div>

                      {registerError ? (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                          {registerError}
                        </div>
                      ) : null}

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={registerLoading}
                      >
                        {registerLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.continueButton}
                      </Button>
                    </form>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">{t.registerWith}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("Google")}
                        className="w-full"
                      >
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Google
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("Facebook")}
                        className="w-full"
                      >
                        <svg className="h-4 w-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">{t.registrationComplete}</p>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        {t.registrationSuccess}
                      </p>
                    </div>
                    <Button 
                      onClick={handleStartOnboarding}
                      className="w-full"
                    >
                      {t.continueButton}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            © 2025 RealMaker AI • By Betterplace
          </p>
        </div>
      </div>

      {/* Dialog de recuperación de contraseña */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.recoverPassword}</DialogTitle>
            <DialogDescription>
              {t.recoverPasswordDescription}
            </DialogDescription>
          </DialogHeader>

          {!resetEmailSent ? (
            <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">{t.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="forgot-email"
                    type="text"
                    placeholder={t.emailPlaceholder}
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1"
                >
                  {t.cancel}
                </Button>
                <Button type="submit" className="flex-1">
                  {t.sendLink}
                </Button>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{t.emailSent}</p>
                <p className="text-sm text-gray-500">
                  {t.checkInbox}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Google */}
      <Dialog open={showGooglePopup} onOpenChange={setShowGooglePopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.connectGoogle}</DialogTitle>
            <DialogDescription>
              {t.aboutToConnect} {t.googleName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{t.googleName}</p>
                <p className="text-sm text-gray-500">{t.secureAuth}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              <p>{t.permissionsText}</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>{t.viewProfile}</li>
                <li>{t.viewEmail}</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowGooglePopup(false)}
                className="flex-1"
              >
                {t.cancel}
              </Button>
              <Button
                type="button"
                onClick={() => handleSocialConnect("Google")}
                className="flex-1"
              >
                {t.connectButton}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Facebook */}
      <Dialog open={showFacebookPopup} onOpenChange={setShowFacebookPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.connectFacebook}</DialogTitle>
            <DialogDescription>
              {t.aboutToConnect} {t.facebookName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{t.facebookName}</p>
                <p className="text-sm text-gray-500">{t.secureAuth}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              <p>{t.permissionsText}</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>{t.viewProfilePublic}</li>
                <li>{t.viewEmail}</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFacebookPopup(false)}
                className="flex-1"
              >
                {t.cancel}
              </Button>
              <Button
                type="button"
                onClick={() => handleSocialConnect("Facebook")}
                className="flex-1"
              >
                {t.connectButton}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de registro */}
      <Dialog open={showRegistrationDialog} onOpenChange={setShowRegistrationDialog}>
        <DialogContent className="sm:max-w-md border-0 shadow-xl">
          <DialogTitle className="sr-only">Registro Completado</DialogTitle>
          <DialogDescription className="sr-only">
            Gracias por registrarte. Un agente se pondrá en contacto contigo para activar tu prueba gratuita.
          </DialogDescription>
          
          <button
            onClick={handleCloseRegistrationDialog}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 z-10"
          >
            <X className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Cerrar</span>
          </button>

          <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
            {/* Icono de contact en círculo */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Contact className="h-10 w-10 text-primary" />
            </div>

            {/* Mensaje principal */}
            <p className="text-gray-700 max-w-sm leading-relaxed mb-4">
              {t.thanksRegistration}
            </p>
            
            {/* Horario de atención */}
            <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{t.scheduleTitle}:</span>
              </div>
              <div className="space-y-1">
                <p>{t.scheduleMondayThursday}</p>
                <p>{t.scheduleFriday}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
