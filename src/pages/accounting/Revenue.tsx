import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Search, Eye, FileText, AlertCircle } from "lucide-react";

// Mockup data for revenue chart (12 months)
const revenueChartData = [
  { month: "ม.ค.", actual: 450000, target: 400000, custom: 280000, readymade: 170000 },
  { month: "ก.พ.", actual: 380000, target: 400000, custom: 220000, readymade: 160000 },
  { month: "มี.ค.", actual: 520000, target: 450000, custom: 350000, readymade: 170000 },
  { month: "เม.ย.", actual: 480000, target: 450000, custom: 300000, readymade: 180000 },
  { month: "พ.ค.", actual: 610000, target: 500000, custom: 420000, readymade: 190000 },
  { month: "มิ.ย.", actual: 580000, target: 500000, custom: 380000, readymade: 200000 },
  { month: "ก.ค.", actual: 650000, target: 550000, custom: 450000, readymade: 200000 },
  { month: "ส.ค.", actual: 620000, target: 550000, custom: 410000, readymade: 210000 },
  { month: "ก.ย.", actual: 690000, target: 600000, custom: 480000, readymade: 210000 },
  { month: "ต.ค.", actual: 720000, target: 600000, custom: 500000, readymade: 220000 },
  { month: "พ.ย.", actual: 680000, target: 650000, custom: 460000, readymade: 220000 },
  { month: "ธ.ค.", actual: 750000, target: 700000, custom: 520000, readymade: 230000 },
];

// Mockup data for orders
const ordersData = [
  {
    id: "ORD-2025-001",
    orderType: "สั่งผลิตภายนอก",
    quotationNo: "QT-2025-001",
    customerName: "บริษัท ABC จำกัด",
    lineId: "@abc_company",
    address: "123 ถนนสุขุมวิท กรุงเทพฯ 10110",
    phone: "02-123-4567",
    email: "contact@abc.co.th",
    orderDate: "2025-01-15",
    usageDate: "2025-02-01",
    deliveryDate: "2025-01-30",
    deliveryMethod: "ขนส่งเอกชน",
    taxInvoice: true,
    companyName: "บริษัท ABC จำกัด",
    taxId: "0123456789012",
    jobName: "ปากกาพรีเมี่ยม 1000 ชิ้น",
    jobType: "สกรีน",
    tags: "#ปากกา #พรีเมี่ยม",
    totalAmount: 85000,
    paymentStatus: "ชำระครบ",
    isClosed: true,
    urgency: "ปกติ",
    orderChannel: "ลูกค้าเก่า",
    shippingFee: 500,
    productionDetail: "สกรีนโลโก้ 2 สี",
    productionStaff: "วิชัย ช่างพิมพ์",
    productionDeadline: "2025-01-28",
    productionStatus: "เสร็จสิ้น"
  },
  {
    id: "ORD-2025-002",
    orderType: "สินค้าสำเร็จรูป",
    quotationNo: "QT-2025-002",
    customerName: "คุณสมชาย ใจดี",
    lineId: "@somchai99",
    address: "456 ซอยอารีย์ กรุงเทพฯ 10400",
    phone: "081-234-5678",
    email: "somchai@email.com",
    orderDate: "2025-01-16",
    usageDate: "2025-01-20",
    deliveryDate: "2025-01-19",
    deliveryMethod: "Messenger",
    taxInvoice: false,
    jobName: "กระเป๋าผ้า 50 ใบ",
    jobType: "สินค้าสำเร็จรูป",
    tags: "#กระเป๋า #ผ้า",
    totalAmount: 12500,
    paymentStatus: "ชำระครบ",
    isClosed: true,
    urgency: "ด่วน 1 วัน",
    orderChannel: "LINE",
    shippingFee: 150
  },
  {
    id: "ORD-2025-003",
    orderType: "สั่งผลิตภายใน",
    quotationNo: "QT-2025-003",
    customerName: "บริษัท XYZ จำกัด",
    lineId: "@xyz_corp",
    address: "789 ถนนพระราม 4 กรุงเทพฯ 10500",
    phone: "02-987-6543",
    email: "sales@xyz.co.th",
    orderDate: "2025-01-18",
    usageDate: "2025-02-15",
    deliveryDate: "2025-02-10",
    deliveryMethod: "หน้าร้าน",
    taxInvoice: true,
    companyName: "บริษัท XYZ จำกัด",
    taxId: "9876543210987",
    jobName: "แก้วเซรามิค 500 ชิ้น",
    jobType: "พิมพ์ภาพ",
    tags: "#แก้ว #เซรามิค",
    totalAmount: 125000,
    paymentStatus: "มัดจำ",
    isClosed: false,
    urgency: "ปกติ",
    orderChannel: "เว็บไซต์",
    shippingFee: 0,
    productionDetail: "พิมพ์ภาพสีเต็มรูป",
    productionStaff: "สมหญิง ช่างพิมพ์",
    productionDeadline: "2025-02-08",
    productionStatus: "กำลังผลิต"
  },
  {
    id: "ORD-2025-004",
    orderType: "สั่งผลิตภายนอก",
    quotationNo: "QT-2025-004",
    customerName: "คุณวิภา นักธุรกิจ",
    lineId: "@wipa_biz",
    address: "321 ถนนลาดพร้าว กรุงเทพฯ 10230",
    phone: "089-123-4567",
    email: "wipa@business.com",
    orderDate: "2025-01-20",
    usageDate: "2025-02-20",
    deliveryDate: "2025-02-18",
    deliveryMethod: "ลูกค้ารับเอง",
    taxInvoice: false,
    jobName: "พวงกุญแจอะคริลิค 2000 ชิ้น",
    jobType: "ตัดเลเซอร์",
    tags: "#พวงกุญแจ #อะคริลิค",
    totalAmount: 48000,
    paymentStatus: "รอชำระ",
    isClosed: false,
    urgency: "ด่วน 2 วัน",
    orderChannel: "โทร",
    shippingFee: 0,
    productionDetail: "ตัดเลเซอร์ + พิมพ์UV",
    productionStaff: "ประยุทธ์ ช่างเลเซอร์",
    productionDeadline: "2025-02-15",
    productionStatus: "รอวัตถุดิบ"
  }
];

export default function Revenue() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || order.orderType === filterType;
    const matchesStatus = filterStatus === "all" || order.paymentStatus === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgMonthlyRevenue = totalRevenue / 12;
  const pendingPayments = ordersData.filter(o => o.paymentStatus === "รอชำระ").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ชำระครบ": return "default";
      case "มัดจำ": return "secondary";
      case "รอชำระ": return "destructive";
      default: return "outline";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    if (urgency.includes("3-5")) return "destructive";
    if (urgency.includes("1 วัน")) return "destructive";
    if (urgency.includes("2 วัน")) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">หน้ารายรับ</h1>
            <p className="text-muted-foreground">ระบบจัดการรายรับและออเดอร์ทั้งหมด</p>
          </div>
          <div className="flex gap-2">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">รายรับรวมทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">฿{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">ข้อมูล 12 เดือนย้อนหลัง</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">รายรับเฉลี่ยต่อเดือน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">฿{avgMonthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-success mt-1">+12.5% จากเดือนที่แล้ว</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">ออเดอร์รอชำระเงิน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{pendingPayments} ออเดอร์</div>
              <p className="text-xs text-muted-foreground mt-1">ต้องติดตามชำระเงิน</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>กราฟรายรับรวม 12 เดือนย้อนหลัง</CardTitle>
              <CardDescription>เปรียบเทียบยอดขายจริงกับเป้าหมาย</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueChartData}>
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
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      name="ยอดขายจริง" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeDasharray="5 5" 
                      name="เป้าหมาย" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>เปรียบเทียบยอดขายตามประเภทสินค้า</CardTitle>
              <CardDescription>สินค้าสั่งผลิต vs สินค้าสำเร็จรูป</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChartData}>
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
                    />
                    <Legend />
                    <Bar dataKey="custom" fill="hsl(var(--primary))" name="สินค้าสั่งผลิต" />
                    <Bar dataKey="readymade" fill="hsl(var(--accent))" name="สินค้าสำเร็จรูป" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการรับออเดอร์ทั้งหมด</CardTitle>
            <CardDescription>ข้อมูลออเดอร์และสถานะการชำระเงิน</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหารหัสออเดอร์หรือชื่อลูกค้า..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="ประเภทการสั่งซื้อ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="สั่งผลิตภายนอก">สั่งผลิตภายนอก</SelectItem>
                  <SelectItem value="สั่งผลิตภายใน">สั่งผลิตภายใน</SelectItem>
                  <SelectItem value="สินค้าสำเร็จรูป">สินค้าสำเร็จรูป</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="สถานะการชำระเงิน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="รอชำระ">รอชำระ</SelectItem>
                  <SelectItem value="มัดจำ">มัดจำ</SelectItem>
                  <SelectItem value="ชำระครบ">ชำระครบ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสออเดอร์</TableHead>
                    <TableHead>ลูกค้า</TableHead>
                    <TableHead>ชื่องาน</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>วันที่สั่ง</TableHead>
                    <TableHead>วันที่ส่ง</TableHead>
                    <TableHead className="text-right">ยอดเงิน</TableHead>
                    <TableHead>สถานะชำระ</TableHead>
                    <TableHead>ระดับความเร่งด่วน</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-xs text-muted-foreground">{order.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.jobName}</div>
                          <div className="text-xs text-muted-foreground">{order.tags}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.orderType}</Badge>
                      </TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.deliveryDate}</TableCell>
                      <TableCell className="text-right font-medium">
                        ฿{order.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getUrgencyColor(order.urgency)}>
                          {order.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.isClosed ? (
                          <Badge variant="default">ปิดยอดแล้ว</Badge>
                        ) : (
                          <Badge variant="secondary">ยังไม่ปิดยอด</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              ดูรายละเอียด
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>รายละเอียดออเดอร์ {order.id}</DialogTitle>
                              <DialogDescription>ข้อมูลสั่งซื้อและการจัดส่งแบบละเอียด</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">ข้อมูลลูกค้า</p>
                                  <p className="font-medium">{order.customerName}</p>
                                  <p className="text-sm">{order.phone}</p>
                                  <p className="text-sm">{order.email}</p>
                                  <p className="text-sm">{order.lineId}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">ที่อยู่จัดส่ง</p>
                                  <p className="text-sm">{order.address}</p>
                                  <p className="text-sm mt-2">
                                    <span className="font-medium">วิธีจัดส่ง:</span> {order.deliveryMethod}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">รายละเอียดงาน</p>
                                <p className="font-medium">{order.jobName}</p>
                                <p className="text-sm">ประเภทงาน: {order.jobType}</p>
                                <p className="text-sm">{order.tags}</p>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">วันที่สั่งซื้อ</p>
                                  <p className="font-medium">{order.orderDate}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">วันที่ใช้งาน</p>
                                  <p className="font-medium">{order.usageDate}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">วันที่จัดส่ง</p>
                                  <p className="font-medium">{order.deliveryDate}</p>
                                </div>
                              </div>
                              {order.taxInvoice && (
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">ข้อมูลใบกำกับภาษี</p>
                                  <p className="text-sm">{order.companyName}</p>
                                  <p className="text-sm">เลขที่: {order.taxId}</p>
                                </div>
                              )}
                              {order.productionDetail && (
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">ข้อมูลฝ่ายผลิต</p>
                                  <p className="text-sm">{order.productionDetail}</p>
                                  <p className="text-sm">ผู้รับผิดชอบ: {order.productionStaff}</p>
                                  <p className="text-sm">กำหนดส่ง: {order.productionDeadline}</p>
                                  <Badge variant="outline" className="mt-1">{order.productionStatus}</Badge>
                                </div>
                              )}
                              <div className="pt-4 border-t">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-muted-foreground">ยอดรวม</span>
                                  <span className="font-medium">฿{order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-muted-foreground">ค่าขนส่ง</span>
                                  <span className="font-medium">฿{order.shippingFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-lg">
                                  <span>ยอดสุทธิ</span>
                                  <span>฿{(order.totalAmount + order.shippingFee).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        {pendingPayments > 0 && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-sm font-medium">
                  มีออเดอร์ {pendingPayments} รายการที่ยังไม่ได้ชำระเงิน กรุณาติดตาม
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  );
}
