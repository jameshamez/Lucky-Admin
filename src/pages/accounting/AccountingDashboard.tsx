import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Receipt, 
  TrendingUp,
  FileText,
  Clock,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  CheckCircle2,
  AlertCircle,
  Users,
  ShoppingCart,
  Wallet,
  TrendingDown
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Mock Data
const cashFlowData = [
  { month: "ม.ค.", income: 450000, expense: 320000 },
  { month: "ก.พ.", income: 520000, expense: 380000 },
  { month: "มี.ค.", income: 680000, expense: 420000 },
  { month: "เม.ย.", income: 590000, expense: 390000 },
  { month: "พ.ค.", income: 720000, expense: 450000 },
  { month: "มิ.ย.", income: 850000, expense: 520000 },
];

const kpiData = [
  { name: "งานจัดส่ง", value: 92, target: 90, status: "success" },
  { name: "ปิดใบรับเงิน", value: 88, target: 85, status: "success" },
  { name: "เงินสดย่อย", value: 75, target: 80, status: "warning" },
  { name: "อนุมัติใบเสนอราคา", value: 95, target: 90, status: "success" },
  { name: "บันทึกรายรับ-จ่าย", value: 65, target: 85, status: "danger" },
];

const pendingTasks = [
  { id: "INV-001", task: "บันทึกรายรับจากคำสั่งซื้อ ORD-125", status: "pending", dueDate: "2024-01-20", priority: "high" },
  { id: "PAY-015", task: "อนุมัติการจ่ายเงินซัพพลายเออร์", status: "in-progress", dueDate: "2024-01-18", priority: "high" },
  { id: "REC-032", task: "ออกใบเสร็จรับเงิน - บริษัท ABC", status: "pending", dueDate: "2024-01-22", priority: "medium" },
  { id: "RPT-008", task: "จัดทำรายงานกำไรขาดทุนประจำเดือน", status: "completed", dueDate: "2024-01-15", priority: "low" },
  { id: "CHK-019", task: "ตรวจสอบยอดลูกหนี้คงค้าง", status: "in-progress", dueDate: "2024-01-21", priority: "medium" },
];

const activityLog = [
  { action: "อนุมัติการจ่าย", detail: "PAY-015 - ค่าวัสดุ ฿25,000", user: "สมชาย บัญชี", time: "10 นาทีที่แล้ว" },
  { action: "เพิ่มคำสั่งซื้อ", detail: "ORD-126 - บริษัท XYZ", user: "สมหญิง ขาย", time: "25 นาทีที่แล้ว" },
  { action: "ออกใบเสร็จ", detail: "REC-031 - ฿45,000", user: "สมชาย บัญชี", time: "1 ชั่วโมงที่แล้ว" },
  { action: "บันทึกรายรับ", detail: "INV-089 - ฿67,000", user: "สมศรี บัญชี", time: "2 ชั่วโมงที่แล้ว" },
  { action: "อนุมัติใบเสนอราคา", detail: "QUO-045", user: "ผู้จัดการขาย", time: "3 ชั่วโมงที่แล้ว" },
];

const salesByPerson = [
  { name: "สมชาย", sales: 450000, target: 400000 },
  { name: "สมหญิง", sales: 380000, target: 350000 },
  { name: "วิชัย", sales: 320000, target: 380000 },
  { name: "สมศรี", sales: 290000, target: 300000 },
  { name: "ประเสริฐ", sales: 260000, target: 270000 },
];

const salesByProductType = [
  { type: "เหรียญรางวัล", value: 280000, percentage: 22 },
  { type: "ถ้วยรางวัล", value: 245000, percentage: 19 },
  { type: "คริสตัล", value: 180000, percentage: 14 },
  { type: "อะคริลิก", value: 165000, percentage: 13 },
  { type: "ผ้า", value: 150000, percentage: 12 },
  { type: "อื่นๆ", value: 255000, percentage: 20 },
];

const topProducts = [
  { name: "เหรียญทองแดง พร้อมกล่อง", category: "เหรียญรางวัล", sales: 85000, orders: 45 },
  { name: "ถ้วยคริสตัล Premium", category: "ถ้วยรางวัล", sales: 78000, orders: 38 },
  { name: "ป้าย Acrylic ใส", category: "อะคริลิก", sales: 65000, orders: 52 },
  { name: "ริสแบรนด์ผ้าซาติน", category: "ผ้า", sales: 58000, orders: 67 },
  { name: "พวงกุญแจโลหะ", category: "พวงกุญแจ", sales: 52000, orders: 95 },
];

const accountsReceivable = [
  { company: "บริษัท ABC จำกัด", amount: 125000, dueDate: "2024-01-25", aging: "15 วัน" },
  { company: "ร้าน XYZ", amount: 85000, dueDate: "2024-01-30", aging: "10 วัน" },
  { company: "บริษัท DEF จำกัด", amount: 67000, dueDate: "2024-02-05", aging: "5 วัน" },
];

const accountsPayable = [
  { supplier: "ซัพพลายเออร์ A", amount: 95000, dueDate: "2024-01-22", type: "วัสดุ" },
  { supplier: "ซัพพลายเออร์ B", amount: 58000, dueDate: "2024-01-28", type: "อุปกรณ์" },
  { supplier: "ซัพพลายเออร์ C", amount: 42000, dueDate: "2024-02-01", type: "วัสดุ" },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#f59e0b', '#10b981', '#6366f1'];

export default function AccountingDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  
  // คำนวณ KPI เฉลี่ย
  const averageKPI = Math.round(kpiData.reduce((sum, kpi) => sum + kpi.value, 0) / kpiData.length);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">แดชบอร์ดฝ่ายบัญชี</h1>
          <p className="text-muted-foreground">ภาพรวมข้อมูลทางการเงินแบบ Real-time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* 1. การ์ดสรุปข้อมูลการเงิน */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="ยอดขายเดือนนี้"
          value="฿850,000"
          change="+18% จากเดือนที่แล้ว"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
        />
        <StatsCard
          title="สต็อกสินค้า"
          value="156 รายการ"
          change="-3% จากเดือนที่แล้ว"
          icon={<Package className="h-4 w-4" />}
          trend="down"
        />
        <StatsCard
          title="การเบิกจ่ายวันนี้"
          value="฿28,500"
          change="+12% จากเมื่อวาน"
          icon={<Wallet className="h-4 w-4" />}
          trend="up"
        />
        <StatsCard
          title="รายการรอดำเนินการ"
          value="12 รายการ"
          change="+3 รายการใหม่"
          icon={<Clock className="h-4 w-4" />}
          trend="neutral"
        />
      </div>

      {/* 2. สถานะการดำเนินงาน */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>สถานะการดำเนินงาน</CardTitle>
            <Badge 
              variant={averageKPI >= 85 ? "default" : averageKPI >= 70 ? "secondary" : "destructive"}
              className="text-lg px-4 py-1"
            >
              Job Completion Rate: {averageKPI}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kpiData.map((kpi) => (
              <div key={kpi.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{kpi.name}</span>
                    <Badge 
                      variant="outline" 
                      className={
                        kpi.status === "success" ? "border-green-500 text-green-700" :
                        kpi.status === "warning" ? "border-yellow-500 text-yellow-700" :
                        "border-red-500 text-red-700"
                      }
                    >
                      {kpi.value}%
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">เป้าหมาย: {kpi.target}%</span>
                </div>
                <Progress 
                  value={kpi.value} 
                  className={
                    kpi.status === "success" ? "[&>div]:bg-green-500" :
                    kpi.status === "warning" ? "[&>div]:bg-yellow-500" :
                    "[&>div]:bg-red-500"
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. งานรอดำเนินการ & 4. กิจกรรมล่าสุด */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* งานรอดำเนินการ */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>งานรอดำเนินการ</CardTitle>
              <Badge variant="secondary">{pendingTasks.filter(t => t.status !== "completed").length} รายการ</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
                      <Badge 
                        variant="outline" 
                        className={
                          task.status === "completed" ? "border-green-500 text-green-700" :
                          task.status === "in-progress" ? "border-blue-500 text-blue-700" :
                          "border-yellow-500 text-yellow-700"
                        }
                      >
                        {task.status === "completed" ? "เสร็จสิ้น" : 
                         task.status === "in-progress" ? "ดำเนินการ" : "รอดำเนินการ"}
                      </Badge>
                      {task.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">ด่วน</Badge>
                      )}
                    </div>
                    <p className="text-sm">{task.task}</p>
                    <p className="text-xs text-muted-foreground mt-1">ครบกำหนด: {task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* กิจกรรมล่าสุด */}
        <Card>
          <CardHeader>
            <CardTitle>กิจกรรมล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLog.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.detail}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* กระแสเงินสด 6 เดือน */}
      <Card>
        <CardHeader>
          <CardTitle>กระแสเงินสด 6 เดือนที่ผ่านมา</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                formatter={(value: number) => `฿${value.toLocaleString()}`}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              />
              <Legend />
              <Bar dataKey="income" fill="hsl(var(--primary))" name="รายรับ" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="hsl(var(--destructive))" name="รายจ่าย" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ยอดขายรายบุคคล & ยอดขายตามประเภทสินค้า */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ยอดขายรายบุคคล */}
        <Card>
          <CardHeader>
            <CardTitle>ยอดขายรายบุคคล vs เป้าหมาย</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByPerson} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                <Tooltip 
                  formatter={(value: number) => `฿${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                />
                <Legend />
                <Bar dataKey="sales" fill="hsl(var(--primary))" name="ยอดขายจริง" radius={[0, 8, 8, 0]} />
                <Bar dataKey="target" fill="hsl(var(--secondary))" name="เป้าหมาย" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ยอดขายตามประเภทสินค้า */}
        <Card>
          <CardHeader>
            <CardTitle>ยอดขายตามประเภทสินค้า</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByProductType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {salesByProductType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `฿${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 สินค้าขายดี */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 สินค้าขายดี</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">฿{product.sales.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{product.orders} ออเดอร์</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* รายงานลูกหนี้ & เจ้าหนี้ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* รายงานลูกหนี้ */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>รายงานลูกหนี้</CardTitle>
              <Badge variant="secondary">
                ฿{accountsReceivable.reduce((sum, ar) => sum + ar.amount, 0).toLocaleString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accountsReceivable.map((ar, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{ar.company}</p>
                    <p className="text-sm text-muted-foreground">ครบกำหนด: {ar.dueDate}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      Aging: {ar.aging}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">฿{ar.amount.toLocaleString()}</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      ติดตาม
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* รายงานเจ้าหนี้ */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>รายงานเจ้าหนี้</CardTitle>
              <Badge variant="destructive">
                ฿{accountsPayable.reduce((sum, ap) => sum + ap.amount, 0).toLocaleString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accountsPayable.map((ap, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{ap.supplier}</p>
                    <p className="text-sm text-muted-foreground">ครบกำหนด: {ap.dueDate}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {ap.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-destructive">฿{ap.amount.toLocaleString()}</p>
                    <Button size="sm" className="mt-1">
                      จ่ายเงิน
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>การดำเนินการด่วน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button className="h-20 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              บันทึกรายรับ-รายจ่าย
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="w-6 h-6 mb-2" />
              จัดการลูกหนี้
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ShoppingCart className="w-6 h-6 mb-2" />
              อนุมัติการเบิกจ่าย
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="w-6 h-6 mb-2" />
              รายงานทางการเงิน
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}