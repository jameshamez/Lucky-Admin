import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Edit, Eye, UserPlus, Key } from "lucide-react";

const employeeData = [
  {
    id: "EMP-001",
    name: "คุณสมชาย ใจดี",
    position: "หัวหน้าฝ่ายขาย",
    department: "ฝ่ายขาย",
    startDate: "2022-01-15",
    status: "พนักงานประจำ",
    phone: "081-234-5678",
    email: "somchai@company.com",
    username: "somchai.s",
    salary: 35000
  },
  {
    id: "EMP-002",
    name: "คุณสมหญิง รวยเงิน",
    position: "พนักงานขาย",
    department: "ฝ่ายขาย",
    startDate: "2023-03-01",
    status: "พนักงานประจำ",
    phone: "081-345-6789",
    email: "somying@company.com",
    username: "somying.r",
    salary: 25000
  },
  {
    id: "EMP-003",
    name: "คุณสมศักดิ์ ทำงาน",
    position: "นักออกแบบกราฟิก",
    department: "ฝ่ายกราฟิก",
    startDate: "2022-06-15",
    status: "พนักงานประจำ",
    phone: "081-456-7890",
    email: "somsak@company.com",
    username: "somsak.t",
    salary: 28000
  },
  {
    id: "EMP-004",
    name: "คุณสมปอง ผลิต",
    position: "หัวหน้าฝ่ายผลิต",
    department: "ฝ่ายผลิต",
    startDate: "2021-09-01",
    status: "พนักงานประจำ",
    phone: "081-567-8901",
    email: "sompong@company.com",
    username: "sompong.p",
    salary: 32000
  },
  {
    id: "EMP-005",
    name: "คุณสมใจ จัดซื้อ",
    position: "เจ้าหน้าที่จัดซื้อ",
    department: "ฝ่ายจัดซื้อ",
    startDate: "2023-08-15",
    status: "พนักงานทดลองงาน",
    phone: "081-678-9012",
    email: "somjai@company.com",
    username: "somjai.j",
    salary: 22000
  }
];

export default function EmployeeManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการข้อมูลพนักงาน</h1>
          <p className="text-muted-foreground">ฐานข้อมูลพนักงานและข้อมูลการเข้าสู่ระบบ</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-hover">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มพนักงานใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>เพิ่มพนักงานใหม่</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <Input id="name" placeholder="กรอกชื่อ-นามสกุล" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">ตำแหน่ง</Label>
                  <Input id="position" placeholder="กรอกตำแหน่ง" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">แผนก</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกแผนก" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">ฝ่ายขาย</SelectItem>
                      <SelectItem value="design">ฝ่ายกราฟิก</SelectItem>
                      <SelectItem value="production">ฝ่ายผลิต</SelectItem>
                      <SelectItem value="procurement">ฝ่ายจัดซื้อ</SelectItem>
                      <SelectItem value="accounting">ฝ่ายบัญชี</SelectItem>
                      <SelectItem value="hr">ฝ่ายบุคคล</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">สถานะ</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกสถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">พนักงานประจำ</SelectItem>
                      <SelectItem value="contract">พนักงานสัญญาจ้าง</SelectItem>
                      <SelectItem value="trial">พนักงานทดลองงาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input id="phone" placeholder="081-xxx-xxxx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input id="email" placeholder="email@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">เงินเดือน</Label>
                  <Input id="salary" type="number" placeholder="25000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">วันที่เริ่มงาน</Label>
                <Input id="start-date" type="date" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button 
                className="bg-gradient-to-r from-primary to-primary-hover"
                onClick={() => setIsAddDialogOpen(false)}
              >
                บันทึก
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">พนักงานทั้งหมด</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeData.length}</div>
            <p className="text-xs text-muted-foreground">
              คน
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">พนักงานประจำ</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeeData.filter(emp => emp.status === "พนักงานประจำ").length}
            </div>
            <p className="text-xs text-muted-foreground">
              คน
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">พนักงานทดลองงาน</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeeData.filter(emp => emp.status === "พนักงานทดลองงาน").length}
            </div>
            <p className="text-xs text-muted-foreground">
              คน
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เงินเดือนเฉลี่ย</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ฿{Math.round(employeeData.reduce((sum, emp) => sum + emp.salary, 0) / employeeData.length).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              บาท
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="ค้นหาพนักงาน..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="กรองตามแผนก" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกแผนก</SelectItem>
            <SelectItem value="sales">ฝ่ายขาย</SelectItem>
            <SelectItem value="design">ฝ่ายกราฟิก</SelectItem>
            <SelectItem value="production">ฝ่ายผลิต</SelectItem>
            <SelectItem value="procurement">ฝ่ายจัดซื้อ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายชื่อพนักงาน</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัสพนักงาน</TableHead>
                <TableHead>ชื่อ-นามสกุล</TableHead>
                <TableHead>ตำแหน่ง</TableHead>
                <TableHead>แผนก</TableHead>
                <TableHead>วันที่เริ่มงาน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>เงินเดือน</TableHead>
                <TableHead>การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.startDate}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        employee.status === "พนักงานประจำ" ? "default" : 
                        employee.status === "พนักงานทดลองงาน" ? "secondary" : "outline"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>฿{employee.salary.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        ดู
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        แก้ไข
                      </Button>
                      <Button size="sm" variant="outline">
                        <Key className="w-4 h-4 mr-1" />
                        รหัสผ่าน
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}