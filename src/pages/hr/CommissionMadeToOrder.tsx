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
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data สำหรับงานสั่งผลิต
const mockSalesOrders = [
  {
    id: "1",
    deliveryDate: "2024-12-15",
    poNumber: "PO-2024-001",
    jobName: "ถ้วยรางวัลบริษัท XYZ",
    productCategorySub: "ถ้วยสั่งผลิต",
    productGroup: "Trophy",
    saleName: "คุณสมชาย ใจดี",
    quantity: 50,
    revenueTotal: 75000,
    costTotal: 45000,
    managementCost: 5000,
    gpBeforeManagement: 30000,
    gpNet: 25000,
    commissionRate: 4,
    commissionAmount: 1000,
    isCalculated: true
  },
  {
    id: "2",
    deliveryDate: "2024-12-18",
    poNumber: "PO-2024-002",
    jobName: "โล่รางวัลโรงเรียน ABC",
    productCategorySub: "โล่สั่งผลิต",
    productGroup: "Shield",
    saleName: "คุณสมหญิง รวยเงิน",
    quantity: 30,
    revenueTotal: 120000,
    costTotal: 70000,
    managementCost: 8000,
    gpBeforeManagement: 50000,
    gpNet: 42000,
    commissionRate: 5,
    commissionAmount: 2100,
    isCalculated: true
  },
  {
    id: "3",
    deliveryDate: "2024-12-20",
    poNumber: "PO-2024-003",
    jobName: "เหรียญรางวัลการแข่งขัน",
    productCategorySub: "เหรียญสั่งผลิต",
    productGroup: "Medal",
    saleName: "คุณวิชัย ขยัน",
    quantity: 200,
    revenueTotal: 85000,
    costTotal: 60000,
    managementCost: 6000,
    gpBeforeManagement: 25000,
    gpNet: 19000,
    commissionRate: 4,
    commissionAmount: 760,
    isCalculated: true
  },
  {
    id: "4",
    deliveryDate: "2024-12-22",
    poNumber: "PO-2024-004",
    jobName: "ถ้วยรางวัลกีฬาสี",
    productCategorySub: "ถ้วยสั่งผลิต",
    productGroup: "Trophy",
    saleName: "คุณสมศักดิ์ ทำงาน",
    quantity: 25,
    revenueTotal: 45000,
    costTotal: 32000,
    managementCost: 3000,
    gpBeforeManagement: 13000,
    gpNet: 10000,
    commissionRate: 3,
    commissionAmount: 300,
    isCalculated: true
  },
  {
    id: "5",
    deliveryDate: "2024-12-25",
    poNumber: "PO-2024-005",
    jobName: "โล่ประกาศเกียรติคุณ",
    productCategorySub: "โล่สั่งผลิต",
    productGroup: "Shield",
    saleName: "คุณสมชาย ใจดี",
    quantity: 15,
    revenueTotal: 38000,
    costTotal: 28000,
    managementCost: 2000,
    gpBeforeManagement: 10000,
    gpNet: 8000,
    commissionRate: 3,
    commissionAmount: 240,
    isCalculated: true
  },
  {
    id: "6",
    deliveryDate: "2024-12-28",
    poNumber: "PO-2024-006",
    jobName: "ถ้วยรางวัลชนะเลิศ VIP",
    productCategorySub: "ถ้วยสั่งผลิต",
    productGroup: "Trophy",
    saleName: "คุณสุดา ดี",
    quantity: 10,
    revenueTotal: 95000,
    costTotal: 45000,
    managementCost: 4000,
    gpBeforeManagement: 50000,
    gpNet: 46000,
    commissionRate: 5,
    commissionAmount: 2300,
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

export default function CommissionMadeToOrder() {
  const { toast } = useToast();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orders, setOrders] = useState(mockSalesOrders);

  const filteredOrders = orders.filter(order => {
    const matchSearch = searchQuery === "" || 
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.jobName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const totalOrders = filteredOrders.length;
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

  const handleUpdateManagementCost = (orderId: string, newCost: number) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const gpNet = order.gpBeforeManagement - newCost;
        // คำนวณ % ค่าคอมตาม rule (simplified)
        let commissionRate = 0;
        if (order.productGroup === "Trophy" || order.productGroup === "Shield") {
          if (gpNet >= 40001) commissionRate = 5;
          else if (gpNet >= 10001) commissionRate = 4;
          else if (gpNet >= 3001) commissionRate = 3;
        } else if (order.productGroup === "Medal") {
          if (gpNet >= 30001) commissionRate = 5;
          else if (gpNet >= 12001) commissionRate = 4;
          else if (gpNet >= 8001) commissionRate = 3;
        }
        const commissionAmount = gpNet * (commissionRate / 100);
        
        return {
          ...order,
          managementCost: newCost,
          gpNet,
          commissionRate,
          commissionAmount
        };
      }
      return order;
    }));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ค่าคอมมิชชั่น (งานสั่งผลิต)</h1>
        <p className="text-muted-foreground">คำนวณและจัดการค่าคอมมิชชั่นจากงานสั่งผลิตของฝ่ายขาย</p>
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
          <CardTitle>รายการงานสั่งผลิต</CardTitle>
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
                  <TableHead>ผู้สั่งงาน</TableHead>
                  <TableHead className="text-right">รายรับรวม</TableHead>
                  <TableHead className="text-right">รายจ่ายรวม</TableHead>
                  <TableHead className="text-right">GP ก่อนหักค่าบริหาร</TableHead>
                  <TableHead className="text-right">ค่าบริหาร</TableHead>
                  <TableHead className="text-right">GP สุทธิ</TableHead>
                  <TableHead className="text-right">% ค่าคอม</TableHead>
                  <TableHead className="text-right">ยอดค่าคอม</TableHead>
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
                    <TableCell>{order.saleName}</TableCell>
                    <TableCell className="text-right">฿{order.revenueTotal.toLocaleString()}</TableCell>
                    <TableCell className="text-right">฿{order.costTotal.toLocaleString()}</TableCell>
                    <TableCell className="text-right">฿{order.gpBeforeManagement.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={order.managementCost}
                        onChange={(e) => handleUpdateManagementCost(order.id, parseFloat(e.target.value) || 0)}
                        className="w-24 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right font-bold">฿{order.gpNet.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={order.commissionRate > 0 ? "default" : "secondary"}>
                        {order.commissionRate}%
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">จำนวนบิลในเดือนนี้</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOrders}</div>
            <p className="text-sm text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">GP รวมงานสั่งผลิต</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">฿{totalGP.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">กำไรสุทธิรวม</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">รวมค่าคอมงานสั่งผลิต</CardTitle>
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
