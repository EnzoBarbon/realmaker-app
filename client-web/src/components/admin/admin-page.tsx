import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner@2.0.3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { 
  Shield, 
  Search, 
  Mail, 
  Calendar,
  MessageSquare,
  Users as UsersIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Gift,
  CreditCard,
  Trash2,
  ArrowUpDown,
  Ban,
  Phone,
  Building2,
  ArrowLeft,
  Plus,
  Send,
  Copy,
  Eye,
  EyeOff,
  Bell,
  Globe,
  Pencil
} from "lucide-react";
import { useTrialDays } from "../../contexts/trial-days-context";

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "trial" | "active" | "inactive" | "incomplete" | "unpaid" | "lost";
  trialDays: number;
  licenseType: "monthly" | "permanent" | null;
  licenseExpiry: string | null;
  conversationsCount: number;
  leadsCount: number;
  contactsCount: number;
  sentToCRM: number;
  lastActive: string;
  registeredDate: string;
  hasAlerts: boolean;
  hasWebsite: boolean;
}

interface Company {
  id: string;
  companyId: string; // ID visible para el usuario
  betterplaceId?: string; // ID de Betterplace (opcional)
  name: string;
  email: string;
  phone: string;
  status: "trial" | "active" | "inactive" | "incomplete" | "unpaid" | "lost";
  trialDays: number;
  licenseType: "monthly" | "permanent" | null;
  licenseExpiry: string | null;
  registeredDate: string;
  users: User[];
}

// Mock data de empresas
const mockCompanies: Company[] = [
  {
    id: "1",
    companyId: "RM-001",
    betterplaceId: "BP-2024-001",
    name: "Inmobiliaria García",
    email: "contacto@garciaproperties.com",
    phone: "+34 654 321 098",
    status: "trial",
    trialDays: 7,
    licenseType: null,
    licenseExpiry: "2025-11-23",
    registeredDate: "2025-11-09",
    users: [
      {
        id: "1-1",
        name: "María García",
        email: "maria.garcia@garciaproperties.com",
        phone: "654321098",
        status: "trial",
        trialDays: 7,
        licenseType: null,
        licenseExpiry: "2025-11-23",
        conversationsCount: 145,
        leadsCount: 23,
        contactsCount: 89,
        sentToCRM: 18,
        lastActive: "2025-11-16",
        registeredDate: "2025-11-09",
        hasAlerts: true,
        hasWebsite: false
      }
    ]
  },
  {
    id: "2",
    companyId: "RM-002",
    betterplaceId: "BP-2024-002",
    name: "Realestate Rodríguez",
    email: "info@realestaterodriguez.es",
    phone: "+34 654 321 097",
    status: "active",
    trialDays: 0,
    licenseType: "permanent",
    licenseExpiry: "2026-03-15",
    registeredDate: "2025-03-15",
    users: [
      {
        id: "2-1",
        name: "Carlos Rodríguez",
        email: "carlos@realestaterodriguez.es",
        phone: "654321097",
        status: "active",
        trialDays: 0,
        licenseType: "permanent",
        licenseExpiry: "2026-03-15",
        conversationsCount: 312,
        leadsCount: 47,
        contactsCount: 156,
        sentToCRM: 39,
        lastActive: "2025-11-16",
        registeredDate: "2025-03-15",
        hasAlerts: false,
        hasWebsite: true
      },
      {
        id: "2-2",
        name: "Laura Rodríguez",
        email: "laura@realestaterodriguez.es",
        phone: "654321087",
        status: "active",
        trialDays: 0,
        licenseType: "permanent",
        licenseExpiry: "2026-03-15",
        conversationsCount: 198,
        leadsCount: 31,
        contactsCount: 102,
        sentToCRM: 27,
        lastActive: "2025-11-15",
        registeredDate: "2025-04-01",
        hasAlerts: true,
        hasWebsite: false
      }
    ]
  },
  {
    id: "3",
    companyId: "RM-003",
    name: "Propiedades Martínez",
    email: "ana@propiedades-martinez.com",
    phone: "+34 654 321 096",
    status: "trial",
    trialDays: 3,
    licenseType: null,
    licenseExpiry: "2025-11-19",
    registeredDate: "2025-11-13",
    users: [
      {
        id: "3-1",
        name: "Ana Martínez",
        email: "ana@propiedades-martinez.com",
        phone: "654321096",
        status: "trial",
        trialDays: 3,
        licenseType: null,
        licenseExpiry: "2025-11-19",
        conversationsCount: 45,
        leadsCount: 8,
        contactsCount: 34,
        sentToCRM: 6,
        lastActive: "2025-11-15",
        registeredDate: "2025-11-13",
        hasAlerts: false,
        hasWebsite: false
      }
    ]
  },
  {
    id: "4",
    companyId: "RM-004",
    name: "Homes López",
    email: "info@homeslopez.es",
    phone: "+34 654 321 095",
    status: "active",
    trialDays: 0,
    licenseType: "permanent",
    licenseExpiry: "2026-02-04",
    registeredDate: "2025-05-04",
    users: [
      {
        id: "4-1",
        name: "Jorge López",
        email: "jorge@homeslopez.es",
        phone: "654321095",
        status: "active",
        trialDays: 0,
        licenseType: "permanent",
        licenseExpiry: "2026-02-04",
        conversationsCount: 287,
        leadsCount: 41,
        contactsCount: 178,
        sentToCRM: 34,
        lastActive: "2025-11-16",
        registeredDate: "2025-05-04",
        hasAlerts: true,
        hasWebsite: true
      }
    ]
  },
  {
    id: "5",
    companyId: "RM-005",
    name: "Inmuebles Sánchez",
    email: "laura@inmuebles-sanchez.com",
    phone: "+34 654 321 094",
    status: "unpaid",
    trialDays: 0,
    licenseType: null,
    licenseExpiry: "2025-10-20",
    registeredDate: "2025-08-20",
    users: [
      {
        id: "5-1",
        name: "Laura Sánchez",
        email: "laura@inmuebles-sanchez.com",
        phone: "654321094",
        status: "unpaid",
        trialDays: 0,
        licenseType: null,
        licenseExpiry: "2025-10-20",
        conversationsCount: 89,
        leadsCount: 12,
        contactsCount: 45,
        sentToCRM: 10,
        lastActive: "2025-10-18",
        registeredDate: "2025-08-20",
        hasAlerts: false,
        hasWebsite: false
      }
    ]
  },
  {
    id: "6",
    companyId: "RM-006",
    name: "Propiedades Ruiz",
    email: "pedro@propiedadesruiz.es",
    phone: "+34 654 321 093",
    status: "incomplete",
    trialDays: 0,
    licenseType: null,
    licenseExpiry: null,
    registeredDate: "2025-11-14",
    users: [
      {
        id: "6-1",
        name: "Pedro Ruiz",
        email: "pedro@propiedadesruiz.es",
        phone: "654321093",
        status: "incomplete",
        trialDays: 0,
        licenseType: null,
        licenseExpiry: null,
        conversationsCount: 0,
        leadsCount: 0,
        contactsCount: 0,
        sentToCRM: 0,
        lastActive: "2025-11-14",
        registeredDate: "2025-11-14",
        hasAlerts: false,
        hasWebsite: false
      }
    ]
  },
  {
    id: "7",
    companyId: "RM-007",
    name: "Casas Premium",
    email: "info@casaspremium.com",
    phone: "+34 654 321 092",
    status: "inactive",
    trialDays: 0,
    licenseType: null,
    licenseExpiry: "2025-09-15",
    registeredDate: "2025-06-15",
    users: [
      {
        id: "7-1",
        name: "Fernando Jiménez",
        email: "fernando@casaspremium.com",
        phone: "654321092",
        status: "inactive",
        trialDays: 0,
        licenseType: null,
        licenseExpiry: "2025-09-15",
        conversationsCount: 234,
        leadsCount: 38,
        contactsCount: 128,
        sentToCRM: 32,
        lastActive: "2025-09-14",
        registeredDate: "2025-06-15",
        hasAlerts: false,
        hasWebsite: false
      }
    ]
  },
  {
    id: "8",
    companyId: "RM-008",
    name: "Luxe Properties",
    email: "contact@luxeproperties.es",
    phone: "+34 654 321 091",
    status: "active",
    trialDays: 0,
    licenseType: "monthly",
    licenseExpiry: "2025-12-16",
    registeredDate: "2025-08-10",
    users: [
      {
        id: "8-1",
        name: "Sofia Morales",
        email: "sofia@luxeproperties.es",
        phone: "654321091",
        status: "active",
        trialDays: 0,
        licenseType: "monthly",
        licenseExpiry: "2025-12-16",
        conversationsCount: 178,
        leadsCount: 29,
        contactsCount: 95,
        sentToCRM: 24,
        lastActive: "2025-11-16",
        registeredDate: "2025-08-10",
        hasAlerts: true,
        hasWebsite: true
      },
      {
        id: "8-2",
        name: "Miguel Morales",
        email: "miguel@luxeproperties.es",
        phone: "654321081",
        status: "active",
        trialDays: 0,
        licenseType: "monthly",
        licenseExpiry: "2025-12-16",
        conversationsCount: 156,
        leadsCount: 22,
        contactsCount: 87,
        sentToCRM: 19,
        lastActive: "2025-11-15",
        registeredDate: "2025-09-01",
        hasAlerts: false,
        hasWebsite: true
      }
    ]
  },
  {
    id: "9",
    companyId: "RM-009",
    name: "Inversiones del Sur",
    email: "admin@inversionesdelsur.com",
    phone: "+34 654 321 090",
    status: "trial",
    trialDays: 12,
    licenseType: null,
    licenseExpiry: "2025-11-28",
    registeredDate: "2025-11-04",
    users: [
      {
        id: "9-1",
        name: "Roberto Fernández",
        email: "roberto@inversionesdelsur.com",
        phone: "654321090",
        status: "trial",
        trialDays: 12,
        licenseType: null,
        licenseExpiry: "2025-11-28",
        conversationsCount: 67,
        leadsCount: 11,
        contactsCount: 43,
        sentToCRM: 8,
        lastActive: "2025-11-16",
        registeredDate: "2025-11-04",
        hasAlerts: true,
        hasWebsite: false
      }
    ]
  },
  {
    id: "10",
    companyId: "RM-010",
    name: "Elite Inmobiliaria",
    email: "hola@eliteinmobiliaria.es",
    phone: "+34 654 321 089",
    status: "inactive",
    trialDays: 0,
    licenseType: null,
    licenseExpiry: "2025-08-30",
    registeredDate: "2025-05-20",
    users: [
      {
        id: "10-1",
        name: "Patricia Romero",
        email: "patricia@eliteinmobiliaria.es",
        phone: "654321089",
        status: "inactive",
        trialDays: 0,
        licenseType: null,
        licenseExpiry: "2025-08-30",
        conversationsCount: 189,
        leadsCount: 27,
        contactsCount: 98,
        sentToCRM: 21,
        lastActive: "2025-08-29",
        registeredDate: "2025-05-20",
        hasAlerts: false,
        hasWebsite: false
      }
    ]
  },
  {
    id: "11",
    companyId: "RM-011",
    name: "Coastal Homes",
    email: "info@coastalhomes.com",
    phone: "+34 654 321 088",
    status: "lost",
    trialDays: 0,
    licenseType: null,
    licenseExpiry: null,
    registeredDate: "2025-07-15",
    users: [
      {
        id: "11-1",
        name: "Antonio Delgado",
        email: "antonio@coastalhomes.com",
        phone: "654321088",
        status: "lost",
        trialDays: 0,
        licenseType: null,
        licenseExpiry: null,
        conversationsCount: 123,
        leadsCount: 19,
        contactsCount: 67,
        sentToCRM: 15,
        lastActive: "2025-10-30",
        registeredDate: "2025-07-15",
        hasAlerts: true,
        hasWebsite: false
      }
    ]
  },
  {
    id: "12",
    companyId: "RM-012",
    name: "Urban Living",
    email: "contacto@urbanliving.es",
    phone: "+34 654 321 087",
    status: "incomplete",
    trialDays: 0,
    licenseType: null,
    licenseExpiry: null,
    registeredDate: "2025-11-15",
    users: []
  }
];

export function AdminPage({ onBackToSettings }: { onBackToSettings?: () => void }) {
  const { trialDays: globalTrialDays, setTrialDays: setGlobalTrialDays } = useTrialDays();
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyDetail, setShowCompanyDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("demo");
  
  // Estados para diálogos
  const [showCreateCompanyDialog, setShowCreateCompanyDialog] = useState(false);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showDeleteCompanyDialog, setShowDeleteCompanyDialog] = useState(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showUnpaidDialog, setShowUnpaidDialog] = useState(false);
  const [showRemoveUnpaidDialog, setShowRemoveUnpaidDialog] = useState(false);
  const [showDeleteCompanyConfirm, setShowDeleteCompanyConfirm] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  // Estados para confirmación de toggles
  const [showAlertsConfirmDialog, setShowAlertsConfirmDialog] = useState(false);
  const [showWebsiteConfirmDialog, setShowWebsiteConfirmDialog] = useState(false);
  const [pendingAlertsChange, setPendingAlertsChange] = useState<{ userId: string; value: boolean } | null>(null);
  const [pendingWebsiteChange, setPendingWebsiteChange] = useState<{ userId: string; value: boolean } | null>(null);
  
  // Estados para edición de empresa
  const [editTrialDays, setEditTrialDays] = useState<number>(globalTrialDays);
  const [demoEnabled, setDemoEnabled] = useState(false);
  const [licenseEnabled, setLicenseEnabled] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'permanent'>('monthly');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Estados para crear empresa
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyEmail, setNewCompanyEmail] = useState("");
  const [newCompanyPhone, setNewCompanyPhone] = useState("");
  const [newCompanyBetterplaceId, setNewCompanyBetterplaceId] = useState("");
  
  // Estados para crear usuario
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para editar usuario
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserPhone, setEditUserPhone] = useState("");
  const [editUserPassword, setEditUserPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  
  // Estados para editar empresa
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editCompanyEmail, setEditCompanyEmail] = useState("");
  const [editCompanyPhone, setEditCompanyPhone] = useState("");
  const [editCompanyBetterplaceId, setEditCompanyBetterplaceId] = useState("");

  // Generar ID de empresa único
  const generateCompanyId = () => {
    const maxId = companies.reduce((max, company) => {
      const num = parseInt(company.companyId.split('-')[1]);
      return num > max ? num : max;
    }, 0);
    return `RM-${String(maxId + 1).padStart(3, '0')}`;
  };

  // Generar contraseña aleatoria
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Filtrar empresas por estado y búsqueda
  const getFilteredCompanies = (status: string) => {
    let filtered = companies;
    
    switch (status) {
      case "demo":
        filtered = companies.filter(c => c.status === "trial");
        break;
      case "clients":
        filtered = companies.filter(c => c.status === "active");
        break;
      case "unpaid":
        filtered = companies.filter(c => c.status === "unpaid");
        break;
      case "incomplete":
        filtered = companies.filter(c => c.status === "incomplete");
        break;
      case "lost":
        filtered = companies.filter(c => c.status === "lost");
        break;
      case "inactive":
        filtered = companies.filter(c => c.status === "inactive");
        break;
    }
    
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.companyId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setEditTrialDays(company.trialDays || 14);
    setShowCompanyDetail(true);
    
    // Resetear toggles y fechas
    setDemoEnabled(company.status === "trial");
    setLicenseEnabled(company.status === "active");
    setBillingPeriod('monthly');
    setStartDate("");
    setEndDate("");
  };

  const handleCreateCompany = () => {
    if (!newCompanyName) {
      toast.error("Por favor, ingresa el nombre de la empresa");
      return;
    }

    const newCompany: Company = {
      id: String(companies.length + 1),
      companyId: generateCompanyId(),
      betterplaceId: newCompanyBetterplaceId || undefined,
      name: newCompanyName,
      email: newCompanyEmail,
      phone: newCompanyPhone,
      status: "incomplete",
      trialDays: 0,
      licenseType: null,
      licenseExpiry: null,
      registeredDate: new Date().toISOString().split('T')[0],
      users: []
    };

    setCompanies([...companies, newCompany]);
    setShowCreateCompanyDialog(false);
    setNewCompanyName("");
    setNewCompanyEmail("");
    setNewCompanyPhone("");
    setNewCompanyBetterplaceId("");
    toast.success(`Empresa ${newCompany.companyId} creada correctamente`);
  };

  const handleCreateUser = async () => {
    if (!selectedCompany || !newUserName || !newUserEmail || !newUserPhone) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    const password = newUserPassword || generatePassword();

    const newUser: User = {
      id: `${selectedCompany.id}-${selectedCompany.users.length + 1}`,
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone,
      status: selectedCompany.status,
      trialDays: selectedCompany.trialDays,
      licenseType: selectedCompany.licenseType,
      licenseExpiry: selectedCompany.licenseExpiry,
      conversationsCount: 0,
      leadsCount: 0,
      contactsCount: 0,
      sentToCRM: 0,
      lastActive: new Date().toISOString().split('T')[0],
      registeredDate: new Date().toISOString().split('T')[0],
      hasAlerts: false,
      hasWebsite: false
    };

    const updatedCompanies = companies.map(c => 
      c.id === selectedCompany.id 
        ? { ...c, users: [...c.users, newUser] }
        : c
    );

    setCompanies(updatedCompanies);
    setSelectedCompany({ ...selectedCompany, users: [...selectedCompany.users, newUser] });
    setShowCreateUserDialog(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPhone("");
    setNewUserPassword("");
    
    // Intentar guardar contraseña en portapapeles
    try {
      await navigator.clipboard.writeText(password);
      toast.success(`Usuario creado. Contraseña copiada: ${password}`);
    } catch (error) {
      toast.success(`Usuario creado. Contraseña: ${password}`);
    }
  };

  const handleSendCredentials = (user: User) => {
    // Simular envío de email con credenciales
    toast.success(`Credenciales enviadas a ${user.email}`);
  };

  const handleEditCompany = () => {
    if (!selectedCompany) return;
    setEditCompanyName(selectedCompany.name);
    setEditCompanyEmail(selectedCompany.email);
    setEditCompanyPhone(selectedCompany.phone);
    setEditCompanyBetterplaceId(selectedCompany.betterplaceId || "");
    setIsEditingCompany(true);
  };

  const handleSaveCompanyInfo = () => {
    if (!selectedCompany) return;
    
    if (!editCompanyName.trim()) {
      toast.error("El nombre de la empresa es obligatorio");
      return;
    }

    const updatedCompany = {
      ...selectedCompany,
      name: editCompanyName,
      email: editCompanyEmail,
      phone: editCompanyPhone,
      betterplaceId: editCompanyBetterplaceId || undefined
    };

    const updatedCompanies = companies.map(c => 
      c.id === selectedCompany.id ? updatedCompany : c
    );

    setCompanies(updatedCompanies);
    setSelectedCompany(updatedCompany);
    setIsEditingCompany(false);
    toast.success("Información de empresa actualizada correctamente");
  };

  const handleCancelEditCompany = () => {
    setIsEditingCompany(false);
    setEditCompanyName("");
    setEditCompanyEmail("");
    setEditCompanyPhone("");
    setEditCompanyBetterplaceId("");
  };

  const handleSaveCompanyChanges = () => {
    if (!selectedCompany) return;
    
    let updatedCompanies;
    
    if (demoEnabled) {
      updatedCompanies = companies.map(c => 
        c.id === selectedCompany.id 
          ? { 
              ...c, 
              status: "trial" as const,
              trialDays: editTrialDays,
              licenseExpiry: new Date(Date.now() + editTrialDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              licenseType: null,
              users: c.users.map(u => ({
                ...u,
                status: "trial" as const,
                trialDays: editTrialDays,
                licenseExpiry: new Date(Date.now() + editTrialDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                licenseType: null
              }))
            }
          : c
      );
      
      setSelectedCompany({ 
        ...selectedCompany, 
        status: "trial", 
        trialDays: editTrialDays,
        licenseExpiry: new Date(Date.now() + editTrialDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        licenseType: null
      });
      
      if (editTrialDays !== globalTrialDays) {
        setGlobalTrialDays(editTrialDays);
      }
      toast.success("Modo demo activado correctamente");
    } else if (licenseEnabled && (billingPeriod === 'monthly' || (startDate && endDate))) {
      // Para TPV Mensual no se requieren fechas
      // Para Permanencia sí se requieren fechas
      const licenseType: "monthly" | "permanent" = billingPeriod;
      const expiryDate = billingPeriod === 'monthly' ? null : endDate;
      
      updatedCompanies = companies.map(c => 
        c.id === selectedCompany.id 
          ? { 
              ...c, 
              status: "active" as const,
              licenseType: licenseType,
              licenseExpiry: expiryDate,
              trialDays: 0,
              users: c.users.map(u => ({
                ...u,
                status: "active" as const,
                licenseType: licenseType,
                licenseExpiry: expiryDate,
                trialDays: 0
              }))
            }
          : c
      );
      
      setSelectedCompany({ 
        ...selectedCompany, 
        status: "active", 
        licenseType: licenseType,
        licenseExpiry: expiryDate,
        trialDays: 0
      });
      toast.success("Licencia activada correctamente");
    } else {
      // Determinar el nuevo estado según el estado previo
      // Si era "active" (tenía licencia) → pasa a "inactive" (Dado de baja)
      // Si era "inactive" (ya estaba dado de baja o sin licencia) → se mantiene "inactive"
      // Si era "trial" (modo demo) → pasa a "lost" (Perdido)
      let newStatus: "inactive" | "lost";
      let successMessage: string;
      
      if (selectedCompany.status === "active" || selectedCompany.status === "inactive") {
        newStatus = "inactive";
        successMessage = "Licencia desactivada, cliente dado de baja";
      } else {
        newStatus = "lost";
        successMessage = "Cliente marcado como perdido (terminó prueba sin convertirse en cliente)";
      }
      
      updatedCompanies = companies.map(c => 
        c.id === selectedCompany.id 
          ? { 
              ...c, 
              status: newStatus as const,
              trialDays: 0,
              licenseType: null,
              users: c.users.map(u => ({
                ...u,
                status: newStatus as const,
                trialDays: 0,
                licenseType: null
              }))
            }
          : c
      );
      
      setSelectedCompany({ 
        ...selectedCompany, 
        status: newStatus,
        trialDays: 0,
        licenseType: null
      });
      toast.success(successMessage);
    }
    
    setCompanies(updatedCompanies);
  };

  const handleDeleteCompany = (company: Company) => {
    setCompanyToDelete(company);
    setShowDeleteCompanyDialog(true);
  };

  const confirmDeleteCompany = () => {
    if (!companyToDelete) return;
    
    const updatedCompanies = companies.filter(c => c.id !== companyToDelete.id);
    setCompanies(updatedCompanies);
    setShowDeleteCompanyDialog(false);
    setCompanyToDelete(null);
    
    if (selectedCompany?.id === companyToDelete.id) {
      setShowCompanyDetail(false);
      setSelectedCompany(null);
    }
    
    toast.success("Empresa eliminada correctamente");
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteUserDialog(true);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete || !selectedCompany) return;
    
    const updatedUsers = selectedCompany.users.filter(u => u.id !== userToDelete.id);
    const updatedCompanies = companies.map(c => 
      c.id === selectedCompany.id 
        ? { ...c, users: updatedUsers }
        : c
    );
    
    setCompanies(updatedCompanies);
    setSelectedCompany({ ...selectedCompany, users: updatedUsers });
    setShowDeleteUserDialog(false);
    setUserToDelete(null);
    
    toast.success("Usuario eliminado correctamente");
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserPhone(user.phone);
    setEditUserPassword("");
    setShowEditPassword(false);
    setShowEditUserDialog(true);
  };

  const confirmEditUser = async () => {
    if (!userToEdit || !selectedCompany) return;
    
    // Validar campos obligatorios
    if (!editUserName.trim() || !editUserEmail.trim() || !editUserPhone.trim()) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    const updatedUsers = selectedCompany.users.map(u => 
      u.id === userToEdit.id 
        ? { ...u, name: editUserName, email: editUserEmail, phone: editUserPhone }
        : u
    );
    
    const updatedCompanies = companies.map(c => 
      c.id === selectedCompany.id 
        ? { ...c, users: updatedUsers }
        : c
    );
    
    setCompanies(updatedCompanies);
    setSelectedCompany({ ...selectedCompany, users: updatedUsers });
    setShowEditUserDialog(false);
    setUserToEdit(null);
    setEditUserName("");
    setEditUserEmail("");
    setEditUserPhone("");
    setEditUserPassword("");
    setShowEditPassword(false);
    
    // Si se cambió la contraseña, intentar copiarla al portapapeles
    if (editUserPassword) {
      try {
        await navigator.clipboard.writeText(editUserPassword);
        toast.success(`Usuario actualizado. Nueva contraseña copiada: ${editUserPassword}`);
      } catch (error) {
        toast.success(`Usuario actualizado. Nueva contraseña: ${editUserPassword}`);
      }
    } else {
      toast.success("Usuario actualizado correctamente");
    }
  };

  const handleMarkAsUnpaid = () => {
    if (selectedCompany?.status === 'unpaid') {
      // Mostrar diálogo de confirmación para quitar el estado de impago
      setShowRemoveUnpaidDialog(true);
    } else {
      // Marcar como impago
      setShowUnpaidDialog(true);
    }
  };

  const confirmMarkAsUnpaid = () => {
    if (!selectedCompany) return;
    
    const updatedCompanies = companies.map(c => 
      c.id === selectedCompany.id 
        ? { 
            ...c, 
            status: "unpaid" as const,
            licenseType: null,
            users: c.users.map(u => ({
              ...u,
              status: "unpaid" as const,
              licenseType: null
            }))
          }
        : c
    );
    
    setCompanies(updatedCompanies);
    setSelectedCompany({ 
      ...selectedCompany, 
      status: "unpaid",
      licenseType: null
    });
    setShowUnpaidDialog(false);
    setDemoEnabled(false);
    setLicenseEnabled(false);
    toast.success("Empresa marcada como impago correctamente");
  };

  const confirmRemoveUnpaid = () => {
    if (!selectedCompany) return;
    
    const updatedCompanies = companies.map(c => 
      c.id === selectedCompany.id 
        ? { 
            ...c, 
            status: "active" as const,
            users: c.users.map(u => ({
              ...u,
              status: "active" as const
            }))
          }
        : c
    );
    
    setCompanies(updatedCompanies);
    setSelectedCompany({ 
      ...selectedCompany, 
      status: "active",
    });
    setShowRemoveUnpaidDialog(false);
    setLicenseEnabled(true);
    setDemoEnabled(false);
    toast.success("Estado de impago eliminado, empresa reactivada como cliente");
  };

  // Funciones para manejar confirmaciones de toggles
  const handleAlertsToggleClick = (userId: string, newValue: boolean) => {
    setPendingAlertsChange({ userId, value: newValue });
    setShowAlertsConfirmDialog(true);
  };

  const confirmAlertsToggle = () => {
    if (!pendingAlertsChange || !selectedCompany) return;
    
    const updatedUsers = selectedCompany.users.map(u => 
      u.id === pendingAlertsChange.userId ? { ...u, hasAlerts: pendingAlertsChange.value } : u
    );
    const updatedCompanies = companies.map(c => 
      c.id === selectedCompany.id ? { ...c, users: updatedUsers } : c
    );
    setCompanies(updatedCompanies);
    setSelectedCompany({ ...selectedCompany, users: updatedUsers });
    toast.success(pendingAlertsChange.value ? 'Sistema de alertas activado' : 'Sistema de alertas desactivado');
    
    setShowAlertsConfirmDialog(false);
    setPendingAlertsChange(null);
  };

  const handleWebsiteToggleClick = (userId: string, newValue: boolean) => {
    setPendingWebsiteChange({ userId, value: newValue });
    setShowWebsiteConfirmDialog(true);
  };

  const confirmWebsiteToggle = () => {
    if (!pendingWebsiteChange || !selectedCompany) return;
    
    const updatedUsers = selectedCompany.users.map(u => 
      u.id === pendingWebsiteChange.userId ? { ...u, hasWebsite: pendingWebsiteChange.value } : u
    );
    const updatedCompanies = companies.map(c => 
      c.id === selectedCompany.id ? { ...c, users: updatedUsers } : c
    );
    setCompanies(updatedCompanies);
    setSelectedCompany({ ...selectedCompany, users: updatedUsers });
    toast.success(pendingWebsiteChange.value ? 'Página web activada' : 'Página web desactivada');
    
    setShowWebsiteConfirmDialog(false);
    setPendingWebsiteChange(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "trial":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Demo</Badge>;
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Cliente</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Dado de baja</Badge>;
      case "incomplete":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Incompleto</Badge>;
      case "unpaid":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 px-3 py-1">Impago</Badge>;
      case "lost":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Perdido</Badge>;
      default:
        return null;
    }
  };

  const getLicenseLabel = (type: string | null, status?: string) => {
    if (status === "trial") return "Sin licencia";
    if (!type) return "Sin licencia";
    switch (type) {
      case "monthly":
        return "Mensual";
      case "permanent":
        return "Permanencia";
      default:
        return type;
    }
  };

  // Componente para la lista de empresas
  const CompaniesList = ({ companies }: { companies: Company[] }) => {
    if (companies.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron empresas en esta categoría</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {/* Header de tabla - Desktop */}
        <div className="hidden md:grid md:grid-cols-[80px_120px_minmax(200px,1fr)_120px_120px_120px_100px] gap-4 pb-3 border-b text-xs text-gray-500 uppercase tracking-wider">
          <div>ID RM</div>
          <div>ID Betterplace</div>
          <div>Empresa</div>
          <div>Estado</div>
          <div>Licencia</div>
          <div>Vence</div>
          <div>Usuarios</div>
        </div>

        {/* Lista de empresas */}
        {companies.map((company) => (
          <button
            key={company.id}
            onClick={() => handleCompanyClick(company)}
            className="w-full text-left hover:bg-gray-50 rounded-lg transition-colors p-3 sm:p-4 border border-gray-100"
          >
            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {company.companyId}
                    </Badge>
                    {getStatusBadge(company.status)}
                  </div>
                  <p className="font-medium text-gray-900 truncate">{company.name}</p>
                  <p className="text-sm text-gray-500 truncate">{company.email}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <div className="flex items-center gap-1 text-gray-600">
                  <UsersIcon className="h-4 w-4" />
                  <span>{company.users.length} usuario{company.users.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">{getLicenseLabel(company.licenseType)}</span>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-[80px_120px_minmax(200px,1fr)_120px_120px_120px_100px] gap-4 items-center">
              <div>
                <Badge variant="outline" className="text-xs">
                  {company.companyId}
                </Badge>
              </div>
              
              <div>
                {company.betterplaceId ? (
                  <span className="text-xs text-gray-600">{company.betterplaceId}</span>
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
              </div>
              
              <div>
                <p className="font-medium text-gray-900 truncate">{company.name}</p>
                <p className="text-sm text-gray-500 truncate">{company.email}</p>
              </div>
              
              <div>
                {getStatusBadge(company.status)}
                {company.status === "trial" && company.trialDays > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{company.trialDays} días restantes</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-900">{getLicenseLabel(company.licenseType)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-900">
                  {company.licenseExpiry ? new Date(company.licenseExpiry).toLocaleDateString('es-ES', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  }) : '-'}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UsersIcon className="h-4 w-4" />
                <span>{company.users.length} usuario{company.users.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  // Vista de detalle de empresa
  if (showCompanyDetail && selectedCompany) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header con botón volver */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              setShowCompanyDetail(false);
              setSelectedCompany(null);
            }}
            className="text-gray-600 hover:text-gray-900 -ml-2"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Volver a empresas</span>
            <span className="sm:hidden">Volver</span>
          </Button>
        </div>

        {/* Información de la empresa */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            {!isEditingCompany ? (
              <>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {selectedCompany.companyId}
                  </Badge>
                  {getStatusBadge(selectedCompany.status)}
                </div>
                
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl sm:text-2xl mb-2">{selectedCompany.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{selectedCompany.email}</span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditCompany}
                    className="text-gray-400 hover:text-gray-600 h-8 w-8 -mt-1"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar empresa</span>
                  </Button>
                </div>
                
                {/* Datos de la empresa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Teléfono</p>
                      <p className="text-sm text-gray-900 truncate">{selectedCompany.phone || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">ID Betterplace</p>
                      <p className="text-sm text-gray-900 truncate">{selectedCompany.betterplaceId || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Fecha de registro</p>
                      <p className="text-sm text-gray-900 truncate">
                        {new Date(selectedCompany.registeredDate).toLocaleDateString('es-ES', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Tipo de licencia</p>
                      <p className="text-sm text-gray-900 truncate">
                        {getLicenseLabel(selectedCompany.licenseType, selectedCompany.status)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {selectedCompany.companyId}
                    </Badge>
                    {getStatusBadge(selectedCompany.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-company-name" className="text-sm">Nombre de la empresa *</Label>
                      <Input
                        id="edit-company-name"
                        value={editCompanyName}
                        onChange={(e) => setEditCompanyName(e.target.value)}
                        placeholder="Nombre de la empresa"
                        className="text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-company-email" className="text-sm">Email de contacto</Label>
                      <Input
                        id="edit-company-email"
                        type="email"
                        value={editCompanyEmail}
                        onChange={(e) => setEditCompanyEmail(e.target.value)}
                        placeholder="contacto@empresa.com"
                        className="text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-company-phone" className="text-sm">Teléfono</Label>
                      <Input
                        id="edit-company-phone"
                        type="tel"
                        value={editCompanyPhone}
                        onChange={(e) => setEditCompanyPhone(e.target.value)}
                        placeholder="+34 600 123 456"
                        className="text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-company-betterplace-id" className="text-sm">ID Betterplace</Label>
                      <Input
                        id="edit-company-betterplace-id"
                        value={editCompanyBetterplaceId}
                        onChange={(e) => setEditCompanyBetterplaceId(e.target.value)}
                        placeholder="BP-2024-XXX"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEditCompany}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveCompanyInfo}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Guardar cambios
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardHeader>
        </Card>

        {/* Gestión de cuenta de la empresa */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Gestión de cuenta</CardTitle>
            <CardDescription className="text-sm">
              Activa días de prueba o licencia para esta empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5">
            {/* Activar Demo */}
            <div className={`p-3 sm:p-4 border rounded-lg transition-all ${demoEnabled ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'}`}>
              <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                  <Gift className={`h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0 ${demoEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Modo Demo</p>
                    <p className="text-xs sm:text-sm text-gray-600">Acceso de prueba gratuito</p>
                  </div>
                </div>
                <Switch
                  checked={demoEnabled}
                  onCheckedChange={(checked) => {
                    setDemoEnabled(checked);
                    if (checked) {
                      setLicenseEnabled(false);
                    }
                  }}
                />
              </div>
              
              <div className="pl-0 sm:pl-8">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="90"
                    value={editTrialDays}
                    onChange={(e) => setEditTrialDays(Number(e.target.value))}
                    className="w-16 sm:w-20 text-center text-sm"
                    placeholder="14"
                    disabled={!demoEnabled}
                  />
                  <span className="text-xs sm:text-sm text-gray-600">días de prueba</span>
                </div>
              </div>
            </div>

            {/* Activar Licencia */}
            <div className={`p-3 sm:p-4 border rounded-lg transition-all ${licenseEnabled ? 'border-green-500 bg-green-50/30' : 'border-gray-200'}`}>
              <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                  <CreditCard className={`h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0 ${licenseEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Licencia activa</p>
                    <p className="text-xs sm:text-sm text-gray-600">Acceso completo de pago</p>
                  </div>
                </div>
                <Switch
                  checked={licenseEnabled}
                  onCheckedChange={(checked) => {
                    setLicenseEnabled(checked);
                    if (checked) {
                      setDemoEnabled(false);
                    }
                  }}
                />
              </div>
              
              {licenseEnabled && (
                <div className="pl-0 sm:pl-8 space-y-3">
                  <div>
                    <Label htmlFor="billing-period" className="text-xs sm:text-sm text-gray-700">Tipo de facturación</Label>
                    <Select value={billingPeriod} onValueChange={(value: 'monthly' | 'permanent') => setBillingPeriod(value)}>
                      <SelectTrigger id="billing-period" className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">TPV Mensual (cancelable)</SelectItem>
                        <SelectItem value="permanent">Permanencia (pago anticipado)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {billingPeriod === 'permanent' && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <Label htmlFor="start-date" className="text-xs sm:text-sm text-gray-700">Fecha inicio</Label>
                        <Input
                          id="start-date"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-date" className="text-xs sm:text-sm text-gray-700">Fecha fin</Label>
                        <Input
                          id="end-date"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteCompanyConfirm(true)}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar empresa
                </Button>
                
                {(selectedCompany.status === 'active' || selectedCompany.status === 'unpaid') && (
                  <Button
                    variant={selectedCompany.status === 'unpaid' ? 'outline' : 'outline'}
                    onClick={handleMarkAsUnpaid}
                    size="sm"
                    className={`w-full sm:w-auto ${selectedCompany.status === 'unpaid' ? '' : 'border-orange-500 text-orange-600 hover:bg-orange-50'}`}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{selectedCompany.status === 'unpaid' ? 'Quitar impago' : 'Marcar como impago'}</span>
                    <span className="sm:hidden">{selectedCompany.status === 'unpaid' ? 'Quitar impago' : 'Impago'}</span>
                  </Button>
                )}
              </div>
              
              <Button
                onClick={handleSaveCompanyChanges}
                size="sm"
                className="w-full sm:w-auto"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Guardar cambios
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usuarios de la empresa */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg sm:text-xl">Usuarios de la empresa</CardTitle>
                <CardDescription className="text-sm">
                  Gestiona los usuarios con acceso
                </CardDescription>
              </div>
              <Button onClick={() => setShowCreateUserDialog(true)} size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Añadir usuario
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {selectedCompany.users.length === 0 ? (
              <div className="text-center py-8 sm:py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <UsersIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-gray-500 mb-4">No hay usuarios en esta empresa</p>
                <Button onClick={() => setShowCreateUserDialog(true)} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primer usuario
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedCompany.users.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{user.name}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{user.phone}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{user.conversationsCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{user.leadsCount} leads</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <UsersIcon className="h-3 w-3" />
                            <span>{user.contactsCount} contactos</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendCredentials(user)}
                          className="text-xs"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Credenciales</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="text-xs"
                        >
                          <Pencil className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Editar</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                          className="text-xs"
                        >
                          <Trash2 className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Eliminar</span>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Toggles para funcionalidades */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-3 border-t">
                      <div className="flex items-center gap-3 flex-1">
                        <Switch
                          checked={user.hasAlerts}
                          onCheckedChange={(checked) => handleAlertsToggleClick(user.id, checked)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-700 truncate">Sistema de alertas</p>
                          <p className="text-xs text-gray-500 hidden sm:block">Notificaciones avanzadas</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 flex-1">
                        <Switch
                          checked={user.hasWebsite}
                          onCheckedChange={(checked) => handleWebsiteToggleClick(user.id, checked)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-700 truncate">Página web</p>
                          <p className="text-xs text-gray-500 hidden sm:block">Sitio web generado</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog: Crear usuario */}
        <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
          <DialogContent className="max-w-[95vw] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Añadir usuario a {selectedCompany.name}</DialogTitle>
              <DialogDescription className="text-sm">
                Crea un nuevo usuario para esta empresa. El usuario heredará el estado y la licencia de la empresa.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="user-name" className="text-sm">Nombre completo *</Label>
                <Input
                  id="user-name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="user-email" className="text-sm">Email *</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="juan@empresa.com"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="user-phone" className="text-sm">Teléfono *</Label>
                <Input
                  id="user-phone"
                  type="tel"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="+34 600 123 456"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="user-password" className="text-sm">Contraseña (opcional)</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      id="user-password"
                      type={showPassword ? "text" : "password"}
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Se generará automáticamente"
                      className="text-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewUserPassword(generatePassword())}
                    size="sm"
                    className="text-sm"
                  >
                    Generar
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Si no especificas una contraseña, se generará una automáticamente
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setShowCreateUserDialog(false)} size="sm" className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button onClick={handleCreateUser} size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Crear usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Editar usuario */}
        <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
          <DialogContent className="max-w-[95vw] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Editar usuario</DialogTitle>
              <DialogDescription className="text-sm">
                Modifica los datos de contacto del usuario. Los cambios se guardarán inmediatamente.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-user-name" className="text-sm">Nombre completo *</Label>
                <Input
                  id="edit-user-name"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-user-email" className="text-sm">Email *</Label>
                <Input
                  id="edit-user-email"
                  type="email"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  placeholder="juan@empresa.com"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-user-phone" className="text-sm">Teléfono *</Label>
                <Input
                  id="edit-user-phone"
                  type="tel"
                  value={editUserPhone}
                  onChange={(e) => setEditUserPhone(e.target.value)}
                  placeholder="+34 600 123 456"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-user-password" className="text-sm">Nueva contraseña (opcional)</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      id="edit-user-password"
                      type={showEditPassword ? "text" : "password"}
                      value={editUserPassword}
                      onChange={(e) => setEditUserPassword(e.target.value)}
                      placeholder="Dejar vacío para no cambiar"
                      className="text-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                    >
                      {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditUserPassword(generatePassword())}
                    size="sm"
                    className="text-sm"
                  >
                    Generar
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Deja este campo vacío si no quieres cambiar la contraseña
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setShowEditUserDialog(false)} size="sm" className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button onClick={confirmEditUser} size="sm" className="w-full sm:w-auto">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alert Dialog: Eliminar usuario */}
        <AlertDialog open={showDeleteUserDialog} onOpenChange={setShowDeleteUserDialog}>
          <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg">¿Eliminar usuario?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Esta acción no se puede deshacer. El usuario {userToDelete?.name} será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto m-0">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700 w-full sm:w-auto m-0">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Alert Dialog: Marcar como impago */}
        <AlertDialog open={showUnpaidDialog} onOpenChange={setShowUnpaidDialog}>
          <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg">¿Marcar como impago?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Esta acción marcará a la empresa {selectedCompany?.name} como impago. ¿Estás seguro?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto m-0">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmMarkAsUnpaid} className="bg-red-600 hover:bg-red-700 w-full sm:w-auto m-0">
                Marcar como impago
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Alert Dialog: Quitar impago */}
        <AlertDialog open={showRemoveUnpaidDialog} onOpenChange={setShowRemoveUnpaidDialog}>
          <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg">¿Quitar estado de impago?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Esta acción eliminará el estado de impago de la empresa {selectedCompany?.name} y la marcará como inactiva. ¿Deseas continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto m-0">Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmRemoveUnpaid} 
                style={{ backgroundColor: '#e7af2a' }}
                className="hover:opacity-90 w-full sm:w-auto m-0"
              >
                Quitar impago
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Alert Dialog: Confirmar cambio de Sistema de alertas */}
        <AlertDialog open={showAlertsConfirmDialog} onOpenChange={setShowAlertsConfirmDialog}>
          <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg">
                {pendingAlertsChange?.value ? '¿Activar sistema de alertas?' : '¿Desactivar sistema de alertas?'}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                {pendingAlertsChange?.value 
                  ? 'Esta acción activará el sistema de notificaciones avanzadas para este usuario. Las alertas comenzarán a enviarse inmediatamente.'
                  : 'Esta acción desactivará todas las notificaciones avanzadas para este usuario. No recibirá alertas automáticas.'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto m-0">Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmAlertsToggle} 
                className="bg-[#e7af2a] hover:bg-[#d09a1f] w-full sm:w-auto m-0"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Alert Dialog: Confirmar cambio de Página web */}
        <AlertDialog open={showWebsiteConfirmDialog} onOpenChange={setShowWebsiteConfirmDialog}>
          <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg">
                {pendingWebsiteChange?.value ? '¿Activar página web?' : '¿Desactivar página web?'}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                {pendingWebsiteChange?.value 
                  ? 'Esta acción activará el sitio web generado automáticamente para este usuario. La página estará disponible públicamente.'
                  : 'Esta acción desactivará el sitio web del usuario. La página dejará de estar disponible públicamente.'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto m-0">Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmWebsiteToggle} 
                className="bg-[#e7af2a] hover:bg-[#d09a1f] w-full sm:w-auto m-0"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Vista principal de empresas
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      {onBackToSettings && (
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBackToSettings}
            className="md:hidden text-gray-600 hover:text-gray-900 -ml-2"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Configuración
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl">Panel de Administración</h1>
          <p className="text-gray-600 mt-1">
            Gestiona empresas, licencias y estadísticas
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <Button onClick={() => setShowCreateCompanyDialog(true)} className="w-full sm:w-auto" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva empresa
          </Button>
        </div>
      </div>

      {/* Lista de empresas con tabs */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6 px-3 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Empresas registradas</CardTitle>
          <CardDescription className="hidden sm:block text-sm">
            Haz clic en una empresa para ver detalles y gestionar sus usuarios
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Selector móvil - Minimalista con Select */}
            <div className="sm:hidden mb-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {activeTab === "demo" && `Demo (${getFilteredCompanies("demo").length})`}
                    {activeTab === "clients" && `Clientes activos (${getFilteredCompanies("clients").length})`}
                    {activeTab === "incomplete" && `Incompletos (${getFilteredCompanies("incomplete").length})`}
                    {activeTab === "unpaid" && `Impagos (${getFilteredCompanies("unpaid").length})`}
                    {activeTab === "lost" && `Perdidos (${getFilteredCompanies("lost").length})`}
                    {activeTab === "inactive" && `Dados de baja (${getFilteredCompanies("inactive").length})`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span>Demo</span>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">
                        {getFilteredCompanies("demo").length}
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="clients">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span>Clientes activos</span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                        {getFilteredCompanies("clients").length}
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="incomplete">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span>Incompletos</span>
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">
                        {getFilteredCompanies("incomplete").length}
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="unpaid">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span>Impagos</span>
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                        {getFilteredCompanies("unpaid").length}
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="lost">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span>Perdidos</span>
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs">
                        {getFilteredCompanies("lost").length}
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span>Dados de baja</span>
                      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs">
                        {getFilteredCompanies("inactive").length}
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs desktop - Mejorado con mejor espaciado */}
            <TabsList className="hidden sm:grid w-full grid-cols-6 mb-6 h-auto">
              <TabsTrigger value="demo" className="flex-col py-2.5 gap-1">
                <span>Demo</span>
                {getFilteredCompanies("demo").length > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs px-2 py-0.5">
                    {getFilteredCompanies("demo").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex-col py-2.5 gap-1">
                <span>Clientes</span>
                {getFilteredCompanies("clients").length > 0 && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-0.5">
                    {getFilteredCompanies("clients").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="incomplete" className="flex-col py-2.5 gap-1">
                <span>Incompletos</span>
                {getFilteredCompanies("incomplete").length > 0 && (
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs px-2 py-0.5">
                    {getFilteredCompanies("incomplete").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unpaid" className="flex-col py-2.5 gap-1">
                <span>Impagos</span>
                {getFilteredCompanies("unpaid").length > 0 && (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs px-2 py-0.5">
                    {getFilteredCompanies("unpaid").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="lost" className="flex-col py-2.5 gap-1">
                <span>Perdidos</span>
                {getFilteredCompanies("lost").length > 0 && (
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs px-2 py-0.5">
                    {getFilteredCompanies("lost").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="inactive" className="flex-col py-2.5 gap-1">
                <span>Dados de baja</span>
                {getFilteredCompanies("inactive").length > 0 && (
                  <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs px-2 py-0.5">
                    {getFilteredCompanies("inactive").length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="demo">
              <CompaniesList companies={getFilteredCompanies("demo")} />
            </TabsContent>

            <TabsContent value="clients">
              <CompaniesList companies={getFilteredCompanies("clients")} />
            </TabsContent>

            <TabsContent value="incomplete">
              <CompaniesList companies={getFilteredCompanies("incomplete")} />
            </TabsContent>

            <TabsContent value="unpaid">
              <CompaniesList companies={getFilteredCompanies("unpaid")} />
            </TabsContent>

            <TabsContent value="lost">
              <CompaniesList companies={getFilteredCompanies("lost")} />
            </TabsContent>

            <TabsContent value="inactive">
              <CompaniesList companies={getFilteredCompanies("inactive")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog: Crear empresa */}
      <Dialog open={showCreateCompanyDialog} onOpenChange={setShowCreateCompanyDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Crear nueva empresa</DialogTitle>
            <DialogDescription className="text-sm">
              Añade una nueva empresa al sistema. Podrás agregar usuarios después.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="company-name" className="text-sm">Nombre de la empresa *</Label>
              <Input
                id="company-name"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Ej: Inmobiliaria García"
                className="text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="company-email" className="text-sm">Email de contacto</Label>
              <Input
                id="company-email"
                type="email"
                value={newCompanyEmail}
                onChange={(e) => setNewCompanyEmail(e.target.value)}
                placeholder="contacto@empresa.com"
                className="text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="company-phone" className="text-sm">Teléfono</Label>
              <Input
                id="company-phone"
                type="tel"
                value={newCompanyPhone}
                onChange={(e) => setNewCompanyPhone(e.target.value)}
                placeholder="+34 600 123 456"
                className="text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="company-betterplace-id" className="text-sm">ID Betterplace (opcional)</Label>
              <Input
                id="company-betterplace-id"
                type="text"
                value={newCompanyBetterplaceId}
                onChange={(e) => setNewCompanyBetterplaceId(e.target.value)}
                placeholder="BP-2024-XXX"
                className="text-sm"
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs sm:text-sm text-blue-900">
                Se generará automáticamente un ID único para esta empresa (ej: RM-007)
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowCreateCompanyDialog(false)} size="sm" className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button onClick={handleCreateCompany} size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Crear empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog: Eliminar empresa */}
      <AlertDialog open={showDeleteCompanyDialog} onOpenChange={setShowDeleteCompanyDialog}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">¿Eliminar empresa?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Esta acción no se puede deshacer. La empresa {companyToDelete?.name} y todos sus usuarios ({companyToDelete?.users.length}) serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto m-0">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCompany} className="bg-red-600 hover:bg-red-700 w-full sm:w-auto m-0">
              Eliminar empresa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmación para eliminar empresa desde detalles */}
      <AlertDialog open={showDeleteCompanyConfirm} onOpenChange={setShowDeleteCompanyConfirm}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">¿Estás seguro de eliminar esta empresa?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Esta acción no se puede deshacer. La empresa {selectedCompany?.name} y todos sus {selectedCompany?.users.length} usuario(s) serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto m-0">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (selectedCompany) {
                  handleDeleteCompany(selectedCompany);
                  setShowDeleteCompanyConfirm(false);
                }
              }} 
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto m-0"
            >
              Eliminar empresa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
