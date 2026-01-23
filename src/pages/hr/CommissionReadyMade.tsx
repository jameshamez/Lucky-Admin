import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calculator,
  FileSpreadsheet,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data สำหรับงานสำเร็จรูป
const mockReadyMadeOrders = [
  {
    id: "1",
    deliveryDate: "2024-12-15",
    poNumber: "PO-RM-2024-001",
    jobName: "ถ้วยรางวัลพลาสติกไทย 100 ชิ้น",
    productCategorySub: "ถ้วยรางวัล พลาสติก ไทย",
    saleName: "คุณสมชาย ใจดี",
    quantity: 100,
    revenueTotal: 15000,
    costTotal: 10000,
    gpNet: 5000,
    commissionType: "PerUnit",
    commissionRate: 3,
    commissionAmount: 300,
    isCalculated: true
  },
  {
    id: "2",
    deliveryDate: "2024-12-18",
    poNumber: "PO-RM-2024-002",
    jobName: "ถ้วยรางวัลพลาสติกจีน 50 ชิ้น",
    productCategorySub: "ถ้วยรางวัล พลาสติก จีน",
    saleName: "คุณสมหญิง รวยเงิน",
    quantity: 50,
    revenueTotal: 25000,
    costTotal: 18000,
    gpNet: 7000,
    commissionType: "PerUnit",
    commissionRate: 5,
    commissionAmount: 250,
    isCalculated: true
  },
  {
    id: "3",
    deliveryDate: "2024-12-20",
    poNumber: "PO-RM-2024-003",
    jobName: "ถ้วยรางวัลโลหะ S/M 30 ชิ้น",
    productCategorySub: "ถ้วยรางวัล โลหะ S/M",
    saleName: "คุณวิชัย ขยัน",
    quantity: 30,
    revenueTotal: 45000,
    costTotal: 32000,
    gpNet: 13000,
    commissionType: "PerUnit",
    commissionRate: 10,
    commissionAmount: 300,
    isCalculated: true
  },
  {
    id: "4",
    deliveryDate: "2024-12-22",
    poNumber: "PO-RM-2024-004",
    jobName: "ถ้วยรางวัลโลหะ L/XL 20 ชิ้น",
    productCategorySub: "ถ้วยรางวัล โลหะ L/XL",
    saleName: "คุณสมศักดิ์ ทำงาน",
    quantity: 20,
    revenueTotal: 80000,
    costTotal: 60000,
    gpNet: 20000,
    commissionType: "PerUnit",
    commissionRate: 30,
    commissionAmount: 600,
    isCalculated: true
  },
  {
    id: "5",
    deliveryDate: "2024-12-25",
    poNumber: "PO-RM-2024-005",
    jobName: "โล่รางวัล 150 ชิ้น",
    productCategorySub: "โล่รางวัล (ตามราคามาตรฐาน)",
    saleName: "คุณสุดา ดี",
    quantity: 150,
    revenueTotal: 22500,
    costTotal: 16000,
    gpNet: 6500,
    commissionType: "PerUnit",
    commissionRate: 3,
    commissionAmount: 450,
    isCalculated: true
  },
  {
    id: "6",
    deliveryDate: "2024-12-27",
    poNumber: "PO-RM-2024-006",
    jobName: "เหรียญรางวัล 500 ชิ้น",
    productCategorySub: "เหรียญรางวัล (ตามราคามาตรฐาน)",
    saleName: "คุณประยุทธ์ เก่ง",
    quantity: 500,
    revenueTotal: 12500,
    costTotal: 9000,
    gpNet: 3500,
    commissionType: "PerUnit",
    commissionRate: 0.5,
    commissionAmount: 250,
    isCalculated: true
  },
  {
    id: "7",
    deliveryDate: "2024-12-28",
    poNumber: "PO-RM-2024-007",
    jobName: "ระบบวิ่ง 200 คน",
    productCategorySub: "ระบบวิ่ง",
    saleName: "คุณนิภา สวย",
    quantity: 200,
    revenueTotal: 35000,
    costTotal: 25000,
    gpNet: 10000,
    commissionType: "PerUnit",
    commissionRate: 1,
    commissionAmount: 200,
    isCalculated: true
  },
  {
    id: "8",
    deliveryDate: "2024-12-29",
    poNumber: "PO-RM-2024-008",
    jobName: "อะไหล่ชิ้นส่วนถ้วยรางวัล",
    productCategorySub: "อะไหล่ชิ้นส่วนถ้วยรางวัล",
    saleName: "คุณสมบัติ ชัย",
    quantity: 1,
    revenueTotal: 18000,
    costTotal: 14000,
    gpNet: 4000,
    commissionType: "PercentOfSales",
    commissionRate: 5,
    commissionAmount: 900,
    isCalculated: true
  },
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

export default function CommissionReadyMade() {
  const { toast } = useToast();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orders] = useState(mockReadyMadeOrders);

  const filteredOrders = orders.filter(order => {
    const matchSearch = searchQuery === "" || 
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.jobName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.revenueTotal, 0);
  const totalGP = filteredOrders.reduce((sum, order) => sum + order.gpNet, 0);
  const totalCommission = filteredOrders.reduce((sum, order) => sum + order.commissionAmount, 0);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const calculateCommission = (orderIds: string[]) => {
    const ordersToCalculate = orderIds.length > 0 
      ? orders.filter(o => orderIds.includes(o.id))
      : filteredOrders;

    toast({
      title: "คำนวณค่าคอมมิชชั่นเรียบร้อย",
      description: `คำนวณค่าคอมแล้ว ${ordersToCalculate.length} รายการ รวม ฿${ordersToCalculate.reduce((sum, o) => sum + o.commissionAmount, 0).toLocaleString()}`,
    });
  };

  const handleCalculateAll = () => {
    calculateCommission([]);
  };

  const handleCalculateSelected = () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "กรุณาเลือกรายการ",
        description: "โปรดเลือกรายการที่ต้องการคำนวณค่าคอมมิชชั่น",
        variant: "destructive"
      });
      return;
    }
    calculateCommission(selectedOrders);
  };

  const formatCommissionRate = (type: string, rate: number) => {
    if (type === "PerUnit") {
      return `${rate} บาท/ชิ้น`;
    } else {
      return `${rate}% ของยอดขาย`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ค่าคอมมิชชั่น (งานสำเร็จรูป)</h1>
        <p className="text-muted-foreground">คำนวณและจัดการค่าคอมมิชชั่นจากงานสำเร็จรูปของฝ่ายขาย</p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
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
            <div>
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
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">ค้นหา</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาเลขที่ PO หรือชื่องาน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleCalculateAll} className="gap-2">
          <Calculator className="w-4 h-4" />
          คำนวณค่าคอมทั้งหมด (เดือนนี้)
        </Button>
        <Button onClick={handleCalculateSelected} variant="outline" className="gap-2">
          <Calculator className="w-4 h-4" />
          คำนวณค่าคอม (รายการที่เลือก)
        </Button>
        <Button variant="outline" className="gap-2 ml-auto">
          <FileSpreadsheet className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการงานสำเร็จรูป</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>วันที่ส่งงาน</TableHead>
                  <TableHead>เลขที่ PO</TableHead>
                  <TableHead>ชื่องาน</TableHead>
                  <TableHead>ประเภทสินค้า</TableHead>
                  <TableHead className="text-right">จำนวน</TableHead>
                  <TableHead>ผู้สั่งงาน (Sale)</TableHead>
                  <TableHead className="text-right">รายรับรวม</TableHead>
                  <TableHead className="text-right">รายจ่ายรวม</TableHead>
                  <TableHead className="text-right">กำไรสุทธิ GP</TableHead>
                  <TableHead>เรทค่าคอม</TableHead>
                  <TableHead className="text-right">ยอดค่าคอม (บาท)</TableHead>
                  <TableHead>สถานะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>{new Date(order.deliveryDate).toLocaleDateString('th-TH')}</TableCell>
                    <TableCell className="font-medium">{order.poNumber}</TableCell>
                    <TableCell>{order.jobName}</TableCell>
                    <TableCell>{order.productCategorySub}</TableCell>
                    <TableCell className="text-right">{order.quantity.toLocaleString()}</TableCell>
                    <TableCell>{order.saleName}</TableCell>
                    <TableCell className="text-right">฿{order.revenueTotal.toLocaleString()}</TableCell>
                    <TableCell className="text-right">฿{order.costTotal.toLocaleString()}</TableCell>
                    <TableCell className="text-right">฿{order.gpNet.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatCommissionRate(order.commissionType, order.commissionRate)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      ฿{order.commissionAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {order.isCalculated ? (
                        <Badge>คำนวณแล้ว</Badge>
                      ) : (
                        <Badge variant="outline">ยังไม่คำนวณ</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">จำนวนใบงานในเดือนนี้</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOrders}</div>
            <p className="text-sm text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ยอดขายรวม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">฿{totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">รายรับทั้งหมด</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">กำไรสุทธิรวม GP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">฿{totalGP.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">กำไรสุทธิ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">รวมค่าคอมงานสำเร็จรูป</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">฿{totalCommission.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">ค่าคอมมิชชั่นทั้งหมด</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
