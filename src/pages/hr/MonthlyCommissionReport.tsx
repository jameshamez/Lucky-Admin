import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, FileSpreadsheet, TrendingUp, DollarSign, Package, Users, Award } from "lucide-react";
import { toast } from "sonner";

// Mock Data
const mockEmployees = [
  { id: "1", name: "สมชาย ใจดี", department: "sales" },
  { id: "2", name: "สมหญิง รักงาน", department: "sales" },
  { id: "3", name: "วิชัย มานะ", department: "sales" },
  { id: "4", name: "สุดา สวยงาม", department: "admin" },
  { id: "5", name: "ประเสริฐ เก่งงาน", department: "sales" },
];

const mockCommissionData = [
  { id: "1", employeeId: "1", employeeName: "สมชาย ใจดี", department: "sales", readyMade: 15000, madeToOrder: 45000, organizer: 8000, incentive: 5000, total: 73000 },
  { id: "2", employeeId: "2", employeeName: "สมหญิง รักงาน", department: "sales", readyMade: 12000, madeToOrder: 38000, organizer: 6000, incentive: 4000, total: 60000 },
  { id: "3", employeeId: "3", employeeName: "วิชัย มานะ", department: "sales", readyMade: 18000, madeToOrder: 52000, organizer: 9000, incentive: 6000, total: 85000 },
  { id: "4", employeeId: "4", employeeName: "สุดา สวยงาม", department: "admin", readyMade: 0, madeToOrder: 0, organizer: 0, incentive: 12000, total: 12000 },
  { id: "5", employeeId: "5", employeeName: "ประเสริฐ เก่งงาน", department: "sales", readyMade: 14000, madeToOrder: 41000, organizer: 7000, incentive: 5000, total: 67000 },
];

const mockJobDetails = [
  { id: "1", deliveryDate: "2025-01-15", poNumber: "PO-2501-001", type: "ReadyMade", jobName: "ตู้เสื้อผ้า 2 บาน", employee: "สมชาย ใจดี", commission: 3000, basis: "3% ของยอดขาย", note: "" },
  { id: "2", deliveryDate: "2025-01-18", poNumber: "PO-2501-002", type: "MadeToOrder", jobName: "ชุดครัวบิ้วอิน", employee: "วิชัย มานะ", commission: 8500, basis: "GP 15-20%: 5%", note: "" },
  { id: "3", deliveryDate: "2025-01-20", poNumber: "PO-2501-003", type: "Organizer", jobName: "ชั้นวาง Walk-in", employee: "สมหญิง รักงาน", commission: 2000, basis: "2% ของยอดขาย", note: "" },
  { id: "4", deliveryDate: "2025-01-22", poNumber: "PO-2501-004", type: "ReadyMade", jobName: "โต๊ะทำงาน L-Shape", employee: "ประเสริฐ เก่งงาน", commission: 2500, basis: "3% ของยอดขาย", note: "" },
  { id: "5", deliveryDate: "2025-01-25", poNumber: "PO-2501-005", type: "MadeToOrder", jobName: "ห้องนอนชุดใหญ่", employee: "สมชาย ใจดี", commission: 12000, basis: "GP 20-25%: 7%", note: "งานพิเศษ" },
];

const MonthlyCommissionReport = () => {
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("all");

  // Calculate summary
  const totalCommission = mockCommissionData.reduce((sum, item) => sum + item.total, 0);
  const totalReadyMade = mockCommissionData.reduce((sum, item) => sum + item.readyMade, 0);
  const totalMadeToOrder = mockCommissionData.reduce((sum, item) => sum + item.madeToOrder, 0);
  const totalOrganizer = mockCommissionData.reduce((sum, item) => sum + item.organizer, 0);
  const totalIncentive = mockCommissionData.reduce((sum, item) => sum + item.incentive, 0);

  // Data for commission type chart
  const commissionTypeData = [
    { name: "งานสำเร็จรูป", value: totalReadyMade, color: "#3BB4C1" },
    { name: "งานสั่งผลิต", value: totalMadeToOrder, color: "#6C5CE7" },
    { name: "Organizer", value: totalOrganizer, color: "#0984E3" },
    { name: "Incentive", value: totalIncentive, color: "#FFA726" },
  ];

  // Data for top 10 employees
  const topEmployeesData = [...mockCommissionData]
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map(item => ({
      name: item.employeeName,
      commission: item.total,
    }));

  const handleExportEmployee = () => {
    toast.success("กำลังดาวน์โหลดรายงานตามพนักงาน...");
  };

  const handleExportJobDetail = () => {
    toast.success("กำลังดาวน์โหลดรายละเอียดใบงาน...");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">รายงานค่าคอมมิชชั่นรายเดือน</h1>
          <p className="text-muted-foreground mt-1">สรุปค่าคอมทั้งหมดแยกตามพนักงาน / ประเภทงาน / เดือน</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportEmployee} variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export รายพนักงาน
          </Button>
          <Button onClick={handleExportJobDetail} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export รายละเอียด
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ตัวกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">เดือน</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01">มกราคม</SelectItem>
                  <SelectItem value="02">กุมภาพันธ์</SelectItem>
                  <SelectItem value="03">มีนาคม</SelectItem>
                  <SelectItem value="04">เมษายน</SelectItem>
                  <SelectItem value="05">พฤษภาคม</SelectItem>
                  <SelectItem value="06">มิถุนายน</SelectItem>
                  <SelectItem value="07">กรกฎาคม</SelectItem>
                  <SelectItem value="08">สิงหาคม</SelectItem>
                  <SelectItem value="09">กันยายน</SelectItem>
                  <SelectItem value="10">ตุลาคม</SelectItem>
                  <SelectItem value="11">พฤศจิกายน</SelectItem>
                  <SelectItem value="12">ธันวาคม</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">ปี</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2568</SelectItem>
                  <SelectItem value="2024">2567</SelectItem>
                  <SelectItem value="2023">2566</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">แผนก</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="sales">ฝ่ายขาย</SelectItem>
                  <SelectItem value="admin">ฝ่ายบริหาร</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">พนักงาน</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {mockEmployees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">แสดงรายงาน</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ค่าคอมรวมทั้งหมด</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommission)}</div>
            <p className="text-xs text-muted-foreground mt-1">มกราคม 2568</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">งานสำเร็จรูป</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalReadyMade)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalReadyMade / totalCommission) * 100).toFixed(1)}% ของยอดรวม
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">งานสั่งผลิต</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMadeToOrder)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalMadeToOrder / totalCommission) * 100).toFixed(1)}% ของยอดรวม
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalOrganizer)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalOrganizer / totalCommission) * 100).toFixed(1)}% ของยอดรวม
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incentive แอดมิน</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncentive)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalIncentive / totalCommission) * 100).toFixed(1)}% ของยอดรวม
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>ค่าคอมตามประเภทงาน</CardTitle>
          </CardHeader>
          <CardContent className="shadow-lg" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={commissionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {commissionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 พนักงานค่าคอมสูงสุด</CardTitle>
          </CardHeader>
          <CardContent className="shadow-lg" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topEmployeesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="commission" fill="#6C5CE7" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Employee Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>สรุปค่าคอมตามพนักงาน</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ลำดับ</TableHead>
                <TableHead>ชื่อพนักงาน</TableHead>
                <TableHead>แผนก</TableHead>
                <TableHead className="text-right">งานสำเร็จรูป</TableHead>
                <TableHead className="text-right">งานสั่งผลิต</TableHead>
                <TableHead className="text-right">Organizer</TableHead>
                <TableHead className="text-right">Incentive</TableHead>
                <TableHead className="text-right">รวมค่าคอมทั้งหมด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCommissionData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.employeeName}</TableCell>
                  <TableCell>{item.department === "sales" ? "ฝ่ายขาย" : "ฝ่ายบริหาร"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.readyMade)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.madeToOrder)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.organizer)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.incentive)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/50">
                <TableCell colSpan={3}>รวมทั้งหมด</TableCell>
                <TableCell className="text-right">{formatCurrency(totalReadyMade)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalMadeToOrder)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalOrganizer)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalIncentive)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalCommission)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Job Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายละเอียดใบงาน</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่ส่งงาน</TableHead>
                <TableHead>เลขที่ PO</TableHead>
                <TableHead>ประเภทงาน</TableHead>
                <TableHead>ชื่องาน</TableHead>
                <TableHead>พนักงานขาย</TableHead>
                <TableHead className="text-right">ค่าคอม (บาท)</TableHead>
                <TableHead>ประเภทการคิด</TableHead>
                <TableHead>หมายเหตุ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockJobDetails.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.deliveryDate}</TableCell>
                  <TableCell>{job.poNumber}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      job.type === "ReadyMade" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                      job.type === "MadeToOrder" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    }`}>
                      {job.type === "ReadyMade" ? "สำเร็จรูป" :
                       job.type === "MadeToOrder" ? "สั่งผลิต" :
                       "Organizer"}
                    </span>
                  </TableCell>
                  <TableCell>{job.jobName}</TableCell>
                  <TableCell>{job.employee}</TableCell>
                  <TableCell className="text-right">{formatCurrency(job.commission)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{job.basis}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{job.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">จำนวนใบงานทั้งหมด</p>
              <p className="text-2xl font-bold">{mockJobDetails.length} ใบงาน</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ค่าคอมรวมทั้งบริษัท</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCommission)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ยอดขายรวม</p>
              <p className="text-2xl font-bold">{formatCurrency(1250000)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">GP รวม</p>
              <p className="text-2xl font-bold">{formatCurrency(425000)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyCommissionReport;
