export interface BranchSettingsDto {
  currency?: string;
  timezone?: string;
  gst?: number;
  serviceCharge?: number;
  upiVpa?: string;
  businessHours?: Record<string, unknown>;
}

export interface BrandingDto {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface FeatureFlagsDto {
  [key: string]: boolean | string | number;
}

export type SettingsDto = BranchSettingsDto | BrandingDto | FeatureFlagsDto;
