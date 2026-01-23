import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, CheckCircle2, FileCheck, Search, Eye } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const ProductionOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterFactory, setFilterFactory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Mock data for production orders
  const mockOrders = [
    {
      id: 1,
      jobCode: "240115-01-C",
      jobName: "เหรียญรางวัล งานวิ่ง",
      customerName: "สมชาย ใจดี",
      factory: "china_bc",
      factoryLabel: "China B&C",
      createdDate: "2024-01-15",
      quantity: 100,
      totalCost: 12500,
      totalSellingPrice: 15000,
      profit: 2500,
      status: "รอยืนยันการผลิต"
    },
    {
      id: 2,
      jobCode: "240116-01-L",
      jobName: "โล่คริสตัล",
      customerName: "สุดา เก่งมาก",
      factory: "china_linda",
      factoryLabel: "China LINDA",
      createdDate: "2024-01-16",
      quantity: 50,
      totalCost: 16000,
      totalSellingPrice: 17500,
      profit: 1500,
      status: "สั่งผลิตแล้ว"
    },
    {
      id: 3,
      jobCode: "240117-01-P",
      jobName: "ถ้วยรางวัล",
      customerName: "อนันต์ ชาญฉลาด",
      factory: "china_pn",
      factoryLabel: "China PN",
      createdDate: "2024-01-17",
      quantity: 75,
      totalCost: 18750,
      totalSellingPrice: 21000,
      profit: 2250,
      status: "รอยืนยันการผลิต"
    },
  ];

  const factoryOptions = [
    { value: "china_bc", label: "China B&C" },
    { value: "china_linda", label: "China LINDA" },
    { value: "china_pn", label: "China PN" },
    { value: "china_xiaoli", label: "China Xiaoli" },
    { value: "china_zj", label: "China ZJ" },
    { value: "china_benc", label: "China BENC" },
    { value: "china_lanyard_a", label: "China Lanyard A" },
    { value: "china_u", label: "China U" },
    { value: "china_w", label: "China W" },
    { value: "china_x", label: "China X" },
    { value: "china_y", label: "China Y" },
    { value: "china_z", label: "China Z" },
    { value: "papermate", label: "Papermate" },
    { value: "shinemaker", label: "Shinemaker" },
    { value: "the101", label: "The101" },
    { value: "premium_bangkok", label: "บริษัท พรีเมี่ยมแบงค์ค็อก จำกัด" },
    { value: "thai_solid", label: "ไทย Solid" },
    { value: "pv_pewter", label: "PV พิวเตอร์" },
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "รอยืนยันการผลิต": "outline",
      "สั่งผลิตแล้ว": "default",
      "ยกเลิก": "destructive"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchSearch = searchTerm === "" || 
      order.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.jobCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFactory = filterFactory === "" || order.factory === filterFactory;
    const matchStatus = filterStatus === "" || order.status === filterStatus;
    const matchDate = filterDate === "" || order.createdDate === filterDate;
    
    return matchSearch && matchFactory && matchStatus && matchDate;
  });

  const stats = {
    pending: mockOrders.filter(q => q.status === "รอยืนยันการผลิต").length,
    ordered: mockOrders.filter(q => q.status === "สั่งผลิตแล้ว").length,
    total: mockOrders.length
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowDetailDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">สั่งผลิต</h1>
          <p className="text-muted-foreground">จัดการคำสั่งผลิตจากโรงงาน</p>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="รอยืนยันการผลิต"
          value={stats.pending.toString()}
          change="รายการรอยืนยัน"
          icon={<Clock className="h-4 w-4" />}
          trend="neutral"
        />
        <StatsCard
          title="สั่งผลิตแล้ว"
          value={stats.ordered.toString()}
          change="รายการสั่งผลิต"
          icon={<CheckCircle2 className="h-4 w-4" />}
          trend="up"
        />
        <StatsCard
          title="ทั้งหมด"
          value={stats.total.toString()}
          change="รายการทั้งหมด"
          icon={<FileCheck className="h-4 w-4" />}
          trend="neutral"
        />
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>ค้นหาและกรอง</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ค้นหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="วันที่"
            />
            <Select value={filterFactory} onValueChange={setFilterFactory}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกโรงงาน" />
              </SelectTrigger>
              <SelectContent className="bg-popover max-h-[300px]">
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {factoryOptions.map((factory) => (
                  <SelectItem key={factory.value} value={factory.value}>
                    {factory.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="รอยืนยันการผลิต">รอยืนยันการผลิต</SelectItem>
                <SelectItem value="สั่งผลิตแล้ว">สั่งผลิตแล้ว</SelectItem>
                <SelectItem value="ยกเลิก">ยกเลิก</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterDate("");
                setFilterFactory("");
                setFilterStatus("");
              }}
            >
              ล้างตัวกรอง
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Production Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการสั่งผลิต</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัสงาน</TableHead>
                <TableHead>ชื่องาน</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>โรงงาน</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead>จำนวน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.jobCode}</TableCell>
                    <TableCell>{order.jobName}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.factoryLabel}</TableCell>
                    <TableCell>{order.createdDate}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        ดูรายละเอียด
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดการสั่งผลิต</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* ข้อมูลคนทำงานขาย */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ข้อมูลคนทำงานขาย</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">เจ้าของงาน</p>
                      <p className="text-base">-</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ผู้รับผิดชอบ</p>
                      <p className="text-base">-</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">เบอร์โทรศัพท์</p>
                      <p className="text-base">-</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">อีเมล</p>
                      <p className="text-base">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ข้อมูลลูกค้า */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ข้อมูลลูกค้า</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ชื่อลูกค้า</p>
                      <p className="text-base">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ประเภทลูกค้า</p>
                      <p className="text-base">-</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">เบอร์โทรศัพท์</p>
                      <p className="text-base">-</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">อีเมล</p>
                      <p className="text-base">-</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ที่อยู่</p>
                    <p className="text-base">-</p>
                  </div>
                </CardContent>
              </Card>

              {/* ข้อมูลการสั่งงาน */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ข้อมูลการสั่งงาน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">รหัสงาน</p>
                      <p className="text-base">{selectedOrder.jobCode}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">วันที่สร้าง</p>
                      <p className="text-base">{selectedOrder.createdDate}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">โรงงาน</p>
                      <p className="text-base">{selectedOrder.factoryLabel}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">สถานะ</p>
                      <p className="text-base">{getStatusBadge(selectedOrder.status)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* รายละเอียดในการสั่งงาน */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">รายละเอียดในการสั่งงาน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ชื่องาน</p>
                      <p className="text-base">{selectedOrder.jobName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">โรงงาน</p>
                      <p className="text-base">{selectedOrder.factoryLabel}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">จำนวน</p>
                      <p className="text-base">{selectedOrder.quantity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ต้นทุนรวม</p>
                      <p className="text-base">{selectedOrder.totalCost.toLocaleString()} บาท</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ราคาขายรวม</p>
                      <p className="text-base">{selectedOrder.totalSellingPrice.toLocaleString()} บาท</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">กำไร</p>
                      <p className="text-base text-green-600">{selectedOrder.profit.toLocaleString()} บาท</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-base font-semibold mb-3">รายละเอียดเหรียญสั่งผลิต</p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">ชนิด</p>
                          <p className="text-base">-</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">วัสดุ</p>
                          <p className="text-base">-</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">ขนาดสินค้า</p>
                          <p className="text-base">-</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">น้ำหนัก</p>
                          <p className="text-base">-</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">ลายหน้า / สีหน้า</p>
                          <p className="text-base">-</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">ลายหลัง / สีหลัง</p>
                          <p className="text-base">-</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">จำนวนสี</p>
                          <p className="text-base">-</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">ตัวอย่างสินค้า</p>
                          <p className="text-base">-</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* การจัดส่ง */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">การจัดส่ง</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* ข้อมูลผู้รับสินค้า */}
                  <div>
                    <p className="text-base font-semibold mb-3">ข้อมูลผู้รับสินค้า</p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">ชื่อผู้รับ</p>
                          <p className="text-base">-</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">เบอร์โทรศัพท์</p>
                          <p className="text-base">-</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* ที่อยู่จัดส่ง */}
                  <div>
                    <p className="text-base font-semibold mb-3">ที่อยู่จัดส่ง</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ที่อยู่</p>
                        <p className="text-base">-</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">จังหวัด</p>
                          <p className="text-base">-</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">รหัสไปรษณีย์</p>
                          <p className="text-base">-</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* วิธีการจัดส่ง */}
                  <div>
                    <p className="text-base font-semibold mb-3">วิธีการจัดส่ง</p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">ประเภทการจัดส่ง</p>
                          <p className="text-base">-</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">บริษัทขนส่ง</p>
                          <p className="text-base">-</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">วันที่ต้องการรับสินค้า</p>
                        <p className="text-base">-</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* การชำระเงิน */}
                  <div>
                    <p className="text-base font-semibold mb-3">การชำระเงิน</p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">วิธีการชำระเงิน</p>
                          <p className="text-base">-</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">เครดิต</p>
                          <p className="text-base">-</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* คำแนะนำเพิ่มเติม */}
                  <div>
                    <p className="text-base font-semibold mb-3">คำแนะนำเพิ่มเติม</p>
                    <p className="text-base">-</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductionOrder;
