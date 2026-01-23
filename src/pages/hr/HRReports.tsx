import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TableRow 
} from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Download, Users, TrendingUp, DollarSign, Award } from "lucide-react";

const performanceData = [
  { month: "ก.ย.", excellent: 3, good: 8, average: 2, poor: 1 },
  { month: "ต.ค.", excellent: 4, good: 7, average: 3, poor: 0 },
  { month: "พ.ย.", excellent: 5, good: 6, average: 2, poor: 1 },
  { month: "ธ.ค.", excellent: 4, good: 8, average: 2, poor: 0 },
  { month: "ม.ค.", excellent: 4, good: 7, average: 3, poor: 0 },
];

const payrollTrends = [
  { month: "ก.ย.", salary: 340000, commission: 45000, bonus: 12000 },
  { month: "ต.ค.", salary: 340000, commission: 52000, bonus: 15000 },
  { month: "พ.ย.", salary: 340000, commission: 48000, bonus: 8000 },
  { month: "ธ.ค.", salary: 355000, commission: 42000, bonus: 25000 },
  { month: "ม.ค.", salary: 355000, commission: 38000, bonus: 10000 },
];

const departmentStats = [
  { name: "ฝ่ายขาย", employees: 6, avgSalary: 28500, turnover: 8.3 },
  { name: "ฝ่ายกราฟิก", employees: 4, avgSalary: 26750, turnover: 5.0 },
  { name: "ฝ่ายผลิต", employees: 8, avgSalary: 24500, turnover: 12.5 },
  { name: "ฝ่ายจัดซื้อ", employees: 3, avgSalary: 25000, turnover: 0 },
  { name: "ฝ่ายบัญชี", employees: 2, avgSalary: 30000, turnover: 0 },
  { name: "ฝ่ายบุคคล", employees: 2, avgSalary: 32000, turnover: 0 },
];

const employeeStatusBreakdown = [
  { name: "พนักงานประจำ", value: 22, color: "#8884d8" },
  { name: "พนักงานสัญญาจ้าง", value: 6, color: "#82ca9d" },
  { name: "พนักงานทดลองงาน", value: 3, color: "#ffc658" },
];

const expensesByCategory = [
  { category: "ค่าเดินทาง", jan: 15000, feb: 18000, mar: 12000 },
  { category: "เบี้ยเลี้ยง", jan: 8000, feb: 9500, mar: 7200 },
  { category: "ค่าฝึกอบรม", jan: 25000, feb: 0, mar: 15000 },
  { category: "อื่นๆ", jan: 5000, feb: 3000, mar: 4500 },
];

const kpiSummary = [
  { department: "ฝ่ายขาย", q1Target: 1500000, q1Actual: 1420000, achievement: 94.7, trend: "down" },
  { department: "ฝ่ายกราฟิก", q1Target: 60, q1Actual: 65, achievement: 108.3, trend: "up" },
  { department: "ฝ่ายผลิต", q1Target: 400, q1Actual: 395, achievement: 98.8, trend: "neutral" },
  { department: "ฝ่ายจัดซื้อ", q1Target: 95, q1Actual: 98, achievement: 103.2, trend: "up" },
];

export default function HRReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">รายงานฝ่ายบุคคล</h1>
          <p className="text-muted-foreground">รายงานและวิเคราะห์ข้อมูลบุคลากรอย่างครอบคลุม</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="q1-2024">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="เลือกช่วงเวลา" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q1-2024">Q1 2024</SelectItem>
              <SelectItem value="q4-2023">Q4 2023</SelectItem>
              <SelectItem value="2023">ปี 2023</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-primary to-primary-hover">
            <Download className="w-4 h-4 mr-2" />
            ส่งออกรายงาน
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">พนักงานทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31</div>
            <p className="text-xs text-green-600">+6.9% จากไตรมาสที่แล้ว</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ค่าจ้างเฉลี่ย</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿27,258</div>
            <p className="text-xs text-green-600">+3.2% จากไตรมาสที่แล้ว</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อัตราลาออก</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.1%</div>
            <p className="text-xs text-red-600">+1.5% จากไตรมาสที่แล้ว</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คะแนน KPI เฉลี่ย</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.2%</div>
            <p className="text-xs text-green-600">+2.8% จากไตรมาสที่แล้ว</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">
            <Award className="w-4 h-4 mr-2" />
            ประสิทธิภาพ
          </TabsTrigger>
          <TabsTrigger value="payroll">
            <DollarSign className="w-4 h-4 mr-2" />
            ค่าตอบแทน
          </TabsTrigger>
          <TabsTrigger value="department">
            <Users className="w-4 h-4 mr-2" />
            สถานะพนักงาน
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <TrendingUp className="w-4 h-4 mr-2" />
            ค่าใช้จ่าย
          </TabsTrigger>
        </TabsList>

        {/* Performance Reports */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>แนวโน้มประสิทธิภาพการทำงาน</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="excellent" stackId="a" fill="#22c55e" name="ดีเยี่ยม" />
                    <Bar dataKey="good" stackId="a" fill="#3b82f6" name="ดี" />
                    <Bar dataKey="average" stackId="a" fill="#f59e0b" name="ปานกลาง" />
                    <Bar dataKey="poor" stackId="a" fill="#ef4444" name="ต้องปรับปรุง" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>สรุป KPI แต่ละแผนก</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>แผนก</TableHead>
                      <TableHead>เป้าหมาย</TableHead>
                      <TableHead>ผลงาน</TableHead>
                      <TableHead>ความสำเร็จ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kpiSummary.map((kpi) => (
                      <TableRow key={kpi.department}>
                        <TableCell className="font-medium">{kpi.department}</TableCell>
                        <TableCell>{kpi.q1Target.toLocaleString()}</TableCell>
                        <TableCell>{kpi.q1Actual.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              kpi.achievement >= 100 ? "default" : 
                              kpi.achievement >= 80 ? "secondary" : "destructive"
                            }
                          >
                            {kpi.achievement.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payroll Reports */}
        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>แนวโน้มค่าตอบแทนรวม</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={payrollTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `฿${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="salary" stroke="#8884d8" name="เงินเดือนพื้นฐาน" />
                  <Line type="monotone" dataKey="commission" stroke="#82ca9d" name="ค่าคอมมิชชัน" />
                  <Line type="monotone" dataKey="bonus" stroke="#ffc658" name="โบนัส" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Status */}
        <TabsContent value="department" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>การกระจายสถานะพนักงาน</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={employeeStatusBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {employeeStatusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>สถิติแต่ละแผนก</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>แผนก</TableHead>
                      <TableHead>จำนวนคน</TableHead>
                      <TableHead>เงินเดือนเฉลี่ย</TableHead>
                      <TableHead>อัตราลาออก</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentStats.map((dept) => (
                      <TableRow key={dept.name}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.employees}</TableCell>
                        <TableCell>฿{dept.avgSalary.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={dept.turnover > 10 ? "text-red-600" : "text-green-600"}>
                            {dept.turnover}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employee Expenses */}
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ค่าใช้จ่ายพนักงานตามหมวดหมู่</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={expensesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => `฿${value.toLocaleString()}`} />
                  <Bar dataKey="jan" fill="#8884d8" name="มกราคม" />
                  <Bar dataKey="feb" fill="#82ca9d" name="กุมภาพันธ์" />
                  <Bar dataKey="mar" fill="#ffc658" name="มีนาคม" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>สรุปค่าใช้จ่ายรายประเภท</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ประเภทค่าใช้จ่าย</TableHead>
                    <TableHead>มกราคม</TableHead>
                    <TableHead>กุมภาพันธ์</TableHead>
                    <TableHead>มีนาคม</TableHead>
                    <TableHead>รวม Q1</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expensesByCategory.map((expense) => {
                    const total = expense.jan + expense.feb + expense.mar;
                    return (
                      <TableRow key={expense.category}>
                        <TableCell className="font-medium">{expense.category}</TableCell>
                        <TableCell>฿{expense.jan.toLocaleString()}</TableCell>
                        <TableCell>฿{expense.feb.toLocaleString()}</TableCell>
                        <TableCell>฿{expense.mar.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">฿{total.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}