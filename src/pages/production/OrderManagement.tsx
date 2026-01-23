import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data for production orders
const mockOrders = [
  {
    id: "ORD-001",
    orderDate: "2024-01-15",
    lineName: "customer_line_1",
    customerName: "บริษัท ABC จำกัด",
    product: "เหรียญรางวัล",
    deliveryDate: "2024-01-25",
    status: "ยังไม่ได้รับงาน",
    quotation: "Q-2024-001",
    responsiblePerson: "สมชาย ใจดี",
    graphicDesigner: "นภา สวยงาม",
    jobType: "งานเหรียญ",
    quantity: 500,
    isAccepted: false,
    productDetails: [
      { name: "สินค้า A", orderedQty: 500, countedQty: 0 },
    ]
  },
  {
    id: "ORD-002",
    orderDate: "2024-01-16",
    lineName: "customer_line_2",
    customerName: "ห้างหุ้นส่วน XYZ",
    product: "เหรียญรางวัล",
    deliveryDate: "2024-01-28",
    status: "อยู่ระหว่างการผลิต",
    quotation: "Q-2024-002",
    responsiblePerson: "วิชัย ขยัน",
    graphicDesigner: "สมหญิง รักงาน",
    jobType: "งานเหรียญ",
    quantity: 1250,
    isAccepted: true,
    productDetails: [
      { name: "สินค้า A", orderedQty: 500, countedQty: 495 },
      { name: "สินค้า B", orderedQty: 750, countedQty: 750 },
    ]
  },
  {
    id: "ORD-003",
    orderDate: "2024-01-10",
    lineName: "customer_line_3",
    customerName: "ร้านของขวัญ DEF",
    product: "กระเช้าของขวัญ",
    deliveryDate: "2024-01-20",
    status: "รอจัดส่ง",
    quotation: "Q-2024-003",
    responsiblePerson: "มานะ ทำงาน",
    graphicDesigner: "ประดิษฐ์ สร้างสรรค์",
    jobType: "งานกระเช้า",
    quantity: 10,
    isAccepted: true,
    productDetails: []
  },
  {
    id: "ORD-004",
    orderDate: "2024-01-05",
    lineName: "customer_line_4",
    customerName: "องค์กร GHI",
    product: "เหรียญรางวัล",
    deliveryDate: "2024-01-15",
    status: "จัดส่งสำเร็จ",
    quotation: "Q-2024-004",
    responsiblePerson: "สุชาติ ดีงาม",
    graphicDesigner: "วิภา ศิลป์",
    jobType: "งานเหรียญ",
    quantity: 2000,
    isAccepted: true,
    productDetails: [
      { name: "สินค้า A", orderedQty: 500, countedQty: 500 },
      { name: "สินค้า B", orderedQty: 750, countedQty: 748 },
      { name: "สินค้า C", orderedQty: 750, countedQty: 750 },
    ]
  }
];

export default function OrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [orders, setOrders] = useState(mockOrders);

  const handleAcceptJob = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, isAccepted: true, status: "อยู่ระหว่างการผลิต" }
        : order
    ));
  };

  const handleUpdateJob = (order: any) => {
    setSelectedOrder(order);
    setIsUpdateDialogOpen(true);
  };

  // Group orders by status
  const notAcceptedOrders = orders.filter(o => o.status === "ยังไม่ได้รับงาน");
  const inProductionOrders = orders.filter(o => o.status === "อยู่ระหว่างการผลิต");
  const waitingShipmentOrders = orders.filter(o => o.status === "รอจัดส่ง");
  const deliveredOrders = orders.filter(o => o.status === "จัดส่งสำเร็จ");

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "secondary" | "default" | "outline" | "destructive"> = {
      "ยังไม่ได้รับงาน": "secondary",
      "อยู่ระหว่างการผลิต": "default",
      "รอจัดส่ง": "outline",
      "จัดส่งสำเร็จ": "default"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const renderOrderRow = (order: any) => (
    <TableRow key={order.id}>
      <TableCell className="font-medium">{order.orderDate}</TableCell>
      <TableCell>{order.lineName}</TableCell>
      <TableCell>{order.customerName}</TableCell>
      <TableCell>{order.product}</TableCell>
      <TableCell>{order.deliveryDate}</TableCell>
      <TableCell>{getStatusBadge(order.status)}</TableCell>
      <TableCell>{order.quotation}</TableCell>
      <TableCell>{order.responsiblePerson}</TableCell>
      <TableCell>{order.graphicDesigner}</TableCell>
      <TableCell>{order.jobType}</TableCell>
      <TableCell>{order.quantity}</TableCell>
      <TableCell>
        {!order.isAccepted ? (
          <Button size="sm" onClick={() => handleAcceptJob(order.id)}>
            รับงาน
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => handleUpdateJob(order)}>
            อัพเดทงาน
          </Button>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">การจัดการผลิต</h1>
        <p className="text-muted-foreground">จัดการและติดตามออเดอร์การผลิตทั้งหมด</p>
      </div>

      {/* Section 1: ออเดอร์ที่ยังไม่ได้รับ */}
      {notAcceptedOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">ออเดอร์ที่ยังไม่ได้รับ</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>วันที่สั่งซื้อ</TableHead>
                  <TableHead>ชื่อ LINE</TableHead>
                  <TableHead>ชื่อผู้สั่งซื้อ</TableHead>
                  <TableHead>สินค้า</TableHead>
                  <TableHead>วันจัดส่ง</TableHead>
                  <TableHead>สถานะงาน</TableHead>
                  <TableHead>ใบเสนอราคา</TableHead>
                  <TableHead>ผู้รับผิดชอบงาน</TableHead>
                  <TableHead>กราฟิกผู้รับผิดชอบ</TableHead>
                  <TableHead>ประเภทงาน</TableHead>
                  <TableHead>จำนวน</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notAcceptedOrders.map(order => renderOrderRow(order))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Section 2: ออเดอร์ที่อยู่ระหว่างการผลิต */}
      {inProductionOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">ออเดอร์ที่อยู่ระหว่างการผลิต</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>วันที่สั่งซื้อ</TableHead>
                  <TableHead>ชื่อ LINE</TableHead>
                  <TableHead>ชื่อผู้สั่งซื้อ</TableHead>
                  <TableHead>สินค้า</TableHead>
                  <TableHead>วันจัดส่ง</TableHead>
                  <TableHead>สถานะงาน</TableHead>
                  <TableHead>ใบเสนอราคา</TableHead>
                  <TableHead>ผู้รับผิดชอบงาน</TableHead>
                  <TableHead>กราฟิกผู้รับผิดชอบ</TableHead>
                  <TableHead>ประเภทงาน</TableHead>
                  <TableHead>จำนวน</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inProductionOrders.map(order => renderOrderRow(order))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Section 3: ออเดอร์ที่รอจัดส่ง */}
      {waitingShipmentOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">ออเดอร์ที่รอจัดส่ง</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>วันที่สั่งซื้อ</TableHead>
                  <TableHead>ชื่อ LINE</TableHead>
                  <TableHead>ชื่อผู้สั่งซื้อ</TableHead>
                  <TableHead>สินค้า</TableHead>
                  <TableHead>วันจัดส่ง</TableHead>
                  <TableHead>สถานะงาน</TableHead>
                  <TableHead>ใบเสนอราคา</TableHead>
                  <TableHead>ผู้รับผิดชอบงาน</TableHead>
                  <TableHead>กราฟิกผู้รับผิดชอบ</TableHead>
                  <TableHead>ประเภทงาน</TableHead>
                  <TableHead>จำนวน</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitingShipmentOrders.map(order => renderOrderRow(order))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Section 4: ออเดอร์ที่จัดส่งสำเร็จแล้ว */}
      {deliveredOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">ออเดอร์ที่จัดส่งสำเร็จแล้ว</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>วันที่สั่งซื้อ</TableHead>
                  <TableHead>ชื่อ LINE</TableHead>
                  <TableHead>ชื่อผู้สั่งซื้อ</TableHead>
                  <TableHead>สินค้า</TableHead>
                  <TableHead>วันจัดส่ง</TableHead>
                  <TableHead>สถานะงาน</TableHead>
                  <TableHead>ใบเสนอราคา</TableHead>
                  <TableHead>ผู้รับผิดชอบงาน</TableHead>
                  <TableHead>กราฟิกผู้รับผิดชอบ</TableHead>
                  <TableHead>ประเภทงาน</TableHead>
                  <TableHead>จำนวน</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveredOrders.map(order => renderOrderRow(order))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Update Job Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>อัพเดทงาน - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ลูกค้า</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">สินค้า</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.product}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">วันจัดส่ง</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.deliveryDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">ผู้รับผิดชอบ</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.responsiblePerson}</p>
                </div>
              </div>

              {/* Dynamic product details for Medal products */}
              {selectedOrder.product === "เหรียญรางวัล" && selectedOrder.productDetails.length > 0 && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold text-sm">รายละเอียดสินค้า</h3>
                  {selectedOrder.productDetails.map((detail: any, index: number) => (
                    <div key={index} className="grid grid-cols-3 gap-3 items-center">
                      <div>
                        <Label className="text-xs">ชื่อสินค้า</Label>
                        <p className="text-sm font-medium">{detail.name}</p>
                      </div>
                      <div>
                        <Label className="text-xs">จำนวนที่สั่ง</Label>
                        <p className="text-sm">{detail.orderedQty}</p>
                      </div>
                      <div>
                        <Label htmlFor={`counted-${index}`} className="text-xs">จำนวนที่นับ</Label>
                        <Input
                          id={`counted-${index}`}
                          type="number"
                          defaultValue={detail.countedQty}
                          className="h-8"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="productImage">รูปสินค้า</Label>
                <Input
                  id="productImage"
                  type="file"
                  accept="image/*"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes">หมายเหตุ</Label>
                <Input
                  id="notes"
                  placeholder="เพิ่มหมายเหตุ..."
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={() => setIsUpdateDialogOpen(false)}>
              บันทึก
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
