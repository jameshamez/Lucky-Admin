import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  AlertTriangle,
  XCircle,
  Lock,
  Search,
  Eye,
  Edit,
  ArrowRightLeft,
  Printer,
  Download,
} from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ProductInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Mock data
  const stats = [
    { label: "รายการทั้งหมด", value: "1,248", icon: Package, color: "text-primary" },
    { label: "มูลค่าสต๊อกรวม", value: "฿12,450,000", icon: Package, color: "text-success" },
    { label: "สต๊อกต่ำกว่า Min", value: "45", icon: AlertTriangle, color: "text-warning" },
    { label: "สต๊อกหมด", value: "12", icon: XCircle, color: "text-destructive" },
    { label: "รายการกักกัน", value: "8", icon: Lock, color: "text-muted-foreground" },
  ];

  const products = [
    {
      id: 1,
      sku: "PRD-001",
      barcode: "1234567890123",
      name: "กล่องกระดาษลูกฟูก A4",
      category: "บรรจุภัณฑ์",
      unit: "กล่อง",
      location: "คลัง A-01",
      min: 100,
      max: 500,
      reorder: 150,
      onHand: 85,
      allocated: 20,
      available: 65,
      avgCost: 25.50,
      lastCost: 26.00,
      stockValue: 2210,
      supplier: "บริษัท ABC จำกัด",
      leadTime: "7 วัน",
      valuationMethod: "FIFO",
      status: "ต่ำกว่า Min",
    },
    {
      id: 2,
      sku: "PRD-002",
      barcode: "1234567890124",
      name: "สติ๊กเกอร์กันน้ำ",
      category: "วัสดุพิมพ์",
      unit: "ม้วน",
      location: "คลัง A-02",
      min: 50,
      max: 200,
      reorder: 75,
      onHand: 120,
      allocated: 10,
      available: 110,
      avgCost: 150.00,
      lastCost: 155.00,
      stockValue: 18600,
      supplier: "บริษัท XYZ จำกัด",
      leadTime: "5 วัน",
      valuationMethod: "Average",
      status: "ปกติ",
    },
  ];

  const movements = [
    {
      id: 1,
      datetime: "2024-01-15 10:30",
      type: "รับเข้า",
      docRef: "PO-2024-001",
      fromLocation: "-",
      toLocation: "คลัง A-01",
      qty: 200,
      user: "นายสมชาย ใจดี",
      note: "รับเข้าจากซัพพลายเออร์",
    },
    {
      id: 2,
      datetime: "2024-01-14 14:20",
      type: "เบิก",
      docRef: "WO-2024-050",
      fromLocation: "คลัง A-01",
      toLocation: "แผนกผลิต",
      qty: -50,
      user: "นางสาวสมหญิง รักงาน",
      note: "เบิกสำหรับงาน WO-050",
    },
  ];

  const chartDataByCategory = [
    { category: "บรรจุภัณฑ์", count: 15 },
    { category: "วัสดุพิมพ์", count: 12 },
    { category: "อุปกรณ์ตกแต่ง", count: 8 },
    { category: "เคมีภัณฑ์", count: 10 },
  ];

  const chartDataByValue = [
    { name: "บรรจุภัณฑ์", value: 4500000 },
    { name: "วัสดุพิมพ์", value: 3200000 },
    { name: "อุปกรณ์ตกแต่ง", value: 2800000 },
    { name: "เคมีภัณฑ์", value: 1950000 },
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"];

  const getStatusBadge = (status: string) => {
    if (status === "หมด") return <Badge variant="destructive">{status}</Badge>;
    if (status === "ต่ำกว่า Min") return <Badge className="bg-warning text-warning-foreground">{status}</Badge>;
    if (status === "กักกัน") return <Badge variant="outline">{status}</Badge>;
    return <Badge className="bg-success text-success-foreground">{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">สต๊อกสินค้า</h1>
          <p className="text-muted-foreground mt-1">
            ตรวจสอบและจัดการสต๊อกสินค้าคงคลัง พร้อมระบบติดตามการเคลื่อนไหว
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle>รายการสินค้า</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหา ชื่อ / รหัสสินค้า / บาร์โค้ด..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="คลัง/ที่เก็บ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="warehouse-a">คลัง A</SelectItem>
                <SelectItem value="warehouse-b">คลัง B</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="ประเภทสินค้า" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="packaging">บรรจุภัณฑ์</SelectItem>
                <SelectItem value="printing">วัสดุพิมพ์</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="normal">ปกติ</SelectItem>
                <SelectItem value="low">ต่ำกว่า Min</SelectItem>
                <SelectItem value="out">หมด</SelectItem>
                <SelectItem value="quarantine">กักกัน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU/บาร์โค้ด</TableHead>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>คลัง/ที่เก็บ</TableHead>
                  <TableHead className="text-right">On Hand</TableHead>
                  <TableHead className="text-right">Allocated</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead className="text-right">Min/Max</TableHead>
                  <TableHead className="text-right">มูลค่าสต๊อก</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-xs">
                      <div>{product.sku}</div>
                      <div className="text-muted-foreground">{product.barcode}</div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.location}</TableCell>
                    <TableCell className="text-right">{product.onHand}</TableCell>
                    <TableCell className="text-right">{product.allocated}</TableCell>
                    <TableCell className="text-right font-medium">{product.available}</TableCell>
                    <TableCell className="text-right text-xs">
                      {product.min}/{product.max}
                    </TableCell>
                    <TableCell className="text-right">฿{product.stockValue.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDetailDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ArrowRightLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>สินค้าต่ำกว่า Min ตามประเภท</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary))" name="จำนวนรายการ" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>สัดส่วนมูลค่าสต๊อกตามประเภท</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartDataByValue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {chartDataByValue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `฿${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดสินค้า: {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">ข้อมูลสินค้า</TabsTrigger>
                <TabsTrigger value="movements">ประวัติการเคลื่อนไหว</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">SKU / บาร์โค้ด</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.sku} / {selectedProduct.barcode}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">ชื่อสินค้า</label>
                    <p className="text-sm text-muted-foreground">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">ประเภท</label>
                    <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">หน่วย</label>
                    <p className="text-sm text-muted-foreground">{selectedProduct.unit}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">คลัง/ที่เก็บ</label>
                    <p className="text-sm text-muted-foreground">{selectedProduct.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Min / Max / Reorder</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.min} / {selectedProduct.max} / {selectedProduct.reorder}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">On Hand / Allocated / Available</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.onHand} / {selectedProduct.allocated} / {selectedProduct.available}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">ต้นทุนเฉลี่ย / ต้นทุนล่าสุด</label>
                    <p className="text-sm text-muted-foreground">
                      ฿{selectedProduct.avgCost} / ฿{selectedProduct.lastCost}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">มูลค่าสต๊อก</label>
                    <p className="text-sm text-muted-foreground">฿{selectedProduct.stockValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Supplier / Lead Time</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.supplier} / {selectedProduct.leadTime}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">วิธีตีมูลค่า</label>
                    <p className="text-sm text-muted-foreground">{selectedProduct.valuationMethod}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">สถานะ</label>
                    <p className="text-sm">{getStatusBadge(selectedProduct.status)}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="movements">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>วันที่/เวลา</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>อ้างอิงเอกสาร</TableHead>
                      <TableHead>จาก</TableHead>
                      <TableHead>ไป</TableHead>
                      <TableHead className="text-right">จำนวน</TableHead>
                      <TableHead>ผู้ทำ</TableHead>
                      <TableHead>หมายเหตุ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((move) => (
                      <TableRow key={move.id}>
                        <TableCell className="text-xs">{move.datetime}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{move.type}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{move.docRef}</TableCell>
                        <TableCell>{move.fromLocation}</TableCell>
                        <TableCell>{move.toLocation}</TableCell>
                        <TableCell className={`text-right ${move.qty > 0 ? "text-success" : "text-destructive"}`}>
                          {move.qty > 0 ? "+" : ""}
                          {move.qty}
                        </TableCell>
                        <TableCell className="text-sm">{move.user}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{move.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductInventory;
