export function formatDateTimeToCustomString(dateTime: string | Date): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short',
    };

    const parsedDateTime = dateTime instanceof Date ? dateTime : new Date(dateTime);

    return parsedDateTime.toLocaleString('en-US', options);
}

export const getSessionDetails = () => {
    const session = {
        token: localStorage.getItem("token"),
        user: localStorage.getItem("user"),
    }

    return session;
}