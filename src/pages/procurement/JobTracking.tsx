import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CalendarIcon, Upload, Check, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const workStages = [
  { id: "artwork", label: "Artwork จากโรงงาน" },
  { id: "cnc", label: "CNC" },
  { id: "block", label: "ขึ้นบล็อก" },
  { id: "piece", label: "ชิ้นงาน" },
  { id: "plating", label: "ชุบสี" },
  { id: "lanyard", label: "เย็บสาย" },
];

interface Order {
  id: string;
  jobName: string;
  customer: string;
  orderDate: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
  value: number;
}

const mockOrders: Order[] = [
  { id: "ORD-001", jobName: "วิ่งเลาะเวียง", customer: "บริษัท ABC จำกัด", orderDate: "2024-01-15", dueDate: "2024-02-15", status: "in_progress", value: 125000 },
  { id: "ORD-002", jobName: "งานกีฬาสี", customer: "โรงเรียนสาธิต", orderDate: "2024-01-18", dueDate: "2024-02-20", status: "pending", value: 85000 },
  { id: "ORD-003", jobName: "เหรียญที่ระลึก", customer: "บริษัท XYZ จำกัด", orderDate: "2024-01-10", dueDate: "2024-02-10", status: "in_progress", value: 95000 },
  { id: "ORD-004", jobName: "งานสัมมนา", customer: "มหาวิทยาลัยเทคโนโลยี", orderDate: "2024-01-20", dueDate: "2024-02-25", status: "pending", value: 150000 },
  { id: "ORD-005", jobName: "ของรางวัล", customer: "องค์กรกีฬา", orderDate: "2024-01-12", dueDate: "2024-02-12", status: "completed", value: 75000 },
];

interface StageData {
  confirmDate: Date | undefined;
  image: File | null;
  salesComment: string;
  status: "pending" | "confirmed" | "rejected";
  rejectReason?: string;
}

export default function JobTracking() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [stagesData, setStagesData] = useState<Record<string, StageData>>(
    workStages.reduce((acc, stage) => ({
      ...acc,
      [stage.id]: {
        confirmDate: undefined,
        image: null,
        salesComment: "",
        status: "pending" as const,
        rejectReason: "",
      },
    }), {})
  );

  const handleImageUpload = (stageId: string, file: File | null) => {
    setStagesData((prev) => ({
      ...prev,
      [stageId]: { ...prev[stageId], image: file },
    }));
  };

  const handleConfirm = (stageId: string) => {
    setStagesData((prev) => ({
      ...prev,
      [stageId]: { ...prev[stageId], status: "confirmed" },
    }));
    toast.success(`ยืนยันขั้นตอน ${workStages.find(s => s.id === stageId)?.label} เรียบร้อย`);
  };

  const handleReject = (stageId: string) => {
    const rejectReason = prompt("กรุณาระบุเหตุผลในการไม่ยืนยัน:");
    if (rejectReason) {
      setStagesData((prev) => ({
        ...prev,
        [stageId]: { ...prev[stageId], status: "rejected", rejectReason },
      }));
      toast.error(`ไม่ยืนยันขั้นตอน ${workStages.find(s => s.id === stageId)?.label}`);
    }
  };

  const handleDeliveryDateSet = () => {
    toast.success("สถานะเปลี่ยนเป็น 'จัดส่งแล้ว' และแจ้งเตือนไปยังฝ่ายจัดซื้อ/ฝ่ายผลิตแล้ว");
  };

  const handleManageOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">รอดำเนินการ</Badge>;
      case "in_progress":
        return <Badge variant="default">กำลังดำเนินการ</Badge>;
      case "completed":
        return <Badge className="bg-green-600 hover:bg-green-700">เสร็จสิ้น</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">อัพเดตงาน / ตรวจสอบสถานะ</h1>
        <p className="text-muted-foreground mt-2">ติดตามและอัพเดตสถานะการผลิตในแต่ละขั้นตอน</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการออเดอร์ทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัสออเดอร์</TableHead>
                <TableHead>ชื่องาน</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>วันที่สั่ง</TableHead>
                <TableHead>วันครบกำหนด</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">มูลค่า</TableHead>
                <TableHead className="text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.jobName}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{format(new Date(order.orderDate), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{format(new Date(order.dueDate), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">฿{order.value.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManageOrder(order)}
                    >
                      จัดการ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>จัดการงาน: {selectedOrder?.jobName}</DrawerTitle>
          </DrawerHeader>
          <div className="p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลงาน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>รหัสออเดอร์</Label>
                    <Input value={selectedOrder?.id || ""} disabled />
                  </div>
                  <div>
                    <Label>ชื่องาน</Label>
                    <Input value={selectedOrder?.jobName || ""} disabled />
                  </div>
                  <div>
                    <Label>ลูกค้า</Label>
                    <Input value={selectedOrder?.customer || ""} disabled />
                  </div>
                  <div>
                    <Label>วันครบกำหนด</Label>
                    <Input 
                      value={selectedOrder?.dueDate ? format(new Date(selectedOrder.dueDate), "dd/MM/yyyy") : ""} 
                      disabled 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              {workStages.map((stage) => {
                const data = stagesData[stage.id];
                return (
                  <Card key={stage.id} className={cn(
                    "border-2",
                    data.status === "confirmed" && "border-green-500",
                    data.status === "rejected" && "border-red-500"
                  )}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{stage.label}</CardTitle>
                        {data.status === "confirmed" && (
                          <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                            <Check className="w-4 h-4" /> ยืนยันแล้ว
                          </span>
                        )}
                        {data.status === "rejected" && (
                          <span className="text-sm text-red-600 font-semibold flex items-center gap-1">
                            <X className="w-4 h-4" /> ไม่ยืนยัน
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>วันที่ยืนยันงาน</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !data.confirmDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {data.confirmDate ? format(data.confirmDate, "PPP") : "เลือกวันที่"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={data.confirmDate}
                                onSelect={(date) =>
                                  setStagesData((prev) => ({
                                    ...prev,
                                    [stage.id]: { ...prev[stage.id], confirmDate: date },
                                  }))
                                }
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <Label>รูปภาพอัพเดตงาน</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(stage.id, e.target.files?.[0] || null)
                              }
                              className="flex-1"
                            />
                            {data.image && (
                              <Upload className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>ความเห็นจากเซลล์</Label>
                        <Textarea
                          value={data.salesComment}
                          onChange={(e) =>
                            setStagesData((prev) => ({
                              ...prev,
                              [stage.id]: { ...prev[stage.id], salesComment: e.target.value },
                            }))
                          }
                          placeholder="ระบุความเห็นหรือหมายเหตุ"
                          rows={3}
                        />
                      </div>

                      {data.status === "rejected" && data.rejectReason && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded">
                          <Label className="text-red-700">เหตุผลในการไม่ยืนยัน:</Label>
                          <p className="text-sm text-red-600 mt-1">{data.rejectReason}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleConfirm(stage.id)}
                          disabled={data.status === "confirmed"}
                          className="flex-1"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          ยืนยัน
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(stage.id)}
                          disabled={data.status === "rejected"}
                          className="flex-1"
                        >
                          <X className="mr-2 h-4 w-4" />
                          ไม่ยืนยัน
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>จัดส่งงาน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>วันที่จัดส่งงาน</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        เลือกวันที่จัดส่ง
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={handleDeliveryDateSet} className="w-full">
                  บันทึกวันที่จัดส่ง (เปลี่ยนสถานะเป็น 'จัดส่งแล้ว')
                </Button>
              </CardContent>
            </Card>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
