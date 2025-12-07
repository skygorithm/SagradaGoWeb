import React from "react";
import { Table, Card, Typography, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { generateReport } from "../utils/reportGenerator";

const { Title } = Typography;

export default function ReportTemplate({ title, columns, data, exportType = "pdf" }) {
  const formattedData = data.map((row, index) => {
    const newRow = { ...row };
    Object.keys(newRow).forEach((key) => {
      const value = newRow[key];

      if (value instanceof Date || dayjs(value, { strict: true }).isValid()) {
        newRow[key] = dayjs(value).format("YYYY-MM-DD HH:mm");

      } else if (typeof value === "number") {
        newRow[key] = value.toLocaleString();
      }
    });

    return { ...newRow, id: row.id || index };
  });

  const handleExport = () => {
    generateReport({
      type: exportType,
      title,
      columns,
      data: formattedData,
    });
  };

  return (
    <Card style={{ margin: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={3}>{title}</Title>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
        >
          Export
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={formattedData}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
}
