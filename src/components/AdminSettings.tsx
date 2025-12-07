import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import bcryptjs from 'bcryptjs';
import { supabase } from '../lib/supabase';
import { getSettings, defaultSettings } from '../data/settings';

export default function AdminSettings() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mapLocation, setMapLocation] = useState('');
  const [paypalClientId, setPaypalClientId] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getSettings();
    setEmail(data.email);
    setPhone(data.phone);
    setAddress(data.address);
    setBusinessName(data.businessName);
    setMapLocation(`${data.latitude}, ${data.longitude}`);
    setPaypalClientId(data.paypalClientId || '');
  };

  const handleSave = async (field: string, value: any) => {
    const updateData: any = { [field]: value };

    if (field === 'OnlinePassword') {
      updateData[field] = await bcryptjs.hash(value, 10);
    }

    await supabase
      .from('Settings')
      .update(updateData)
      .eq('Id', defaultSettings.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('contact.email')}
        </label>
        <input
          type="email"
          defaultValue={email}
          onBlur={(e) => handleSave('email', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('contact.phone')}
        </label>
        <input
          type="tel"
          defaultValue={phone}
          onBlur={(e) => handleSave('phone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('contact.address')}
        </label>
        <input
          type="text"
          defaultValue={address}
          onBlur={(e) => handleSave('address', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('admin.businessName')}
        </label>
        <input
          type="text"
          defaultValue={businessName}
          onBlur={(e) => handleSave('BusinessName', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('admin.mapLocation')}
        </label>
        <input
          type="text"
          defaultValue={mapLocation}
          onBlur={(e) => handleSave('MapLocation', e.target.value)}
          placeholder="lat, lng"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('admin.paypalClientId')}
        </label>
        <input
          type="text"
          defaultValue={paypalClientId}
          onBlur={(e) => handleSave('PaypalClientId', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('admin.newPassword')}
        </label>
        <input
          type="password"
          placeholder={t('admin.passwordPlaceholder')}
          onBlur={(e) => e.target.value && handleSave('OnlinePassword', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
        />
      </div>
    </div>
  );
}
