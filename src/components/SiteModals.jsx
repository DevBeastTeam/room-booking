import React, { useState, useEffect } from 'react';
import ContactSupportModal from './ContactSupportModal';
import ScheduleTourModal from './ScheduleTourModal';
import LegalModal from './LegalModal';
import SummerSavingsModal from './SummerSavingsModal';
import Widgets from './Widgets';
import PaddleCheckoutModal from './PaddleCheckoutModal';
import { getSiteSettings, getLegalPages, getSupportInquiries } from '../services/siteDataService';

export default function SiteModals() {
  const [siteSettings, setSiteSettings] = useState(() => getSiteSettings());
  const [legalPages, setLegalPages] = useState(() => getLegalPages());
  const [supportInquiries, setSupportInquiries] = useState(() => getSupportInquiries());

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulePreset, setSchedulePreset] = useState({ bed: '', unit: '' });
  const [legalModalType, setLegalModalType] = useState(null);

  // Paddle Checkout Modal state
  const [isPaddleOpen, setIsPaddleOpen] = useState(false);
  const [paddlePreset, setPaddlePreset] = useState({ item: 'holding_deposit', unit: '', amount: null, customer: null });

  useEffect(() => {
    const handleOpenSchedule = (e) => {
      const { bed = '', unit = '' } = e.detail || {};
      setSchedulePreset({ bed: typeof bed === 'string' ? bed : '', unit: typeof unit === 'string' ? unit : '' });
      setIsScheduleModalOpen(true);
    };

    const handleOpenContact = () => {
      setIsContactModalOpen(true);
    };

    const handleOpenLegal = (e) => {
      const { pageType = 'terms' } = e.detail || {};
      setLegalModalType(pageType);
    };

    const handleOpenPaddle = (e) => {
      const { item = 'holding_deposit', unit = '', amount = null, customer = null } = e.detail || {};
      setPaddlePreset({ item, unit, amount, customer });
      setIsPaddleOpen(true);
    };

    const onSettingsUpdate = (e) => setSiteSettings(e.detail);
    const onLegalUpdate = (e) => setLegalPages(e.detail);
    const onSupportUpdate = (e) => setSupportInquiries(e.detail);

    window.addEventListener('open-schedule-tour', handleOpenSchedule);
    window.addEventListener('open-contact-modal', handleOpenContact);
    window.addEventListener('open-legal-modal', handleOpenLegal);
    window.addEventListener('open-paddle-checkout', handleOpenPaddle);
    window.addEventListener('site-settings-updated', onSettingsUpdate);
    window.addEventListener('legal-pages-updated', onLegalUpdate);
    window.addEventListener('support-inquiries-updated', onSupportUpdate);

    return () => {
      window.removeEventListener('open-schedule-tour', handleOpenSchedule);
      window.removeEventListener('open-contact-modal', handleOpenContact);
      window.removeEventListener('open-legal-modal', handleOpenLegal);
      window.removeEventListener('open-paddle-checkout', handleOpenPaddle);
      window.removeEventListener('site-settings-updated', onSettingsUpdate);
      window.removeEventListener('legal-pages-updated', onLegalUpdate);
      window.removeEventListener('support-inquiries-updated', onSupportUpdate);
    };
  }, []);

  const handleNavigateFloorPlans = () => {
    window.location.href = '/floor-plans';
  };

  const handleOpenScheduleTour = (bed = '', unit = '') => {
    setSchedulePreset({ bed: typeof bed === 'string' ? bed : '', unit: typeof unit === 'string' ? unit : '' });
    setIsScheduleModalOpen(true);
  };

  return (
    <>
      <ContactSupportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        siteSettings={siteSettings}
        onInquirySubmitted={() => {
          setSupportInquiries(getSupportInquiries());
        }}
      />

      <ScheduleTourModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        siteSettings={siteSettings}
        onTourScheduled={() => {
          setSupportInquiries(getSupportInquiries());
        }}
        initialBedrooms={schedulePreset.bed}
        initialUnit={schedulePreset.unit}
      />

      <LegalModal
        isOpen={Boolean(legalModalType)}
        pageType={legalModalType || 'terms'}
        onClose={() => setLegalModalType(null)}
        legalPages={legalPages}
      />

      <PaddleCheckoutModal
        isOpen={isPaddleOpen}
        onClose={() => setIsPaddleOpen(false)}
        initialItem={paddlePreset.item}
        initialUnit={paddlePreset.unit}
        initialAmount={paddlePreset.amount}
        customerPreset={paddlePreset.customer}
      />

      <SummerSavingsModal onNavigateFloorPlans={handleNavigateFloorPlans} />

      <Widgets onOpenScheduleTour={handleOpenScheduleTour} />
    </>
  );
}
