import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Minus, AlertTriangle, Package, TrendingDown } from "lucide-react";

const inventoryData = [
  {
    id: "INV-001",
    name: "กระดาษ A4",
    category: "วัสดุการพิมพ์",
    currentStock: 25,
    minimumStock: 50,
    unit: "รีม",
    lastUpdated: "2024-01-20",
    status: "ขาดแคลน"
  },
  {
    id: "INV-002", 
    name: "หมึกสีดำ",
    category: "วัสดุการพิมพ์",
    currentStock: 15,
    minimumStock: 20,
    unit: "ขวด",
    lastUpdated: "2024-01-19",
    status: "ใกล้หมด"
  },
  {
    id: "INV-003",
    name: "ฟิล์มพลาสติก",
    category: "วัสดุบรรจุภัณฑ์",
    currentStock: 120,
    minimumStock: 100,
    unit: "เมตร",
    lastUpdated: "2024-01-18",
    status: "ปกติ"
  },
  {
    id: "INV-004",
    name: "กาวลาเบล",
    category: "วัสดุติดตั้ง",
    currentStock: 8,
    minimumStock: 10,
    unit: "หลอด",
    lastUpdated: "2024-01-17",
    status: "ใกล้หมด"
  }
];

const defectiveItems = [
  {
    id: "DEF-001",
    product: "ป้ายโฆษณา",
    quantity: 2,
    defectType: "สีผิดเพี้ยน",
    reportDate: "2024-01-20",
    reportedBy: "ทีม QC",
    orderRef: "ORD-001",
    action: "ผลิตใหม่"
  },
  {
    id: "DEF-002",
    product: "แผ่นพับ",
    quantity: 50,
    defectType: "พิมพ์ไม่ชัด",
    reportDate: "2024-01-19",
    reportedBy: "ทีม A",
    orderRef: "ORD-002",
    action: "ส่งคืนซัพพลายเออร์"
  }
];

export default function InventoryManagement() {
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [stockAction, setStockAction] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "ขาดแคลน": return "destructive";
      case "ใกล้หมด": return "secondary";
      case "ปกติ": return "default";
      default: return "secondary";
    }
  };

  const lowStockCount = inventoryData.filter(item => 
    item.status === "ขาดแคลน" || item.status === "ใกล้หมด"
  ).length;

  const totalDefective = defectiveItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการสต็อกสินค้า</h1>
          <p className="text-muted-foreground">ระบบควบคุมสต็อกและการเคลื่อนไหวสินค้า</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setStockAction("import")}
              >
                <Plus className="w-4 h-4 mr-2" />
                นำเข้าสินค้า
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>
                  {stockAction === "import" ? "นำเข้าสินค้า" : 
                   stockAction === "export" ? "เบิกสินค้า" : "บันทึกสินค้ามีตำหนิ"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="item">รายการสินค้า</Label>
                  <Input id="item" placeholder="กรอกชื่อสินค้า" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">จำนวน</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">หน่วย</Label>
                  <Input id="unit" placeholder="เช่น ชิ้น, รีม, ขวด" />
                </div>
                {stockAction === "defective" && (
                  <div className="space-y-2">
                    <Label htmlFor="defect-reason">สาเหตุตำหนิ</Label>
                    <Textarea id="defect-reason" placeholder="อธิบายสาเหตุที่ทำให้เกิดตำหนิ" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="notes">หมายเหตุ</Label>
                  <Textarea id="notes" placeholder="รายละเอียดเพิ่มเติม" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsStockDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button 
                  className="bg-gradient-to-r from-primary to-primary-hover"
                  onClick={() => setIsStockDialogOpen(false)}
                >
                  บันทึก
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline"
            onClick={() => {
              setStockAction("export");
              setIsStockDialogOpen(true);
            }}
          >
            <Minus className="w-4 h-4 mr-2" />
            เบิกสินค้า
          </Button>

          <Button 
            variant="destructive"
            onClick={() => {
              setStockAction("defective");
              setIsStockDialogOpen(true);
            }}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            สินค้ามีตำหนิ
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายการสินค้าทั้งหมด</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryData.length}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สินค้าใกล้หมด/ขาดแคลน</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สินค้ามีตำหนิ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalDefective}</div>
            <p className="text-xs text-muted-foreground">ชิ้น</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การเคลื่อนไหววันนี้</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">รายการสต็อก</TabsTrigger>
          <TabsTrigger value="defective">สินค้ามีตำหนิ</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="ค้นหาสินค้า..." className="pl-10" />
            </div>
            <Button variant="outline">
              ขาดแคลน/ใกล้หมดเท่านั้น
            </Button>
          </div>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>รายการสต็อกสินค้า</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสสินค้า</TableHead>
                    <TableHead>ชื่อสินค้า</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead>คงเหลือ</TableHead>
                    <TableHead>ขั้นต่ำ</TableHead>
                    <TableHead>หน่วย</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>อัปเดตล่าสุด</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <span className={item.currentStock < item.minimumStock ? "text-red-600 font-semibold" : ""}>
                          {item.currentStock}
                        </span>
                      </TableCell>
                      <TableCell>{item.minimumStock}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" />
                            เพิ่ม
                          </Button>
                          <Button size="sm" variant="outline">
                            <Minus className="w-4 h-4 mr-1" />
                            เบิก
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

        <TabsContent value="defective" className="space-y-4">
          {/* Defective Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>รายงานสินค้ามีตำหนิ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสรายงาน</TableHead>
                    <TableHead>สินค้า</TableHead>
                    <TableHead>จำนวน</TableHead>
                    <TableHead>ประเภทตำหนิ</TableHead>
                    <TableHead>วันที่รายงาน</TableHead>
                    <TableHead>ผู้รายงาน</TableHead>
                    <TableHead>ออเดอร์อ้างอิง</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defectiveItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell className="text-red-600 font-semibold">{item.quantity}</TableCell>
                      <TableCell>{item.defectType}</TableCell>
                      <TableCell>{item.reportDate}</TableCell>
                      <TableCell>{item.reportedBy}</TableCell>
                      <TableCell>{item.orderRef}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.action}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Defective Summary */}
          <Card>
            <CardHeader>
              <CardTitle>สรุปสินค้ามีตำหนิ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{totalDefective}</div>
                  <p className="text-sm text-muted-foreground">ชิ้นงานมีตำหนิ (เดือนนี้)</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">2.3%</div>
                  <p className="text-sm text-muted-foreground">อัตราตำหนิเฉลี่ย</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <p className="text-sm text-muted-foreground">แก้ไขได้</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}