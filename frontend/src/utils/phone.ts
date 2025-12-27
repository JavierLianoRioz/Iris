export const PHONE_PREFIX = '34';
export const PHONE_PREFIX_DISPLAY = '+34';

export const stripCountryCode = (phone: string): string => {
    if (phone.startsWith(PHONE_PREFIX)) {
        return phone.substring(PHONE_PREFIX.length);
    }
    return phone;
};

export const hasCountryCode = (phone: string): boolean => {
    return phone.startsWith(PHONE_PREFIX);
};

export const validateSpanishPhone = (phone: string): boolean => {
    const clean = phone.replace(/\D/g, '');
    return clean.length === 9;
};

export const formatForApi = (phone: string): string => {
    const clean = phone.replace(/\D/g, '');
    if (clean.startsWith(PHONE_PREFIX)) {
        return clean;
    }
    return `${PHONE_PREFIX}${clean}`;
};
