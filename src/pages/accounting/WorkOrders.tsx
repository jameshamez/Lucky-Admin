import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileDown, Search, Eye, Edit, Trash2, Receipt } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function WorkOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFactory, setFilterFactory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Mock data
  const workOrders = [
    {
      id: "WO-2024-001",
      project: "โปรเจคสายคล้องคอพรีเมียม",
      customer: "บริษัท ABC จำกัด",
      factory: "Chaina B&C",
      productionDate: "2024-01-15",
      shipmentDate: "2024-01-20",
      quantity: 5000,
      salesAmount: 125000,
      status: "ผลิตเสร็จ",
      assignedBy: "สมชาย ใจดี"
    },
    {
      id: "WO-2024-002",
      project: "ตัวอย่างพวงกุญแจ",
      customer: "บริษัท XYZ จำกัด",
      factory: "China BENC",
      productionDate: "2024-01-18",
      shipmentDate: "2024-01-25",
      quantity: 10000,
      salesAmount: 85000,
      status: "รอดำเนินการ",
      assignedBy: "สมหญิง รักงาน"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ปิดงาน": return "bg-success/10 text-success border-success/20";
      case "ส่งแล้ว": return "bg-info/10 text-info border-info/20";
      case "ผลิตเสร็จ": return "bg-primary/10 text-primary border-primary/20";
      case "รอดำเนินการ": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleExport = () => {
    toast({
      title: "ส่งออกข้อมูลสำเร็จ",
      description: "กำลังดาวน์โหลดไฟล์ Excel..."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ใบสั่งงาน</h1>
          <p className="text-muted-foreground">บันทึกและติดตามงานสั่งผลิตจากฝ่ายจัดซื้อ</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                เพิ่มใบสั่งงาน
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>เพิ่มใบสั่งงานใหม่</DialogTitle>
                <DialogDescription>กรอกข้อมูลใบสั่งงานจากฝ่ายจัดซื้อ</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workOrderId">รหัสงาน</Label>
                  <Input id="workOrderId" placeholder="สร้างอัตโนมัติ" disabled />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectName">ชื่อโปรเจค</Label>
                  <Input id="projectName" placeholder="ระบุชื่อโปรเจค" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">ชื่อลูกค้า</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกลูกค้า" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer1">บริษัท ABC จำกัด</SelectItem>
                      <SelectItem value="customer2">บริษัท XYZ จำกัด</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderDate">วันที่รับออเดอร์</Label>
                  <Input id="orderDate" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usageDate">วันที่ลูกค้าใช้งาน</Label>
                  <Input id="usageDate" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productType">ประเภทสินค้า</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภทสินค้า" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lanyard">สายคล้องคอ</SelectItem>
                      <SelectItem value="keychain">พวงกุญแจ</SelectItem>
                      <SelectItem value="pin">เข็มกลัด</SelectItem>
                      <SelectItem value="badge">ป้ายชื่อ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productCategory">หมวดสินค้า</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดสินค้า" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">พรีเมียม</SelectItem>
                      <SelectItem value="standard">มาตรฐาน</SelectItem>
                      <SelectItem value="custom">สั่งทำพิเศษ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">วัสดุ</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกวัสดุ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nylon">ไนลอน</SelectItem>
                      <SelectItem value="polyester">โพลีเอสเตอร์</SelectItem>
                      <SelectItem value="satin">ซาติน</SelectItem>
                      <SelectItem value="metal">โลหะ</SelectItem>
                      <SelectItem value="plastic">พลาสติก</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="factory">โรงงาน</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกโรงงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chainabc">Chaina B&C</SelectItem>
                      <SelectItem value="chainalinda">Chaina LINDA</SelectItem>
                      <SelectItem value="chainapn">Chaina PN</SelectItem>
                      <SelectItem value="chainaxiaoli">Chaina Xiaoli</SelectItem>
                      <SelectItem value="chainazj">Chaina ZJ</SelectItem>
                      <SelectItem value="chinabenc">China BENC</SelectItem>
                      <SelectItem value="chinalanyarda">China Lanyard A</SelectItem>
                      <SelectItem value="chinau">China U</SelectItem>
                      <SelectItem value="chinaw">China W</SelectItem>
                      <SelectItem value="chinax">China X</SelectItem>
                      <SelectItem value="chinay">China Y</SelectItem>
                      <SelectItem value="chinaz">China Z</SelectItem>
                      <SelectItem value="papermate">Papermate</SelectItem>
                      <SelectItem value="shinemaker">Shinemaker</SelectItem>
                      <SelectItem value="the101">The101</SelectItem>
                      <SelectItem value="premiumbkk">บริษัท พรีเมี่ยมแบงค์ค็อก จำกัด</SelectItem>
                      <SelectItem value="thaisolid">ไทย Solid</SelectItem>
                      <SelectItem value="pvpewter">PV พิวเตอร์</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">สี</Label>
                  <Input id="color" placeholder="ระบุสี" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="frontDetails">รายละเอียดด้านหน้า</Label>
                  <Textarea id="frontDetails" placeholder="ระบุรายละเอียดด้านหน้า" rows={2} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="backDetails">รายละเอียดด้านหลัง</Label>
                  <Textarea id="backDetails" placeholder="ระบุรายละเอียดด้านหลัง" rows={2} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sizeCm">ขนาด (cm)</Label>
                  <Input id="sizeCm" type="number" step="0.1" placeholder="เช่น 90" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thicknessMm">ความหนา (mm)</Label>
                  <Input id="thicknessMm" type="number" step="0.1" placeholder="เช่น 2.5" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ropeSizeCount">ขนาดสาย / จำนวนสาย</Label>
                  <Input id="ropeSizeCount" placeholder="เช่น 1.5cm / 2 แบบ" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">รุ่น / โมเดล</Label>
                  <Input id="model" placeholder="ระบุรุ่น (ถ้ามี)" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">จำนวน</Label>
                  <Input id="quantity" type="number" placeholder="จำนวนชิ้น" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitCostProduct">ทุนต่อหน่วย (ชิ้นงาน) RMB</Label>
                  <Input id="unitCostProduct" type="number" step="0.01" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitCostMold">ทุนต่อหน่วย (โมล) RMB</Label>
                  <Input id="unitCostMold" type="number" step="0.01" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalCostRMB">รวมต้นทุน RMB</Label>
                  <Input id="totalCostRMB" type="number" step="0.01" placeholder="คำนวณอัตโนมัติ" disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qoNumber">เลข QO</Label>
                  <Input id="qoNumber" placeholder="เลข QO" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poNumber">เลข PO</Label>
                  <Input id="poNumber" placeholder="เลข PO" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productionDate">วันที่ผลิต</Label>
                  <Input id="productionDate" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipmentDate">วันที่จัดส่งออก</Label>
                  <Input id="shipmentDate" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="separateQty">จำนวนแยก</Label>
                  <Input id="separateQty" placeholder="ระบุจำนวนแยก (ถ้ามี)" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingChannel">ช่องทางการจัดส่ง</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกช่องทางจัดส่ง" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air">ทางอากาศ</SelectItem>
                      <SelectItem value="sea">ทางเรือ</SelectItem>
                      <SelectItem value="land">ทางรถ</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalSales">รวมยอดขาย (THB)</Label>
                  <Input id="totalSales" type="number" step="0.01" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vat">ภาษีมูลค่าเพิ่ม (THB)</Label>
                  <Input id="vat" type="number" step="0.01" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingCost">ค่าขนส่ง (RMB)</Label>
                  <Input id="shippingCost" type="number" step="0.01" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exchangeRate">EXC (Exchange Rate)</Label>
                  <Input id="exchangeRate" type="number" step="0.01" placeholder="5.5" defaultValue="5.5" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedBy">ผู้สั่งงาน</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกผู้สั่งงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">สมชาย ใจดี</SelectItem>
                      <SelectItem value="user2">สมหญิง รักงาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actualRate">เรทจ่ายจริง</Label>
                  <Input id="actualRate" type="number" step="0.01" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actualShipping">ค่าขนส่งจ่ายตามจริง</Label>
                  <Input id="actualShipping" type="number" step="0.01" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">สถานะใบสั่งงาน</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกสถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">รอดำเนินการ</SelectItem>
                      <SelectItem value="production">กำลังผลิต</SelectItem>
                      <SelectItem value="completed">ผลิตเสร็จ</SelectItem>
                      <SelectItem value="shipped">ส่งแล้ว</SelectItem>
                      <SelectItem value="closed">ปิดงาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="images">ภาพประกอบ</Label>
                  <Input id="images" type="file" multiple accept="image/*" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">หมายเหตุ</Label>
                  <Textarea id="notes" placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)" rows={3} />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "บันทึกสำเร็จ",
                    description: "เพิ่มใบสั่งงานใหม่แล้ว"
                  });
                  setShowAddDialog(false);
                }}>
                  บันทึก
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ค้นหาและกรอง</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">ค้นหา</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="รหัสงาน, โปรเจค, ลูกค้า..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterFactory">โรงงาน</Label>
              <Select value={filterFactory} onValueChange={setFilterFactory}>
                <SelectTrigger>
                  <SelectValue placeholder="ทั้งหมด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="chainabc">Chaina B&C</SelectItem>
                  <SelectItem value="chinabenc">China BENC</SelectItem>
                  <SelectItem value="other">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterStatus">สถานะ</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="ทั้งหมด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="pending">รอดำเนินการ</SelectItem>
                  <SelectItem value="production">กำลังผลิต</SelectItem>
                  <SelectItem value="completed">ผลิตเสร็จ</SelectItem>
                  <SelectItem value="shipped">ส่งแล้ว</SelectItem>
                  <SelectItem value="closed">ปิดงาน</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterDate">วันที่</Label>
              <Input id="filterDate" type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการใบสั่งงานทั้งหมด</CardTitle>
          <CardDescription>แสดงข้อมูลใบสั่งงานจากฝ่ายจัดซื้อ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสงาน</TableHead>
                  <TableHead>โปรเจค</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>โรงงาน</TableHead>
                  <TableHead>วันที่ผลิต</TableHead>
                  <TableHead>วันที่จัดส่ง</TableHead>
                  <TableHead className="text-right">จำนวน</TableHead>
                  <TableHead className="text-right">ยอดขาย (THB)</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ผู้สั่งงาน</TableHead>
                  <TableHead className="text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.project}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.factory}</TableCell>
                    <TableCell>{new Date(order.productionDate).toLocaleDateString('th-TH')}</TableCell>
                    <TableCell>{new Date(order.shipmentDate).toLocaleDateString('th-TH')}</TableCell>
                    <TableCell className="text-right">{order.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">฿{order.salesAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.assignedBy}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowViewDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Receipt className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>เพิ่มบันทึกจ่าย</DialogTitle>
                              <DialogDescription>บันทึกการจ่ายเงินสำหรับใบสั่งงาน {order.id}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="paymentDate">วันที่จ่าย</Label>
                                <Input id="paymentDate" type="date" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="paymentAmount">ยอด (RMB)</Label>
                                <Input id="paymentAmount" type="number" step="0.01" placeholder="0.00" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="paymentRate">เรท</Label>
                                <Input id="paymentRate" type="number" step="0.01" placeholder="5.5" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="paymentMethod">วิธีจ่าย</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="เลือกวิธีจ่าย" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cash">เงินสด</SelectItem>
                                    <SelectItem value="transfer">โอนเงิน</SelectItem>
                                    <SelectItem value="check">เช็ค</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="paymentSlip">แนบสลิป</Label>
                                <Input id="paymentSlip" type="file" accept="image/*,application/pdf" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="paymentNotes">หมายเหตุ</Label>
                                <Textarea id="paymentNotes" placeholder="หมายเหตุเพิ่มเติม" rows={2} />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                                ยกเลิก
                              </Button>
                              <Button onClick={() => {
                                toast({
                                  title: "บันทึกสำเร็จ",
                                  description: "เพิ่มบันทึกการจ่ายแล้ว"
                                });
                                setShowPaymentDialog(false);
                              }}>
                                บันทึก
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
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

      {/* View Details Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดใบสั่งงาน</DialogTitle>
            <DialogDescription>ข้อมูลใบสั่งงาน {selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">รหัสงาน</Label>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground">ชื่อโปรเจค</Label>
                  <p className="font-medium">{selectedOrder.project}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">ชื่อลูกค้า</Label>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">โรงงาน</Label>
                  <p className="font-medium">{selectedOrder.factory}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">วันที่ผลิต</Label>
                  <p className="font-medium">{new Date(selectedOrder.productionDate).toLocaleDateString('th-TH')}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">วันที่จัดส่งออก</Label>
                  <p className="font-medium">{new Date(selectedOrder.shipmentDate).toLocaleDateString('th-TH')}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">จำนวน</Label>
                  <p className="font-medium">{selectedOrder.quantity.toLocaleString()} ชิ้น</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">ยอดขาย</Label>
                  <p className="font-medium">฿{selectedOrder.salesAmount.toLocaleString()}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">สถานะ</Label>
                  <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">ผู้สั่งงาน</Label>
                  <p className="font-medium">{selectedOrder.assignedBy}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  ปิด
                </Button>
                <Button onClick={() => {
                  setShowViewDialog(false);
                  // TODO: Open edit dialog
                }}>
                  แก้ไข
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
