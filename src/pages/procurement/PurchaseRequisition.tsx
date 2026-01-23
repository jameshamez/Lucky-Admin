import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Plus, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PRRequest {
  id: string;
  prNumber: string;
  issueDate: Date;
  usageDate: Date;
  requester: string;
  description: string;
  purpose: string;
  status: "pending" | "ordered" | "received" | "po_opened";
  poNumber?: string;
}

export default function PurchaseRequisition() {
  const [showForm, setShowForm] = useState(false);
  const [issueDate, setIssueDate] = useState<Date>();
  const [usageDate, setUsageDate] = useState<Date>();
  const [receiveDate, setReceiveDate] = useState<Date>();
  const [requests, setRequests] = useState<PRRequest[]>([
    {
      id: "1",
      prNumber: "PR13092025001",
      issueDate: new Date(),
      usageDate: new Date(),
      requester: "นายสมชาย ใจดี",
      description: "ซื้อวัสดุสำนักงาน จำนวน 10 ชิ้น",
      purpose: "ใช้ในแผนก",
      status: "pending",
    },
  ]);

  const generatePRNumber = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);
    const sequence = String(requests.length + 1).padStart(4, "0");
    return `PR${day}${month}${year}${sequence}`;
  };

  const handleSubmit = () => {
    const newPR: PRRequest = {
      id: String(Date.now()),
      prNumber: generatePRNumber(),
      issueDate: issueDate || new Date(),
      usageDate: usageDate || new Date(),
      requester: "ชื่อผู้ขอ",
      description: "รายละเอียดสินค้า",
      purpose: "จุดประสงค์",
      status: "pending",
    };
    setRequests((prev) => [newPR, ...prev]);
    setShowForm(false);
    toast.success("สร้าง PR เรียบร้อย: " + newPR.prNumber);
  };

  const getStatusBadge = (status: PRRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">รอสั่งงาน</Badge>;
      case "ordered":
        return <Badge className="bg-blue-600">สั่งแล้ว</Badge>;
      case "received":
        return <Badge className="bg-green-600">รับของแล้ว</Badge>;
      case "po_opened":
        return <Badge className="bg-purple-600">เปิด PO แล้ว</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">สั่งซื้อวัสดุอุปกรณ์</h1>
          <p className="text-muted-foreground mt-2">จัดการใบขอซื้อ (Purchase Requisition)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          สร้าง PR ใหม่
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>สร้างใบขอซื้อ (PR)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>เลข PR (อัตโนมัติ)</Label>
                <Input value={generatePRNumber()} disabled />
              </div>
              <div>
                <Label>วันที่ออก PR</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !issueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {issueDate ? format(issueDate, "PPP") : "เลือกวันที่"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={issueDate}
                      onSelect={setIssueDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>วันที่ใช้งาน</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !usageDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {usageDate ? format(usageDate, "PPP") : "เลือกวันที่"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={usageDate}
                      onSelect={setUsageDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>ชื่อผู้ขอซื้อ</Label>
                <Input placeholder="ระบุชื่อผู้ขอซื้อ" />
              </div>
            </div>

            <div>
              <Label>รายละเอียด (สิ่งที่ต้องการ + จำนวนชิ้น)</Label>
              <Textarea placeholder="ระบุรายละเอียดสินค้าและจำนวน" rows={3} />
            </div>

            <div>
              <Label>จุดประสงค์</Label>
              <Textarea placeholder="ระบุจุดประสงค์การใช้งาน" rows={2} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>ลิงก์</Label>
                <Input placeholder="https://" type="url" />
              </div>
              <div>
                <Label>แนบไฟล์/รูปภาพ</Label>
                <Input type="file" multiple />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1">บันทึก</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>รายการใบขอซื้อ (PR)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เลข PR</TableHead>
                <TableHead>วันที่ออก</TableHead>
                <TableHead>ผู้ขอซื้อ</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {req.prNumber}
                    </div>
                  </TableCell>
                  <TableCell>{format(req.issueDate, "dd/MM/yyyy")}</TableCell>
                  <TableCell>{req.requester}</TableCell>
                  <TableCell className="max-w-xs truncate">{req.description}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell>
                    <Select
                      value={req.status}
                      onValueChange={(value) =>
                        setRequests((prev) =>
                          prev.map((r) =>
                            r.id === req.id ? { ...r, status: value as PRRequest["status"] } : r
                          )
                        )
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">รอสั่งงาน</SelectItem>
                        <SelectItem value="ordered">สั่งแล้ว</SelectItem>
                        <SelectItem value="received">รับของแล้ว</SelectItem>
                        <SelectItem value="po_opened">เปิด PO แล้ว</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
