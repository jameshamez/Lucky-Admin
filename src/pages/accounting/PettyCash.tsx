import { useState } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  FileSpreadsheet,
  Eye,
  Check,
  Paperclip
} from "lucide-react";
import { toast } from "sonner";

interface PettyCashRequest {
  id: string;
  employee: string;
  department: string;
  amount: number;
  requestDate: string;
  category: string;
  subCategory?: string;
  description: string;
  status: "รออนุมัติ" | "รอเบิกจ่าย" | "จ่ายแล้ว" | "ยกเลิก";
  approver?: string;
  approvedDate?: string;
  paidDate?: string;
  paymentMethod: string;
  clearanceStatus: "รอเคลียร์" | "เคลียร์แล้ว";
  attachments?: string[];
  notes?: string;
}

const EXPENSE_CATEGORIES = [
  { value: "คืนเงินลูกค้า", label: "คืนเงินลูกค้า", hasSubField: "qo" },
  { value: "ค่าน้ำมัน", label: "ค่าน้ำมัน", hasSubField: "mileage" },
  { value: "ค่าทางด่วน", label: "ค่าทางด่วน", hasSubField: "actual" },
  { value: "สวัสดิการพนักงาน", label: "สวัสดิการพนักงาน", hasSubField: "welfare" },
  { value: "ค่าส่งสินค้า", label: "ค่าส่งสินค้า", hasSubField: "delivery" },
  { value: "ค่าเติมน้ำมันรถบริษัท", label: "ค่าเติมน้ำมันรถบริษัท", hasSubField: "vehicle" },
  { value: "ค่าของใช้", label: "ค่าของใช้", hasSubField: "macro" },
  { value: "ค่าสำรองจ่าย", label: "ค่าสำรองจ่าย", hasSubField: null },
  { value: "อื่น ๆ", label: "อื่น ๆ", hasSubField: "other" },
];

const WELFARE_OPTIONS = ["วันเกิด", "รางวัล", "เลี้ยงส่ง"];
const DELIVERY_OPTIONS = ["Goship", "นครชัยแอร์", "มะม่วง", "NTC", "Flash", "Lalamove"];
const VEHICLE_OPTIONS = ["MG 7กฌ3439", "NISSAN 2ฒผ3439", "MG 5ขล2700", "BENZ ภษ298"];

export default function PettyCash() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [requests] = useState<PettyCashRequest[]>([
    {
      id: "PC-20250110-001",
      employee: "สมชาย ใจดี",
      department: "ขาย",
      amount: 1500,
      requestDate: "2025-01-10",
      category: "ค่าน้ำมัน",
      subCategory: "ขาไป: 15,234 km / ขากลับ: 15,456 km",
      description: "เดินทางพบลูกค้า",
      status: "รออนุมัติ",
      paymentMethod: "เงินสด",
      clearanceStatus: "รอเคลียร์",
    },
    {
      id: "PC-20250109-002",
      employee: "สมหญิง รักงาน",
      department: "บัญชี",
      amount: 500,
      requestDate: "2025-01-09",
      category: "ค่าของใช้",
      description: "ซื้อเครื่องเขียน",
      status: "จ่ายแล้ว",
      approver: "ผู้จัดการฝ่ายบัญชี",
      approvedDate: "2025-01-09",
      paidDate: "2025-01-09",
      paymentMethod: "เงินสด",
      clearanceStatus: "เคลียร์แล้ว",
    },
  ]);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "รออนุมัติ").length,
    readyToPay: requests.filter(r => r.status === "รอเบิกจ่าย").length,
    paid: requests.filter(r => r.status === "จ่ายแล้ว").length,
    balance: 50000,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "รออนุมัติ": "secondary",
      "รอเบิกจ่าย": "default",
      "จ่ายแล้ว": "outline",
      "ยกเลิก": "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getCategoryConfig = () => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === selectedCategory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("บันทึกคำขอเบิกเงินสดย่อยสำเร็จ");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">เบิกเงินสดย่อย</h1>
          <p className="text-muted-foreground mt-1">
            บันทึกคำขอเบิกเงินสด พร้อมสถานะการอนุมัติและการจ่าย
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                ขอเบิกใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>สร้างคำขอเบิกเงินสดย่อย</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลคำขอเบิกเงินสดย่อยและรอการอนุมัติ
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">รหัสคำขอ</Label>
                    <Input 
                      id="code" 
                      value="PC-20250110-003" 
                      disabled 
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestDate">วันที่เบิก</Label>
                    <Input 
                      id="requestDate" 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee">ชื่อ-นามสกุลพนักงาน *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกพนักงาน" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp1">สมชาย ใจดี</SelectItem>
                        <SelectItem value="emp2">สมหญิง รักงาน</SelectItem>
                        <SelectItem value="emp3">สมศักดิ์ มั่นคง</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">แผนก *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกแผนก" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">ขาย</SelectItem>
                        <SelectItem value="accounting">บัญชี</SelectItem>
                        <SelectItem value="production">ผลิต</SelectItem>
                        <SelectItem value="procurement">จัดซื้อ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">จำนวนเงิน (บาท) *</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="0.00" 
                      required
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">หมวดหมู่ค่าใช้จ่าย *</Label>
                    <Select 
                      required 
                      value={selectedCategory} 
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกหมวดหมู่" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Conditional Sub-fields */}
                {getCategoryConfig()?.hasSubField === "qo" && (
                  <div className="space-y-2">
                    <Label htmlFor="qoNumber">QO Number</Label>
                    <Input id="qoNumber" placeholder="ระบุเลข QO" />
                  </div>
                )}

                {getCategoryConfig()?.hasSubField === "mileage" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mileageOut">กิโลขาไป (km)</Label>
                      <Input id="mileageOut" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileageReturn">กิโลขากลับ (km)</Label>
                      <Input id="mileageReturn" type="number" placeholder="0" />
                    </div>
                  </div>
                )}

                {getCategoryConfig()?.hasSubField === "actual" && (
                  <div className="space-y-2">
                    <Label htmlFor="tollActual">จำนวนเงินตามจริง</Label>
                    <Input id="tollActual" placeholder="ตามจริง" disabled className="bg-muted" />
                  </div>
                )}

                {getCategoryConfig()?.hasSubField === "welfare" && (
                  <div className="space-y-2">
                    <Label htmlFor="welfareType">ประเภทสวัสดิการ</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภท" />
                      </SelectTrigger>
                      <SelectContent>
                        {WELFARE_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {getCategoryConfig()?.hasSubField === "delivery" && (
                  <div className="space-y-2">
                    <Label htmlFor="deliveryService">บริการขนส่ง</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกบริการ" />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIVERY_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {getCategoryConfig()?.hasSubField === "vehicle" && (
                  <div className="space-y-2">
                    <Label htmlFor="vehicleId">ทะเบียนรถ</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกรถ" />
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICLE_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {getCategoryConfig()?.hasSubField === "macro" && (
                  <div className="space-y-2">
                    <Label htmlFor="macroDetails">รายละเอียด Macro</Label>
                    <Input id="macroDetails" placeholder="ระบุรายละเอียด" />
                  </div>
                )}

                {getCategoryConfig()?.hasSubField === "other" && (
                  <div className="space-y-2">
                    <Label htmlFor="otherDetails">โปรดระบุเพิ่มเติม</Label>
                    <Input id="otherDetails" placeholder="ระบุรายละเอียด" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">รายละเอียดการเบิก *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="อธิบายรายละเอียดการเบิกเงิน" 
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="approver">ผู้อนุมัติ *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกผู้อนุมัติ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mgr1">ผู้จัดการฝ่ายบัญชี</SelectItem>
                        <SelectItem value="mgr2">ผู้จัดการฝ่ายขาย</SelectItem>
                        <SelectItem value="mgr3">ผู้อำนวยการ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">ช่องทางจ่ายเงิน *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกช่องทาง" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">เงินสด</SelectItem>
                        <SelectItem value="transfer">โอน</SelectItem>
                        <SelectItem value="promptpay">PromptPay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachments">แนบเอกสาร/ใบเสร็จ</Label>
                  <Input id="attachments" type="file" multiple />
                  <p className="text-xs text-muted-foreground">
                    รองรับไฟล์ PDF, JPG, PNG (ไม่เกิน 5MB ต่อไฟล์)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">หมายเหตุ</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)" 
                    rows={2}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button type="submit">บันทึกคำขอ</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatsCard
          title="เบิกทั้งหมด"
          value={stats.total}
          icon={<Wallet className="h-4 w-4" />}
          trend="neutral"
        />
        <StatsCard
          title="รออนุมัติ"
          value={stats.pending}
          icon={<Clock className="h-4 w-4" />}
          trend="neutral"
        />
        <StatsCard
          title="รอเบิกจ่าย"
          value={stats.readyToPay}
          icon={<AlertCircle className="h-4 w-4" />}
          trend="neutral"
        />
        <StatsCard
          title="จ่ายแล้ว"
          value={stats.paid}
          icon={<CheckCircle2 className="h-4 w-4" />}
          trend="neutral"
        />
        <StatsCard
          title="คงเหลือกองกลาง"
          value={`฿${stats.balance.toLocaleString()}`}
          icon={<Wallet className="h-4 w-4" />}
          trend="neutral"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ค้นหาและกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="pending">รออนุมัติ</SelectItem>
                <SelectItem value="ready">รอเบิกจ่าย</SelectItem>
                <SelectItem value="paid">จ่ายแล้ว</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="แผนก" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="sales">ขาย</SelectItem>
                <SelectItem value="accounting">บัญชี</SelectItem>
                <SelectItem value="production">ผลิต</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="หมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {EXPENSE_CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" placeholder="วันที่" />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการเบิกเงินสดย่อย</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัสคำขอ</TableHead>
                <TableHead>พนักงาน</TableHead>
                <TableHead>แผนก</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead className="text-right">จำนวนเงิน</TableHead>
                <TableHead>วันที่เบิก</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>ผู้อนุมัติ</TableHead>
                <TableHead>วันที่จ่าย</TableHead>
                <TableHead>การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.employee}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.category}</TableCell>
                  <TableCell className="text-right">
                    ฿{request.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{request.approver || "-"}</TableCell>
                  <TableCell>{request.paidDate || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === "รออนุมัติ" && (
                        <Button variant="ghost" size="sm">
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
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
