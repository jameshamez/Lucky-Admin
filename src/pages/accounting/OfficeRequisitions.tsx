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
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  Eye,
  Download,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const OfficeRequisitions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [requisitionItems, setRequisitionItems] = useState([
    { id: 1, sku: "", name: "", location: "", qty: 1, unit: "" },
  ]);

  // Mock data
  const stats = [
    { label: "รออนุมัติ", value: "12", icon: Clock, color: "text-warning" },
    { label: "อนุมัติแล้ว", value: "28", icon: CheckCircle, color: "text-success" },
    { label: "จ่ายแล้ว", value: "85", icon: ClipboardList, color: "text-primary" },
    { label: "ยกเลิก", value: "3", icon: XCircle, color: "text-destructive" },
  ];

  const requisitions = [
    {
      id: 1,
      reqNo: "REQ-2024-001",
      date: "2024-01-15",
      requester: "นายสมชาย ใจดี",
      department: "แผนกขาย",
      itemCount: 3,
      status: "รออนุมัติ",
      approver: "-",
      issuer: "-",
      issueDate: "-",
    },
    {
      id: 2,
      reqNo: "REQ-2024-002",
      date: "2024-01-14",
      requester: "นางสาวสมหญิง รักงาน",
      department: "แผนกการตลาด",
      itemCount: 5,
      status: "อนุมัติ",
      approver: "นายผู้จัดการ",
      issuer: "-",
      issueDate: "-",
    },
    {
      id: 3,
      reqNo: "REQ-2024-003",
      date: "2024-01-13",
      requester: "นายทดสอบ ระบบดี",
      department: "แผนกผลิต",
      itemCount: 2,
      status: "จ่ายแล้ว",
      approver: "นายผู้จัดการ",
      issuer: "นางสาวคลัง ยิ้มดี",
      issueDate: "2024-01-13 15:30",
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "รออนุมัติ") return <Badge className="bg-warning text-warning-foreground">{status}</Badge>;
    if (status === "อนุมัติ") return <Badge className="bg-success text-success-foreground">{status}</Badge>;
    if (status === "จ่ายแล้ว") return <Badge variant="default">{status}</Badge>;
    if (status === "ยกเลิก") return <Badge variant="destructive">{status}</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  const addRequisitionItem = () => {
    setRequisitionItems([
      ...requisitionItems,
      { id: Date.now(), sku: "", name: "", location: "", qty: 1, unit: "" },
    ]);
  };

  const removeRequisitionItem = (id: number) => {
    if (requisitionItems.length > 1) {
      setRequisitionItems(requisitionItems.filter((item) => item.id !== id));
    }
  };

  const handleCreateRequisition = () => {
    toast.success("สร้างใบเบิกเรียบร้อยแล้ว");
    setShowCreateDrawer(false);
    setRequisitionItems([{ id: 1, sku: "", name: "", location: "", qty: 1, unit: "" }]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">รายการเบิกใช้วัสดุสำนักงาน</h1>
          <p className="text-muted-foreground mt-1">
            จัดการใบเบิกวัสดุและอุปกรณ์สำนักงาน พร้อมระบบอนุมัติและติดตาม
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" onClick={() => setShowCreateDrawer(true)}>
            <Plus className="w-4 h-4 mr-2" />
            สร้างใบเบิก
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

      {/* Requisitions Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการใบเบิก</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหา เลขที่ใบเบิก / ผู้ขอ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-[200px]"
            />
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="แผนก" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="sales">แผนกขาย</SelectItem>
                <SelectItem value="marketing">แผนกการตลาด</SelectItem>
                <SelectItem value="production">แผนกผลิต</SelectItem>
                <SelectItem value="accounting">แผนกบัญชี</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="pending">รออนุมัติ</SelectItem>
                <SelectItem value="approved">อนุมัติ</SelectItem>
                <SelectItem value="issued">จ่ายแล้ว</SelectItem>
                <SelectItem value="cancelled">ยกเลิก</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เลขที่ใบเบิก</TableHead>
                  <TableHead>วันที่</TableHead>
                  <TableHead>ผู้ขอ</TableHead>
                  <TableHead>แผนก</TableHead>
                  <TableHead className="text-center">จำนวนชนิด</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ผู้อนุมัติ</TableHead>
                  <TableHead>ผู้จ่าย</TableHead>
                  <TableHead>วันที่จ่าย</TableHead>
                  <TableHead className="text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisitions.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs font-medium">{req.reqNo}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell>{req.requester}</TableCell>
                    <TableCell>{req.department}</TableCell>
                    <TableCell className="text-center">{req.itemCount}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell className="text-sm">{req.approver}</TableCell>
                    <TableCell className="text-sm">{req.issuer}</TableCell>
                    <TableCell className="text-xs">{req.issueDate}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
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

      {/* Create Requisition Drawer */}
      <Drawer open={showCreateDrawer} onOpenChange={setShowCreateDrawer}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>สร้างใบเบิกวัสดุสำนักงาน</DrawerTitle>
          </DrawerHeader>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="req-no">เลขที่ใบเบิก *</Label>
                <Input id="req-no" placeholder="REQ-2024-XXX (Auto)" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="req-date">วันที่ขอเบิก *</Label>
                <Input id="req-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requester">ผู้ขอ *</Label>
                <Input id="requester" placeholder="ระบุชื่อผู้ขอเบิก" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">แผนก *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกแผนก" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">แผนกขาย</SelectItem>
                    <SelectItem value="marketing">แผนกการตลาด</SelectItem>
                    <SelectItem value="production">แผนกผลิต</SelectItem>
                    <SelectItem value="accounting">แผนกบัญชี</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="reason">เหตุผลการเบิก/อ้างอิงงาน</Label>
                <Textarea id="reason" placeholder="ระบุเหตุผลหรืองานที่เกี่ยวข้อง" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>รายการเบิก *</Label>
                <Button variant="outline" size="sm" onClick={addRequisitionItem}>
                  <Plus className="w-4 h-4 mr-1" />
                  เพิ่มรายการ
                </Button>
              </div>
              <div className="space-y-2">
                {requisitionItems.map((item, index) => (
                  <Card key={item.id}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-3 space-y-2">
                          <Label className="text-xs">SKU *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือก SKU" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="off-001">OFF-001 - กระดาษ A4</SelectItem>
                              <SelectItem value="off-002">OFF-002 - ปากกาลูกลื่น</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-3 space-y-2">
                          <Label className="text-xs">ชื่อ</Label>
                          <Input placeholder="ชื่อสินค้า" disabled />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label className="text-xs">คลัง/ที่เก็บ</Label>
                          <Input placeholder="ที่เก็บ" disabled />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label className="text-xs">จำนวนที่ขอ *</Label>
                          <Input type="number" min="1" defaultValue="1" />
                        </div>
                        <div className="col-span-1 space-y-2">
                          <Label className="text-xs">หน่วย</Label>
                          <Input placeholder="หน่วย" disabled />
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRequisitionItem(item.id)}
                            disabled={requisitionItems.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="approver">ผู้อนุมัติ</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกผู้อนุมัติ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager1">นายผู้จัดการ</SelectItem>
                    <SelectItem value="manager2">หัวหน้าแผนก</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">หมายเหตุ</Label>
                <Textarea id="note" placeholder="ระบุข้อมูลเพิ่มเติม (ถ้ามี)" />
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleCreateRequisition}>สร้างใบเบิก</Button>
            <Button variant="outline" onClick={() => setShowCreateDrawer(false)}>
              ยกเลิก
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default OfficeRequisitions;
