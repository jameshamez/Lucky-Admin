import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Package, AlertTriangle } from "lucide-react";

interface InventoryItem {
  id: string;
  image: string;
  name: string;
  sku: string;
  category: string;
  color: string;
  size: string;
  description: string;
  quantity: number;
  minQty: number;
  status: "in_stock" | "out_of_stock" | "defective" | "low_stock";
}

export default function InventoryStock() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const mockInventory: InventoryItem[] = [
    {
      id: "1",
      image: "/placeholder.svg",
      name: "ปากกาเจล สีน้ำเงิน",
      sku: "PEN-001",
      category: "เครื่องเขียน",
      color: "น้ำเงิน",
      size: "0.5mm",
      description: "ปากกาเจลคุณภาพดี",
      quantity: 150,
      minQty: 50,
      status: "in_stock",
    },
    {
      id: "2",
      image: "/placeholder.svg",
      name: "กระดาษ A4",
      sku: "PAP-001",
      category: "วัสดุสำนักงาน",
      color: "ขาว",
      size: "A4",
      description: "กระดาษถ่ายเอกสาร 80 แกรม",
      quantity: 25,
      minQty: 30,
      status: "low_stock",
    },
    {
      id: "3",
      image: "/placeholder.svg",
      name: "เมาส์ไร้สาย",
      sku: "IT-001",
      category: "อุปกรณ์ IT",
      color: "ดำ",
      size: "มาตรฐาน",
      description: "เมาส์ไร้สาย 2.4GHz",
      quantity: 0,
      minQty: 10,
      status: "out_of_stock",
    },
    {
      id: "4",
      image: "/placeholder.svg",
      name: "สมุดบันทึก",
      sku: "NOTE-001",
      category: "เครื่องเขียน",
      color: "คละสี",
      size: "A5",
      description: "สมุดบันทึกปกแข็ง",
      quantity: 5,
      minQty: 0,
      status: "defective",
    },
  ];

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && item.status === statusFilter;
  });

  const getStatusBadge = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in_stock":
        return <Badge className="bg-green-600">✅ มีในสต็อก</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive">❌ หมด</Badge>;
      case "defective":
        return <Badge className="bg-yellow-600">⚠️ มีตำหนิ</Badge>;
      case "low_stock":
        return <Badge className="bg-red-600">⚠️ สินค้าใกล้หมด</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">สต๊อกสินค้า</h1>
        <p className="text-muted-foreground mt-2">
          ตรวจสอบข้อมูลสต็อกสินค้าในคลัง (ดูอย่างเดียว ไม่สามารถแก้ไขได้)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ค้นหาและกรองสินค้า</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อสินค้าหรือรหัส SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="กรองตามสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="in_stock">มีในสต็อก</SelectItem>
                <SelectItem value="out_of_stock">หมด</SelectItem>
                <SelectItem value="low_stock">ใกล้หมด</SelectItem>
                <SelectItem value="defective">มีตำหนิ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            รายการสินค้าทั้งหมด ({filteredInventory.length} รายการ)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รูป</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead>รหัส</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>สี</TableHead>
                <TableHead>ขนาด</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead className="text-right">จำนวน</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id} className={item.status === "low_stock" ? "bg-red-50" : ""}>
                  <TableCell>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.color}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-semibold">{item.quantity}</span>
                      {item.minQty > 0 && (
                        <span className="text-xs text-muted-foreground">
                          (ขั้นต่ำ: {item.minQty})
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
                    {item.status === "low_stock" && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                        <AlertTriangle className="w-3 h-3" />
                        ต่ำกว่าขั้นต่ำ
                      </div>
                    )}
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
