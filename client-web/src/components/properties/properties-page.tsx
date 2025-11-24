import { useState, useEffect } from 'react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { AddPropertyByLinkDialog } from "./add-property-by-link-dialog";
import { AddPropertyManualDialog } from "./add-property-manual-dialog";
import { useIsMobile } from "../ui/use-mobile";
import {
  Search,
  RefreshCw,
  Home,
  Bed,
  Bath,
  Maximize,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  Plus,
  Check,
  Link as LinkIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  FileEdit,
  XCircle,
  Eye,
  EyeOff,
  Users,
  Ban,
  CheckCheck,
  Key,
  Bookmark,
  Sparkles
} from "lucide-react";
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';
import { AddPropertyForm } from './add-property-form';
import { PropertyDetail } from './property-detail';
import { MOCK_PROPERTIES, type Property } from '../../utils/properties-data';
import IconHistoricoLogoMobile from '../../imports/IconHistoricoLogoMobile';
import { SwipeableImageCarousel } from './swipeable-image-carousel';

interface SyncResult {
  newProperties: number;
  updatedProperties: number;
  statusChanges: number;
  photoUpdates: number;
  connectedPlatform: 'idealista' | 'fotocasa' | 'crm';
}

// Usar las propiedades globales del sistema desde properties-data.ts
const mockProperties: Property[] = MOCK_PROPERTIES;

// Mantener código antiguo comentado temporalmente
const _DEPRECATED_oldMockProperties = [
  {
    id: '1',
    title: 'Apartamento moderno en el centro',
    price: 350000,
    pricePerM2: 3500,
    constructedArea: 100,
    usableArea: 85,
    bedrooms: 3,
    bathrooms: 2,
    floor: '3º',
    location: 'Centro, Madrid',
    yearBuilt: 2020,
    condition: 'new',
    orientation: 'Sur',
    energyCertification: 'B',
    hasElevator: true,
    hasAirConditioning: true,
    hasHeating: true,
    heatingType: 'Gas natural',
    hasParking: true,
    hasBuiltInWardrobes: true,
    description: 'Moderno apartamento completamente reformado en el corazón de Madrid. Cuenta con acabados de primera calidad, cocina totalmente equipada y amplios espacios luminosos. Ubicado en una zona privilegiada con todos los servicios a mano.',
    socialLinks: {
      instagram: 'https://www.instagram.com/reel/ejemplo1'
    },
    images: [
      'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIzODUyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'available',
    propertyType: 'apartment',
    operation: 'sale',
    updatedAt: '2025-01-15',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800498/',
    idealistaStats: {
      views: 1248,
      contacts: 37,
      favorites: 89
    },
    interestedCount: 5,
    interestedLeads: [
      {
        id: 'lead1',
        name: 'Carlos Martínez',
        phone: '+34 654 321 987',
        email: 'carlos.m@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjI5NDk2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-10',
        qualification: 85,
        source: 'whatsapp'
      },
      {
        id: 'lead2',
        name: 'Laura Sánchez',
        phone: '+34 678 234 567',
        email: 'laura.sanchez@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1580643735948-c52d25d9c07d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzMDQ0NDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-09',
        qualification: 75,
        source: 'instagram'
      },
      {
        id: 'lead3',
        name: 'Miguel Rodríguez',
        phone: '+34 612 345 678',
        avatarUrl: 'https://images.unsplash.com/photo-1762753674498-73ec49feafc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc2Mjk2MTQ2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-08',
        qualification: 60,
        source: 'messenger'
      },
      {
        id: 'lead4',
        name: 'Ana García',
        phone: '+34 698 765 432',
        email: 'ana.garcia@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbnxlbnwxfHx8fDE3NjI5NDM2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-07',
        qualification: 50,
        source: 'tiktok'
      },
      {
        id: 'lead5',
        name: 'Javier López',
        phone: '+34 645 876 234',
        avatarUrl: 'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc2MjkzNDQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-05',
        qualification: 40,
        source: 'whatsapp'
      }
    ]
  },
  {
    id: '2',
    title: 'Casa de lujo con jardín',
    price: 750000,
    pricePerM2: 3000,
    constructedArea: 250,
    usableArea: 230,
    bedrooms: 4,
    bathrooms: 3,
    location: 'Pozuelo de Alarcón, Madrid',
    yearBuilt: 2015,
    condition: 'good',
    orientation: 'Oeste',
    energyCertification: 'C',
    hasElevator: false,
    hasAirConditioning: true,
    hasHeating: true,
    heatingType: 'Aerotermia',
    hasParking: true,
    hasStorage: true,
    hasGarden: true,
    hasPool: true,
    hasBuiltInWardrobes: true,
    isFurnished: false,
    description: 'Espectacular casa de lujo con amplio jardín y piscina privada. Distribuida en dos plantas, cuenta con espacios amplios y luminosos, cocina de diseño totalmente equipada y zona de barbacoa exterior. Perfecta para familias.',
    socialLinks: {
      youtube: 'https://www.youtube.com/watch?v=ejemplo2'
    },
    images: [
      'https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjM0MjAyOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'sold',
    propertyType: 'house',
    operation: 'sale',
    updatedAt: '2025-01-14',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800499/',
    idealistaStats: {
      views: 3567,
      contacts: 142,
      favorites: 256
    },
    interestedCount: 25,
    interestedLeads: [
      {
        id: 'lead6',
        name: 'Roberto Fernández',
        phone: '+34 667 543 210',
        email: 'roberto.f@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1524538198441-241ff79d153b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbnxlbnwxfHx8fDE3NjMwMDIxMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-11',
        qualification: 90,
        source: 'instagram'
      },
      {
        id: 'lead7',
        name: 'Patricia Ruiz',
        phone: '+34 689 123 456',
        email: 'patricia.ruiz@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc3dvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MzA0NDQ1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-11',
        qualification: 85,
        source: 'messenger'
      },
      {
        id: 'lead8',
        name: 'Fernando Díaz',
        phone: '+34 654 987 321',
        avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjI5NDk2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-10',
        qualification: 80,
        source: 'tiktok'
      },
      {
        id: 'lead9',
        name: 'Carmen Morales',
        phone: '+34 678 456 789',
        email: 'carmen.m@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1661955571743-583dbaa19c58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2Mjk4NTI2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-09',
        qualification: 75,
        source: 'whatsapp'
      },
      {
        id: 'lead10',
        name: 'David Torres',
        phone: '+34 612 789 456',
        avatarUrl: 'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc2MjkzNDQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-08',
        qualification: 70,
        source: 'instagram'
      },
      {
        id: 'lead11',
        name: 'Isabel Jiménez',
        phone: '+34 698 321 654',
        email: 'isabel.j@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1758518732130-4b51da74b0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzMDM5NjI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-07',
        qualification: 65,
        source: 'whatsapp'
      },
      {
        id: 'lead12',
        name: 'Antonio Navarro',
        phone: '+34 645 234 567',
        avatarUrl: 'https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzYyOTkyODI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-06',
        qualification: 60,
        source: 'instagram'
      },
      {
        id: 'lead13',
        name: 'Elena Castro',
        phone: '+34 687 654 321',
        avatarUrl: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2Mjk0OTg1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-05',
        qualification: 55,
        source: 'messenger'
      },
      {
        id: 'lead14',
        name: 'Jorge Ramos',
        phone: '+34 656 789 123',
        avatarUrl: 'https://images.unsplash.com/photo-1624835567150-0c530a20d8cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2Mjk0NDA0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-04',
        qualification: 50,
        source: 'whatsapp'
      },
      {
        id: 'lead15',
        name: 'Silvia Ortega',
        phone: '+34 691 456 789',
        email: 'silvia.o@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBwcm9mZXNzaW9uYWwlMjB3b21hbnxlbnwxfHx8fDE3NjMwMzk2NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-03',
        qualification: 45,
        source: 'tiktok'
      },
      {
        id: 'lead16',
        name: 'Manuel Serrano',
        phone: '+34 623 567 890',
        avatarUrl: 'https://images.unsplash.com/photo-1543132220-e7fef0b974e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGJ1c2luZXNzbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzMDM5NjY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-02',
        qualification: 40,
        source: 'instagram'
      },
      {
        id: 'lead17',
        name: 'Rosa Delgado',
        phone: '+34 679 890 123',
        avatarUrl: 'https://images.unsplash.com/photo-1675663351050-89949e051c38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBleGVjdXRpdmUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjMwMjY3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-01',
        qualification: 35,
        source: 'whatsapp'
      },
      {
        id: 'lead21',
        name: 'Pedro Alonso',
        phone: '+34 665 432 109',
        email: 'pedro.alonso@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzYyOTY3NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-10-31',
        qualification: 82,
        source: 'messenger'
      },
      {
        id: 'lead22',
        name: 'Marta Sánchez',
        phone: '+34 677 543 210',
        email: 'marta.s@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1610896011476-300d6239d995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwc21pbGluZ3xlbnwxfHx8fDE3NjMwMTA0OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-10-30',
        qualification: 78,
        source: 'whatsapp'
      },
      {
        id: 'lead23',
        name: 'Javier López',
        phone: '+34 688 654 321',
        avatarUrl: 'https://images.unsplash.com/photo-1629773479797-438cfc9b1ee4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBjYXN1YWx8ZW58MXx8fHwxNzYzMDM1ODAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-10-29',
        qualification: 73,
        source: 'tiktok'
      },
      {
        id: 'lead24',
        name: 'Laura Hernández',
        phone: '+34 699 765 432',
        email: 'laura.h@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1760551733698-8e4a497d40d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI5OTI5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-10-28',
        qualification: 68,
        source: 'instagram'
      },
      {
        id: 'lead25',
        name: 'Miguel Ángel Pérez',
        phone: '+34 610 876 543',
        lastContact: '2025-10-27',
        qualification: 63
      },
      {
        id: 'lead26',
        name: 'Sandra García',
        phone: '+34 621 987 654',
        email: 'sandra.g@email.com',
        lastContact: '2025-10-26',
        qualification: 58
      },
      {
        id: 'lead27',
        name: 'Raúl Martín',
        phone: '+34 632 098 765',
        lastContact: '2025-10-25',
        qualification: 53
      },
      {
        id: 'lead28',
        name: 'Natalia Rodríguez',
        phone: '+34 643 109 876',
        email: 'natalia.r@email.com',
        lastContact: '2025-10-24',
        qualification: 48
      },
      {
        id: 'lead29',
        name: 'Óscar Gómez',
        phone: '+34 654 210 987',
        lastContact: '2025-10-23',
        qualification: 43
      },
      {
        id: 'lead30',
        name: 'Verónica Muñoz',
        phone: '+34 665 321 098',
        email: 'veronica.m@email.com',
        lastContact: '2025-10-22',
        qualification: 38
      },
      {
        id: 'lead31',
        name: 'Alberto Romero',
        phone: '+34 676 432 109',
        lastContact: '2025-10-21',
        qualification: 72
      },
      {
        id: 'lead32',
        name: 'Julia Iglesias',
        phone: '+34 687 543 210',
        email: 'julia.i@email.com',
        lastContact: '2025-10-20',
        qualification: 66
      },
      {
        id: 'lead33',
        name: 'Francisco Blanco',
        phone: '+34 698 654 321',
        lastContact: '2025-10-19',
        qualification: 61
      }
    ]
  },
  {
    id: '3',
    title: 'Piso contemporáneo con vistas',
    price: 425000,
    pricePerM2: 4250,
    constructedArea: 100,
    usableArea: 88,
    bedrooms: 2,
    bathrooms: 2,
    floor: '8º',
    location: 'Salamanca, Madrid',
    yearBuilt: 2018,
    condition: 'good',
    orientation: 'Este',
    energyCertification: 'A',
    hasElevator: true,
    hasAirConditioning: true,
    hasHeating: true,
    heatingType: 'Centralizado',
    hasParking: false,
    hasTerrace: true,
    hasBuiltInWardrobes: true,
    description: 'Piso contemporáneo en el exclusivo barrio de Salamanca. Destaca por sus increíbles vistas y su distribución funcional. Incluye terraza de 15m², acabados de alta gama y excelentes calidades.',
    images: [
      'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBjb25kbyUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzYyNDI4MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'unavailable',
    propertyType: 'condo',
    operation: 'sale',
    updatedAt: '2025-01-13',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800500/',
    idealistaStats: {
      views: 892,
      contacts: 24,
      favorites: 47
    },
    interestedCount: 3,
    interestedLeads: [
      {
        id: 'lead18',
        name: 'Beatriz Vega',
        phone: '+34 634 567 890',
        email: 'beatriz.v@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1745434159123-4908d0b9df94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzYyOTY4MjgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-09',
        qualification: 70,
        source: 'whatsapp'
      },
      {
        id: 'lead19',
        name: 'Alberto Ramírez',
        phone: '+34 687 234 567',
        avatarUrl: 'https://images.unsplash.com/photo-1758599543129-f12d83d5dbae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbiUyMGNvbmZpZGVudHxlbnwxfHx8fDE3NjI5Mzc1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-07',
        qualification: 55,
        source: 'messenger'
      },
      {
        id: 'lead20',
        name: 'Cristina Molina',
        phone: '+34 656 345 678',
        email: 'cristina.m@email.com',
        avatarUrl: 'https://images.unsplash.com/photo-1522206038088-8698bcefa6a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MzAyMTk1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        lastContact: '2025-11-05',
        qualification: 45,
        source: 'instagram'
      }
    ]
  },
  {
    id: '4',
    title: 'Ático exclusivo con terraza',
    price: 890000,
    pricePerM2: 6714,
    constructedArea: 132,
    usableArea: 115,
    bedrooms: 3,
    bathrooms: 2,
    floor: 'Ático',
    location: 'Chamberí, Madrid',
    yearBuilt: 2019,
    condition: 'new',
    orientation: 'Norte-Sur',
    energyCertification: 'A',
    hasElevator: true,
    hasAirConditioning: true,
    hasHeating: true,
    heatingType: 'Radiante',
    hasParking: true,
    hasStorage: true,
    hasTerrace: true,
    hasBuiltInWardrobes: true,
    isFurnished: true,
    description: 'Exclusivo ático de lujo con espectacular terraza de 50m². Totalmente amueblado con diseño de interiores de alta gama. Vistas panorámicas de Madrid, domótica y climatización por suelo radiante. Una joya única en Chamberí.',
    socialLinks: {
      instagram: 'https://www.instagram.com/reel/ejemplo3',
      tiktok: 'https://www.tiktok.com/@ejemplo/video3'
    },
    images: [
      'https://images.unsplash.com/photo-1707075108813-edefd7b3308d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaGZyb250JTIwcHJvcGVydHl8ZW58MXx8fHwxNzYyMzQ1OTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'available',
    propertyType: 'penthouse',
    operation: 'sale',
    updatedAt: '2025-01-15',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800501/',
    idealistaStats: {
      views: 2145,
      contacts: 78,
      favorites: 134
    }
  },
  {
    id: '5',
    title: 'Estudio minimalista céntrico',
    price: 900,
    pricePerM2: 22.5,
    constructedArea: 40,
    usableArea: 38,
    bedrooms: 1,
    bathrooms: 1,
    floor: '2º',
    location: 'Malasaña, Madrid',
    yearBuilt: 2021,
    condition: 'new',
    energyCertification: 'B',
    hasElevator: true,
    hasAirConditioning: true,
    hasHeating: true,
    heatingType: 'Eléctrica',
    hasBuiltInWardrobes: true,
    isFurnished: true,
    description: 'Acogedor estudio totalmente amueblado en el vibrante barrio de Malasaña. Perfecto para jóvenes profesionales o estudiantes. Incluye todos los servicios y electrodomésticos.',
    images: [
      'https://images.unsplash.com/photo-1702014861449-202805baa272?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIzMzc3NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'available',
    propertyType: 'studio',
    operation: 'rent',
    updatedAt: '2025-01-14',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800502/',
    idealistaStats: {
      views: 567,
      contacts: 19,
      favorites: 32
    }
  },
  {
    id: '6',
    title: 'Dúplex espacioso con garaje',
    price: 1650,
    pricePerM2: 11,
    constructedArea: 150,
    usableArea: 140,
    bedrooms: 4,
    bathrooms: 3,
    location: 'Arganzuela, Madrid',
    images: [
      'https://images.unsplash.com/photo-1720378042263-bd1a33156bbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdXBsZXglMjBhcGFydG1lbnR8ZW58MXx8fHwxNzYyMzQyMDI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'unavailable',
    propertyType: 'duplex',
    operation: 'rent',
    updatedAt: '2025-01-13',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800503/',
    idealistaStats: {
      views: 1423,
      contacts: 45,
      favorites: 89
    }
  },
  {
    id: '7',
    title: 'Villa mediterránea con piscina',
    price: 1250000,
    pricePerM2: 4166,
    constructedArea: 300,
    usableArea: 280,
    bedrooms: 5,
    bathrooms: 4,
    location: 'La Moraleja, Madrid',
    images: [
      'https://images.unsplash.com/photo-1679364297777-1db77b6199be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjQyNjcwNHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'available',
    propertyType: 'house',
    operation: 'sale',
    updatedAt: '2025-01-12',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800504/',
    idealistaStats: {
      views: 4231,
      contacts: 156,
      favorites: 298
    }
  },
  {
    id: '8',
    title: 'Adosado con jardín privado',
    price: 485000,
    pricePerM2: 2695,
    constructedArea: 180,
    usableArea: 165,
    bedrooms: 4,
    bathrooms: 3,
    location: 'Las Rozas, Madrid',
    images: [
      'https://images.unsplash.com/photo-1630895600125-6511bfc8fa7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3duaG91c2UlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzYyNDIzNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'unavailable',
    propertyType: 'house',
    operation: 'sale',
    updatedAt: '2025-01-10',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800505/',
    idealistaStats: {
      views: 1789,
      contacts: 62,
      favorites: 112
    }
  },
  {
    id: '9',
    title: 'Loft industrial renovado',
    price: 395000,
    pricePerM2: 4388,
    constructedArea: 90,
    usableArea: 82,
    bedrooms: 2,
    bathrooms: 1,
    location: 'Lavapiés, Madrid',
    images: [
      'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2Z0JTIwYXBhcnRtZW50fGVufDF8fHx8MTc2MjQyOTYyNXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'unavailable',
    propertyType: 'apartment',
    operation: 'sale',
    updatedAt: '2025-01-11',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800506/',
    idealistaStats: {
      views: 654,
      contacts: 18,
      favorites: 41
    }
  },
  {
    id: '10',
    title: 'Chalé rústico en las afueras',
    price: 620000,
    pricePerM2: 2818,
    constructedArea: 220,
    usableArea: 200,
    bedrooms: 5,
    bathrooms: 3,
    location: 'San Lorenzo de El Escorial, Madrid',
    images: [
      'https://images.unsplash.com/photo-1697299261580-876d107bf090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VudHJ5JTIwaG91c2V8ZW58MXx8fHwxNzYyNDI5NjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'available',
    propertyType: 'house',
    operation: 'sale',
    updatedAt: '2025-01-09',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800507/',
    idealistaStats: {
      views: 2876,
      contacts: 89,
      favorites: 187
    }
  },
  {
    id: '11',
    title: 'Apartamento en primera línea de playa',
    price: 680000,
    pricePerM2: 6181,
    constructedArea: 110,
    usableArea: 98,
    bedrooms: 3,
    bathrooms: 2,
    location: 'Retiro, Madrid',
    images: [
      'https://images.unsplash.com/photo-1707075108813-edefd7b3308d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaGZyb250JTIwcHJvcGVydHl8ZW58MXx8fHwxNzYyMzQ1OTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'available',
    propertyType: 'apartment',
    operation: 'sale',
    updatedAt: '2025-01-08',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800508/',
    idealistaStats: {
      views: 3421,
      contacts: 124,
      favorites: 245
    }
  },
  {
    id: '12',
    title: 'Chalé de montaña con vistas',
    price: 810000,
    pricePerM2: 4050,
    size: 200,
    bedrooms: 4,
    bathrooms: 3,
    location: 'Navacerrada, Madrid',
    images: [
      'https://images.unsplash.com/photo-1707926959464-2d8c54e7f70c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGNoYWxldHxlbnwxfHx8fDE3NjIzNTg1ODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'available',
    propertyType: 'house',
    operation: 'sale',
    updatedAt: '2025-01-07',
    idealistaUrl: 'https://www.idealista.com/inmueble/109800509/',
    idealistaStats: {
      views: 1987,
      contacts: 73,
      favorites: 156
    }
  },
  {
    id: '13',
    title: 'Piso luminoso con balcón',
    price: 310000,
    pricePerM2: 3875,
    size: 80,
    bedrooms: 2,
    bathrooms: 1,
    location: 'Tetuán, Madrid',
    images: [
      'https://images.unsplash.com/photo-1652676229684-3b89be489c73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYXBhcnRtZW50JTIwYmFsY29ueXxlbnwxfHx8fDE3NjI0Mjk2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
    ],
    status: 'available',
    propertyType: 'apartment',
    operation: 'sale',
    updatedAt: '2025-01-06'
  }
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Helper para obtener el nombre del estado
const getStatusLabel = (status: Property['status']) => {
  const labels = {
    available: 'Disponible',
    unavailable: 'No disponible',
    sold: 'Vendida',
    rented: 'Alquilada',
    reserved: 'Reservada'
  };
  return labels[status] || status;
};

// Componente para la banda diagonal de estado en las fotos
// Banda de estado en esquina - complementaria al botón de estado
interface StatusCornerRibbonProps {
  status: Property['status'];
  size?: 'small' | 'large';
}

function StatusCornerRibbon({ status, size = 'small' }: StatusCornerRibbonProps) {
  const ribbonConfig = {
    unavailable: { 
      label: 'No disponible', 
      bgColor: 'bg-gray-600'
    },
    sold: { 
      label: 'Vendida', 
      bgColor: 'bg-red-600'
    },
    rented: { 
      label: 'Alquilada', 
      bgColor: 'bg-orange-600'
    },
    reserved: { 
      label: 'Reservada', 
      bgColor: 'bg-yellow-600'
    }
  };
  
  // Solo mostrar si NO está disponible
  if (status === 'available') {
    return null;
  }
  
  const config = ribbonConfig[status];
  
  // Configuración según tamaño
  const sizeConfig = size === 'large' 
    ? {
        containerClass: 'w-40 h-40',
        width: '200px',
        padding: '12px 0',
        top: '30px',
        left: '-50px',
        fontSize: '14px',
        letterSpacing: '1px'
      }
    : {
        containerClass: 'w-28 h-28',
        width: '140px',
        padding: '8px 0',
        top: '20px',
        left: '-35px',
        fontSize: '11px',
        letterSpacing: '0.5px'
      };
  
  return (
    <div className={`absolute top-0 left-0 ${sizeConfig.containerClass} overflow-hidden pointer-events-none z-20`}>
      <div 
        className={`${config.bgColor} text-white absolute shadow-lg`}
        style={{
          width: sizeConfig.width,
          padding: sizeConfig.padding,
          top: sizeConfig.top,
          left: sizeConfig.left,
          textAlign: 'center',
          transform: 'rotate(-45deg)',
          fontWeight: '600',
          letterSpacing: sizeConfig.letterSpacing,
          fontSize: sizeConfig.fontSize
        }}
      >
        {config.label.toUpperCase()}
      </div>
    </div>
  );
}

// Componente interactivo para el badge de estado
interface StatusBadgeProps {
  property: Property;
  onStatusChange: (propertyId: string, newStatus: Property['status']) => void;
}

function StatusBadge({ property, onStatusChange }: StatusBadgeProps) {
  const [open, setOpen] = useState(false);
  
  const statusConfig = {
    available: { 
      label: 'Disponible', 
      className: 'bg-green-50 text-green-700 border-green-200',
      icon: Eye,
      description: 'El asistente mostrará esta propiedad a los clientes'
    },
    unavailable: { 
      label: 'No disponible', 
      className: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: EyeOff,
      description: 'El asistente no mostrará esta propiedad'
    },
    sold: { 
      label: 'Vendida', 
      className: 'bg-red-50 text-red-600 border-red-300',
      icon: CheckCheck,
      description: 'El asistente informará que ya está vendida'
    },
    rented: { 
      label: 'Alquilada', 
      className: 'bg-orange-50 text-orange-600 border-orange-300',
      icon: Key,
      description: 'El asistente informará que ya está alquilada'
    },
    reserved: { 
      label: 'Reservada', 
      className: 'bg-yellow-50 text-yellow-600 border-yellow-300',
      icon: Bookmark,
      description: 'El asistente informará que está reservada'
    }
  };
  
  const currentConfig = statusConfig[property.status];
  const StatusIcon = currentConfig.icon;
  
  const handleStatusClick = (newStatus: Property['status'], e: React.MouseEvent) => {
    e.stopPropagation();
    if (newStatus !== property.status) {
      onStatusChange(property.id, newStatus);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        <div className="cursor-pointer">
          <Badge variant="outline" className={`text-xs border flex items-center gap-1 ${currentConfig.className}`}>
            <StatusIcon className="h-3 w-3" />
            {currentConfig.label}
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-2" 
        align="end"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <div className="text-xs text-gray-600 px-2 py-1.5">Cambiar estado:</div>
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={status}
                onClick={(e) => handleStatusClick(status as Property['status'], e)}
                className={`w-full flex flex-col items-start px-2 py-2 rounded text-sm transition-colors ${
                  property.status === status
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-1.5 w-full justify-between">
                  <span className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4" />
                    {config.label}
                  </span>
                  {property.status === status && (
                    <Check className="h-4 w-4 text-[#e7af2a]" />
                  )}
                </span>
                <span className="text-xs text-gray-500 mt-0.5 ml-5">
                  {config.description}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function PropertiesPage() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [operationFilter, setOperationFilter] = useState<'all' | 'sale' | 'rent'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Estados para sincronización con CRM/Portales
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [showSyncResultDialog, setShowSyncResultDialog] = useState(false);
  const [connectedPlatform] = useState<'idealista' | 'fotocasa' | 'crm' | null>('idealista'); // Conectado con Idealista por defecto
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  
  // Estados para propiedades nuevas encontradas
  const [newPropertiesFound, setNewPropertiesFound] = useState<Property[]>([
    {
      id: 'new-001',
      title: 'Piso céntrico recién reformado',
      price: 295000,
      pricePerM2: 3688,
      location: 'Sol, Madrid',
      propertyType: 'apartment',
      operation: 'sale',
      constructedArea: 80,
      usableArea: 72,
      bedrooms: 2,
      bathrooms: 1,
      floor: '4º',
      yearBuilt: 1990,
      condition: 'good',
      orientation: 'Este',
      energyCertification: 'D',
      hasElevator: true,
      hasAirConditioning: false,
      hasHeating: true,
      heatingType: 'Gas natural',
      hasParking: false,
      hasBuiltInWardrobes: true,
      description: 'Piso totalmente reformado en pleno centro de Madrid. Perfecto para parejas o como inversión.',
      images: [
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      ],
      status: 'available',
      updatedAt: '2025-11-15T10:00:00Z',
      idealistaUrl: 'https://www.idealista.com/inmueble/new001',
      interestedCount: 0,
      interestedLeads: []
    },
    {
      id: 'new-002',
      title: 'Estudio luminoso cerca de metro',
      price: 185000,
      pricePerM2: 4111,
      location: 'Lavapiés, Madrid',
      propertyType: 'studio',
      operation: 'sale',
      constructedArea: 45,
      usableArea: 42,
      bedrooms: 1,
      bathrooms: 1,
      floor: '2º',
      yearBuilt: 1985,
      condition: 'good',
      orientation: 'Sur',
      energyCertification: 'E',
      hasElevator: false,
      hasAirConditioning: false,
      hasHeating: true,
      heatingType: 'Eléctrico',
      hasParking: false,
      description: 'Acogedor estudio perfecto para estudiantes o primera vivienda.',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      ],
      status: 'available',
      updatedAt: '2025-11-15T09:30:00Z',
      idealistaUrl: 'https://www.idealista.com/inmueble/new002',
      interestedCount: 0,
      interestedLeads: []
    },
    {
      id: 'new-003',
      title: 'Apartamento con balcón',
      price: 340000,
      pricePerM2: 3778,
      location: 'Retiro, Madrid',
      propertyType: 'apartment',
      operation: 'sale',
      constructedArea: 90,
      usableArea: 82,
      bedrooms: 2,
      bathrooms: 2,
      floor: '5º',
      yearBuilt: 2000,
      condition: 'good',
      orientation: 'Oeste',
      energyCertification: 'C',
      hasElevator: true,
      hasAirConditioning: true,
      hasHeating: true,
      heatingType: 'Gas natural',
      hasParking: true,
      hasBalcony: true,
      hasBuiltInWardrobes: true,
      description: 'Bonito apartamento con balcón cerca del parque del Retiro.',
      images: [
        'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&q=80',
        'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80',
      ],
      status: 'available',
      updatedAt: '2025-11-15T08:45:00Z',
      idealistaUrl: 'https://www.idealista.com/inmueble/new003',
      interestedCount: 0,
      interestedLeads: []
    },
    {
      id: 'new-004',
      title: 'Dúplex con garaje incluido',
      price: 475000,
      pricePerM2: 3958,
      location: 'Salamanca, Madrid',
      propertyType: 'duplex',
      operation: 'sale',
      constructedArea: 120,
      usableArea: 110,
      bedrooms: 3,
      bathrooms: 2,
      floor: '6º y 7º',
      yearBuilt: 2015,
      condition: 'new',
      orientation: 'Sur',
      energyCertification: 'B',
      hasElevator: true,
      hasAirConditioning: true,
      hasHeating: true,
      heatingType: 'Aerotermia',
      hasParking: true,
      hasStorage: true,
      hasBuiltInWardrobes: true,
      description: 'Espectacular dúplex en zona premium con todas las comodidades.',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      ],
      status: 'available',
      updatedAt: '2025-11-15T07:20:00Z',
      idealistaUrl: 'https://www.idealista.com/inmueble/new004',
      interestedCount: 0,
      interestedLeads: []
    },
    {
      id: 'new-005',
      title: 'Piso exterior con buenas vistas',
      price: 265000,
      pricePerM2: 3312,
      location: 'Carabanchel, Madrid',
      propertyType: 'apartment',
      operation: 'sale',
      constructedArea: 80,
      usableArea: 75,
      bedrooms: 3,
      bathrooms: 1,
      floor: '8º',
      yearBuilt: 1995,
      condition: 'good',
      orientation: 'Norte',
      energyCertification: 'D',
      hasElevator: true,
      hasAirConditioning: false,
      hasHeating: true,
      heatingType: 'Gas natural',
      hasParking: false,
      hasBuiltInWardrobes: false,
      description: 'Amplio piso exterior con vistas despejadas. Excelente ubicación con todos los servicios.',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      ],
      status: 'available',
      updatedAt: '2025-11-15T06:10:00Z',
      idealistaUrl: 'https://www.idealista.com/inmueble/new005',
      interestedCount: 0,
      interestedLeads: []
    }
  ]);
  const [showNewPropertiesDialog, setShowNewPropertiesDialog] = useState(false);
  const [selectedNewProperties, setSelectedNewProperties] = useState<string[]>([]);

  // Estados para añadir propiedad por enlace
  const [showAddByLinkDialog, setShowAddByLinkDialog] = useState(false);
  const [propertyLink, setPropertyLink] = useState('');
  const [isSearchingProperty, setIsSearchingProperty] = useState(false);
  const [foundProperty, setFoundProperty] = useState<Property | null>(null);
  
  // Estados para añadir propiedad manual
  const [showAddManualDialog, setShowAddManualDialog] = useState(false);

  // Cargar propiedades desde localStorage al iniciar
  useEffect(() => {
    const savedProperties = localStorage.getItem('realmaker_properties');
    if (savedProperties) {
      try {
        const parsed = JSON.parse(savedProperties);
        // Validar si hay cambios significativos en los datos
        const lengthChanged = parsed.length !== mockProperties.length;
        const interestedCountChanged = parsed[0]?.interestedLeads?.length !== mockProperties[0]?.interestedLeads?.length;
        
        if (lengthChanged || interestedCountChanged) {
          console.log('🔄 Datos actualizados detectados, recargando datos frescos');
          localStorage.removeItem('realmaker_properties');
          setProperties([...mockProperties]);
        } else {
          console.log('📦 Cargando propiedades desde localStorage:', parsed[0]?.interestedLeads?.slice(0, 3));
          setProperties(parsed);
        }
      } catch (error) {
        console.error('Error al cargar propiedades guardadas:', error);
        // Si hay error, cargar datos frescos y limpiar localStorage
        localStorage.removeItem('realmaker_properties');
        setProperties([...mockProperties]); // Usar spread para nueva referencia
      }
    } else {
      // No hay datos guardados, usar datos frescos del archivo
      console.log('🆕 Cargando propiedades frescas desde el archivo:', mockProperties[0]?.interestedLeads?.slice(0, 3));
      setProperties([...mockProperties]); // Usar spread para nueva referencia
    }
  }, []);

  // Guardar propiedades en localStorage cada vez que cambien
  useEffect(() => {
    if (properties.length > 0) {
      localStorage.setItem('realmaker_properties', JSON.stringify(properties));
    }
  }, [properties]);

  // Simular que el bot ha encontrado nuevas propiedades una vez al día
  useEffect(() => {
    // Simular propiedades nuevas encontradas en el portal
    const mockNewProperties: Property[] = [
      {
        id: 'new-prop-1',
        title: 'Apartamento luminoso en Chamartín',
        price: 385000,
        pricePerM2: 3850,
        location: 'Chamartín, Madrid',
        propertyType: 'apartment',
        operation: 'sale',
        constructedArea: 100,
        usableArea: 90,
        bedrooms: 3,
        bathrooms: 2,
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
        ],
        status: 'available',
        updatedAt: new Date().toISOString(),
        idealistaUrl: 'https://www.idealista.com/inmueble/109800600/',
        description: 'Moderno apartamento con excelentes vistas y acabados de calidad.',
        hasElevator: true,
        hasParking: true,
        energyCertification: 'B'
      },
      {
        id: 'new-prop-2',
        title: 'Piso reformado cerca de metro',
        price: 295000,
        pricePerM2: 3687,
        location: 'Carabanchel, Madrid',
        propertyType: 'apartment',
        operation: 'sale',
        constructedArea: 80,
        usableArea: 72,
        bedrooms: 2,
        bathrooms: 1,
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
        ],
        status: 'available',
        updatedAt: new Date().toISOString(),
        idealistaUrl: 'https://www.idealista.com/inmueble/109800601/',
        description: 'Piso completamente reformado, listo para entrar a vivir.',
        hasElevator: false,
        energyCertification: 'E'
      },
      {
        id: 'new-prop-3',
        title: 'Estudio en zona universitaria',
        price: 850,
        pricePerM2: 21.25,
        location: 'Moncloa, Madrid',
        propertyType: 'studio',
        operation: 'rent',
        constructedArea: 40,
        usableArea: 37,
        bedrooms: 1,
        bathrooms: 1,
        images: [
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80'
        ],
        status: 'available',
        updatedAt: new Date().toISOString(),
        idealistaUrl: 'https://www.idealista.com/inmueble/109800602/',
        description: 'Estudio ideal para estudiantes, zona tranquila.',
        hasElevator: true,
        energyCertification: 'D'
      },
      {
        id: 'new-prop-4',
        title: 'Dúplex con terraza en Retiro',
        price: 520000,
        pricePerM2: 4333,
        location: 'Retiro, Madrid',
        propertyType: 'duplex',
        operation: 'sale',
        constructedArea: 120,
        usableArea: 110,
        bedrooms: 3,
        bathrooms: 2,
        images: [
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
          'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80'
        ],
        status: 'available',
        updatedAt: new Date().toISOString(),
        idealistaUrl: 'https://www.idealista.com/inmueble/109800603/',
        description: 'Precioso dúplex con terraza de 30m², vistas al parque.',
        hasElevator: true,
        hasParking: true,
        hasTerrace: true,
        energyCertification: 'B'
      },
      {
        id: 'new-prop-5',
        title: 'Ático con piscina comunitaria',
        price: 675000,
        pricePerM2: 6136,
        location: 'Salamanca, Madrid',
        propertyType: 'penthouse',
        operation: 'sale',
        constructedArea: 110,
        usableArea: 100,
        bedrooms: 2,
        bathrooms: 2,
        images: [
          'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80'
        ],
        status: 'available',
        updatedAt: new Date().toISOString(),
        idealistaUrl: 'https://www.idealista.com/inmueble/109800604/',
        description: 'Ático exclusivo con terraza, piscina y gimnasio comunitario.',
        hasElevator: true,
        hasParking: true,
        hasPool: true,
        hasTerrace: true,
        energyCertification: 'A'
      }
    ];
    
    setNewPropertiesFound(mockNewProperties);
  }, []);

  // Contador de propiedades removido completamente

  // Función para obtener el nombre de la plataforma
  const getPlatformName = (platform: 'idealista' | 'fotocasa' | 'crm') => {
    switch (platform) {
      case 'idealista':
        return 'Idealista';
      case 'fotocasa':
        return 'Fotocasa';
      case 'crm':
        return 'CRM';
      default:
        return 'Plataforma';
    }
  };

  // Función para calcular el tiempo transcurrido desde la última sincronización
  const getTimeSinceSync = () => {
    const now = new Date();
    const diffMs = now.getTime() - lastSyncTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'hace un momento';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    return `hace ${diffDays}d`;
  };

  const handleUpdateProperties = () => {
    setIsUpdating(true);
    // Simular sincronización con datos detallados
    setTimeout(() => {
      // Generar resultados aleatorios para la simulación
      const mockSyncResult: SyncResult = {
        newProperties: Math.floor(Math.random() * 5) + 1,
        updatedProperties: Math.floor(Math.random() * 8) + 2,
        statusChanges: Math.floor(Math.random() * 3),
        photoUpdates: Math.floor(Math.random() * 6) + 1,
        connectedPlatform: connectedPlatform
      };
      
      setIsUpdating(false);
      setLastUpdate(new Date());
      setLastSyncTime(new Date());
      setSyncResult(mockSyncResult);
      setShowSyncResultDialog(true);
      // NO incrementar el contador aquí porque el usuario está dentro de la página y actualizó manualmente
    }, 2500);
  };

  const handleAddProperty = () => {
    setShowAddByLinkDialog(true);
    setFoundProperty(null);
    setPropertyLink('');
  };

  const handleSearchPropertyByLink = () => {
    if (!propertyLink.trim()) {
      toast.error('Por favor, introduce un enlace válido');
      return;
    }

    setIsSearchingProperty(true);
    
    // Simular búsqueda de la propiedad
    setTimeout(() => {
      // Simular que se encontró la propiedad
      const mockFoundProperty: Property = {
        id: `prop-${Date.now()}`,
        title: 'Piso en Calle Mayor, Centro',
        price: 350000,
        pricePerM2: 4375,
        location: 'Centro, Madrid',
        propertyType: 'apartment',
        operation: 'sale',
        constructedArea: 80,
        usableArea: 75,
        bedrooms: 2,
        bathrooms: 1,
        floor: '3º',
        yearBuilt: 1995,
        condition: 'good',
        orientation: 'Sur',
        energyCertification: 'D',
        hasElevator: true,
        hasAirConditioning: false,
        hasHeating: true,
        heatingType: 'Gas natural',
        hasParking: false,
        hasStorage: false,
        hasTerrace: false,
        hasBalcony: true,
        hasGarden: false,
        hasPool: false,
        hasBuiltInWardrobes: true,
        isFurnished: false,
        isAccessible: true,
        description: 'Amplio piso en pleno centro de Madrid, muy luminoso y exterior.',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
        ],
        status: 'available',
        updatedAt: new Date().toISOString(),
        idealistaUrl: propertyLink
      };
      
      setFoundProperty(mockFoundProperty);
      setIsSearchingProperty(false);
      toast.success('Propiedad detectada correctamente');
    }, 2000);
  };

  const handleConfirmAddProperty = (property: Property) => {
    setProperties([property, ...properties]);
    setShowAddByLinkDialog(false);
    toast.success('Propiedad añadida correctamente');
  };

  const handleCancelAddProperty = () => {
    setShowAddByLinkDialog(false);
    setFoundProperty(null);
    setPropertyLink('');
  };

  const handleSaveProperty = (newProperty: Property) => {
    setProperties([newProperty, ...properties]);
  };

  const handleConfirmNewProperties = () => {
    const propertiesToAdd = newPropertiesFound.filter(p => selectedNewProperties.includes(p.id));
    setProperties([...propertiesToAdd, ...properties]);
    toast.success(`${propertiesToAdd.length} ${propertiesToAdd.length === 1 ? 'propiedad añadida' : 'propiedades añadidas'} correctamente`);
    setNewPropertiesFound([]);
    setShowNewPropertiesDialog(false);
    setSelectedNewProperties([]);
  };

  const handleToggleSelectAll = () => {
    if (selectedNewProperties.length === newPropertiesFound.length) {
      setSelectedNewProperties([]);
    } else {
      setSelectedNewProperties(newPropertiesFound.map(p => p.id));
    }
  };

  const handleNextImage = (propertyId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % totalImages
    }));
  };

  const handlePrevImage = (propertyId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOperation = operationFilter === 'all' || property.operation === operationFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'available') {
      matchesStatus = property.status === 'available';
    } else if (statusFilter === 'unavailable') {
      matchesStatus = property.status === 'unavailable';
    }
    
    return matchesSearch && matchesOperation && matchesStatus;
  });

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Mostrar vista de detalle o listado */}
        {selectedProperty ? (
          <PropertyDetail
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            onUpdate={(propertyId, updates) => {
              setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, ...updates } : p));
              setSelectedProperty(prev => prev ? { ...prev, ...updates } : null);
            }}
            onDelete={(propertyId) => {
              setProperties(prev => prev.filter(p => p.id !== propertyId));
              setSelectedProperty(null);
            }}
          />
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="px-4 py-4">
                <div className="mb-3">
                  <h1 className="text-2xl font-semibold text-gray-900">Propiedades</h1>
                  <p className="text-gray-600 mt-1">
                    Gestiona tus propiedades desde un solo lugar
                  </p>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar propiedades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-gray-300 bg-white focus:border-primary"
                  />
                </div>

                {/* Filtros por Operación - Mobile */}
                <div className="space-y-2 mb-3 mt-3">
                <span className="text-xs text-gray-600 font-medium">Filtrar por operación:</span>
                <div className="overflow-x-auto -mx-4 px-4 hide-scrollbar">
                  <div className="flex gap-2 pb-2">
                    <button
                      onClick={() => setOperationFilter('all')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        operationFilter === 'all'
                          ? 'bg-[#e7af2a] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">Todas</span>
                    </button>
                    <button
                      onClick={() => setOperationFilter('sale')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        operationFilter === 'sale'
                          ? 'bg-[#e7af2a] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Home className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">Venta</span>
                    </button>
                    <button
                      onClick={() => setOperationFilter('rent')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        operationFilter === 'rent'
                          ? 'bg-[#e7af2a] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">Alquiler</span>
                    </button>
                    </div>
                  </div>
                </div>

                {/* Filtros por Estado - Mobile */}
                <div className="space-y-2 mb-3">
                <span className="text-xs text-gray-600 font-medium">Filtrar por estado:</span>
                <div className="overflow-x-auto -mx-4 px-4 hide-scrollbar">
                  <div className="flex gap-2 pb-2">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        statusFilter === 'all'
                          ? 'bg-[#e7af2a] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">Todos</span>
                    </button>
                    <button
                      onClick={() => setStatusFilter('available')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        statusFilter === 'available'
                          ? 'bg-[#e7af2a] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Eye className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">Disponible</span>
                    </button>
                    <button
                      onClick={() => setStatusFilter('unavailable')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        statusFilter === 'unavailable'
                          ? 'bg-[#e7af2a] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <EyeOff className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">No disponible</span>
                    </button>
                    </div>
                  </div>
                </div>

                {/* Información de propiedades y actualización - Mobile */}
                <div className="flex flex-col gap-2 py-3 px-3 bg-white rounded-lg border border-gray-200">
                  {/* Primera fila: Contador + Badge Idealista */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-900">
                        {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad' : 'propiedades'}
                      </span>
                    </div>
                    
                    {connectedPlatform && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-700">
                          {getPlatformName(connectedPlatform)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Segunda fila: Botón de búsqueda - ancho completo */}
                  {connectedPlatform && (
                    <Button
                      type="button"
                      onClick={(e) => {
                        console.log('Click detectado!');
                        e.preventDefault();
                        e.stopPropagation();
                        if (newPropertiesFound.length > 0) {
                          setSelectedNewProperties(newPropertiesFound.map(p => p.id));
                        }
                        setShowNewPropertiesDialog(true);
                      }}
                      onTouchEnd={(e) => {
                        console.log('Touch detectado!');
                        e.preventDefault();
                        e.stopPropagation();
                        if (newPropertiesFound.length > 0) {
                          setSelectedNewProperties(newPropertiesFound.map(p => p.id));
                        }
                        setShowNewPropertiesDialog(true);
                      }}
                      className="flex items-center justify-center gap-1.5 bg-[#e7af2a]/10 border border-[#e7af2a]/30 rounded-full px-3 py-2 hover:bg-[#e7af2a]/20 active:bg-[#e7af2a]/30 transition-colors w-full h-auto cursor-pointer relative z-50"
                      style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#e7af2a] flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-900">
                        {newPropertiesFound.length > 0 
                          ? `${newPropertiesFound.length} ${newPropertiesFound.length === 1 ? 'propiedad nueva' : 'propiedades nuevas'}`
                          : 'Buscar nuevas'
                        }
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de propiedades */}
            <ScrollArea className="flex-1 bg-gray-50">
              <div className="space-y-3 px-4 pt-4 pb-24">
                {/* Tarjeta de añadir propiedad - Mobile */}
                <button 
                  className="w-full overflow-hidden border-2 border-dashed border-gray-300 active:border-[#e7af2a] bg-white active:bg-gray-50 shadow-sm transition-all duration-200 active:scale-[0.98] rounded-lg text-left"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddProperty();
                  }}
                  type="button"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-[#e7af2a] flex items-center justify-center">
                          <Plus className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Añadir propiedad</p>
                        <p className="text-sm text-gray-500">Añadir desde enlace del portal</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                </button>

                {filteredProperties.map((property) => {
                  const currentIndex = currentImageIndex[property.id] || 0;
                  const hasMultipleImages = property.images.length > 1;
                  
                  return (
                    <Card 
                      key={property.id} 
                      className="border-gray-100 shadow-sm"
                    >
                      <div 
                        className="cursor-pointer"
                        onClick={() => setSelectedProperty(property)}
                      >
                        <SwipeableImageCarousel
                          images={property.images}
                          currentIndex={currentIndex}
                          onIndexChange={(newIndex) => {
                            setCurrentImageIndex(prev => ({
                              ...prev,
                              [property.id]: newIndex
                            }));
                          }}
                          alt={property.title}
                          className="h-48 rounded-t-lg"
                          showIndicators={hasMultipleImages}
                        >
                          {/* Banda de estado en esquina */}
                          <StatusCornerRibbon status={property.status} />
                          
                          <div className="absolute top-2 right-2 z-10">
                            <StatusBadge
                              property={property}
                              onStatusChange={(propertyId, newStatus) => {
                                setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status: newStatus } : p));
                                toast.success(`Estado actualizado a: ${getStatusLabel(newStatus)}`);
                              }}
                            />
                          </div>
                          
                          {/* Badge de interesados - Esquina inferior izquierda */}
                          {property.interestedLeads && property.interestedLeads.length > 0 && (
                            <div className="absolute bottom-2 left-2 z-10">
                              <div className="bg-primary text-white px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 text-sm font-medium">
                                <Users className="h-3.5 w-3.5" />
                                <span>{property.interestedLeads.length}</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Flechas de navegación */}
                          {hasMultipleImages && (
                            <>
                              <button
                                onClick={(e) => handlePrevImage(property.id, property.images.length, e)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-opacity z-20"
                                aria-label="Imagen anterior"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => handleNextImage(property.id, property.images.length, e)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-opacity z-20"
                                aria-label="Imagen siguiente"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </SwipeableImageCarousel>
                      </div>
                      
                      <CardContent className="p-4">
                        <div onClick={() => setSelectedProperty(property)} className="cursor-pointer">
                          {/* Título con espacio fijo para 2 líneas */}
                          <h3 className="text-base text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{property.title}</h3>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                            <MapPin className="h-4 w-4" />
                            <span>{property.location}</span>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-2xl text-gray-900 mb-1">{formatPrice(property.price)}</p>
                            <p className="text-sm text-gray-500">
                              {formatPrice(property.pricePerM2)}/m² · {property.constructedArea} m²
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Bed className="h-4 w-4" />
                              <span>{property.bedrooms}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="h-4 w-4" />
                              <span>{property.bathrooms}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Maximize className="h-4 w-4" />
                              <span>{property.constructedArea} m²</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Formulario de añadir propiedad */}
            {showAddForm && (
              <AddPropertyForm
                onSave={handleSaveProperty}
                onClose={() => setShowAddForm(false)}
              />
            )}

            {/* Diálogo de resultados de sincronización */}
            <Dialog open={showSyncResultDialog} onOpenChange={setShowSyncResultDialog}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Sincronización completada
                  </DialogTitle>
                  <DialogDescription>
                    Tu catálogo se ha actualizado correctamente desde {getPlatformName(connectedPlatform)}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-3 py-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Home className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{syncResult?.newProperties} propiedades nuevas</p>
                      <p className="text-xs text-gray-600">Añadidas al catálogo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <FileEdit className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{syncResult?.updatedProperties} propiedades actualizadas</p>
                      <p className="text-xs text-gray-600">Información modificada</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{syncResult?.statusChanges} cambios de estado</p>
                      <p className="text-xs text-gray-600">Disponibilidad actualizada</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{syncResult?.photoUpdates} fotos actualizadas</p>
                      <p className="text-xs text-gray-600">Imágenes nuevas o modificadas</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LinkIcon className="h-4 w-4" />
                    <span>Conectado con {getPlatformName(connectedPlatform)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{getTimeSinceSync()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mt-2">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    La sincronización automática se realiza diariamente. Puedes sincronizar manualmente cuando lo necesites.
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            {/* Diálogo para añadir propiedad por enlace - Móvil */}
            <AddPropertyByLinkDialog
              open={showAddByLinkDialog}
              onOpenChange={setShowAddByLinkDialog}
              onConfirm={handleConfirmAddProperty}
              onOpenManual={() => {
                setShowAddByLinkDialog(false);
                setShowAddManualDialog(true);
              }}
            />
            
            {/* Diálogo para añadir propiedad manual - Móvil */}
            <AddPropertyManualDialog
              open={showAddManualDialog}
              onOpenChange={setShowAddManualDialog}
              onConfirm={handleConfirmAddProperty}
            />

            {/* Diálogo de verificación de propiedades nuevas - Móvil */}
            <Dialog open={showNewPropertiesDialog} onOpenChange={setShowNewPropertiesDialog}>
              <DialogContent aria-describedby={undefined} className="max-w-3xl w-[95vw] sm:w-full max-h-[90vh] sm:max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden">
                {/* Header fijo - solo título */}
                <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      {newPropertiesFound.length > 0 
                        ? `Propiedades nuevas encontradas en ${getPlatformName(connectedPlatform)}`
                        : `Buscar propiedades en ${getPlatformName(connectedPlatform)}`
                      }
                    </DialogTitle>
                  </DialogHeader>
                </div>
                
                {newPropertiesFound.length > 0 ? (
                  <>
                    {/* Barra de acciones fija */}
                    <div className="flex-shrink-0 flex items-center justify-between px-6 py-2.5 bg-gray-50 border-b">
                      <div className="flex items-center gap-2.5">
                        <Checkbox
                          id="select-all-mobile"
                          checked={selectedNewProperties.length === newPropertiesFound.length && newPropertiesFound.length > 0}
                          onCheckedChange={handleToggleSelectAll}
                        />
                        <label htmlFor="select-all-mobile" className="text-sm font-medium cursor-pointer select-none">
                          Seleccionar todas <span className="text-gray-500">({selectedNewProperties.length}/{newPropertiesFound.length})</span>
                        </label>
                      </div>
                      <Button
                        onClick={handleConfirmNewProperties}
                        disabled={selectedNewProperties.length === 0}
                        size="sm"
                        className="bg-[#e7af2a] hover:bg-[#d19d25] text-white border-0"
                      >
                        <Check className="h-4 w-4 mr-1.5" />
                        Añadir {selectedNewProperties.length > 0 && `(${selectedNewProperties.length})`}
                      </Button>
                    </div>

                    {/* Lista scrolleable con pastilla de Idealista incluida */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                      <div className="p-4 space-y-3">
                        {/* Información del perfil conectado - dentro del scroll */}
                        <div className="p-2.5 bg-gradient-to-br from-[#e7af2a]/5 to-transparent border border-[#e7af2a]/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-lg overflow-hidden">
                                {/* Logo oficial de Idealista */}
                                <IconHistoricoLogoMobile nombre="idealista" className="w-full h-full" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-sm font-medium text-gray-900">Nordeste Real Estate</p>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-green-50 text-green-700 border-green-200">
                                  Conectado
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mb-1">Oviedo · Cliente desde 2021</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Propiedades */}
                      {newPropertiesFound.map((property) => (
                        <div
                          key={property.id}
                          className={`group relative border rounded-lg overflow-hidden transition-all cursor-pointer ${
                            selectedNewProperties.includes(property.id)
                              ? 'border-[#e7af2a] bg-amber-50/50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
                          }`}
                          onClick={() => {
                            if (selectedNewProperties.includes(property.id)) {
                              setSelectedNewProperties(selectedNewProperties.filter(id => id !== property.id));
                            } else {
                              setSelectedNewProperties([...selectedNewProperties, property.id]);
                            }
                          }}
                        >
                          <div className="flex gap-4 p-4">
                            {/* Checkbox e imagen */}
                            <div className="flex items-start gap-3 flex-shrink-0">
                              <div className="pt-0.5">
                                <Checkbox
                                  checked={selectedNewProperties.includes(property.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedNewProperties([...selectedNewProperties, property.id]);
                                    } else {
                                      setSelectedNewProperties(selectedNewProperties.filter(id => id !== property.id));
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div className="w-28 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                <ImageWithFallback
                                  src={property.images[0]}
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            
                            {/* Información */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              {/* Título y precio */}
                              <div>
                                <div className="flex items-start justify-between gap-3 mb-1.5">
                                  <h3 className="font-medium text-gray-900 line-clamp-1 flex-1">{property.title}</h3>
                                  <div className="flex-shrink-0 font-semibold text-gray-900 whitespace-nowrap">
                                    {formatPrice(property.price)}
                                    {property.operation === 'rent' && <span className="text-sm text-gray-600">/mes</span>}
                                  </div>
                                </div>
                                
                                {/* Ubicación */}
                                <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="line-clamp-1">{property.location}</span>
                                </div>
                              </div>
                              
                              {/* Características */}
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                {property.bedrooms > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Bed className="h-3.5 w-3.5" />
                                    <span>{property.bedrooms}</span>
                                  </div>
                                )}
                                {property.bathrooms > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Bath className="h-3.5 w-3.5" />
                                    <span>{property.bathrooms}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Maximize className="h-3.5 w-3.5" />
                                  <span>{property.constructedArea}m²</span>
                                </div>
                              </div>
                              
                              {/* Descripción */}
                              {property.description && (
                                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{property.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
                ) : (
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                      {/* Pastilla de Idealista */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-lg overflow-hidden">
                              {/* Logo oficial de Idealista */}
                              <IconHistoricoLogoMobile nombre="idealista" className="w-full h-full" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-medium text-gray-900">Nordeste Real Estate</p>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-green-50 text-green-700 border-green-200">
                                Conectado
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">Oviedo · Cliente desde 2021</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Estado vacío */}
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center space-y-3">
                          <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                              <Search className="h-8 w-8 text-gray-400" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">No se encontraron propiedades nuevas</p>
                            <p className="text-sm text-gray-500">Todas las propiedades de {getPlatformName(connectedPlatform)} ya están en tu catálogo</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    );
  }

  // Vista desktop
  return (
    <div className="space-y-8">
      {/* Mostrar vista de detalle o listado */}
      {selectedProperty ? (
        <PropertyDetail
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onUpdate={(propertyId, updates) => {
            setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, ...updates } : p));
            setSelectedProperty(prev => prev ? { ...prev, ...updates } : null);
          }}
          onDelete={(propertyId) => {
            setProperties(prev => prev.filter(p => p.id !== propertyId));
            setSelectedProperty(null);
          }}
        />
      ) : (
        <>
          {/* Header */}
          <div>
            <div className="mb-6">
              <h1 className="text-2xl text-gray-900 mb-1">Propiedades</h1>
              <p className="text-gray-600 mt-1">
                Gestiona tus propiedades desde un solo lugar
              </p>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar propiedades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 bg-white border border-gray-300 rounded-lg focus:border-primary"
                />
              </div>
            </div>

            {/* Filtros en la misma línea - Desktop */}
            <div className="flex items-start gap-8">
              {/* Filtros por Operación */}
              <div className="space-y-3">
                <span className="text-sm text-gray-600">Filtrar por operación:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setOperationFilter('all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                      operationFilter === 'all'
                        ? 'bg-[#e7af2a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    <span>Todas</span>
                  </button>
                  <button
                    onClick={() => setOperationFilter('sale')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                      operationFilter === 'sale'
                        ? 'bg-[#e7af2a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Home className="h-4 w-4 flex-shrink-0" />
                    <span>Venta</span>
                  </button>
                  <button
                    onClick={() => setOperationFilter('rent')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                      operationFilter === 'rent'
                        ? 'bg-[#e7af2a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>Alquiler</span>
                  </button>
                </div>
              </div>

              {/* Separador vertical */}
              <div className="w-px h-16 bg-gray-200 self-center"></div>

              {/* Filtros por Estado */}
              <div className="space-y-3">
                <span className="text-sm text-gray-600">Filtrar por estado:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                      statusFilter === 'all'
                        ? 'bg-[#e7af2a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    <span>Todos</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter('available')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                      statusFilter === 'available'
                        ? 'bg-[#e7af2a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Eye className="h-4 w-4 flex-shrink-0" />
                    <span>Disponible</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter('unavailable')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                      statusFilter === 'unavailable'
                        ? 'bg-[#e7af2a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <EyeOff className="h-4 w-4 flex-shrink-0" />
                    <span>No disponible</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de información y actualización - Desktop */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 py-3 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-900">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad' : 'propiedades'}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                {connectedPlatform && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700">
                      {getPlatformName(connectedPlatform)}
                    </span>
                  </div>
                )}
                
                {connectedPlatform && (
                  <button
                    onClick={() => {
                      // Simular búsqueda de propiedades nuevas
                      if (newPropertiesFound.length > 0) {
                        setSelectedNewProperties(newPropertiesFound.map(p => p.id));
                      }
                      setShowNewPropertiesDialog(true);
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#e7af2a]/10 border border-[#e7af2a]/30 rounded-full px-3 py-1 hover:bg-[#e7af2a]/20 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#e7af2a]" />
                    <span className="text-xs font-medium text-gray-900">
                      {newPropertiesFound.length > 0 
                        ? `Hemos encontrado ${newPropertiesFound.length} ${newPropertiesFound.length === 1 ? 'propiedad nueva' : 'propiedades nuevas'}`
                        : 'Buscar propiedades nuevas'
                      }
                    </span>
                  </button>
                )}
              </div>
            </div>

          {/* Grid de propiedades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Tarjeta para añadir nueva propiedad */}
                <Card 
                  className="overflow-hidden border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={handleAddProperty}
                >
                  <div className="relative h-48">
                    {/* Imagen difuminada de fondo */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200"></div>
                    
                    {/* Overlay con blur */}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
                    
                    {/* Botón de añadir centrado */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full bg-[#e7af2a] hover:bg-[#d19d1f] flex items-center justify-center transition-all group-hover:scale-110 shadow-lg">
                          <Plus className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                          Añadir propiedad
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 pt-1">
                    {/* Título difuminado con espacio fijo para 2 líneas */}
                    <div className="min-h-[3rem] mb-2 blur-[3px] opacity-40">
                      <div className="h-4 bg-gray-300 rounded w-full mb-1.5"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-400 mb-3 blur-[2px] opacity-40">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <div className="h-3 bg-gray-300 rounded w-32"></div>
                    </div>
                    
                    <div className="mb-3 blur-[3px] opacity-40">
                      <div className="h-7 bg-gray-300 rounded w-28 mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-36"></div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 blur-[2px] opacity-40">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <div className="h-3 bg-gray-300 rounded w-3"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <div className="h-3 bg-gray-300 rounded w-3"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="h-4 w-4" />
                        <div className="h-3 bg-gray-300 rounded w-10"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Propiedades existentes */}
                {filteredProperties.map((property) => {
                  const currentIndex = currentImageIndex[property.id] || 0;
                  const hasMultipleImages = property.images.length > 1;
                  
                  return (
                    <Card 
                      key={property.id} 
                      className="border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <SwipeableImageCarousel
                        images={property.images}
                        currentIndex={currentIndex}
                        onIndexChange={(newIndex) => {
                          setCurrentImageIndex(prev => ({
                            ...prev,
                            [property.id]: newIndex
                          }));
                        }}
                        alt={property.title}
                        className="h-48 rounded-t-lg"
                        showIndicators={hasMultipleImages}
                      >
                        {/* Banda de estado en esquina */}
                        <StatusCornerRibbon status={property.status} />
                        
                        <div className="absolute top-2 right-2 z-10">
                          <StatusBadge
                            property={property}
                            onStatusChange={(propertyId, newStatus) => {
                              setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status: newStatus } : p));
                              toast.success(`Estado actualizado a: ${getStatusLabel(newStatus)}`);
                            }}
                          />
                        </div>
                        
                        {/* Badge de interesados - Esquina inferior izquierda */}
                        {property.interestedLeads && property.interestedLeads.length > 0 && (
                          <div className="absolute bottom-2 left-2 z-10">
                            <div className="bg-primary text-white px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 text-sm font-medium">
                              <Users className="h-3.5 w-3.5" />
                              <span>{property.interestedLeads.length}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Flechas de navegación - solo desktop */}
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={(e) => handlePrevImage(property.id, property.images.length, e)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                              aria-label="Imagen anterior"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => handleNextImage(property.id, property.images.length, e)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                              aria-label="Imagen siguiente"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </SwipeableImageCarousel>
                      <CardContent className="p-4 pt-1">
                        {/* Título con espacio fijo para 2 líneas */}
                        <h3 className="text-base text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{property.title}</h3>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{property.location}</span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-2xl text-gray-900 mb-1">{formatPrice(property.price)}</p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(property.pricePerM2)}/m² · {property.constructedArea} m²
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{property.bathrooms}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Maximize className="h-4 w-4" />
                            <span>{property.constructedArea} m²</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredProperties.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Home className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-center">
                    No se encontraron propiedades
                  </p>
                </div>
              )}

          {/* Formulario de añadir propiedad */}
          {showAddForm && (
            <AddPropertyForm
              onSave={handleSaveProperty}
              onClose={() => setShowAddForm(false)}
            />
          )}

          {/* Diálogo de resultados de sincronización */}
          <Dialog open={showSyncResultDialog} onOpenChange={setShowSyncResultDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Sincronización completada
                </DialogTitle>
                <DialogDescription>
                  Tu catálogo se ha actualizado correctamente desde {getPlatformName(connectedPlatform)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3 py-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{syncResult?.newProperties} propiedades nuevas</p>
                    <p className="text-xs text-gray-600">Añadidas al catálogo</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <FileEdit className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{syncResult?.updatedProperties} propiedades actualizadas</p>
                    <p className="text-xs text-gray-600">Información modificada</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{syncResult?.statusChanges} cambios de estado</p>
                    <p className="text-xs text-gray-600">Disponibilidad actualizada</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{syncResult?.photoUpdates} fotos actualizadas</p>
                    <p className="text-xs text-gray-600">Imágenes nuevas o modificadas</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <LinkIcon className="h-4 w-4" />
                  <span>Conectado con {getPlatformName(connectedPlatform)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{getTimeSinceSync()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mt-2">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-600">
                  La sincronización automática se realiza diariamente. Puedes sincronizar manualmente cuando lo necesites.
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Diálogo para añadir propiedad por enlace - Nuevo componente mejorado */}
          <AddPropertyByLinkDialog
            open={showAddByLinkDialog}
            onOpenChange={setShowAddByLinkDialog}
            onConfirm={handleConfirmAddProperty}
            onOpenManual={() => {
              setShowAddByLinkDialog(false);
              setShowAddManualDialog(true);
            }}
          />
          
          {/* Diálogo para añadir propiedad manual - Desktop */}
          <AddPropertyManualDialog
            open={showAddManualDialog}
            onOpenChange={setShowAddManualDialog}
            onConfirm={handleConfirmAddProperty}
          />

          {/* Diálogo de verificación de propiedades nuevas */}
          <Dialog open={showNewPropertiesDialog} onOpenChange={setShowNewPropertiesDialog}>
            <DialogContent aria-describedby={undefined} className="max-w-3xl w-[95vw] sm:w-full max-h-[90vh] sm:max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden">
              {/* Header fijo - solo título */}
              <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {newPropertiesFound.length > 0 
                      ? `Propiedades nuevas encontradas en ${getPlatformName(connectedPlatform)}`
                      : `Buscar propiedades en ${getPlatformName(connectedPlatform)}`
                    }
                  </DialogTitle>
                </DialogHeader>
              </div>
              
              {newPropertiesFound.length > 0 ? (
                <>
                  {/* Barra de acciones fija */}
                  <div className="flex-shrink-0 flex items-center justify-between px-6 py-2.5 bg-gray-50 border-b">
                    <div className="flex items-center gap-2.5">
                      <Checkbox
                        id="select-all"
                        checked={selectedNewProperties.length === newPropertiesFound.length && newPropertiesFound.length > 0}
                        onCheckedChange={handleToggleSelectAll}
                      />
                      <label htmlFor="select-all" className="text-sm font-medium cursor-pointer select-none">
                        Seleccionar todas <span className="text-gray-500">({selectedNewProperties.length}/{newPropertiesFound.length})</span>
                      </label>
                    </div>
                    <Button
                      onClick={handleConfirmNewProperties}
                      disabled={selectedNewProperties.length === 0}
                      size="sm"
                      className="bg-[#e7af2a] hover:bg-[#d19d25] text-white border-0"
                    >
                      <Check className="h-4 w-4 mr-1.5" />
                      Añadir {selectedNewProperties.length > 0 && `(${selectedNewProperties.length})`}
                    </Button>
                  </div>

                  {/* Lista scrolleable con pastilla de Idealista incluida */}
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="p-4 space-y-3">
                      {/* Información del perfil conectado - dentro del scroll */}
                      <div className="p-2.5 bg-gradient-to-br from-[#e7af2a]/5 to-transparent border border-[#e7af2a]/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-lg overflow-hidden">
                              {/* Logo oficial de Idealista */}
                              <IconHistoricoLogoMobile nombre="idealista" className="w-full h-full" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-medium text-gray-900">Nordeste Real Estate</p>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-green-50 text-green-700 border-green-200">
                                Conectado
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">Oviedo · Cliente desde 2021</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Propiedades */}
                    {newPropertiesFound.map((property) => (
                      <div
                        key={property.id}
                        className={`group relative border rounded-lg overflow-hidden transition-all cursor-pointer ${
                          selectedNewProperties.includes(property.id)
                            ? 'border-[#e7af2a] bg-amber-50/50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
                        }`}
                        onClick={() => {
                          if (selectedNewProperties.includes(property.id)) {
                            setSelectedNewProperties(selectedNewProperties.filter(id => id !== property.id));
                          } else {
                            setSelectedNewProperties([...selectedNewProperties, property.id]);
                          }
                        }}
                      >
                        <div className="flex gap-4 p-4">
                          {/* Checkbox e imagen */}
                          <div className="flex items-start gap-3 flex-shrink-0">
                            <div className="pt-0.5">
                              <Checkbox
                                checked={selectedNewProperties.includes(property.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedNewProperties([...selectedNewProperties, property.id]);
                                  } else {
                                    setSelectedNewProperties(selectedNewProperties.filter(id => id !== property.id));
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="w-28 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <ImageWithFallback
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          {/* Información */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            {/* Título y precio */}
                            <div>
                              <div className="flex items-start justify-between gap-3 mb-1.5">
                                <h3 className="font-medium text-gray-900 line-clamp-1 flex-1">{property.title}</h3>
                                <div className="flex-shrink-0 font-semibold text-gray-900 whitespace-nowrap">
                                  {formatPrice(property.price)}
                                  {property.operation === 'rent' && <span className="text-sm text-gray-600">/mes</span>}
                                </div>
                              </div>
                              
                              {/* Ubicación */}
                              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="line-clamp-1">{property.location}</span>
                              </div>
                            </div>
                            
                            {/* Características */}
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              {property.bedrooms > 0 && (
                                <div className="flex items-center gap-1">
                                  <Bed className="h-3.5 w-3.5" />
                                  <span>{property.bedrooms}</span>
                                </div>
                              )}
                              {property.bathrooms > 0 && (
                                <div className="flex items-center gap-1">
                                  <Bath className="h-3.5 w-3.5" />
                                  <span>{property.bathrooms}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Maximize className="h-3.5 w-3.5" />
                                <span>{property.constructedArea}m²</span>
                              </div>
                            </div>
                            
                            {/* Descripción */}
                            {property.description && (
                              <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{property.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
              ) : (
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {/* Pastilla de Idealista */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            {/* Logo oficial de Idealista */}
                            <IconHistoricoLogoMobile nombre="idealista" className="w-full h-full" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-medium text-gray-900">Nordeste Real Estate</p>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-green-50 text-green-700 border-green-200">
                              Conectado
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">Oviedo · Cliente desde 2021</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Estado vacío */}
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-3">
                        <div className="flex justify-center">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Search className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">No se encontraron propiedades nuevas</p>
                          <p className="text-sm text-gray-500">Todas las propiedades de {getPlatformName(connectedPlatform)} ya están en tu catálogo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}