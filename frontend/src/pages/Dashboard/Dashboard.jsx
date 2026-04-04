import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';
import './Dashboard.css';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load stats.</div>;

  const { summary, monthlyTrendsRaw, categoryStats, recentTransactions } = stats;

  // Format Monthly Trends Data
  const monthlyDataMap = new Map();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  monthlyTrendsRaw.forEach(item => {
    const month = monthNames[item._id.month - 1];
    if (!monthlyDataMap.has(month)) {
      monthlyDataMap.set(month, { name: month, income: 0, expense: 0 });
    }
    const data = monthlyDataMap.get(month);
    if (item._id.type === 'income') data.income = item.total;
    if (item._id.type === 'expense') data.expense = item.total;
  });
  
  const chartData = Array.from(monthlyDataMap.values());

  // Pie chart handling (showing expenses for example)
  const expenseCatObj = categoryStats.find(c => c._id === 'expense');
  const pieData = expenseCatObj ? expenseCatObj.categories.map(c => ({
    name: c.category,
    value: c.total
  })) : [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="dashboard-grid">
        <div className="card stats-card">
          <div className="stats-icon balance">
            <DollarSign size={24} />
          </div>
          <div className="stats-info">
            <span className="stats-label">Net Balance</span>
            <span className="stats-value">${summary.netBalance.toFixed(2)}</span>
          </div>
        </div>

        <div className="card stats-card">
          <div className="stats-icon income">
            <ArrowUpRight size={24} />
          </div>
          <div className="stats-info">
            <span className="stats-label">Total Income</span>
            <span className="stats-value">${summary.income.toFixed(2)}</span>
          </div>
        </div>

        <div className="card stats-card">
          <div className="stats-icon expense">
            <ArrowDownRight size={24} />
          </div>
          <div className="stats-info">
            <span className="stats-label">Total Expenses</span>
            <span className="stats-value">${summary.expense.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h2 className="chart-header">Monthly Cashflow (Current Year)</h2>
          <div className="chart-container">
            <ResponsiveContainer width="99%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <h2 className="chart-header">Expense Categories</h2>
          <div className="chart-container">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="99%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                No expenses found
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card recent-transactions">
        <h2 className="chart-header">Recent Transactions</h2>
        <div className="transaction-list">
          {recentTransactions.map((tx) => (
            <div className="transaction-item" key={tx._id}>
              <div className="transaction-main">
                <div className={`transaction-icon ${tx.type}`}>
                  {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div className="transaction-details">
                  <span className="transaction-category">{tx.category}</span>
                  <span className="transaction-date">{new Date(tx.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className={`transaction-amount ${tx.type}`}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
              </div>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem 0' }}>No recent transactions</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
