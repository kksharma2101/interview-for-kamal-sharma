import { useState, useEffect } from 'react';
import { Launch, Rocket, Launchpad, LaunchQuery } from '../types/spacex';
import { getDateRange } from '@/utils/dateUtils';

interface TableData {
    id: string;
    no: number;
    launched: string;
    location: string;
    mission: string;
    orbit: string;
    status: string;
    rocket: string;
    patch: string;
}

const useLaunches = () => {
    const [data, setData] = useState<TableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState<string>('All')
    const [category, setCategory] = useState<string>('all');
    const itemsPerPage = 12;

    const fetchData = async (pageNumber: number, filterPeriod: string, category: string = 'all') => {
        try {
            setLoading(true);
            setError(null)

            const { start, end } = getDateRange(filterPeriod);

            const query: LaunchQuery = {};

            // Handle category filters
            switch (category.toLowerCase()) {
                case 'upcoming':
                    query.upcoming = true;
                    break;
                case 'successful':
                    query.upcoming = false;
                    query.success = true;
                    break;
                case 'failed':
                    query.upcoming = false;
                    query.success = false;
                    break;
                case 'all':
                default:
                    // For 'all', we don't need to add any specific success/upcoming filters
                    break;
            }

            if (start && end) {
                query.date_utc = {
                    $gte: start,
                    $lte: end
                };
            }

            // Fetch launches with pagination
            const response = await fetch(`https://api.spacexdata.com/v5/launches/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    options: {
                        page: pageNumber,
                        limit: itemsPerPage,
                        sort: { date_utc: 'desc' } // Show most recent first
                    }
                })
            });

            const { docs: launches, totalPages: total } = await response.json();


            // Fetch rockets and launchpads in parallel
            const rocketIds = [...new Set(launches.map((l: Launch) => l.rocket))];
            const launchpadIds = [...new Set(launches.map((l: Launch) => l.launchpad))];

            const [rocketsRes, launchpadsRes] = await Promise.all([
                fetch('https://api.spacexdata.com/v4/rockets/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: { _id: { $in: rocketIds } },
                        options: { limit: 100 }
                    })
                }),
                fetch('https://api.spacexdata.com/v4/launchpads/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: { _id: { $in: launchpadIds } },
                        options: { limit: 100 }
                    })
                })
            ]);

            const rocketsData = await rocketsRes.json();
            const launchpadsData = await launchpadsRes.json();

            const rockets: Record<string, Rocket> = {};
            rocketsData.docs.forEach((r: Rocket) => {
                rockets[r.id] = r;
            });

            const launchpads: Record<string, Launchpad> = {};
            launchpadsData.docs.forEach((l: Launchpad) => {
                launchpads[l.id] = l;
            });

            // Transform data for table
            const tableData = launches.map((launch: Launch, index: number) => ({
                id: launch.id,
                no: (pageNumber - 1) * itemsPerPage + index + 1,
                launched: launch.date_utc,
                location: launchpads[launch.launchpad]?.name || 'Unknown',
                mission: launch.name,
                orbit: launch.payloads[0]?.orbit || 'Unknown',
                status: launch.upcoming
                    ? 'Upcoming'
                    : launch.success === null
                        ? 'Unknown'
                        : launch.success
                            ? 'Success'
                            : 'Failed',
                rocket: rockets[launch.rocket]?.name || 'Unknown',
                patch: launch.links.patch.small
            }));

            setData(tableData);
            setTotalPages(total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page, filter, category);
    }, [page, filter, category]);

    const nextPage = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    };

    return {
        data,
        loading,
        error,
        currentPage: page,
        totalPages,
        nextPage,
        prevPage,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        filter,
        setFilter,
        category,
        setCategory
    };
};

export default useLaunches;