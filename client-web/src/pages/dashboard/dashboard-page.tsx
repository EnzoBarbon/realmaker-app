import { useEffect, useMemo, useState } from 'react';
import { AccountPage } from '../../components/account/account-page';
import { AdminPage } from '../../components/admin/admin-page';
import { AssistantsConfig } from '../../components/assistants/assistants-config';
import { ContactsPage } from '../../components/contacts/contacts-page';
import { DashboardWelcome } from '../../components/dashboard/dashboard-welcome';
import { IntegrationsPage } from '../../components/integrations/integrations-page';
import { BottomNav } from '../../components/layout/bottom-nav';
import { MinimalHeader } from '../../components/layout/minimal-header';
import { MinimalSidebar } from '../../components/layout/minimal-sidebar';
import { LeadsPage } from '../../components/leads/leads-page';
import { AlertConversationsPage } from '../../components/notifications/alert-conversations-page';
import { NotificationsPage } from '../../components/notifications/notifications-page';
import { ProfilePage } from '../../components/profile/profile-page';
import { PropertiesPage } from '../../components/properties/properties-page';
import { PropertyPublicView } from '../../components/properties/property-public-view';
import { SettingsHub } from '../../components/settings/settings-hub';
import { Toaster } from '../../components/ui/sonner';
import { WebsiteBuilder } from '../../components/website/website-builder';
import { getUnreadCount } from '../../utils/conversation-state';
import { getPropertyById } from '../../utils/properties-data';

interface DashboardPageProps {
  onLogout: () => Promise<void>;
  userName: string;
  userEmail: string;
}

export function DashboardPage({ onLogout, userEmail, userName }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('leads');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [unreadConversationsCount, setUnreadConversationsCount] = useState(0);
  const [isTrialUser, setIsTrialUser] = useState(false);
  const [licenseType, setLicenseType] = useState<'trial' | 'monthly' | 'permanent'>('trial');
  const [renewalDate, setRenewalDate] = useState<string>('');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [propertiesKey, setPropertiesKey] = useState(0);
  const [previewPropertyId, setPreviewPropertyId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const initialCount = getUnreadCount();
    setUnreadConversationsCount(initialCount);

    const handleUnreadChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ count: number; unreadIds: string[] }>;
      setUnreadConversationsCount(customEvent.detail.count);
    };

    window.addEventListener('unreadConversationsChanged', handleUnreadChange);
    return () => window.removeEventListener('unreadConversationsChanged', handleUnreadChange);
  }, []);

  useEffect(() => {
    const handleShowPublicView = (event: Event) => {
      const customEvent = event as CustomEvent<{ propertyId: string }>;
      setPreviewPropertyId(customEvent.detail.propertyId);
      setActiveTab('public-property-preview');
    };

    window.addEventListener('showPublicPropertyView', handleShowPublicView);
    return () => window.removeEventListener('showPublicPropertyView', handleShowPublicView);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/settings/profile') {
        setActiveTab('profile');
        window.location.hash = '';
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (newTab: string) => {
    if (newTab === 'properties' && activeTab === 'properties') {
      setPropertiesKey((prev) => prev + 1);
    }
    setActiveTab(newTab);
  };

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case 'home':
        return <DashboardWelcome />;
      case 'config':
        return (
          <AssistantsConfig
            sidebarCollapsed={sidebarCollapsed}
            isMobile={isMobile}
            onBackToSettings={() => setActiveTab('more')}
          />
        );
      case 'integrations':
        return <IntegrationsPage onBackToSettings={() => setActiveTab('more')} />;
      case 'leads':
        return <LeadsPage onNavigateToConfig={() => setActiveTab('config')} />;
      case 'contacts':
        return <ContactsPage />;
      case 'properties':
        return <PropertiesPage key={propertiesKey} />;
      case 'website':
        return <WebsiteBuilder />;
      case 'notifications':
        return (
          <NotificationsPage
            onAlertClick={(alertId) => {
              setSelectedAlertId(alertId);
              setActiveTab('alert-detail');
            }}
            onBackToSettings={() => setActiveTab('more')}
          />
        );
      case 'alert-detail':
        return selectedAlertId ? (
          <AlertConversationsPage
            alertId={selectedAlertId}
            onBack={() => setActiveTab('notifications')}
          />
        ) : null;
      case 'profile':
        return <ProfilePage onBackToSettings={() => setActiveTab('more')} />;
      case 'admin':
        return <AdminPage onBackToSettings={() => setActiveTab('more')} />;
      case 'more':
        return (
          <SettingsHub
            onNavigate={setActiveTab}
            onBackToHub={() => setActiveTab('home')}
            onLogout={onLogout}
            isMobile={isMobile}
          />
        );
      case 'account':
        return <AccountPage onBackToSettings={() => setActiveTab('more')} />;
      case 'help':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-gray-400 mb-2">❓</div>
              <h3 className="font-medium text-gray-900 mb-1">Centro de Ayuda</h3>
              <p className="text-sm text-gray-500">Próximamente disponible</p>
            </div>
          </div>
        );
      default:
        return <DashboardWelcome />;
    }
  }, [activeTab, isMobile, onLogout, selectedAlertId, sidebarCollapsed]);

  return (
    <>
      <Toaster position="top-right" duration={2000} />
      {activeTab === 'public-property-preview' && previewPropertyId ? (
        (() => {
          const property = getPropertyById(previewPropertyId);
          if (!property) return null;
          return (
            <PropertyPublicView
              property={property}
              onClose={() => {
                setPreviewPropertyId(null);
                setActiveTab('properties');
              }}
            />
          );
        })()
      ) : (
        <div className="h-screen flex flex-col bg-gray-50/30">
          <MinimalHeader
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogoClick={() => setActiveTab('home')}
            sidebarCollapsed={sidebarCollapsed}
            onSidebarCollapsedChange={setSidebarCollapsed}
            onLogout={onLogout}
            userName={userName}
            userEmail={userEmail}
            isTrialUser={isTrialUser}
            licenseType={licenseType}
            renewalDate={renewalDate}
          />

          <div className="flex-1 flex overflow-hidden">
            {!isMobile && (
              <MinimalSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                collapsed={sidebarCollapsed}
                onCollapsedChange={setSidebarCollapsed}
                onBackToHub={() => setActiveTab('home')}
                unreadCount={unreadConversationsCount}
              />
            )}

            <main className="flex-1 overflow-auto">
              <div
                className={`max-w-7xl mx-auto ${
                  activeTab === 'more' || activeTab === 'public-property-preview'
                    ? ''
                    : 'p-6 lg:p-8'
                } ${isMobile ? 'pb-24' : ''}`}
              >
                {renderContent}
              </div>
            </main>
          </div>

          {isMobile && (
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              conversationsBadge={
                unreadConversationsCount > 0 ? String(unreadConversationsCount) : undefined
              }
            />
          )}
        </div>
      )}
    </>
  );
}

