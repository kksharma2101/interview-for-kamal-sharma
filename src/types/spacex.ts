export interface Launch {
    id: string;
    flight_number: number;
    name: string;
    date_utc: string;
    success: boolean | null;
    upcoming: boolean;
    details: string | null;
    rocket: string;
    launchpad: string;
    payloads: {
        orbit: string;
        type: string;
    }[];
    links: {
        patch: {
            small: string;
            large: string;
        };
        flickr: {
            original: string[];
        };
        webcast: string;
        article: string;
        wikipedia: string;
    };
}

export interface Rocket {
    id: string;
    name: string;
    type: string;
    active: boolean;
    stages: number;
    boosters: number;
    cost_per_launch: number;
    success_rate_pct: number;
    first_flight: string;
    country: string;
    company: string;
    height: {
        meters: number;
        feet: number;
    };
    diameter: {
        meters: number;
        feet: number;
    };
    mass: {
        kg: number;
        lb: number;
    };
    description: string;
    flickr_images: string[];
}

export interface Launchpad {
    id: string;
    name: string;
    full_name: string;
    locality: string;
    region: string;
    latitude: number;
    longitude: number;
    details: string;
}

export interface Payload {
    id: string;
    name: string;
    type: string;
    orbit: string;
    mass_kg: number;
    mass_lbs: number;
}

export interface FilterOption {
    label: string;
    value: string;
    dateRange: {
        start: string;
        end: string;
    };
}

export interface LaunchQuery {
    upcoming?: boolean;
    success?: boolean | null;
    date_utc?: {
        $gte: string;
        $lte: string;
    };
}

export interface PopupProps {
    onSelect: (option: LaunchCategory) => void;
    currentSelection: LaunchCategory;
}

export type TimeRangeOption =
    | "Past Week"
    | "Past Month"
    | "Past 3 Months"
    | "Past 6 Months"
    | "Past Year"
    | "Past 10 Years";

export type LaunchCategory = 'all' | 'upcoming' | 'successful' | 'failed';

export const tableHeadings = [
    { id: 1, name: "No:" },
    { id: 2, name: "Launched (UTC)" },
    { id: 3, name: "Location" },
    { id: 4, name: "Mission" },
    { id: 5, name: "Orbit" },
    { id: 6, name: "Launch Status" },
    { id: 7, name: "Rocket" },
];
