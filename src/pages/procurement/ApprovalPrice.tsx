import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, FileText, TrendingUp, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuotationItem {
  id: string;
  jobCode: string;
  jobName: string;
  factory: string;
  totalCost: number;
  totalSellingPrice: number;
  totalProfit: number;
  quantity: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  remarks?: string;
  image?: string;
  platingColor: string;
  size: string;
  thickness: string;
  numberOfLines: string;
  moldCost?: number;
}

// Mock data
const mockQuotations: QuotationItem[] = [
  {
    id: "1",
    jobCode: "250709-01-Z",
    jobName: "วิ่งเลาะเวียง - เหรียญรางวัล",
    factory: "China Z",
    totalCost: 45.50,
    totalSellingPrice: 65.00,
    totalProfit: 5850.00,
    quantity: 300,
    status: "pending",
    createdAt: new Date("2025-07-09"),
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400",
    platingColor: "ทอง",
    size: "5 cm",
    thickness: "3 mm",
    numberOfLines: "2 แบบ",
    moldCost: 1500,
  },
  {
    id: "2",
    jobCode: "250709-02-Y",
    jobName: "วิ่งเลาะเวียง - ถ้วยรางวัล",
    factory: "China Y",
    totalCost: 85.00,
    totalSellingPrice: 120.00,
    totalProfit: 7000.00,
    quantity: 200,
    status: "pending",
    createdAt: new Date("2025-07-09"),
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400",
    platingColor: "เงิน",
    size: "15 cm / 6 inch",
    thickness: "5 mm",
    numberOfLines: "3 แบบ",
    moldCost: 2000,
  },
  {
    id: "3",
    jobCode: "250708-01-U",
    jobName: "งานมหาวิทยาลัย - โล่",
    factory: "China U",
    totalCost: 120.00,
    totalSellingPrice: 180.00,
    totalProfit: 6000.00,
    quantity: 100,
    status: "approved",
    createdAt: new Date("2025-07-08"),
    image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400",
    platingColor: "ทองเหลือง",
    size: "20 cm / 8 inch",
    thickness: "8 mm",
    numberOfLines: "1 แบบ",
    moldCost: 3000,
  },
];

const ApprovalPrice = () => {
  const [quotations, setQuotations] = useState<QuotationItem[]>(mockQuotations);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationItem | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [viewingQuotation, setViewingQuotation] = useState<QuotationItem | null>(null);

  const handleApprove = (id: string) => {
    setQuotations(quotations.map(q => 
      q.id === id ? { ...q, status: "approved" as const } : q
    ));
    toast.success("อนุมัติราคาสำเร็จ");
  };

  const handleReject = () => {
    if (!selectedQuotation) return;
    
    setQuotations(quotations.map(q => 
      q.id === selectedQuotation.id 
        ? { ...q, status: "rejected" as const, remarks: rejectRemarks } 
        : q
    ));
    toast.error("ไม่อนุมัติราคา - จัดซื้อต้องแก้ไข");
    setRejectDialogOpen(false);
    setRejectRemarks("");
    setSelectedQuotation(null);
  };

  const openRejectDialog = (quotation: QuotationItem) => {
    setSelectedQuotation(quotation);
    setRejectDialogOpen(true);
  };

  const openDetailDialog = (quotation: QuotationItem) => {
    setViewingQuotation(quotation);
    setDetailDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            อนุมัติแล้ว
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            ไม่อนุมัติ
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-warning text-warning-foreground">
            <Clock className="w-3 h-3 mr-1" />
            รออนุมัติ
          </Badge>
        );
    }
  };

  const pendingCount = quotations.filter(q => q.status === "pending").length;
  const approvedCount = quotations.filter(q => q.status === "approved").length;
  const rejectedCount = quotations.filter(q => q.status === "rejected").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">อนุมัติราคา</h1>
          <p className="text-muted-foreground mt-1">ตรวจสอบและอนุมัติรายการเสนอราคาจากจัดซื้อ</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">รออนุมัติ</p>
                <p className="text-3xl font-bold text-warning">{pendingCount}</p>
              </div>
              <Clock className="w-10 h-10 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">อนุมัติแล้ว</p>
                <p className="text-3xl font-bold text-success">{approvedCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ไม่อนุมัติ</p>
                <p className="text-3xl font-bold text-destructive">{rejectedCount}</p>
              </div>
              <XCircle className="w-10 h-10 text-destructive opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotation List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">รายการเสนอราคา</h2>
        
        {quotations.map((quotation) => (
          <Card key={quotation.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {quotation.jobName}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-mono font-semibold text-foreground">
                      {quotation.jobCode}
                    </span>
                    <span>•</span>
                    <span>{quotation.factory}</span>
                  </div>
                </div>
                {getStatusBadge(quotation.status)}
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Product Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                {quotation.image && (
                  <div className="flex items-center justify-center">
                    <img 
                      src={quotation.image} 
                      alt={quotation.jobName}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-border"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-muted-foreground">สีชุบ</p>
                  <p className="text-sm font-semibold text-foreground">{quotation.platingColor}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-muted-foreground">ขนาด</p>
                  <p className="text-sm font-semibold text-foreground">{quotation.size}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-muted-foreground">ความหนา</p>
                  <p className="text-sm font-semibold text-foreground">{quotation.thickness}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-muted-foreground">จำนวนสาย</p>
                  <p className="text-sm font-semibold text-foreground">{quotation.numberOfLines}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-muted-foreground">จำนวนชิ้น</p>
                  <p className="text-sm font-semibold text-foreground">{quotation.quantity.toLocaleString()} ชิ้น</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDetailDialog(quotation)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  ดูรายละเอียด
                </Button>
              </div>

              {quotation.remarks && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg mt-4">
                  <p className="text-sm font-medium text-destructive mb-1">หมายเหตุ:</p>
                  <p className="text-sm text-foreground">{quotation.remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ไม่อนุมัติราคา</DialogTitle>
            <DialogDescription>
              กรุณาระบุเหตุผลที่ไม่อนุมัติเพื่อแจ้งให้จัดซื้อแก้ไข
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">หมายเหตุ *</label>
              <Textarea
                placeholder="ระบุเหตุผลที่ไม่อนุมัติ..."
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectRemarks("");
                setSelectedQuotation(null);
              }}
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectRemarks.trim()}
            >
              ยืนยันไม่อนุมัติ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดใบเสนอราคา</DialogTitle>
            <DialogDescription>
              {viewingQuotation?.jobCode} - {viewingQuotation?.jobName}
            </DialogDescription>
          </DialogHeader>
          
          {viewingQuotation && (
            <div className="space-y-6 py-4">
              {/* ข้อมูลการขอราคา */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">ข้อมูลการขอราคา</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  {viewingQuotation.image && (
                    <div className="col-span-2 md:col-span-1 flex justify-center">
                      <img 
                        src={viewingQuotation.image} 
                        alt={viewingQuotation.jobName}
                        className="w-32 h-32 object-cover rounded-lg border-2 border-border"
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">สีชุบ</p>
                      <p className="text-sm font-semibold text-foreground">{viewingQuotation.platingColor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ขนาด</p>
                      <p className="text-sm font-semibold text-foreground">{viewingQuotation.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ความหนา</p>
                      <p className="text-sm font-semibold text-foreground">{viewingQuotation.thickness}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">จำนวนสาย</p>
                      <p className="text-sm font-semibold text-foreground">{viewingQuotation.numberOfLines}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">จำนวนชิ้น</p>
                      <p className="text-sm font-semibold text-foreground">{viewingQuotation.quantity.toLocaleString()} ชิ้น</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ข้อมูลการเสนอราคา */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">ข้อมูลการเสนอราคา</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supplier</TableHead>
                        <TableHead className="text-right">ทุนรวม (THB)</TableHead>
                        <TableHead className="text-right">ราคาขายรวม (THB)</TableHead>
                        <TableHead className="text-right">กำไร (THB)</TableHead>
                        <TableHead className="text-right">ค่าโมล(เพิ่มเติม) (THB)</TableHead>
                        {viewingQuotation.status === "pending" && (
                          <TableHead className="text-center">การดำเนินการ</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">{viewingQuotation.factory}</TableCell>
                        <TableCell className="text-right">
                          {(viewingQuotation.totalCost * viewingQuotation.quantity).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          {(viewingQuotation.totalSellingPrice * viewingQuotation.quantity).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right text-success font-semibold">
                          {viewingQuotation.totalProfit.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          {viewingQuotation.moldCost?.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '-'}
                        </TableCell>
                        {viewingQuotation.status === "pending" && (
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setDetailDialogOpen(false);
                                  openRejectDialog(viewingQuotation);
                                }}
                                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                ไม่อนุมัติ
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  handleApprove(viewingQuotation.id);
                                  setDetailDialogOpen(false);
                                }}
                                className="bg-success text-success-foreground hover:bg-success/90"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                อนุมัติราคา
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalPrice;
