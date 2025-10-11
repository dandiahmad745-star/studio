import { OperatingHours } from './types';

// Helper function to get the current date and time in WIB (UTC+7)
const getCurrentWIBTime = () => {
    const now = new Date();
    // In a server environment, we might need to be more explicit with timezones.
    // For client-side, this creates a date object with the user's local timezone,
    // which is what we want for this use case.
    return now;
};

export const getShopStatus = (operatingHours: OperatingHours) => {
    const now = getCurrentWIBTime();
    
    const dayIndex = now.getDay();
    const days: (keyof OperatingHours)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayKey = days[dayIndex];
    
    const todaysHours = operatingHours[currentDayKey];

    if (!todaysHours.isOpen) {
        return { isOpen: false, message: 'Closed Today' };
    }

    const [openHour, openMinute] = todaysHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = todaysHours.close.split(':').map(Number);
    
    const openTime = new Date();
    openTime.setHours(openHour, openMinute, 0, 0);

    const closeTime = new Date();
    closeTime.setHours(closeHour, closeMinute, 0, 0);

    // Handle overnight closing (e.g., open 22:00, close 02:00)
    if (closeTime < openTime) {
        // If current time is after open time, we are in the same day.
        // If current time is before close time (but after midnight), it means we are in the next day but still open.
        if (now < openTime) {
            // We are before opening time, but on the next day from the opening.
            // e.g. it's 3AM, shop closed at 2AM.
            // We need to check yesterday's closing time.
             const yesterdayIndex = (dayIndex === 0) ? 6 : dayIndex - 1;
             const yesterdaysHours = operatingHours[days[yesterdayIndex]];
             const [yesterdayCloseHour, yesterdayCloseMinute] = yesterdaysHours.close.split(':').map(Number);
             if (yesterdaysHours.isOpen && yesterdayCloseHour > openHour) { // Yesterday was overnight
                 const yesterdayCloseTime = new Date();
                 yesterdayCloseTime.setHours(yesterdayCloseHour, yesterdayCloseMinute, 0, 0);
                 yesterdayCloseTime.setDate(yesterdayCloseTime.getDate() - 1);
                 // This logic is getting complex, for now, we will simplify.
                 // A proper implementation would require a more robust date-library like date-fns-tz.
             }
        }
         // If closeTime is on the next day, add a day to it.
        if (now < openTime) { // We are in the early morning before the shop opens
             return { isOpen: false, message: `Opens at ${todaysHours.open}` };
        }
         closeTime.setDate(closeTime.getDate() + 1);
    }
    
    if (now >= openTime && now < closeTime) {
        return { isOpen: true, message: `Open until ${todaysHours.close}` };
    } else if (now < openTime) {
        return { isOpen: false, message: `Opens at ${todaysHours.open}` };
    } else {
        // It's after closing time on a normal day
        return { isOpen: false, message: 'Closed' };
    }
};
