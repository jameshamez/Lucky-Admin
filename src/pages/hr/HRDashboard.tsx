import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DollarSign,
  TrendingUp,
  Award,
  Briefcase,
  Target,
  RefreshCw
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";

// Mock data สำหรับค่าคอมตามพนักงาน
const topCommissionData = [
  { name: "คุณสมชาย ใจดี", commission: 85000 },
  { name: "คุณสมหญิง รวยเงิน", commission: 78000 },
  { name: "คุณสมศักดิ์ ทำงาน", commission: 72000 },
  { name: "คุณวิชัย ขยัน", commission: 68000 },
  { name: "คุณสุดา ดี", commission: 65000 },
  { name: "คุณประยุทธ์ เก่ง", commission: 61000 },
  { name: "คุณนิภา สวย", commission: 58000 },
  { name: "คุณสมบัติ ชัย", commission: 55000 },
  { name: "คุณวารี มั่น", commission: 52000 },
  { name: "คุณกรณ์ สมาร์ท", commission: 48000 },
];

// Mock data ยอดขาย vs GP ตามประเภทสินค้า
const salesGPData = [
  { category: "งานสำเร็จรูป", sales: 1250000, gp: 375000 },
  { category: "งานสั่งผลิต", sales: 2100000, gp: 735000 },
  { category: "Organizer", sales: 850000, gp: 289000 },
];

// Mock data Top 10 พนักงาน
const topEmployees = [
  { 
    rank: 1, 
    name: "คุณสมชาย ใจดี", 
    department: "ฝ่ายขาย", 
    position: "พนักงานขาย",
    readyMade: 35000,
    madeToOrder: 38000,
    organizer: 12000,
    total: 85000
  },
  { 
    rank: 2, 
    name: "คุณสมหญิง รวยเงิน", 
    department: "ฝ่ายขาย", 
    position: "พนักงานขาย",
    readyMade: 28000,
    madeToOrder: 42000,
    organizer: 8000,
    total: 78000
  },
  { 
    rank: 3, 
    name: "คุณสมศักดิ์ ทำงาน", 
    department: "ฝ่ายขาย", 
    position: "หัวหน้าขาย",
    readyMade: 30000,
    madeToOrder: 32000,
    organizer: 10000,
    total: 72000
  },
  { 
    rank: 4, 
    name: "คุณวิชัย ขยัน", 
    department: "ฝ่ายขาย", 
    position: "พนักงานขาย",
    readyMade: 25000,
    madeToOrder: 35000,
    organizer: 8000,
    total: 68000
  },
  { 
    rank: 5, 
    name: "คุณสุดา ดี", 
    department: "ฝ่ายขาย", 
    position: "พนักงานขาย",
    readyMade: 22000,
    madeToOrder: 33000,
    organizer: 10000,
    total: 65000
  },
  { 
    rank: 6, 
    name: "คุณประยุทธ์ เก่ง", 
    department: "ฝ่ายขาย", 
    position: "พนักงานขาย",
    readyMade: 20000,
    madeToOrder: 31000,
    organizer: 10000,
    total: 61000
  },
  { 
    rank: 7, 
    name: "คุณนิภา สวย", 
    department: "ฝ่ายขาย", 
    position: "พนักงานขาย",
    readyMade: 18000,
    madeToOrder: 32000,
    organizer: 8000,
    total: 58000
  },
  { 
    rank: 8, 
    name: "คุณสมบัติ ชัย", 
    department: "ฝ่ายขาย", 
    position: "พนักงานขาย",
    readyMade: 17000,
    madeToOrder: 30000,
    organizer: 8000,
    total: 55000
  },
  { 
    rank: 9, 
    name: "คุณวารี มั่น", 
    department: "ฝ่ายขาย", 
    position: "พนักงานขาย",
    readyMade: 16000,
    madeToOrder: 28000,
    organizer: 8000,
    total: 52000
  },
  { 
    rank: 10, 
    name: "คุณกรณ์ สมาร์ท", 
    department: "ฝ่ายขาย", 
    position: "พนักงานขาย",
    readyMade: 15000,
    madeToOrder: 26000,
    organizer: 7000,
    total: 48000
  },
];

// Mock data KPI แยกตามแผนก
const departmentKPIData = [
  { department: "ฝ่ายขาย", avgKPI: 87.5, employeeCount: 12 },
  { department: "ฝ่ายกราฟิก", avgKPI: 92.3, employeeCount: 8 },
  { department: "ฝ่ายผลิต", avgKPI: 85.7, employeeCount: 15 },
  { department: "ฝ่ายจัดซื้อ", avgKPI: 89.1, employeeCount: 6 },
  { department: "ฝ่ายบัญชี", avgKPI: 91.2, employeeCount: 5 },
  { department: "ฝ่ายบุคคล", avgKPI: 88.9, employeeCount: 3 },
];

const months = [
  { value: "1", label: "มกราคม" },
  { value: "2", label: "กุมภาพันธ์" },
  { value: "3", label: "มีนาคม" },
  { value: "4", label: "เมษายน" },
  { value: "5", label: "พฤษภาคม" },
  { value: "6", label: "มิถุนายน" },
  { value: "7", label: "กรกฎาคม" },
  { value: "8", label: "สิงหาคม" },
  { value: "9", label: "กันยายน" },
  { value: "10", label: "ตุลาคม" },
  { value: "11", label: "พฤศจิกายน" },
  { value: "12", label: "ธันวาคม" },
];

const years = [
  { value: "2022", label: "2565" },
  { value: "2023", label: "2566" },
  { value: "2024", label: "2567" },
  { value: "2025", label: "2568" },
];

export default function HRDashboard() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  const handleRefresh = () => {
    // Logic สำหรับ refresh ข้อมูลตามเดือน/ปีที่เลือก
    console.log("Refreshing data for", selectedMonth, "/", selectedYear);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">แดชบอร์ด HR & Commission</h1>
          <p className="text-muted-foreground">ภาพรวมยอดขาย GP ค่าคอมมิชชั่น Incentive และ KPI พนักงาน</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">เดือน</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกเดือน" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">ปี</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกปี" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex items-end">
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                รีเฟรชข้อมูล
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="ยอดขายรวม"
          value="฿4,200,000"
          change="+15.3% จากเดือนที่แล้ว"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
        />
        <StatsCard
          title="กำไรรวม GP"
          value="฿1,399,000"
          change="+12.8% จากเดือนที่แล้ว"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
        />
        <StatsCard
          title="ค่าคอมมิชชั่นรวม"
          value="฿642,000"
          change="+8.5% จากเดือนที่แล้ว"
          icon={<Award className="h-4 w-4" />}
          trend="up"
        />
        <StatsCard
          title="Incentive แอดมินรวม"
          value="฿125,000"
          change="+5.2% จากเดือนที่แล้ว"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
        />
        <StatsCard
          title="จำนวนงาน / ใบ PO"
          value="156"
          change="+12 งานจากเดือนที่แล้ว"
          icon={<Briefcase className="h-4 w-4" />}
          trend="up"
        />
        <StatsCard
          title="KPI เฉลี่ยทั้งบริษัท"
          value="88.9"
          change="+2.1 คะแนนจากเดือนที่แล้ว"
          icon={<Target className="h-4 w-4" />}
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart 1: ค่าคอมตามพนักงาน */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 ค่าคอมมิชชั่นตามพนักงานขาย</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topCommissionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(value) => `฿${Number(value).toLocaleString()}`} />
                <Bar dataKey="commission" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: ยอดขาย vs GP */}
        <Card>
          <CardHeader>
            <CardTitle>ยอดขาย vs GP ตามประเภทสินค้า</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesGPData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `฿${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="sales" fill="hsl(var(--primary))" name="ยอดขาย" />
                <Bar dataKey="gp" fill="hsl(var(--chart-2))" name="GP" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 พนักงาน ตามยอดค่าคอมในเดือนนี้</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">ลำดับ</TableHead>
                <TableHead>ชื่อพนักงาน</TableHead>
                <TableHead>แผนก</TableHead>
                <TableHead>ตำแหน่ง</TableHead>
                <TableHead className="text-right">งานสำเร็จรูป</TableHead>
                <TableHead className="text-right">งานสั่งผลิต</TableHead>
                <TableHead className="text-right">Organizer</TableHead>
                <TableHead className="text-right">รวมทั้งหมด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topEmployees.map((employee) => (
                <TableRow key={employee.rank}>
                  <TableCell className="font-medium">
                    <Badge variant={employee.rank <= 3 ? "default" : "secondary"}>
                      {employee.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell className="text-right">฿{employee.readyMade.toLocaleString()}</TableCell>
                  <TableCell className="text-right">฿{employee.madeToOrder.toLocaleString()}</TableCell>
                  <TableCell className="text-right">฿{employee.organizer.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">฿{employee.total.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* KPI by Department */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* KPI Table */}
        <Card>
          <CardHeader>
            <CardTitle>KPI เฉลี่ยแยกตามแผนก</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>แผนก</TableHead>
                  <TableHead className="text-right">KPI เฉลี่ย</TableHead>
                  <TableHead className="text-right">จำนวนพนักงาน</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentKPIData.map((dept) => (
                  <TableRow key={dept.department}>
                    <TableCell className="font-medium">{dept.department}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={
                          dept.avgKPI >= 90 ? "default" : 
                          dept.avgKPI >= 80 ? "secondary" : "destructive"
                        }
                      >
                        {dept.avgKPI.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{dept.employeeCount} คน</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* KPI Chart */}
        <Card>
          <CardHeader>
            <CardTitle>กราฟเปรียบเทียบ KPI แต่ละแผนก</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentKPIData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="avgKPI" fill="hsl(var(--chart-3))" name="KPI เฉลี่ย" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
