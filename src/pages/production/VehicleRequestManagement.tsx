import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, X, Plus, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for vehicle requests
const mockRequests = [
  {
    id: "VR001",
    customerLineName: "ลูกค้า A",
    product: "เหรียญรางวัล 500 ชิ้น",
    deliveryBy: "พนักงานขับรถ 1",
    deliveryDate: "2024-03-15",
    deliveryLocation: "โรงเรียนสาธิต",
    address: "123 ถนนพระราม 4 กรุงเทพฯ 10110",
    notes: "มีใบเสร็จ",
    status: "รออนุมัติ",
    imageUrl: null
  },
  {
    id: "VR002",
    customerLineName: "ลูกค้า B",
    product: "โล่รางวัล 100 ชิ้น",
    deliveryBy: "พนักงานขับรถ 2",
    deliveryDate: "2024-03-16",
    deliveryLocation: "บริษัท ABC จำกัด",
    address: "456 ถนนสุขุมวิท กรุงเทพฯ 10110",
    notes: "ไม่มีใบเสร็จ",
    status: "อนุมัติแล้ว",
    imageUrl: null
  }
];

export default function VehicleRequestManagement() {
  const [requests, setRequests] = useState(mockRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerLineName: "",
    product: "",
    deliveryBy: "",
    deliveryDate: "",
    deliveryLocation: "",
    address: "",
    notes: "",
    imageUrl: null as string | null
  });

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "อนุมัติแล้ว" } : req
    ));
    toast({
      title: "อนุมัติคำขอสำเร็จ",
      description: `คำขอเลขที่ ${id} ได้รับการอนุมัติแล้ว`
    });
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "ไม่อนุมัติ" } : req
    ));
    toast({
      title: "ไม่อนุมัติคำขอ",
      description: `คำขอเลขที่ ${id} ไม่ได้รับการอนุมัติ`,
      variant: "destructive"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest = {
      id: `VR${String(requests.length + 1).padStart(3, '0')}`,
      ...formData,
      status: "รออนุมัติ"
    };
    setRequests([newRequest, ...requests]);
    setIsDialogOpen(false);
    setFormData({
      customerLineName: "",
      product: "",
      deliveryBy: "",
      deliveryDate: "",
      deliveryLocation: "",
      address: "",
      notes: "",
      imageUrl: null
    });
    toast({
      title: "สร้างคำขอสำเร็จ",
      description: "คำขอใช้รถถูกสร้างเรียบร้อยแล้ว"
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "รออนุมัติ":
        return "default";
      case "อนุมัติแล้ว":
        return "default";
      case "ไม่อนุมัติ":
        return "destructive";
      default:
        return "default";
    }
  };

  const pendingRequests = requests.filter(r => r.status === "รออนุมัติ");
  const approvedRequests = requests.filter(r => r.status === "อนุมัติแล้ว");
  const rejectedRequests = requests.filter(r => r.status === "ไม่อนุมัติ");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">การจัดการขอใช้รถ</h1>
          <p className="text-muted-foreground mt-2">จัดการคำขอใช้รถสำหรับการจัดส่งสินค้า</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              สร้างคำขอใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>สร้างคำขอใช้รถ</DialogTitle>
              <DialogDescription>กรอกข้อมูลสำหรับการขอใช้รถจัดส่งสินค้า</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerLineName">ชื่อ Line ลูกค้า</Label>
                <Input
                  id="customerLineName"
                  value={formData.customerLineName}
                  onChange={(e) => setFormData({ ...formData, customerLineName: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product">สินค้า</Label>
                <Input
                  id="product"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryBy">จัดส่งโดย</Label>
                <Input
                  id="deliveryBy"
                  value={formData.deliveryBy}
                  onChange={(e) => setFormData({ ...formData, deliveryBy: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate">วันที่จัดส่ง</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryLocation">สถานที่จัดส่ง</Label>
                <Input
                  id="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">ที่อยู่</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ช่องหมายเหตุ (ระบุ)</Label>
                <Textarea
                  id="notes"
                  placeholder="เช่น มีใบเสร็จ / ไม่มีใบเสร็จ / เอกสารอื่นๆ"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">แนบรูปภาพการจัดส่งสินค้า</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button type="submit">สร้างคำขอ</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">รอการอนุมัติ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">อนุมัติแล้ว</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedRequests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">ไม่อนุมัติ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการคำขอใช้รถทั้งหมด</CardTitle>
          <CardDescription>รายการคำขอใช้รถสำหรับการจัดส่งสินค้า</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัสคำขอ</TableHead>
                <TableHead>ชื่อ Line ลูกค้า</TableHead>
                <TableHead>สินค้า</TableHead>
                <TableHead>จัดส่งโดย</TableHead>
                <TableHead>วันที่จัดส่ง</TableHead>
                <TableHead>สถานที่จัดส่ง</TableHead>
                <TableHead>หมายเหตุ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    ไม่มีคำขอในระบบ
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.customerLineName}</TableCell>
                    <TableCell>{request.product}</TableCell>
                    <TableCell>{request.deliveryBy}</TableCell>
                    <TableCell>{request.deliveryDate}</TableCell>
                    <TableCell>{request.deliveryLocation}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{request.notes}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === "รออนุมัติ" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            อนุมัติ
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            ไม่อนุมัติ
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
