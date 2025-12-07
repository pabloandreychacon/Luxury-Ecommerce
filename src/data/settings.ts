import { supabase } from '../lib/supabase';

export interface BusinessSettings {
  id: number;
  email: string;
  phone: string;
  address: string;
  businessName: string;
  latitude: number;
  longitude: number;
  onlinePassword: string;
  paypalClientId?: string;
}

export const defaultSettings: BusinessSettings = {
  id: 5, // this Id is equal to the Supabase row Id for default Settings table entry
  email: 'info@default.com',
  phone: '(555) 123-4567',
  address: '123 Calle Example, Ciudad, Estado 12345',
  businessName: 'Luxe',
  latitude: 10.007725,
  longitude: -84.099413,
  onlinePassword: '',
  paypalClientId: '',
};

export async function getSettings(): Promise<BusinessSettings> {
  try {
    const { data, error } = await supabase
      .from('Settings')
      .select('Email, Phone, Address, BusinessName, MapLocation, OnlinePassword, PaypalClientId')
      .eq('Id', defaultSettings.id)
      .single();

    if (error) {
      console.error('Supabase getSettings error:', error);
      return defaultSettings;
    }

    if (!data) return defaultSettings;

    let latitude = defaultSettings.latitude;
    let longitude = defaultSettings.longitude;

    if (data.MapLocation) {
      const coords = (data.MapLocation as string).split(',').map((c: string) => parseFloat(c.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        latitude = coords[0];
        longitude = coords[1];
      }
    }

    return {
      id: defaultSettings.id,
      email: (data.Email as string) ?? defaultSettings.email,
      phone: (data.Phone as string) ?? defaultSettings.phone,
      address: (data.Address as string) ?? defaultSettings.address,
      businessName: (data.BusinessName as string) ?? defaultSettings.businessName,
      latitude,
      longitude,
      onlinePassword: (data.OnlinePassword as string) ?? defaultSettings.onlinePassword,
      paypalClientId: (data.PaypalClientId as string) ?? defaultSettings.paypalClientId,
    };
  } catch (err) {
    console.error('getSettings unexpected error', err);
    return defaultSettings;
  }
}
