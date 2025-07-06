import { FilterOption } from "@/types/spacex";

export const getDateRange = (period: string) => {
    const now = new Date();
    const end = new Date(now);
    // end.setUTCHours(23, 59, 59, 999); // End of current day

    let start = new Date(now);

    switch (period) {
        case 'Past Week':
            start.setDate(now.getDate() - 7);
            break;
        case 'Past Month':
            start.setMonth(now.getMonth() - 1);
            break;
        case 'Past 3 Months':
            start.setMonth(now.getMonth() - 3);
            break;
        case 'Past 6 Months':
            start.setMonth(now.getMonth() - 6);
            break;
        case 'Past 5 Year':
            start.setFullYear(now.getFullYear() - 5);
            break;
        case 'Past 10 Years':
            start.setFullYear(now.getFullYear() - 10);
            break;
        default:
            start = new Date(0); // All time
    }

    // start.setUTCHours(0, 0, 0, 0); // Start of day
    return {
        start: start.toISOString(),
        end: end.toISOString()
    };
};


export const filterOptions: FilterOption[] = [
    {
        label: 'Past Week',
        value: 'Past Week',
        dateRange: getDateRange('Past week')
    },
    {
        label: 'Past Month',
        value: 'Past Month',
        dateRange: getDateRange('Past Month')
    },
    {
        label: 'Past 3 Months',
        value: 'Past 3 Months',
        dateRange: getDateRange('Past 3 Months')
    },
    {
        label: 'Past 6 Months',
        value: 'Past 6 Months',
        dateRange: getDateRange('Past 6 Months')
    },
    {
        label: 'Past 5 Year',
        value: 'Past 5 Year',
        dateRange: getDateRange('Past 5 Year')
    },
    {
        label: 'Past 10 Years',
        value: 'Past 10 Years',
        dateRange: getDateRange('Past 10 Years')
    },
    {
        label: 'All',
        value: 'All',
        dateRange: {
            start: new Date(0).toISOString(),
            end: new Date().toISOString()
        }
    }
];