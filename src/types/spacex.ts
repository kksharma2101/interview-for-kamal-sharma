// types/spacex.ts
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
    // payloads: string[];
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
//
// export interface Launch {
//     id: string;
//     name: string;
//     date_utc: string;
//     success: boolean | null;
//     upcoming: boolean;
//     rocket: string;
//     launchpad: string;
//     payloads: {
//         orbit: string;
//         type: string;
//     }[];
//     details: string | null;
//     links: {
//         patch: {
//             small: string;
//         };
//     };
// }

// export interface Rocket {
//     id: string;
//     name: string;
// }

// export interface Launchpad {
//     id: string;
//     name: string;
//     locality: string;
// }