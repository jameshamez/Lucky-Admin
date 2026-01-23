import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  AlertTriangle,
  XCircle,
  Search,
  Plus,
  Edit,
  Download,
  Upload,
  ArrowRightLeft,
} from "lucide-react";
import { toast } from "sonner";

const OfficeInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [addType, setAddType] = useState<"material" | "equipment">("material");

  // Mock data
  const stats = [
    { label: "รายการทั้งหมด", value: "328", icon: Package, color: "text-primary" },
    { label: "มูลค่าสต๊อกรวม", value: "฿485,600", icon: Package, color: "text-success" },
    { label: "สต๊อกต่ำกว่า Min", value: "18", icon: AlertTriangle, color: "text-warning" },
    { label: "สต๊อกหมด", value: "5", icon: XCircle, color: "text-destructive" },
  ];

  const officeItems = [
    {
      id: 1,
      sku: "OFF-001",
      name: "กระดาษ A4 80 แกรม",
      category: "วัสดุสิ้นเปลือง",
      unit: "รีม",
      onHand: 85,
      min: 100,
      reorder: 150,
      price: 120,
      stockValue: 10200,
      location: "คลังวัสดุสำนักงาน-A1",
      status: "ต่ำกว่า Min",
    },
    {
      id: 2,
      sku: "OFF-002",
      name: "ปากกาลูกลื่น สีน้ำเงิน",
      category: "วัสดุสิ้นเปลือง",
      unit: "แท่ง",
      onHand: 200,
      min: 150,
      reorder: 200,
      price: 8,
      stockValue: 1600,
      location: "คลังวัสดุสำนักงาน-A2",
      status: "ปกติ",
    },
    {
      id: 3,
      sku: "OFF-003",
      name: "เครื่องพิมพ์ HP LaserJet",
      category: "อุปกรณ์ถาวร",
      unit: "เครื่อง",
      onHand: 12,
      min: 10,
      reorder: 12,
      price: 8500,
      stockValue: 102000,
      location: "คลังอุปกรณ์-B1",
      status: "ปกติ",
    },
  ];

  const movements = [
    {
      id: 1,
      datetime: "2024-01-15 09:15",
      type: "เบิกไปแผนก",
      docRef: "REQ-2024-012",
      fromLocation: "คลังวัสดุสำนักงาน-A1",
      toLocation: "แผนกขาย",
      qty: -15,
      user: "นายสมชาย ใจดี",
      note: "เบิกใช้ในแผนก",
    },
    {
      id: 2,
      datetime: "2024-01-14 14:30",
      type: "รับเข้า",
      docRef: "PO-2024-088",
      fromLocation: "-",
      toLocation: "คลังวัสดุสำนักงาน-A1",
      qty: 50,
      user: "นางสาวสมหญิง รักงาน",
      note: "รับเข้าจากซัพพลายเออร์",
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "หมด") return <Badge variant="destructive">{status}</Badge>;
    if (status === "ต่ำกว่า Min") return <Badge className="bg-warning text-warning-foreground">{status}</Badge>;
    return <Badge className="bg-success text-success-foreground">{status}</Badge>;
  };

  const handleAddItem = () => {
    toast.success("เพิ่มรายการเรียบร้อยแล้ว");
    setShowAddDrawer(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">สต๊อกวัสดุสำนักงาน</h1>
          <p className="text-muted-foreground mt-1">
            จัดการวัสดุและอุปกรณ์สำนักงาน พร้อมระบบติดตามการเบิกใช้
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => {
              setAddType("material");
              setShowAddDrawer(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มรายการวัสดุ
          </Button>
          <Button
            variant="default"
            onClick={() => {
              setAddType("equipment");
              setShowAddDrawer(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มอุปกรณ์สำนักงาน
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Excel
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการวัสดุ/อุปกรณ์สำนักงาน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหา SKU / ชื่อวัสดุ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="ประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="consumable">วัสดุสิ้นเปลือง</SelectItem>
                <SelectItem value="equipment">อุปกรณ์ถาวร</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="คลัง/ที่เก็บ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="office-a">คลังวัสดุสำนักงาน A</SelectItem>
                <SelectItem value="equipment-b">คลังอุปกรณ์ B</SelectItem>
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
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">รายการสินค้า</TabsTrigger>
              <TabsTrigger value="movements">ประวัติการเคลื่อนไหว</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>ชื่อ</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>หน่วย</TableHead>
                      <TableHead className="text-right">คงเหลือ</TableHead>
                      <TableHead className="text-right">Min</TableHead>
                      <TableHead className="text-right">Reorder</TableHead>
                      <TableHead className="text-right">ราคา/หน่วย</TableHead>
                      <TableHead className="text-right">มูลค่าสต๊อก</TableHead>
                      <TableHead>คลัง/ที่เก็บ</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-center">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {officeItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="text-right">{item.onHand}</TableCell>
                        <TableCell className="text-right">{item.min}</TableCell>
                        <TableCell className="text-right">{item.reorder}</TableCell>
                        <TableCell className="text-right">฿{item.price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">฿{item.stockValue.toLocaleString()}</TableCell>
                        <TableCell className="text-sm">{item.location}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="movements">
              <div className="rounded-md border">
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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Item Drawer */}
      <Drawer open={showAddDrawer} onOpenChange={setShowAddDrawer}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>
              {addType === "material" ? "เพิ่มรายการวัสดุสำนักงาน" : "เพิ่มรายการอุปกรณ์สำนักงาน"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">รหัสสินค้า (SKU) *</Label>
                <Input id="sku" placeholder="OFF-XXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ/ข้อมูลสินค้า *</Label>
                <Input id="name" placeholder="ระบุชื่อสินค้า" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">ประเภท *</Label>
                <Select defaultValue={addType === "material" ? "consumable" : "equipment"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumable">วัสดุสิ้นเปลือง</SelectItem>
                    <SelectItem value="equipment">อุปกรณ์ถาวร</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">หน่วย (UoM) *</Label>
                <Input id="unit" placeholder="เช่น รีม, แท่ง, เครื่อง" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">ราคาต่อหน่วยมาตรฐาน *</Label>
                <Input id="price" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initial-qty">จำนวนคงเหลือเริ่มต้น *</Label>
                <Input id="initial-qty" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min">Min *</Label>
                <Input id="min" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorder">Reorder Point *</Label>
                <Input id="reorder" type="number" placeholder="0" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="location">คลัง/ที่เก็บ (Office Store/Bin) *</Label>
                <Input id="location" placeholder="เช่น คลังวัสดุสำนักงาน-A1" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="note">หมายเหตุ</Label>
                <Textarea id="note" placeholder="ระบุข้อมูลเพิ่มเติม (ถ้ามี)" />
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleAddItem}>บันทึก</Button>
            <Button variant="outline" onClick={() => setShowAddDrawer(false)}>
              ยกเลิก
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default OfficeInventory;
