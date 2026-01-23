import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data สำหรับพนักงาน (ข้อมูลเต็ม)
const mockEmployees = [
  { id: "1", fullName: "คุณสมชาย ใจดี", nickname: "ชาย", department: "Sale", position: "พนักงานขาย", level: "L2", isPrimarySales: true, status: "Active", hireDate: "2023-01-15", remark: "" },
  { id: "2", fullName: "คุณสมหญิง รวยเงิน", nickname: "หญิง", department: "Sale", position: "พนักงานขาย", level: "L3", isPrimarySales: true, status: "Active", hireDate: "2022-06-20", remark: "" },
  { id: "3", fullName: "คุณวิชัย ขยัน", nickname: "วิชัย", department: "Sale", position: "พนักงานขาย", level: "L2", isPrimarySales: true, status: "Active", hireDate: "2023-03-10", remark: "" },
  { id: "4", fullName: "คุณสมศักดิ์ ทำงาน", nickname: "ศักดิ์", department: "Sale", position: "หัวหน้าขาย", level: "Senior", isPrimarySales: true, status: "Active", hireDate: "2020-01-05", remark: "" },
  { id: "5", fullName: "คุณสุดา ดี", nickname: "สุดา", department: "Admin", position: "ผู้จัดการแอดมิน", level: "Senior", isPrimarySales: false, status: "Active", hireDate: "2021-08-15", remark: "" },
  { id: "6", fullName: "คุณประยุทธ์ เก่ง", nickname: "ยุทธ์", department: "Sale", position: "พนักงานขาย", level: "L1", isPrimarySales: true, status: "Active", hireDate: "2023-09-01", remark: "" },
];

// Mock data สำหรับเรทงานสำเร็จรูป
const mockReadyMadeRates = [
  { id: "1", productCategory: "ถ้วยรางวัล พลาสติก ไทย", commissionType: "PerUnit", ratePerUnit: 3, percentOfSales: null, unit: "ชิ้น", active: true },
  { id: "2", productCategory: "ถ้วยรางวัล พลาสติก จีน", commissionType: "PerUnit", ratePerUnit: 5, percentOfSales: null, unit: "ชิ้น", active: true },
  { id: "3", productCategory: "ถ้วยรางวัล โลหะ S/M", commissionType: "PerUnit", ratePerUnit: 10, percentOfSales: null, unit: "ชิ้น", active: true },
  { id: "4", productCategory: "ถ้วยรางวัล โลหะ L/XL", commissionType: "PerUnit", ratePerUnit: 30, percentOfSales: null, unit: "ชิ้น", active: true },
  { id: "5", productCategory: "โล่รางวัล (ตามราคามาตรฐาน)", commissionType: "PerUnit", ratePerUnit: 3, percentOfSales: null, unit: "ชิ้น", active: true },
  { id: "6", productCategory: "เหรียญรางวัล (ตามราคามาตรฐาน)", commissionType: "PerUnit", ratePerUnit: 0.5, percentOfSales: null, unit: "ชิ้น", active: true },
  { id: "7", productCategory: "ระบบวิ่ง", commissionType: "PerUnit", ratePerUnit: 1, percentOfSales: null, unit: "คน", active: true },
  { id: "8", productCategory: "อะไหล่ชิ้นส่วนถ้วยรางวัล", commissionType: "PercentOfSales", ratePerUnit: null, percentOfSales: 5, unit: "-", active: true },
];

// Mock data สำหรับเรทงานสั่งผลิต (ตาม GP)
const mockMadeToOrderRates = [
  // Trophy
  { id: "1", productGroup: "Trophy", gpMin: 3001, gpMax: 10000, commissionPercent: 3, active: true },
  { id: "2", productGroup: "Trophy", gpMin: 10001, gpMax: 40000, commissionPercent: 4, active: true },
  { id: "3", productGroup: "Trophy", gpMin: 40001, gpMax: null, commissionPercent: 5, active: true },
  // Shield
  { id: "4", productGroup: "Shield", gpMin: 3001, gpMax: 10000, commissionPercent: 3, active: true },
  { id: "5", productGroup: "Shield", gpMin: 10001, gpMax: 40000, commissionPercent: 4, active: true },
  { id: "6", productGroup: "Shield", gpMin: 40001, gpMax: null, commissionPercent: 5, active: true },
  // Medal
  { id: "7", productGroup: "Medal", gpMin: 8001, gpMax: 12000, commissionPercent: 3, active: true },
  { id: "8", productGroup: "Medal", gpMin: 12001, gpMax: 30000, commissionPercent: 4, active: true },
  { id: "9", productGroup: "Medal", gpMin: 30001, gpMax: null, commissionPercent: 5, active: true },
  // Other
  { id: "10", productGroup: "OtherMadeToOrder", gpMin: 3001, gpMax: 10000, commissionPercent: 3, active: true },
  { id: "11", productGroup: "OtherMadeToOrder", gpMin: 10001, gpMax: 40000, commissionPercent: 4, active: true },
  { id: "12", productGroup: "OtherMadeToOrder", gpMin: 40001, gpMax: null, commissionPercent: 5, active: true },
];

// Mock data สำหรับ Incentive แอดมิน
const mockIncentiveRules = [
  { id: "1", minSales: 2300000, maxSales: 2499999, incentivePerPerson: 500, active: true },
  { id: "2", minSales: 2500000, maxSales: 2699999, incentivePerPerson: 2500, active: true },
  { id: "3", minSales: 2700000, maxSales: 2999999, incentivePerPerson: 3000, active: true },
  { id: "4", minSales: 3000000, maxSales: 3499999, incentivePerPerson: 3500, active: true },
  { id: "5", minSales: 3500000, maxSales: 3999999, incentivePerPerson: 4000, active: true },
  { id: "6", minSales: 4000000, maxSales: 4999999, incentivePerPerson: 4500, active: true },
  { id: "7", minSales: 5000000, maxSales: null, incentivePerPerson: 5000, active: true },
];

// Mock data สำหรับ KPI
const mockKPIRecords = [
  { id: "1", employeeId: "1", employeeName: "คุณสมชาย ใจดี", department: "Sale", month: "2024-12", kpiScore: 95, remark: "ผลงานดีเยี่ยม" },
  { id: "2", employeeId: "2", employeeName: "คุณสมหญิง รวยเงิน", department: "Sale", month: "2024-12", kpiScore: 92, remark: "" },
  { id: "3", employeeId: "3", employeeName: "คุณวิชัย ขยัน", department: "Sale", month: "2024-12", kpiScore: 88, remark: "ดี" },
  { id: "4", employeeId: "4", employeeName: "คุณสมศักดิ์ ทำงาน", department: "Sale", month: "2024-12", kpiScore: 97, remark: "ยอดเยี่ยม" },
  { id: "5", employeeId: "5", employeeName: "คุณสุดา ดี", department: "Admin", month: "2024-12", kpiScore: 90, remark: "" },
];

// Mock data สำหรับ KPI Integration Settings
const mockKPIIntegrations = [
  { id: "1", department: "Sale", dataSourceType: "GoogleSheet", sheetUrl: "https://docs.google.com/spreadsheets/d/...", apiEndpoint: "", note: "Sheet KPI ฝ่ายขาย", active: true },
  { id: "2", department: "Admin", dataSourceType: "Manual", sheetUrl: "", apiEndpoint: "", note: "บันทึกด้วยตนเอง", active: true },
  { id: "3", department: "Accounting", dataSourceType: "API", sheetUrl: "", apiEndpoint: "https://api.example.com/kpi", note: "ดึงจากระบบบัญชี", active: false },
];

type Employee = {
  id: string;
  fullName: string;
  nickname: string;
  department: string;
  position: string;
  level: string;
  isPrimarySales: boolean;
  status: string;
  hireDate: string;
  remark: string;
};

export default function HRSettings() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2024-12");
  const [employees, setEmployees] = useState(mockEmployees);
  
  // Dialog states
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);
  
  // Form states for employee
  const [employeeForm, setEmployeeForm] = useState({
    fullName: "",
    nickname: "",
    department: "Sale",
    position: "",
    level: "L1",
    isPrimarySales: false,
    status: "Active",
    hireDate: new Date().toISOString().split('T')[0],
    remark: "",
  });

  const resetEmployeeForm = () => {
    setEmployeeForm({
      fullName: "",
      nickname: "",
      department: "Sale",
      position: "",
      level: "L1",
      isPrimarySales: false,
      status: "Active",
      hireDate: new Date().toISOString().split('T')[0],
      remark: "",
    });
    setEditingEmployee(null);
  };

  const handleAddNew = (type: string) => {
    if (type === "พนักงาน") {
      resetEmployeeForm();
      setIsEmployeeDialogOpen(true);
    } else {
      toast({
        title: "เพิ่มข้อมูลใหม่",
        description: `เปิดฟอร์มเพิ่ม${type}`,
      });
    }
  };

  const handleEdit = (type: string, id: string) => {
    if (type === "พนักงาน") {
      const emp = employees.find(e => e.id === id);
      if (emp) {
        setEditingEmployee(emp);
        setEmployeeForm({
          fullName: emp.fullName,
          nickname: emp.nickname,
          department: emp.department,
          position: emp.position,
          level: emp.level,
          isPrimarySales: emp.isPrimarySales,
          status: emp.status,
          hireDate: emp.hireDate,
          remark: emp.remark,
        });
        setIsEmployeeDialogOpen(true);
      }
    } else {
      toast({
        title: "เปิดฟอร์มแก้ไข",
        description: `กำลังเปิดฟอร์มแก้ไข${type} ID: ${id}`,
      });
    }
  };

  const handleDelete = (type: string, id: string) => {
    setDeleteTarget({ type, id });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === "พนักงาน") {
        setEmployees(employees.filter(e => e.id !== deleteTarget.id));
        toast({
          title: "ลบข้อมูลสำเร็จ",
          description: "ลบข้อมูลพนักงานแล้ว",
        });
      } else {
        toast({
          title: "ลบข้อมูล",
          description: `ลบ${deleteTarget.type} ID: ${deleteTarget.id}`,
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleSaveEmployee = () => {
    if (editingEmployee) {
      // Update existing employee
      setEmployees(employees.map(e => 
        e.id === editingEmployee.id 
          ? { ...e, ...employeeForm }
          : e
      ));
      toast({
        title: "อัพเดทสำเร็จ",
        description: "อัพเดทข้อมูลพนักงานแล้ว",
      });
    } else {
      // Add new employee
      const newEmployee = {
        id: String(employees.length + 1),
        ...employeeForm,
      };
      setEmployees([...employees, newEmployee]);
      toast({
        title: "เพิ่มข้อมูลสำเร็จ",
        description: "เพิ่มพนักงานใหม่แล้ว",
      });
    }
    setIsEmployeeDialogOpen(false);
    resetEmployeeForm();
  };

  const formatProductGroup = (group: string) => {
    const labels: { [key: string]: string } = {
      "Trophy": "ถ้วยรางวัล",
      "Shield": "โล่รางวัล",
      "Medal": "เหรียญรางวัล",
      "OtherMadeToOrder": "งานสั่งผลิตอื่นๆ"
    };
    return labels[group] || group;
  };

  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredKPIRecords = mockKPIRecords.filter(record =>
    record.month === selectedMonth
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ตั้งค่า (ฝ่าย HR & Commission)</h1>
        <p className="text-muted-foreground">ศูนย์กลางการตั้งค่าทั้งหมดสำหรับฝ่าย HR การจัดการค่าคอมมิชชั่น Incentive และ KPI</p>
      </div>

      {/* Employee Dialog */}
      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลพนักงานให้ครบถ้วน
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">ชื่อ-นามสกุล *</Label>
                <Input
                  id="fullName"
                  value={employeeForm.fullName}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })}
                  placeholder="คุณสมชาย ใจดี"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">ชื่อเล่น</Label>
                <Input
                  id="nickname"
                  value={employeeForm.nickname}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, nickname: e.target.value })}
                  placeholder="ชาย"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">แผนก *</Label>
                <Select value={employeeForm.department} onValueChange={(value) => setEmployeeForm({ ...employeeForm, department: value })}>
                  <SelectTrigger id="department">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sale">Sale</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Logistics">Logistics</SelectItem>
                    <SelectItem value="Accounting">Accounting</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">ตำแหน่ง *</Label>
                <Input
                  id="position"
                  value={employeeForm.position}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                  placeholder="พนักงานขาย"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select value={employeeForm.level} onValueChange={(value) => setEmployeeForm({ ...employeeForm, level: value })}>
                  <SelectTrigger id="level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L1">L1</SelectItem>
                    <SelectItem value="L2">L2</SelectItem>
                    <SelectItem value="L3">L3</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Leader">Leader</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">สถานะ *</Label>
                <Select value={employeeForm.status} onValueChange={(value) => setEmployeeForm({ ...employeeForm, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hireDate">วันที่เริ่มงาน *</Label>
              <Input
                id="hireDate"
                type="date"
                value={employeeForm.hireDate}
                onChange={(e) => setEmployeeForm({ ...employeeForm, hireDate: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrimarySales"
                checked={employeeForm.isPrimarySales}
                onCheckedChange={(checked) => setEmployeeForm({ ...employeeForm, isPrimarySales: checked as boolean })}
              />
              <Label htmlFor="isPrimarySales" className="cursor-pointer">
                เป็นพนักงานขายประจำ
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remark">หมายเหตุ</Label>
              <Input
                id="remark"
                value={employeeForm.remark}
                onChange={(e) => setEmployeeForm({ ...employeeForm, remark: e.target.value })}
                placeholder="หมายเหตุเพิ่มเติม"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSaveEmployee}>
              {editingEmployee ? "บันทึกการแก้ไข" : "เพิ่มพนักงาน"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              ลบข้อมูล
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tabs */}
      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="employees">ข้อมูลพนักงาน</TabsTrigger>
          <TabsTrigger value="ready-made">คอมมิชชั่น — สำเร็จรูป</TabsTrigger>
          <TabsTrigger value="made-to-order">คอมมิชชั่น — สั่งผลิต (GP)</TabsTrigger>
          <TabsTrigger value="incentive">Incentive แอดมิน</TabsTrigger>
          <TabsTrigger value="kpi">KPI พนักงาน</TabsTrigger>
          <TabsTrigger value="kpi-integration">การเชื่อม KPI แผนก</TabsTrigger>
        </TabsList>

        {/* Tab 1: ข้อมูลพนักงาน */}
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>จัดการข้อมูลพนักงาน</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาพนักงาน..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={() => handleAddNew("พนักงาน")} className="gap-2">
                  <Plus className="w-4 h-4" />
                  เพิ่มพนักงาน
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อพนักงาน</TableHead>
                    <TableHead>ชื่อเล่น</TableHead>
                    <TableHead>แผนก</TableHead>
                    <TableHead>ตำแหน่ง</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>พนักงานขายประจำ</TableHead>
                    <TableHead>วันที่เริ่มงาน</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.fullName}</TableCell>
                      <TableCell>{emp.nickname}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{emp.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={emp.isPrimarySales}
                          onCheckedChange={(checked) => {
                            setEmployees(employees.map(e => 
                              e.id === emp.id ? { ...e, isPrimarySales: checked as boolean } : e
                            ));
                          }}
                        />
                      </TableCell>
                      <TableCell>{new Date(emp.hireDate).toLocaleDateString('th-TH')}</TableCell>
                      <TableCell>
                        <Badge variant={emp.status === "Active" ? "default" : "secondary"}>
                          {emp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit("พนักงาน", emp.id);
                            }}
                            className="hover:bg-accent"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete("พนักงาน", emp.id);
                            }}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: คอมมิชชั่น — สำเร็จรูป */}
        <TabsContent value="ready-made" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>เรทค่าคอมงานสำเร็จรูป</CardTitle>
              <Button onClick={() => handleAddNew("เรทสำเร็จรูป")} className="gap-2">
                <Plus className="w-4 h-4" />
                เพิ่มเรทใหม่
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ประเภทสินค้า</TableHead>
                    <TableHead>ประเภทการคิดคอม</TableHead>
                    <TableHead className="text-right">อัตราค่าคอม</TableHead>
                    <TableHead>หน่วย</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReadyMadeRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.productCategory}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {rate.commissionType === "PerUnit" ? "ต่อหน่วย" : "% ยอดขาย"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {rate.ratePerUnit ? `฿${rate.ratePerUnit}` : `${rate.percentOfSales}%`}
                      </TableCell>
                      <TableCell>{rate.unit}</TableCell>
                      <TableCell>
                        <Badge variant={rate.active ? "default" : "secondary"}>
                          {rate.active ? "ใช้งาน" : "ปิดใช้งาน"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit("เรท", rate.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("เรท", rate.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: คอมมิชชั่น — สั่งผลิต (GP) */}
        <TabsContent value="made-to-order" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>เรทค่าคอมงานสั่งผลิต (ตาม GP)</CardTitle>
              <Button onClick={() => handleAddNew("Tier GP")} className="gap-2">
                <Plus className="w-4 h-4" />
                เพิ่ม Tier ใหม่
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {["Trophy", "Shield", "Medal", "OtherMadeToOrder"].map((group) => (
                <div key={group}>
                  <h3 className="font-semibold mb-3 text-lg">กลุ่ม: {formatProductGroup(group)}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">GP ขั้นต่ำ (บาท)</TableHead>
                        <TableHead className="text-right">GP ขั้นสูง (บาท)</TableHead>
                        <TableHead className="text-right">% ค่าคอมมิชชั่น</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead className="text-right">จัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMadeToOrderRates
                        .filter(rate => rate.productGroup === group)
                        .map((rate) => (
                          <TableRow key={rate.id}>
                            <TableCell className="text-right">
                              ฿{rate.gpMin.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {rate.gpMax ? `฿${rate.gpMax.toLocaleString()}` : "ไม่จำกัด"}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {rate.commissionPercent}%
                            </TableCell>
                            <TableCell>
                              <Badge variant={rate.active ? "default" : "secondary"}>
                                {rate.active ? "ใช้งาน" : "ปิดใช้งาน"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit("Tier", rate.id)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete("Tier", rate.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Incentive แอดมิน */}
        <TabsContent value="incentive" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>ค่า Incentive แอดมิน</CardTitle>
              <Button onClick={() => handleAddNew("ขั้น Incentive")} className="gap-2">
                <Plus className="w-4 h-4" />
                เพิ่มขั้น Incentive
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">ยอดขายขั้นต่ำ (บาท)</TableHead>
                    <TableHead className="text-right">ยอดขายขั้นสูง (บาท)</TableHead>
                    <TableHead className="text-right">เงินรางวัลต่อคน/เดือน (บาท)</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockIncentiveRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="text-right">
                        ฿{rule.minSales.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {rule.maxSales ? `฿${rule.maxSales.toLocaleString()}` : "ไม่จำกัด"}
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        ฿{rule.incentivePerPerson.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {rule.active ? "ใช้งาน" : "ปิดใช้งาน"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit("Incentive", rule.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("Incentive", rule.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: KPI พนักงาน */}
        <TabsContent value="kpi" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>KPI พนักงาน</CardTitle>
              <div className="flex gap-2">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-40">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-11">พฤศจิกายน 2567</SelectItem>
                    <SelectItem value="2024-12">ธันวาคม 2567</SelectItem>
                    <SelectItem value="2025-01">มกราคม 2568</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => handleAddNew("คะแนน KPI")} className="gap-2">
                  <Plus className="w-4 h-4" />
                  เพิ่ม KPI
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>พนักงาน</TableHead>
                    <TableHead>แผนก</TableHead>
                    <TableHead>เดือน</TableHead>
                    <TableHead className="text-right">KPI Score</TableHead>
                    <TableHead>หมายเหตุ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKPIRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>{new Date(record.month + "-01").toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={record.kpiScore >= 90 ? "default" : "secondary"}>
                          {record.kpiScore}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.remark}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit("KPI", record.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("KPI", record.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: การเชื่อม KPI แผนก */}
        <TabsContent value="kpi-integration" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>การเชื่อม KPI จากแต่ละแผนก</CardTitle>
              <Button onClick={() => handleAddNew("แหล่งข้อมูล KPI")} className="gap-2">
                <Plus className="w-4 h-4" />
                เพิ่มแหล่งข้อมูล
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>แผนก</TableHead>
                    <TableHead>ประเภทแหล่งข้อมูล</TableHead>
                    <TableHead>URL / Endpoint</TableHead>
                    <TableHead>หมายเหตุ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockKPIIntegrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell className="font-medium">{integration.department}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{integration.dataSourceType}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {integration.sheetUrl || integration.apiEndpoint || "-"}
                      </TableCell>
                      <TableCell>{integration.note}</TableCell>
                      <TableCell>
                        <Badge variant={integration.active ? "default" : "secondary"}>
                          {integration.active ? "ใช้งาน" : "ปิดใช้งาน"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit("Integration", integration.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("Integration", integration.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

