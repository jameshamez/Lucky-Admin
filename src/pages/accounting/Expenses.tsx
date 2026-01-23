import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Download, Search, Plus, FileText, AlertCircle, Edit } from "lucide-react";

// Mockup data for expenses
const expensesData = [
  {
    id: "EXP-2025-001",
    supplier: "China BENC",
    poNo: "PO-2025-001",
    invoiceNo: "INV-CN-001",
    purchaseDate: "2025-01-10",
    paymentDate: "2025-01-15",
    description: "ปากกาพลาสติก 5000 ชิ้น",
    amount: 75000,
    vat: 5250,
    netAmount: 80250,
    paymentMethod: "โอน",
    paymentStatus: "จ่ายแล้ว",
    remark: "สั่งจากจีน รอสินค้าถึง 25 ม.ค."
  },
  {
    id: "EXP-2025-002",
    supplier: "บริษัท พรีเมี่ยมแบงค์ค็อก จำกัด",
    poNo: "PO-2025-002",
    invoiceNo: "INV-TH-002",
    purchaseDate: "2025-01-12",
    paymentDate: null,
    description: "กระเป๋าผ้า Canvas 500 ใบ",
    amount: 45000,
    vat: 3150,
    netAmount: 48150,
    paymentMethod: "เช็ค",
    paymentStatus: "รออนุมัติ",
    remark: "รอการอนุมัติจากผู้บริหาร"
  },
  {
    id: "EXP-2025-003",
    supplier: "Chaina LINDA",
    poNo: "PO-2025-003",
    invoiceNo: "INV-CN-003",
    purchaseDate: "2025-01-14",
    paymentDate: "2025-01-20",
    description: "แก้วเซรามิค 800 ชิ้น",
    amount: 96000,
    vat: 6720,
    netAmount: 102720,
    paymentMethod: "โอน",
    paymentStatus: "จ่ายแล้ว",
    remark: "จ่ายครบแล้ว รอของถึงไทย"
  },
  {
    id: "EXP-2025-004",
    supplier: "ไทย Solid",
    poNo: "PO-2025-004",
    invoiceNo: "INV-TH-004",
    purchaseDate: "2025-01-16",
    paymentDate: null,
    description: "วัตถุดิบพลาสติก PLA",
    amount: 25000,
    vat: 1750,
    netAmount: 26750,
    paymentMethod: "เงินสด",
    paymentStatus: "รออนุมัติ",
    remark: "สั่งเพิ่มเติมสำหรับงานเร่งด่วน"
  },
  {
    id: "EXP-2025-005",
    supplier: "Papermate",
    poNo: "PO-2025-005",
    invoiceNo: "INV-TH-005",
    purchaseDate: "2025-01-18",
    paymentDate: "2025-01-22",
    description: "กล่องกระดาษพรีเมี่ยม 1000 ใบ",
    amount: 18000,
    vat: 1260,
    netAmount: 19260,
    paymentMethod: "โอน",
    paymentStatus: "จ่ายแล้ว",
    remark: "ของถึงแล้ว เก็บในคลัง"
  },
  {
    id: "EXP-2025-006",
    supplier: "China X",
    poNo: "PO-2025-006",
    invoiceNo: "INV-CN-006",
    purchaseDate: "2025-01-20",
    paymentDate: null,
    description: "พวงกุญแจอะคริลิค 3000 ชิ้น",
    amount: 42000,
    vat: 2940,
    netAmount: 44940,
    paymentMethod: "โอน",
    paymentStatus: "ยกเลิก",
    remark: "ยกเลิกเนื่องจากลูกค้าเปลี่ยนใจ"
  }
];

// Mockup data for expense categories (Pie Chart)
const expenseCategoryData = [
  { name: "โรงงานจีน", value: 213000, color: "hsl(var(--primary))" },
  { name: "โรงงานไทย", value: 88000, color: "hsl(var(--info))" },
  { name: "ค่าขนส่ง", value: 15000, color: "hsl(var(--accent))" },
  { name: "วัสดุสิ้นเปลือง", value: 32000, color: "hsl(var(--warning))" },
  { name: "ค่าแรง", value: 45000, color: "hsl(var(--success))" }
];

// Mockup data for monthly expenses (Bar Chart)
const monthlyExpensesData = [
  { month: "ม.ค.", amount: 28000 },
  { month: "ก.พ.", amount: 32000 },
  { month: "มี.ค.", amount: 29000 },
  { month: "เม.ย.", amount: 35000 },
  { month: "พ.ค.", amount: 31000 },
  { month: "มิ.ย.", amount: 38000 },
  { month: "ก.ค.", amount: 33000 },
  { month: "ส.ค.", amount: 36000 },
  { month: "ก.ย.", amount: 34000 },
  { month: "ต.ค.", amount: 40000 },
  { month: "พ.ย.", amount: 37000 },
  { month: "ธ.ค.", amount: 42000 }
];

export default function Expenses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredExpenses = expensesData.filter(expense => {
    const matchesSearch = expense.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.poNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = filterSupplier === "all" || expense.supplier === filterSupplier;
    const matchesStatus = filterStatus === "all" || expense.paymentStatus === filterStatus;
    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const totalExpenses = expensesData.reduce((sum, exp) => sum + exp.netAmount, 0);
  const avgMonthlyExpense = totalExpenses / 12;
  const pendingApprovals = expensesData.filter(e => e.paymentStatus === "รออนุมัติ").length;
  const totalPaidExpenses = expensesData.filter(e => e.paymentStatus === "จ่ายแล้ว").reduce((sum, exp) => sum + exp.netAmount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "จ่ายแล้ว": return "default";
      case "รออนุมัติ": return "secondary";
      case "ยกเลิก": return "destructive";
      default: return "outline";
    }
  };

  const suppliersList = [
    "Chaina B&C", "Chaina LINDA", "Chaina PN", "Chaina Xiaoli", "Chaina ZJ",
    "China BENC", "China Lanyard A", "China U", "China W", "China X", "China Y", "China Z",
    "Papermate", "Shinemaker", "The101", "บริษัท พรีเมี่ยมแบงค์ค็อก จำกัด", "ไทย Solid", "PV พิวเตอร์"
  ];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">หน้ารายจ่าย</h1>
            <p className="text-muted-foreground">ระบบจัดการรายจ่ายและการสั่งซื้อทั้งหมด</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มรายจ่าย
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>เพิ่มรายการจ่ายใหม่</DialogTitle>
                  <DialogDescription>กรอกข้อมูลรายการจ่ายและหลักฐานการชำระเงิน</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>โรงงาน / ผู้ขาย</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกผู้ขาย" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliersList.map((supplier) => (
                            <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>หมายเลขใบสั่งซื้อ (PO No.)</Label>
                      <Input placeholder="PO-2025-XXX" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>หมายเลขใบแจ้งหนี้</Label>
                      <Input placeholder="INV-XXX-XXX" />
                    </div>
                    <div>
                      <Label>วันที่สั่งซื้อ</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div>
                    <Label>รายละเอียดสินค้า / รายการจ่าย</Label>
                    <Textarea placeholder="ระบุรายละเอียด..." />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>ยอดรวม (บาท)</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div>
                      <Label>VAT 7%</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div>
                      <Label>ยอดสุทธิ</Label>
                      <Input type="number" placeholder="0.00" disabled />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>วิธีการชำระเงิน</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกวิธีชำระ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">เงินสด</SelectItem>
                          <SelectItem value="transfer">โอน</SelectItem>
                          <SelectItem value="check">เช็ค</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>สถานะการชำระเงิน</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกสถานะ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">รออนุมัติ</SelectItem>
                          <SelectItem value="paid">จ่ายแล้ว</SelectItem>
                          <SelectItem value="cancelled">ยกเลิก</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>หมายเหตุ</Label>
                    <Textarea placeholder="บันทึกเพิ่มเติม..." />
                  </div>
                  <div>
                    <Label>แนบหลักฐานการจ่าย</Label>
                    <Input type="file" multiple />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>ยกเลิก</Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>บันทึก</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">รายจ่ายรวมทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">฿{totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">ข้อมูล 12 เดือนย้อนหลัง</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">รายจ่ายเฉลี่ยต่อเดือน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">฿{avgMonthlyExpense.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">เฉลี่ยต่อเดือน</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">จ่ายไปแล้ว</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">฿{totalPaidExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">ยอดที่จ่ายจริง</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">รออนุมัติ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${pendingApprovals > 3 ? 'text-destructive' : 'text-warning'}`}>
                {pendingApprovals} รายการ
              </div>
              <p className="text-xs text-muted-foreground mt-1">ต้องอนุมัติการจ่าย</p>
            </CardContent>
          </Card>
        </div>

        {/* Expense Category Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>สัดส่วนรายจ่ายตามประเภท</CardTitle>
              <CardDescription>แยกตามหมวดหมู่ค่าใช้จ่าย</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>สรุปยอดรายจ่ายรายเดือน</CardTitle>
              <CardDescription>ย้อนหลัง 12 เดือน</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyExpensesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      stroke="hsl(var(--border))"
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      stroke="hsl(var(--border))"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                      }}
                      formatter={(value: number) => [`฿${value.toLocaleString()}`, 'ยอดรายจ่าย']}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการจ่ายทั้งหมด</CardTitle>
            <CardDescription>ข้อมูลการสั่งซื้อและการชำระเงิน</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหารหัส, โรงงาน หรือ PO No..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterSupplier} onValueChange={setFilterSupplier}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="โรงงาน / ผู้ขาย" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {suppliersList.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="สถานะการชำระเงิน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="รออนุมัติ">รออนุมัติ</SelectItem>
                  <SelectItem value="จ่ายแล้ว">จ่ายแล้ว</SelectItem>
                  <SelectItem value="ยกเลิก">ยกเลิก</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสรายการ</TableHead>
                    <TableHead>โรงงาน / ผู้ขาย</TableHead>
                    <TableHead>PO No.</TableHead>
                    <TableHead>Invoice No.</TableHead>
                    <TableHead>รายละเอียด</TableHead>
                    <TableHead>วันที่สั่งซื้อ</TableHead>
                    <TableHead>วันที่จ่ายจริง</TableHead>
                    <TableHead className="text-right">ยอดสุทธิ</TableHead>
                    <TableHead>วิธีชำระ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.id}</TableCell>
                      <TableCell>{expense.supplier}</TableCell>
                      <TableCell className="font-mono text-sm">{expense.poNo}</TableCell>
                      <TableCell className="font-mono text-sm">{expense.invoiceNo}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={expense.description}>
                          {expense.description}
                        </div>
                      </TableCell>
                      <TableCell>{expense.purchaseDate}</TableCell>
                      <TableCell>
                        {expense.paymentDate ? (
                          <span>{expense.paymentDate}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ฿{expense.netAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(expense.paymentStatus)}>
                          {expense.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          แก้ไข
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        {pendingApprovals > 0 && (
          <Card className="border-secondary">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-secondary-foreground" />
                <p className="text-sm font-medium">
                  มีรายการจ่าย {pendingApprovals} รายการที่รออนุมัติ กรุณาตรวจสอบและอนุมัติ
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  );
}
