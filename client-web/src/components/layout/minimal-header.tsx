import { useState } from "react";
import { Button } from "../ui/button";
import { TooltipProvider } from "../ui/tooltip";
import Frame5980 from "../../imports/Frame5980";
import AIIcon from "../icons/ai-icon";
import { Clock, Headset, X, PanelLeftClose, PanelLeft, User, LogOut, Calendar, Bot, CheckCircle2, Sparkles, Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTrialDays } from "../../contexts/trial-days-context";

type LicenseType = 'trial' | 'monthly' | 'permanent';

interface MinimalHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogoClick?: () => void;
  sidebarCollapsed?: boolean;
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  isTrialUser?: boolean;
  licenseType?: LicenseType;
  renewalDate?: string;
}

export function MinimalHeader({ 
  activeTab, 
  onTabChange, 
  onLogoClick, 
  sidebarCollapsed, 
  onSidebarCollapsedChange,
  onLogout,
  userName = "Usuario",
  userEmail = "usuario@realmaker.com",
  isTrialUser = false,
  licenseType = 'trial',
  renewalDate = ''
}: MinimalHeaderProps) {
  const { trialDays } = useTrialDays();
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  
  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Formatear fecha para mostrar en formato legible (ej: "8 dic. 2025")
  const formatRenewalDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${date.getDate()} ${months[date.getMonth()]}. ${date.getFullYear()}`;
  };

  // Calcular días restantes hasta la fecha de renovación
  const calculateDaysRemaining = (dateString: string) => {
    if (!dateString) return 0;
    const today = new Date();
    const renewalDate = new Date(dateString);
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <TooltipProvider delayDuration={300}>
      <header className="bg-white border-b border-gray-100">
        {/* Main Header */}
        <div className="px-4 lg:px-6 py-2.5">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Collapse button + Logo */}
            <div className="flex items-center gap-3">
              {/* Collapse Sidebar Button - Desktop only */}
              {onSidebarCollapsedChange && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSidebarCollapsedChange(!sidebarCollapsed)}
                  className="hidden lg:flex h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {sidebarCollapsed ? (
                    <Menu className="h-5 w-5" />
                  ) : (
                    <X className="h-5 w-5" />
                  )}
                </Button>
              )}
              {/* Logo */}
              <button 
                onClick={onLogoClick}
                className="hover:opacity-80 transition-opacity"
              >
                {/* Logo grande - Desktop */}
                <div className="hidden md:block w-48 h-9">
                  <Frame5980 />
                </div>
                {/* Icono pequeño - Móvil */}
                <div className="md:hidden w-8 h-8">
                  <AIIcon />
                </div>
              </button>
            </div>

            {/* Right side - Trial Banner + Profile Menu */}
            <div className="flex items-center gap-3">
              {/* Banner para usuario trial */}
              {isTrialUser && (
                <>
                  {/* Trial Banner - Desktop version */}
                  <div className="hidden lg:flex items-center gap-3">
                    {/* Status Card con diseño mejorado */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
                      {/* Bot Icon con background circular */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/80 border border-blue-200/50">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      
                      {/* Status badge y días */}
                      <div className="flex items-center gap-2.5">
                        {/* Badge "Prueba gratis" */}
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded-full border border-blue-200">
                          <Sparkles className="h-3 w-3 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">Prueba gratis</span>
                        </div>
                        
                        {/* Separador vertical */}
                        <div className="h-4 w-px bg-blue-200"></div>
                        
                        {/* Días restantes */}
                        <div className="flex flex-col">
                          <span className="text-[10px] text-blue-600 uppercase tracking-wide">Quedan</span>
                          <span className="text-xs font-semibold text-blue-900">{trialDays} días</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <Button 
                      size="sm"
                      onClick={() => setShowContactDialog(true)}
                      className="h-9 px-4 text-xs font-medium bg-primary hover:bg-primary/90 shadow-sm hover:shadow transition-all duration-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      Contratar
                    </Button>
                  </div>

                  {/* Trial Banner - Mobile/Tablet version */}
                  <div className="lg:hidden flex items-center gap-2">
                    {/* Compact status card */}
                    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-md border border-blue-200 shadow-sm">
                      {/* Bot icon */}
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/80 border border-blue-200/50 flex-shrink-0">
                        <Bot className="h-3 w-3 text-blue-600" />
                      </div>
                      
                      {/* Badge y días */}
                      <div className="flex items-center gap-1.5">
                        {/* Badge "Prueba" */}
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 rounded-full border border-blue-200">
                          <Sparkles className="h-2.5 w-2.5 text-blue-600 flex-shrink-0" />
                          <span className="text-[10px] font-medium text-blue-700 leading-none">Prueba</span>
                        </div>
                        
                        {/* Separador */}
                        <div className="h-3 w-px bg-blue-200 flex-shrink-0"></div>
                        
                        {/* Días restantes */}
                        <div className="flex items-center gap-0.5">
                          <span className="text-[10px] text-blue-600 leading-none">Quedan</span>
                          <span className="text-[10px] font-semibold text-blue-900 leading-none">{trialDays} días</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA Button compacto */}
                    <Button 
                      size="sm"
                      onClick={() => setShowContactDialog(true)}
                      className="h-7 px-2.5 text-xs bg-primary hover:bg-primary/90 shadow-sm"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Contratar
                    </Button>
                  </div>
                </>
              )}

              {/* Banner para cliente con licencia de permanencia */}
              {!isTrialUser && licenseType === 'permanent' && renewalDate && (
                <>
                  {/* Renewal Banner - Desktop version */}
                  <div className="hidden lg:flex items-center gap-3">
                    {/* Status Card con diseño mejorado */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
                      {/* Bot Icon con background circular */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/80 border border-blue-200/50">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      
                      {/* Status badge y fecha */}
                      <div className="flex items-center gap-2.5">
                        {/* Badge "Activo" */}
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 rounded-full border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-700">Activo</span>
                        </div>
                        
                        {/* Separador vertical */}
                        <div className="h-4 w-px bg-blue-200"></div>
                        
                        {/* Fecha */}
                        <div className="flex flex-col">
                          <span className="text-[10px] text-blue-600 uppercase tracking-wide">Quedan</span>
                          <span className="text-xs font-semibold text-blue-900">{calculateDaysRemaining(renewalDate)} días</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA Button mejorado */}
                    <Button 
                      size="sm"
                      onClick={() => setShowRenewalDialog(true)}
                      className="h-9 px-4 text-xs font-medium bg-primary hover:bg-primary/90 shadow-sm hover:shadow transition-all duration-200"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Ampliar renovación
                    </Button>
                  </div>

                  {/* Renewal Banner - Mobile/Tablet version */}
                  <div className="lg:hidden flex items-center gap-2">
                    {/* Compact status card */}
                    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-md border border-blue-200 shadow-sm">
                      {/* Bot icon */}
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/80 border border-blue-200/50 flex-shrink-0">
                        <Bot className="h-3 w-3 text-blue-600" />
                      </div>
                      
                      {/* Badge y días */}
                      <div className="flex items-center gap-1.5">
                        {/* Badge "Activo" */}
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-100 rounded-full border border-emerald-200">
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600 flex-shrink-0" />
                          <span className="text-[10px] font-medium text-emerald-700 leading-none">Activo</span>
                        </div>
                        
                        {/* Separador */}
                        <div className="h-3 w-px bg-blue-200 flex-shrink-0"></div>
                        
                        {/* Días restantes */}
                        <div className="flex items-center gap-0.5">
                          <span className="text-[10px] text-blue-600 leading-none">Quedan</span>
                          <span className="text-[10px] font-semibold text-blue-900 leading-none">{calculateDaysRemaining(renewalDate)} días</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA Button compacto */}
                    <Button 
                      size="sm"
                      onClick={() => setShowRenewalDialog(true)}
                      className="h-7 px-2.5 text-xs bg-primary hover:bg-primary/90 shadow-sm"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Ampliar
                    </Button>
                  </div>
                </>
              )}

              {/* Para licencia mensual, no mostrar banner (se renueva automáticamente) */}

              {/* Profile Menu - Desktop Only */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 rounded-full hover:bg-gray-100 p-0 hidden lg:flex"
                  >
                    <Avatar className="h-8 w-8 border-2 border-gray-200">
                      <AvatarImage src="" alt={userName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-gray-500">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onTabChange?.('profile')}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={onLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md border-0 shadow-xl">
          <DialogTitle className="sr-only">Solicitud Enviada</DialogTitle>
          <DialogDescription className="sr-only">
            Tu solicitud ha sido recibida. Un consultor se pondrá en contacto contigo pronto.
          </DialogDescription>
          
          <button
            onClick={() => setShowContactDialog(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 z-10"
          >
            <X className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Cerrar</span>
          </button>

          <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
            {/* Icono de check en círculo */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Headset className="h-10 w-10 text-primary" />
            </div>

            {/* Mensaje principal */}
            <p className="text-gray-700 max-w-sm leading-relaxed mb-4">
              Uno de nuestros asesores se pondrá en contacto contigo.
            </p>
            
            {/* Horario de atención */}
            <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Horario de atención:</span>
              </div>
              <div className="space-y-1">
                <p>Lunes a Jueves: 9:00h a 14:00h y 15:00h a 18:30h</p>
                <p>Viernes: 08:30h a 14:30h</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Renewal Dialog */}
      <Dialog open={showRenewalDialog} onOpenChange={setShowRenewalDialog}>
        <DialogContent className="sm:max-w-md border-0 shadow-xl">
          <DialogTitle className="sr-only">Solicitud de Renovación</DialogTitle>
          <DialogDescription className="sr-only">
            Tu solicitud de renovación ha sido recibida. Un asesor se pondrá en contacto contigo para gestionar la renovación.
          </DialogDescription>
          
          <button
            onClick={() => setShowRenewalDialog(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 z-10"
          >
            <X className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Cerrar</span>
          </button>

          <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
            {/* Icono de calendario */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Headset className="h-10 w-10 text-primary" />
            </div>

            {/* Mensaje principal */}
            <p className="text-gray-700 max-w-sm leading-relaxed mb-4">
              Un asesor se pondrá en contacto contigo para gestionar tu renovación.
            </p>
            
            {/* Horario de atención */}
            <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Horario de atención:</span>
              </div>
              <div className="space-y-1">
                <p>Lunes a Jueves: 9:00h a 14:00h y 15:00h a 18:30h</p>
                <p>Viernes: 08:30h a 14:30h</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}