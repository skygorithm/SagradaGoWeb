import React, { useState } from 'react';
import { FloatButton, Modal, Progress, Select, Tag } from 'antd';
import {
    CommentOutlined,
    HeartOutlined,
    PlusOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "../styles/donationModal.css";

const FloatingButton = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const donationHistory = [
        { id: 1, amount: "1.00", type: "In Kind", date: "Nov 29, 2025", status: "PENDING", color: "orange" },
        { id: 2, amount: "1200.00", type: "Cash", date: "Nov 22, 2025", status: "CONFIRMED", color: "green" },
    ];

    return (
        <>
            <FloatButton.Group
                trigger="click"
                style={{ right: 24, bottom: 24 }}
                icon={<PlusOutlined />}
            >
                <FloatButton
                    icon={<CommentOutlined />}
                    tooltip={<div>Chat</div>}
                    onClick={() => navigate('/chat')}
                />
                <FloatButton
                    icon={<HeartOutlined />}
                    tooltip={<div>Donate</div>}
                    onClick={() => setIsModalOpen(true)}
                />
            </FloatButton.Group>

            <Modal
                title={null}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={600}
                className="donation-modal"
                centered
            >
                <div className="donation-container">
                    <h2 className="main-title">Donations</h2>
                    <p className="sub-title">Make a donation to support our cause.</p>

                    {/* Summary Card */}
                    <div className="summary-card">
                        <div className="progress-line"></div>
                        <p>You have donated a total of:</p>
                        <h1>PHP 1,201.00</h1>
                    </div>

                    <h3 className="history-title">Your Donation History</h3>

                    {/* Filter Dropdown */}
                    <Select defaultValue="all" className="filter-select" suffixIcon={null}>
                        <Select.Option value="all">All Donations</Select.Option>
                    </Select>

                    {/* Donation List */}
                    <div className="history-list">
                        {donationHistory.map((item) => (
                            <div key={item.id} className={`history-card ${item.color}-border`}>
                                <div className="card-header">
                                    <span className="amount">PHP {item.amount}</span>
                                    <Tag color={item.color === 'green' ? 'success' : 'warning'}>
                                        {item.status}
                                    </Tag>
                                </div>
                                <div className="card-body">
                                    <p className="type">{item.type}</p>
                                    <p className="date"><CalendarOutlined /> {item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="make-donation-btn" onClick={() => navigate('/donate')}>
                        Make a Donation
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default FloatingButton;