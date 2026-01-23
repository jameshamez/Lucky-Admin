import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Search, 
  Package,
  AlertTriangle,
  Plus,
  Edit,
  X,
  FileText,
  Download,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for Material Stock
const mockMaterialStock = [
  {
    id: "1",
    material_name: "แผ่นเงิน-ทอง",
    unit: "แผ่น",
    current_qty: 45,
    min_qty: 20,
    note: "สำหรับงานพิเศษ",
    updated_at: "2024-01-15T10:30:00"
  },
  {
    id: "2",
    material_name: "ฟิล์มใส",
    unit: "ม้วน",
    current_qty: 8,
    min_qty: 15,
    note: "",
    updated_at: "2024-01-14T14:20:00"
  },
  {
    id: "3",
    material_name: "สติ๊กเกอร์ขาวด้าน",
    unit: "ม้วน",
    current_qty: 25,
    min_qty: 10,
    note: "ใช้บ่อย",
    updated_at: "2024-01-16T09:15:00"
  },
  {
    id: "4",
    material_name: "สติ๊กเกอร์ PVC ใส",
    unit: "ม้วน",
    current_qty: 0,
    min_qty: 8,
    note: "ต้องสั่งด่วน",
    updated_at: "2024-01-10T16:45:00"
  },
  {
    id: "5",
    material_name: "ใบมีด",
    unit: "ชิ้น",
    current_qty: 15,
    min_qty: 10,
    note: "",
    updated_at: "2024-01-12T11:00:00"
  },
  {
    id: "6",
    material_name: "หมึกเครื่องปริ้น",
    unit: "ตลับ",
    current_qty: 4,
    min_qty: 12,
    note: "ถึงจุดสั่งซื้อ",
    updated_at: "2024-01-13T08:30:00"
  },
  {
    id: "7",
    material_name: "อุปกรณ์สำนักงาน",
    unit: "ชิ้น",
    current_qty: 50,
    min_qty: 20,
    note: "",
    updated_at: "2024-01-11T15:20:00"
  }
];

// Mock data for Material Requests
const mockMaterialRequests = [
  {
    id: "1",
    request_date: "2024-01-16",
    material_name: "ฟิล์มใส",
    qty: 3,
    requester: "สมชาย ใจดี",
    remark: "ใช้สำหรับงาน Order #1234",
    status: "บันทึกแล้ว",
    created_at: "2024-01-16T10:30:00"
  },
  {
    id: "2",
    request_date: "2024-01-16",
    material_name: "แผ่นเงิน-ทอง",
    qty: 5,
    requester: "สมหญิง รักงาน",
    remark: "งานพิมพ์นามบัตร",
    status: "บันทึกแล้ว",
    created_at: "2024-01-16T09:15:00"
  },
  {
    id: "3",
    request_date: "2024-01-15",
    material_name: "สติ๊กเกอร์ขาวด้าน",
    qty: 2,
    requester: "สมชาย ใจดี",
    remark: "ทดสอบสติ๊กเกอร์ใหม่",
    status: "บันทึกแล้ว",
    created_at: "2024-01-15T14:20:00"
  },
  {
    id: "4",
    request_date: "2024-01-15",
    material_name: "หมึกเครื่องปริ้น",
    qty: 2,
    requester: "สมหญิง รักงาน",
    remark: "หมึกหมดแล้ว",
    status: "บันทึกแล้ว",
    created_at: "2024-01-15T11:00:00"
  },
  {
    id: "5",
    request_date: "2024-01-14",
    material_name: "ใบมีด",
    qty: 5,
    requester: "สมชาย ใจดี",
    remark: "ใบมีดทื่อ ต้องเปลี่ยน",
    status: "บันทึกแล้ว",
    created_at: "2024-01-14T16:30:00"
  }
];

const MATERIAL_OPTIONS = [
  { name: "แผ่นเงิน-ทอง", unit: "แผ่น" },
  { name: "ฟิล์มใส", unit: "ม้วน" },
  { name: "สติ๊กเกอร์ขาวด้าน", unit: "ม้วน" },
  { name: "สติ๊กเกอร์ PVC ใส", unit: "ม้วน" },
  { name: "ใบมีด", unit: "ชิ้น" },
  { name: "หมึกเครื่องปริ้น", unit: "ตลับ" },
  { name: "อุปกรณ์สำนักงาน", unit: "ชิ้น" }
];

export default function MaterialStock() {
  const [activeTab, setActiveTab] = useState("stock");
  
  // Request History states
  const [searchRequest, setSearchRequest] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("all");
  const [filterRequester, setFilterRequester] = useState("all");
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    request_date: new Date().toISOString().split('T')[0],
    material_name: "",
    qty: 0,
    remark: ""
  });

  // Stock states
  const [searchStock, setSearchStock] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAdjustDrawerOpen, setIsAdjustDrawerOpen] = useState(false);
  const [isAddMaterialDrawerOpen, setIsAddMaterialDrawerOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [adjustForm, setAdjustForm] = useState({
    adjustType: "set",
    newQty: 0,
    adjustAmount: 0,
    note: ""
  });
  const [addMaterialForm, setAddMaterialForm] = useState({
    material_name: "",
    unit: "",
    current_qty: 0,
    min_qty: 0,
    note: ""
  });

  // Filter requests
  const filteredRequests = mockMaterialRequests.filter(req => {
    const matchesSearch = req.material_name.toLowerCase().includes(searchRequest.toLowerCase()) ||
                         req.requester.toLowerCase().includes(searchRequest.toLowerCase());
    const matchesMaterial = filterMaterial === "all" || req.material_name === filterMaterial;
    const matchesRequester = filterRequester === "all" || req.requester === filterRequester;
    return matchesSearch && matchesMaterial && matchesRequester;
  });

  // Filter stock
  const filteredStock = mockMaterialStock.filter(item => {
    const matchesSearch = item.material_name.toLowerCase().includes(searchStock.toLowerCase());
    let matchesStatus = true;
    if (filterStatus === "low") matchesStatus = item.current_qty <= item.min_qty && item.current_qty > 0;
    if (filterStatus === "out") matchesStatus = item.current_qty === 0;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalMaterials = mockMaterialStock.length;
  const lowStockCount = mockMaterialStock.filter(m => m.current_qty <= m.min_qty && m.current_qty > 0).length;
  const outOfStockCount = mockMaterialStock.filter(m => m.current_qty === 0).length;

  // Get unique requesters
  const uniqueRequesters = Array.from(new Set(mockMaterialRequests.map(r => r.requester)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getStockColor = (current: number, min: number) => {
    if (current === 0) return "text-red-600";
    if (current <= min) return "text-amber-600";
    return "text-green-600";
  };

  const getStockBadge = (current: number, min: number) => {
    if (current === 0) return <Badge variant="destructive">หมดสต็อก</Badge>;
    if (current <= min) return <Badge className="bg-amber-500">ถึงจุดต่ำสุด</Badge>;
    return <Badge variant="secondary">ปกติ</Badge>;
  };

  const handleOpenRequestDrawer = () => {
    setRequestForm({
      request_date: new Date().toISOString().split('T')[0],
      material_name: "",
      qty: 0,
      remark: ""
    });
    setIsRequestDrawerOpen(true);
  };

  const handleSubmitRequest = () => {
    if (!requestForm.material_name || requestForm.qty <= 0) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const material = mockMaterialStock.find(m => m.material_name === requestForm.material_name);
    if (material && requestForm.qty > material.current_qty) {
      toast.error("คงเหลือไม่พอ");
      return;
    }

    toast.success("บันทึกการเบิกสำเร็จ");
    
    if (material && (material.current_qty - requestForm.qty) < material.min_qty) {
      toast.warning("ถึงจุดสั่งซื้อขั้นต่ำ");
    }

    setIsRequestDrawerOpen(false);
  };

  const handleCancelRequest = (requestId: string) => {
    const request = mockMaterialRequests.find(r => r.id === requestId);
    const today = new Date().toISOString().split('T')[0];
    
    if (request && request.request_date === today) {
      toast.success("ยกเลิกรายการสำเร็จ คืนสต็อกแล้ว");
    } else {
      toast.error("สามารถยกเลิกได้เฉพาะรายการวันนี้เท่านั้น");
    }
  };

  const handleOpenAdjustDrawer = (material: any) => {
    setSelectedMaterial(material);
    setAdjustForm({
      adjustType: "set",
      newQty: material.current_qty,
      adjustAmount: 0,
      note: ""
    });
    setIsAdjustDrawerOpen(true);
  };

  const handleSubmitAdjust = () => {
    toast.success("อัปเดตสต็อกแล้ว");
    setIsAdjustDrawerOpen(false);
  };

  const handleSubmitAddMaterial = () => {
    if (!addMaterialForm.material_name || !addMaterialForm.unit) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    toast.success("เพิ่มวัสดุใหม่สำเร็จ");
    setIsAddMaterialDrawerOpen(false);
  };

  const handleExportCSV = (type: string) => {
    toast.success(`กำลังดาวน์โหลด ${type === 'history' ? 'ประวัติการเบิก' : 'สต็อกวัสดุ'}.csv`);
  };

  const handleMaterialSelect = (materialName: string) => {
    const option = MATERIAL_OPTIONS.find(m => m.name === materialName);
    if (option) {
      setRequestForm({
        ...requestForm,
        material_name: materialName
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">การเบิกสินค้า และสต็อกสินค้า</h1>
          <p className="text-muted-foreground">จัดการการเบิกวัสดุและตรวจสอบสต็อก</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="stock">สต็อกวัสดุ</TabsTrigger>
          <TabsTrigger value="history">ประวัติการเบิก</TabsTrigger>
        </TabsList>

        {/* Tab A: Request History */}
        <TabsContent value="history" className="space-y-4">
          {/* Header Actions */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ค้นหาวัสดุ หรือผู้เบิก..."
                  value={searchRequest}
                  onChange={(e) => setSearchRequest(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterMaterial} onValueChange={setFilterMaterial}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="ประเภทวัสดุ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {MATERIAL_OPTIONS.map(opt => (
                    <SelectItem key={opt.name} value={opt.name}>{opt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterRequester} onValueChange={setFilterRequester}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="ผู้เบิก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {uniqueRequesters.map(req => (
                    <SelectItem key={req} value={req}>{req}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExportCSV('history')}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={handleOpenRequestDrawer}>
                <Plus className="w-4 h-4 mr-2" />
                เบิกวัสดุ
              </Button>
            </div>
          </div>

          {/* Request History Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>วันที่เบิก</TableHead>
                    <TableHead>ประเภทวัสดุ</TableHead>
                    <TableHead>จำนวน</TableHead>
                    <TableHead>ผู้เบิก</TableHead>
                    <TableHead>หมายเหตุ</TableHead>
                    <TableHead className="text-right">การกระทำ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{formatDate(request.request_date)}</TableCell>
                      <TableCell className="font-medium">{request.material_name}</TableCell>
                      <TableCell>
                        {request.qty} {MATERIAL_OPTIONS.find(m => m.name === request.material_name)?.unit}
                      </TableCell>
                      <TableCell>{request.requester}</TableCell>
                      <TableCell className="text-muted-foreground">{request.remark || "-"}</TableCell>
                      <TableCell className="text-right">
                        {request.request_date === new Date().toISOString().split('T')[0] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelRequest(request.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4 mr-1" />
                            ยกเลิก
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        ไม่พบข้อมูล
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab B: Material Stock */}
        <TabsContent value="stock" className="space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">วัสดุทั้งหมด</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMaterials}</div>
                <p className="text-xs text-muted-foreground">รายการ</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ถึงจุดต่ำสุด</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{lowStockCount}</div>
                <p className="text-xs text-muted-foreground">รายการ</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">วัสดุใกล้หมด</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
                <p className="text-xs text-muted-foreground">รายการ</p>
              </CardContent>
            </Card>
          </div>

          {/* Header Actions */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ค้นหาชื่อวัสดุ..."
                  value={searchStock}
                  onChange={(e) => setSearchStock(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-1 border rounded-md p-1">
                <Button
                  variant={filterStatus === "all" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  ทั้งหมด
                </Button>
                <Button
                  variant={filterStatus === "low" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterStatus("low")}
                  className="text-amber-600"
                >
                  ถึงจุดต่ำสุด
                </Button>
                <Button
                  variant={filterStatus === "out" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterStatus("out")}
                  className="text-red-600"
                >
                  หมดสต็อก
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExportCSV('stock')}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setIsAddMaterialDrawerOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มวัสดุใหม่
              </Button>
            </div>
          </div>

          {/* Stock Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>วัสดุ</TableHead>
                    <TableHead>คงเหลือ</TableHead>
                    <TableHead>จุดต่ำสุด</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>หมายเหตุ</TableHead>
                    <TableHead>ปรับปรุงล่าสุด</TableHead>
                    <TableHead className="text-right">การกระทำ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStock.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.material_name}</TableCell>
                      <TableCell className={getStockColor(material.current_qty, material.min_qty)}>
                        <span className="font-semibold">{material.current_qty}</span> {material.unit}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{material.min_qty}</TableCell>
                      <TableCell>{getStockBadge(material.current_qty, material.min_qty)}</TableCell>
                      <TableCell className="text-muted-foreground">{material.note || "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(material.updated_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenAdjustDrawer(material)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          ปรับสต็อก
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStock.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        ไม่พบข้อมูล
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Drawer */}
      <Sheet open={isRequestDrawerOpen} onOpenChange={setIsRequestDrawerOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>เบิกวัสดุ</SheetTitle>
            <SheetDescription>กรอกข้อมูลการเบิกวัสดุ</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label>วันที่เบิก</Label>
              <Input
                type="date"
                value={requestForm.request_date}
                onChange={(e) => setRequestForm({ ...requestForm, request_date: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>ประเภทวัสดุ</Label>
              <Select value={requestForm.material_name} onValueChange={handleMaterialSelect}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="เลือกวัสดุ" />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAL_OPTIONS.map(opt => (
                    <SelectItem key={opt.name} value={opt.name}>
                      {opt.name} ({opt.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>หน่วย</Label>
              <Input
                value={MATERIAL_OPTIONS.find(m => m.name === requestForm.material_name)?.unit || ""}
                disabled
                className="mt-1 bg-muted"
              />
            </div>
            <div>
              <Label>จำนวนที่เบิก</Label>
              <Input
                type="number"
                min="0"
                value={requestForm.qty || ""}
                onChange={(e) => setRequestForm({ ...requestForm, qty: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>หมายเหตุ</Label>
              <Textarea
                value={requestForm.remark}
                onChange={(e) => setRequestForm({ ...requestForm, remark: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            <Button onClick={handleSubmitRequest} className="w-full">
              ยืนยันการเบิก
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Adjust Stock Drawer */}
      <Sheet open={isAdjustDrawerOpen} onOpenChange={setIsAdjustDrawerOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>ปรับสต็อก</SheetTitle>
            <SheetDescription>ปรับปรุงจำนวนสต็อกวัสดุ</SheetDescription>
          </SheetHeader>
          {selectedMaterial && (
            <div className="space-y-4 mt-6">
              <div>
                <Label>ประเภทวัสดุ</Label>
                <Input value={selectedMaterial.material_name} disabled className="mt-1 bg-muted" />
              </div>
              <div>
                <Label>คงเหลือปัจจุบัน</Label>
                <Input 
                  value={`${selectedMaterial.current_qty} ${selectedMaterial.unit}`} 
                  disabled 
                  className="mt-1 bg-muted" 
                />
              </div>
              <div>
                <Label>ประเภทการปรับ</Label>
                <Select value={adjustForm.adjustType} onValueChange={(v) => setAdjustForm({ ...adjustForm, adjustType: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="set">ตั้งค่าใหม่</SelectItem>
                    <SelectItem value="add">เพิ่ม (+)</SelectItem>
                    <SelectItem value="reduce">ลด (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {adjustForm.adjustType === "set" && (
                <div>
                  <Label>ปรับเป็น</Label>
                  <Input
                    type="number"
                    min="0"
                    value={adjustForm.newQty}
                    onChange={(e) => setAdjustForm({ ...adjustForm, newQty: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              )}
              {(adjustForm.adjustType === "add" || adjustForm.adjustType === "reduce") && (
                <div>
                  <Label>{adjustForm.adjustType === "add" ? "เพิ่ม" : "ลด"}</Label>
                  <Input
                    type="number"
                    min="0"
                    value={adjustForm.adjustAmount}
                    onChange={(e) => setAdjustForm({ ...adjustForm, adjustAmount: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              )}
              <div>
                <Label>หมายเหตุ</Label>
                <Textarea
                  value={adjustForm.note}
                  onChange={(e) => setAdjustForm({ ...adjustForm, note: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <Button onClick={handleSubmitAdjust} className="w-full">
                บันทึก
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Material Drawer */}
      <Sheet open={isAddMaterialDrawerOpen} onOpenChange={setIsAddMaterialDrawerOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>เพิ่มวัสดุใหม่</SheetTitle>
            <SheetDescription>เพิ่มวัสดุใหม่เข้าสู่ระบบ</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label>ชื่อวัสดุ</Label>
              <Input
                value={addMaterialForm.material_name}
                onChange={(e) => setAddMaterialForm({ ...addMaterialForm, material_name: e.target.value })}
                className="mt-1"
                placeholder="ระบุชื่อวัสดุ"
              />
            </div>
            <div>
              <Label>หน่วย</Label>
              <Select value={addMaterialForm.unit} onValueChange={(v) => setAddMaterialForm({ ...addMaterialForm, unit: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="เลือกหน่วย" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="แผ่น">แผ่น</SelectItem>
                  <SelectItem value="ม้วน">ม้วน</SelectItem>
                  <SelectItem value="ชิ้น">ชิ้น</SelectItem>
                  <SelectItem value="ตลับ">ตลับ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>คงเหลือเริ่มต้น</Label>
              <Input
                type="number"
                min="0"
                value={addMaterialForm.current_qty || ""}
                onChange={(e) => setAddMaterialForm({ ...addMaterialForm, current_qty: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>จุดต่ำสุด (Min Stock)</Label>
              <Input
                type="number"
                min="0"
                value={addMaterialForm.min_qty || ""}
                onChange={(e) => setAddMaterialForm({ ...addMaterialForm, min_qty: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>หมายเหตุ</Label>
              <Textarea
                value={addMaterialForm.note}
                onChange={(e) => setAddMaterialForm({ ...addMaterialForm, note: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            <Button onClick={handleSubmitAddMaterial} className="w-full">
              เพิ่มวัสดุ
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}