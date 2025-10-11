import { OperatingHours } from './types';

// Helper function to get the current date and time in WIB (UTC+7)
const getCurrentWIBTime = () => {
    const now = new Date();
    // Convert to UTC, then add 7 hours for WIB
    const wibOffset = 7 * 60 * 60 * 1000;
    const wibTime = new Date(now.getTime() + wibOffset);
    return wibTime;
};

export const getShopStatus = (operatingHours: OperatingHours) => {
    const now = getCurrentWIBTime();
    
    // Get the day index (0 for Sunday, 1 for Monday, etc. in UTC)
    // We adjust this to be Monday-first and match our data structure
    const dayIndex = now.getUTCDay();
    const days: (keyof OperatingHours)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayKey = days[dayIndex];
    
    const todaysHours = operatingHours[currentDayKey];

    if (!todaysHours.isOpen) {
        return { isOpen: false, message: 'Closed Today' };
    }

    const [openHour, openMinute] = todaysHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = todaysHours.close.split(':').map(Number);
    
    const openTime = new Date(now.getTime());
    openTime.setUTCHours(openHour, openMinute, 0, 0);

    const closeTime = new Date(now.getTime());
    closeTime.setUTCHours(closeHour, closeMinute, 0, 0);

    // Handle overnight closing (e.g., open 22:00, close 02:00)
    if (closeTime < openTime) {
        closeTime.setDate(closeTime.getDate() + 1);
    }
    
    if (now >= openTime && now < closeTime) {
        return { isOpen: true, message: `Open until ${todaysHours.close}` };
    } else {
        return { isOpen: false, message: `Opens at ${todaysHours.open}` };
    }
};
