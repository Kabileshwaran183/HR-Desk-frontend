import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export default function AnalysisPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        setLoading(true);
        try {
            const res = await axios.get("/api/jobapplications");
            setApplications(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to load applications");
        } finally {
            setLoading(false);
        }
    }

    const validMatches = applications.filter(
        (app) => app.matchPercentage != null
    );
    const avgMatch =
        validMatches.reduce((sum, app) => sum + app.matchPercentage, 0) /
        (validMatches.length || 1);

    // Count by status
    const statusCounts = applications.reduce((acc, app) => {
        const status = app.status || "Applied";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    // Match % distribution buckets for chart data
    const buckets = {
        "0-49%": 0,
        "50-74%": 0,
        "75-100%": 0,
        "N/A": 0,
    };

    applications.forEach((app) => {
        const mp = app.matchPercentage;
        if (mp == null) {
            buckets["N/A"]++;
        } else if (mp < 50) {
            buckets["0-49%"]++;
        } else if (mp < 75) {
            buckets["50-74%"]++;
        } else {
            buckets["75-100%"]++;
        }
    });

    // Prepare data for Recharts
    const chartData = Object.entries(buckets).map(([range, count]) => ({
        range,
        count,
    }));

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Applicant Analysis</h1>

            {loading && <p>Loading applications...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Average Match Percentage</h2>
                        <p className="text-green-700 text-3xl font-bold">
                            {avgMatch.toFixed(2)}%
                        </p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Match Percentage Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={chartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                barSize={60}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#22c55e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Applicant Count by Status</h2>
                        <ul className="list-disc list-inside space-y-1">
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <li key={status}>
                                    <strong>{status}:</strong> {count}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
