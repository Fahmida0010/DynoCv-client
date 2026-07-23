import React, { useEffect, useState } from "react";
import { FaChartPie, FaFileAlt, FaUsers, FaBriefcase, FaClock, FaSpinner } from "react-icons/fa";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// Chart.js কম্পোনেন্ট রেজিস্টার করা
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface StatsData {
  totalCandidates: number;
  activePositions: number;
  totalCvs: number;
  recentCvs: number;
  recentActivity: Array<{ id: number; message: string; time: string }>;
}

const API_URL =`${import.meta.env.VITE_API_URL}/admin/stats`;
 

export const Statistics: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch system stats");
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <FaSpinner className="spinner-border text-primary" style={{ animation: "spin 1s linear infinite" }} />
        <span className="ms-2">Loading system metrics...</span>
      </div>
    );
  }

  if (error || !stats) {
    return <div className="alert alert-danger">{error || "Data unavailable"}</div>;
  }

  // গ্রাফ ১: বার চার্ট কনফিগারেশন
  const barChartData = {
    labels: ["Total Candidates", "Active Positions", "Total CVs Generated"],
    datasets: [
      {
        label: "System Data Count",
        data: [stats.totalCandidates, stats.activePositions, stats.totalCvs],
        backgroundColor: ["rgba(13, 110, 253, 0.7)", "rgba(25, 135, 84, 0.7)", "rgba(13, 202, 240, 0.7)"],
        borderColor: ["#0d6efd", "#198754", "#0dcaf0"],
        borderWidth: 1,
      },
    ],
  };

  // গ্রাফ ২: ডোনাট চার্ট কনফিগারেশন
  const doughnutChartData = {
    labels: ["Candidates", "Positions", "CVs"],
    datasets: [
      {
        data: [stats.totalCandidates, stats.activePositions, stats.totalCvs],
        backgroundColor: ["#0d6efd", "#198754", "#0dcaf0"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="container-fluid px-2 px-md-4 py-3">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">System Statistics</h2>
        <p className="text-muted">Real-time overview of platform activity and metrics.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card bg-primary text-white h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-uppercase small mb-1 opacity-75">Total Candidates</h6>
                <h3 className="mb-0 fw-bold">{stats.totalCandidates.toLocaleString()}</h3>
              </div>
              <FaUsers className="fs-1 opacity-50" />
            </div>
          </div>
        </div>
        
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card bg-success text-white h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-uppercase small mb-1 opacity-75">Active Positions</h6>
                <h3 className="mb-0 fw-bold">{stats.activePositions.toLocaleString()}</h3>
              </div>
              <FaBriefcase className="fs-1 opacity-50" />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="card bg-info text-white h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-uppercase small mb-1 opacity-75">Total CVs Generated</h6>
                <h3 className="mb-0 fw-bold">{stats.totalCvs.toLocaleString()}</h3>
              </div>
              <FaFileAlt className="fs-1 opacity-50" />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="card bg-warning text-dark h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-uppercase small mb-1 opacity-75">New CVs (Last 24h)</h6>
                <h3 className="mb-0 fw-bold">{stats.recentCvs.toLocaleString()}</h3>
              </div>
              <FaClock className="fs-1 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphs / Visualization Section */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm h-100 border-light-subtle">
            <div className="card-header bg-white fw-bold py-3 text-dark">
              System Metrics Distribution (Bar Chart)
            </div>
            <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: "280px" }}>
              <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100 border-light-subtle">
            <div className="card-header bg-white fw-bold py-3 text-dark">
              Proportional Ratio (Doughnut)
            </div>
            <div className="card-body d-flex align-items-center justify-content-center" style={{ maxHeight: "280px" }}>
              <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      {/* System Activity Log */}
      <div className="card shadow-sm border-light-subtle">
        <div className="card-header bg-white fw-bold d-flex align-items-center gap-2 py-3">
          <FaChartPie className="text-primary" /> Recent Platform Insights
        </div>
        <div className="card-body p-0">
          <ul className="list-group list-group-flush mb-0">
            {stats.recentActivity.map((activity) => (
              <li key={activity.id} className="list-group-item d-flex justify-content-between align-items-center small py-3 px-4">
                <span className="text-dark fw-medium">{activity.message}</span>
                <span className="badge bg-light text-muted border px-2 py-1">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};