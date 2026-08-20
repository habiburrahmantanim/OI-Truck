"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  Truck,
  Wallet,
} from "lucide-react";

interface AdminSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;

  currency: string;
  currencySymbol: string;

  bookingEnabled: boolean;
  instantBooking: boolean;

  emailNotifications: boolean;
  bookingNotifications: boolean;
  paymentNotifications: boolean;
}

const defaultSettings: AdminSettings = {
  siteName: "Truck Lagbe",
  supportEmail: "support@trucklagbe.com",
  supportPhone: "+880 1XXXXXXXXX",
  address: "Dhaka, Bangladesh",

  currency: "BDT",
  currencySymbol: "৳",

  bookingEnabled: true,
  instantBooking: false,

  emailNotifications: true,
  bookingNotifications: true,
  paymentNotifications: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);

  const [isLoaded, setIsLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  /* =========================================
     LOAD SETTINGS
  ========================================= */

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("trucklagbe_admin_settings");

      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);

        setSettings({
          ...defaultSettings,
          ...parsedSettings,
        });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /* =========================================
     UPDATE FIELD
  ========================================= */

  function updateSetting<K extends keyof AdminSettings>(
    key: K,
    value: AdminSettings[K],
  ) {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  }

  /* =========================================
     SAVE SETTINGS
  ========================================= */

  function handleSave() {
    try {
      localStorage.setItem(
        "trucklagbe_admin_settings",
        JSON.stringify(settings),
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);

      alert("Failed to save settings.");
    }
  }

  /* =========================================
     LOADING
  ========================================= */

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="mx-auto animate-spin text-orange-500" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-10">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-orange-600">
            <Settings size={18} />

            <p className="text-sm font-semibold uppercase tracking-wide">
              System Management
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">Settings</h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your Truck Lagbe platform settings and preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          {saved ? (
            <>
              <CheckCircle2 size={18} />
              Saved Successfully
            </>
          ) : (
            <>
              <Save size={18} />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* =====================================
          SUCCESS MESSAGE
      ===================================== */}

      {saved && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          <CheckCircle2 size={20} />

          <p className="text-sm font-semibold">
            Your settings have been saved successfully.
          </p>
        </div>
      )}

      <div className="mt-7 grid gap-7 lg:grid-cols-[230px_1fr]">
        {/* =====================================
            SIDEBAR
        ===================================== */}

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4">
          <p className="px-3 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Settings Menu
          </p>

          <div className="space-y-1">
            <SidebarItem
              icon={<Building2 size={18} />}
              label="Business Information"
            />

            <SidebarItem
              icon={<Wallet size={18} />}
              label="Payment & Currency"
            />

            <SidebarItem icon={<Truck size={18} />} label="Booking Settings" />

            <SidebarItem icon={<Bell size={18} />} label="Notifications" />
          </div>
        </aside>

        {/* =====================================
            SETTINGS CONTENT
        ===================================== */}

        <div className="space-y-7">
          {/* ===================================
              BUSINESS INFORMATION
          =================================== */}

          <SettingsSection
            icon={<Building2 size={21} />}
            title="Business Information"
            description="Update your platform and business contact details."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Platform Name"
                value={settings.siteName}
                onChange={(value) => updateSetting("siteName", value)}
                placeholder="Truck Lagbe"
              />

              <InputField
                label="Support Email"
                type="email"
                value={settings.supportEmail}
                onChange={(value) => updateSetting("supportEmail", value)}
                placeholder="support@example.com"
                icon={<Mail size={17} />}
              />

              <InputField
                label="Support Phone"
                value={settings.supportPhone}
                onChange={(value) => updateSetting("supportPhone", value)}
                placeholder="+880 1XXXXXXXXX"
                icon={<Phone size={17} />}
              />

              <InputField
                label="Business Address"
                value={settings.address}
                onChange={(value) => updateSetting("address", value)}
                placeholder="Dhaka, Bangladesh"
                icon={<MapPin size={17} />}
              />
            </div>
          </SettingsSection>

          {/* ===================================
              CURRENCY
          =================================== */}

          <SettingsSection
            icon={<Wallet size={21} />}
            title="Payment & Currency"
            description="Configure the currency used throughout the platform."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Currency
                </label>

                <div className="relative">
                  <Globe
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={settings.currency}
                    onChange={(event) =>
                      updateSetting("currency", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="BDT">BDT - Bangladeshi Taka</option>

                    <option value="USD">USD - US Dollar</option>

                    <option value="EUR">EUR - Euro</option>

                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>

              <InputField
                label="Currency Symbol"
                value={settings.currencySymbol}
                onChange={(value) => updateSetting("currencySymbol", value)}
                placeholder="৳"
              />
            </div>
          </SettingsSection>

          {/* ===================================
              BOOKING SETTINGS
          =================================== */}

          <SettingsSection
            icon={<Truck size={21} />}
            title="Booking Settings"
            description="Control how customers can create and confirm bookings."
          >
            <div className="space-y-4">
              <ToggleSetting
                title="Enable New Bookings"
                description="Allow customers to create new truck bookings."
                enabled={settings.bookingEnabled}
                onChange={(value) => updateSetting("bookingEnabled", value)}
              />

              <ToggleSetting
                title="Instant Booking Confirmation"
                description="Automatically confirm bookings without manual admin approval."
                enabled={settings.instantBooking}
                onChange={(value) => updateSetting("instantBooking", value)}
              />
            </div>
          </SettingsSection>

          {/* ===================================
              NOTIFICATIONS
          =================================== */}

          <SettingsSection
            icon={<Bell size={21} />}
            title="Notifications"
            description="Choose which important updates you want to receive."
          >
            <div className="space-y-4">
              <ToggleSetting
                title="Email Notifications"
                description="Receive important platform notifications by email."
                enabled={settings.emailNotifications}
                onChange={(value) => updateSetting("emailNotifications", value)}
              />

              <ToggleSetting
                title="New Booking Notifications"
                description="Get notified whenever a customer creates a booking."
                enabled={settings.bookingNotifications}
                onChange={(value) =>
                  updateSetting("bookingNotifications", value)
                }
              />

              <ToggleSetting
                title="Payment Notifications"
                description="Get notified when payment status changes."
                enabled={settings.paymentNotifications}
                onChange={(value) =>
                  updateSetting("paymentNotifications", value)
                }
              />
            </div>
          </SettingsSection>

          {/* ===================================
              BOTTOM SAVE
          =================================== */}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <Save size={18} />
              Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   SETTINGS SECTION
========================================= */

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-orange-100 p-2.5 text-orange-600">
            {icon}
          </div>

          <div>
            <h2 className="font-bold text-slate-900">{title}</h2>

            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

/* =========================================
   SIDEBAR ITEM
========================================= */

function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600">
      <span className="text-slate-400">{icon}</span>

      <span>{label}</span>
    </div>
  );
}

/* =========================================
   INPUT FIELD
========================================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-slate-200 py-3 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100 ${
            icon ? "pl-11" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

/* =========================================
   TOGGLE
========================================= */

function ToggleSetting({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl border border-slate-200 p-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled ? "bg-orange-500" : "bg-slate-300"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
