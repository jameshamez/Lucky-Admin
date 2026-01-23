import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  AlertTriangle,
  Clock,
  Package,
  Truck,
  CheckCircle
} from "lucide-react";

// Status list for "เหรียญสั่งผลิต + ลูกค้ามีแบบแล้ว"
const productStatusList = [
  { status: "รอจัดซื้อส่งประเมิน", department: "เซลล์" },
  { status: "อยู่ระหว่างการประเมินราคา", department: "จัดซื้อ" },
  { status: "ได้รับราคา", department: "จัดซื้อ" },
  { status: "เสนอราคาให้ลูกค้า", department: "เซลล์" },
  { status: "ลูกค้าอนุมัติราคา", department: "เซลล์" },
  { status: "รอกราฟิกปรับไฟล์เพื่อผลิต", department: "กราฟิก" },
  { status: "กำลังปรับไฟล์ผลิต", department: "กราฟิก" },
  { status: "ไฟล์ผลิตพร้อมสั่งผลิต", department: "กราฟิก" },
  { status: "รอจัดซื้อออก PO / สั่งผลิต", department: "จัดซื้อ" },
  { status: "สั่งผลิตแล้ว", department: "จัดซื้อ" },
  { status: "กำลังผลิต", department: "โรงงาน" },
  { status: "ตรวจสอบ Artwork จากโรงงาน", department: "โรงงาน" },
  { status: "ตรวจสอบ CNC", department: "โรงงาน" },
  { status: "อัปเดทปั้มชิ้นงาน", department: "โรงงาน" },
  { status: "อัปเดตสาย", department: "โรงงาน" },
  { status: "อัปเดตชิ้นงานก่อนจัดส่ง", department: "QC" },
  { status: "งานเสร็จสมบูรณ์", department: "QC" },
  { status: "อยู่ระหว่างขนส่ง", department: "ขนส่ง" },
  { status: "สินค้ามาส่งที่ร้าน", department: "คลัง" },
];

interface StatusHistoryItem {
  status: string;
  updatedAt: string;
  updatedBy: string;
  department: string;
}

interface OrderItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  currentStatus: string;
  statusHistory: StatusHistoryItem[];
}

interface Order {
  id: string;
  customer: string;
  items: string;
  orderDate: string;
  dueDate: string;
  status: string;
  value: number;
  progress: number;
  type: string;
  location: string;
  department: string;
  lineId: string;
  phone: string;
  email: string;
  address: string;
  taxId: string;
  orderItems: OrderItem[];
}

const orders: Order[] = [
  {
    id: "JOB-2024-001",
    customer: "บริษัท เอบีซี จำกัด",
    items: "เหรียญสั่งผลิต, ถ้วยรางวัล",
    orderDate: "2024-12-20",
    dueDate: "2025-01-15",
    status: "in_production",
    value: 55000,
    progress: 55,
    type: "internal",
    location: "domestic",
    department: "production",
    lineId: "@abc_company",
    phone: "02-123-4567",
    email: "contact@abc.co.th",
    address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
    taxId: "0105555123456",
    orderItems: [
      {
        id: 1,
        name: "เหรียญสั่งผลิต",
        description: "ลูกค้ามีแบบแล้ว - เหรียญทองแดงชุบทอง ขนาด 5 ซม. พร้อมริบบิ้น",
        quantity: 100,
        currentStatus: "สินค้ามาส่งที่ร้าน",
        statusHistory: [
          { status: "รอจัดซื้อส่งประเมิน", updatedAt: "2024-12-20 09:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "อยู่ระหว่างการประเมินราคา", updatedAt: "2024-12-20 14:30", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "ได้รับราคา", updatedAt: "2024-12-21 10:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "เสนอราคาให้ลูกค้า", updatedAt: "2024-12-21 15:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "ลูกค้าอนุมัติราคา", updatedAt: "2024-12-22 10:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "รอกราฟิกปรับไฟล์เพื่อผลิต", updatedAt: "2024-12-22 11:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "กำลังปรับไฟล์ผลิต", updatedAt: "2024-12-22 14:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "ไฟล์ผลิตพร้อมสั่งผลิต", updatedAt: "2024-12-23 09:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "รอจัดซื้อออก PO / สั่งผลิต", updatedAt: "2024-12-23 10:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "สั่งผลิตแล้ว", updatedAt: "2024-12-23 14:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "กำลังผลิต", updatedAt: "2024-12-24 09:00", updatedBy: "โรงงาน A", department: "โรงงาน" },
          { status: "ตรวจสอบ Artwork จากโรงงาน", updatedAt: "2024-12-25 10:00", updatedBy: "โรงงาน A", department: "โรงงาน" },
          { status: "ตรวจสอบ CNC", updatedAt: "2024-12-26 09:00", updatedBy: "โรงงาน A", department: "โรงงาน" },
          { status: "อัปเดทปั้มชิ้นงาน", updatedAt: "2024-12-27 09:00", updatedBy: "โรงงาน A", department: "โรงงาน" },
          { status: "อัปเดตสาย", updatedAt: "2024-12-28 09:00", updatedBy: "โรงงาน A", department: "โรงงาน" },
          { status: "อัปเดตชิ้นงานก่อนจัดส่ง", updatedAt: "2024-12-29 09:00", updatedBy: "QC Team", department: "QC" },
          { status: "งานเสร็จสมบูรณ์", updatedAt: "2024-12-30 09:00", updatedBy: "QC Team", department: "QC" },
          { status: "อยู่ระหว่างขนส่ง", updatedAt: "2024-12-31 09:00", updatedBy: "ขนส่ง", department: "ขนส่ง" },
          { status: "สินค้ามาส่งที่ร้าน", updatedAt: "2025-01-02 10:00", updatedBy: "คลังสินค้า", department: "คลัง" },
        ]
      },
      {
        id: 2,
        name: "ถ้วยรางวัล",
        description: "ถ้วยรางวัลโลหะ ขนาด 12 นิ้ว ชุบทอง พร้อมฐานไม้",
        quantity: 50,
        currentStatus: "ไฟล์ผลิตพร้อมสั่งผลิต",
        statusHistory: [
          { status: "รอจัดซื้อส่งประเมิน", updatedAt: "2024-12-20 09:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "อยู่ระหว่างการประเมินราคา", updatedAt: "2024-12-20 14:30", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "ได้รับราคา", updatedAt: "2024-12-21 10:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "เสนอราคาให้ลูกค้า", updatedAt: "2024-12-21 15:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "ลูกค้าอนุมัติราคา", updatedAt: "2024-12-22 10:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "รอกราฟิกปรับไฟล์เพื่อผลิต", updatedAt: "2024-12-22 11:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "กำลังปรับไฟล์ผลิต", updatedAt: "2024-12-22 14:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "ไฟล์ผลิตพร้อมสั่งผลิต", updatedAt: "2024-12-23 09:00", updatedBy: "อาร์ต", department: "กราฟิก" },
        ]
      }
    ]
  },
  {
    id: "JOB-2024-003",
    customer: "สมาคมกีฬาแห่งประเทศไทย",
    items: "เหรียญรางวัล",
    orderDate: "2024-12-28",
    dueDate: "2025-01-25",
    status: "in_production",
    value: 85000,
    progress: 65,
    type: "internal",
    location: "domestic",
    department: "production",
    lineId: "@sportthailand",
    phone: "02-214-3456",
    email: "info@sportthailand.org",
    address: "286 ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240",
    taxId: "0993000456789",
    orderItems: [
      {
        id: 1,
        name: "เหรียญรางวัล",
        description: "เหรียญสั่งผลิต - วัสดุ: ทองแดงชุบทอง ขนาด 7 ซม. สีทอง/สีเงิน/สีทองแดง อย่างละ 200 เหรียญ พร้อมริบบิ้นไตรรงค์",
        quantity: 600,
        currentStatus: "ตรวจสอบ CNC",
        statusHistory: [
          { status: "รอจัดซื้อส่งประเมิน", updatedAt: "2024-12-28 09:00", updatedBy: "พิมพ์ใจ", department: "เซลล์" },
          { status: "อยู่ระหว่างการประเมินราคา", updatedAt: "2024-12-28 14:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "ได้รับราคา", updatedAt: "2024-12-29 10:30", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "เสนอราคาให้ลูกค้า", updatedAt: "2024-12-29 14:00", updatedBy: "พิมพ์ใจ", department: "เซลล์" },
          { status: "ลูกค้าอนุมัติราคา", updatedAt: "2024-12-30 09:00", updatedBy: "พิมพ์ใจ", department: "เซลล์" },
          { status: "รอกราฟิกปรับไฟล์เพื่อผลิต", updatedAt: "2024-12-30 10:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "กำลังปรับไฟล์ผลิต", updatedAt: "2024-12-30 14:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "ไฟล์ผลิตพร้อมสั่งผลิต", updatedAt: "2024-12-31 09:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "รอจัดซื้อออก PO / สั่งผลิต", updatedAt: "2024-12-31 10:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "สั่งผลิตแล้ว", updatedAt: "2024-12-31 14:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "กำลังผลิต", updatedAt: "2025-01-02 09:00", updatedBy: "โรงงาน B", department: "โรงงาน" },
          { status: "ตรวจสอบ Artwork จากโรงงาน", updatedAt: "2025-01-04 10:00", updatedBy: "โรงงาน B", department: "โรงงาน" },
        ]
      }
    ]
  },
  {
    id: "JOB-2024-004",
    customer: "มหาวิทยาลัยศิลปากร",
    items: "ถ้วยรางวัลโลหะอิตาลี",
    orderDate: "2024-12-10",
    dueDate: "2025-01-05",
    status: "shipped",
    value: 42000,
    progress: 100,
    type: "internal",
    location: "domestic",
    department: "production",
    lineId: "@silpakorn_uni",
    phone: "02-221-5555",
    email: "info@su.ac.th",
    address: "31 ถนนหน้าพระลาน แขวงพระบรมมหาราชวัง เขตพระนคร กรุงเทพฯ 10200",
    taxId: "0994000789123",
    orderItems: [
      {
        id: 1,
        name: "ถ้วยรางวัลโลหะอิตาลี",
        description: "ถ้วยรางวัลโลหะนำเข้าจากอิตาลี รุ่น B112 G ขนาด 14 นิ้ว ชุบทอง พร้อมฐานหินอ่อน และโบว์สีแดง #1",
        quantity: 30,
        currentStatus: "สินค้ามาส่งที่ร้าน",
        statusHistory: [
          { status: "รอจัดซื้อส่งประเมิน", updatedAt: "2024-12-10 09:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "อยู่ระหว่างการประเมินราคา", updatedAt: "2024-12-10 14:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "ได้รับราคา", updatedAt: "2024-12-11 10:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "เสนอราคาให้ลูกค้า", updatedAt: "2024-12-11 14:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "ลูกค้าอนุมัติราคา", updatedAt: "2024-12-12 10:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "รอกราฟิกปรับไฟล์เพื่อผลิต", updatedAt: "2024-12-12 11:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "กำลังปรับไฟล์ผลิต", updatedAt: "2024-12-12 14:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "ไฟล์ผลิตพร้อมสั่งผลิต", updatedAt: "2024-12-13 09:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "รอจัดซื้อออก PO / สั่งผลิต", updatedAt: "2024-12-13 10:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "สั่งผลิตแล้ว", updatedAt: "2024-12-13 14:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "กำลังผลิต", updatedAt: "2024-12-14 09:00", updatedBy: "โรงงาน A", department: "โรงงาน" },
          { status: "ตรวจสอบ Artwork จากโรงงาน", updatedAt: "2024-12-16 10:00", updatedBy: "โรงงาน A", department: "โรงงาน" },
          { status: "ตรวจสอบ CNC", updatedAt: "2024-12-18 09:00", updatedBy: "โรงงาน A", department: "โรงงาน" },
          { status: "อัปเดทปั้มชิ้นงาน", updatedAt: "2024-12-20 09:00", updatedBy: "โรงงาน A", department: "โรงงาน" },
          { status: "อัปเดตสาย", updatedAt: "2024-12-22 09:00", updatedBy: "โรงงาน A", department: "โรงงาน" },
          { status: "อัปเดตชิ้นงานก่อนจัดส่ง", updatedAt: "2024-12-24 09:00", updatedBy: "QC Team", department: "QC" },
          { status: "งานเสร็จสมบูรณ์", updatedAt: "2024-12-26 09:00", updatedBy: "QC Team", department: "QC" },
          { status: "อยู่ระหว่างขนส่ง", updatedAt: "2024-12-28 09:00", updatedBy: "ขนส่ง", department: "ขนส่ง" },
          { status: "สินค้ามาส่งที่ร้าน", updatedAt: "2025-01-03 10:00", updatedBy: "คลังสินค้า", department: "คลัง" },
        ]
      }
    ]
  },
  {
    id: "JOB-2024-005",
    customer: "โรงเรียนอัสสัมชัญ",
    items: "เหรียญสำเร็จรูป",
    orderDate: "2025-01-02",
    dueDate: "2025-01-20",
    status: "in_production",
    value: 15000,
    progress: 45,
    type: "internal",
    location: "domestic",
    department: "production",
    lineId: "@assumption_bkk",
    phone: "02-630-7111",
    email: "info@assumption.ac.th",
    address: "26 ซอยเจริญกรุง 40 แขวงบางรัก เขตบางรัก กรุงเทพฯ 10500",
    taxId: "0994000111222",
    orderItems: [
      {
        id: 1,
        name: "เหรียญสำเร็จรูป",
        description: "สินค้าสำเร็จรูป - เหรียญสำเร็จรูป รุ่นพลาสติก รู้แพ้รู้ชนะ สีทอง 100 ชิ้น สีเงิน 50 ชิ้น",
        quantity: 150,
        currentStatus: "ได้รับราคา",
        statusHistory: [
          { status: "รอจัดซื้อส่งประเมิน", updatedAt: "2025-01-02 09:00", updatedBy: "สมหญิง", department: "เซลล์" },
          { status: "อยู่ระหว่างการประเมินราคา", updatedAt: "2025-01-02 14:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "ได้รับราคา", updatedAt: "2025-01-03 10:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
        ]
      }
    ]
  },
  {
    id: "JOB-2024-006",
    customer: "บริษัท สปอร์ตเดย์ จำกัด",
    items: "เสื้อ",
    orderDate: "2025-01-03",
    dueDate: "2025-01-25",
    status: "in_production",
    value: 45000,
    progress: 30,
    type: "internal",
    location: "domestic",
    department: "production",
    lineId: "@sportday_th",
    phone: "02-555-8899",
    email: "order@sportday.co.th",
    address: "88 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310",
    taxId: "0105558889999",
    orderItems: [
      {
        id: 1,
        name: "เสื้อ",
        description: "หมวดสิ่งทอ & เสื้อผ้า - เสื้อผ้าไมโครเรียบ คอกลม แขนสั้น ไซส์ M 50 ตัว, L 80 ตัว, XL 70 ตัว",
        quantity: 200,
        currentStatus: "เสนอราคาให้ลูกค้า",
        statusHistory: [
          { status: "รอจัดซื้อส่งประเมิน", updatedAt: "2025-01-03 10:00", updatedBy: "พิมพ์ใจ", department: "เซลล์" },
          { status: "อยู่ระหว่างการประเมินราคา", updatedAt: "2025-01-03 15:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "ได้รับราคา", updatedAt: "2025-01-04 11:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "เสนอราคาให้ลูกค้า", updatedAt: "2025-01-04 14:00", updatedBy: "พิมพ์ใจ", department: "เซลล์" },
        ]
      }
    ]
  },
  {
    id: "JOB-2024-007",
    customer: "สมาคมศิษย์เก่าจุฬาลงกรณ์",
    items: "โล่สั่งผลิต",
    orderDate: "2025-01-05",
    dueDate: "2025-02-10",
    status: "in_production",
    value: 72000,
    progress: 55,
    type: "internal",
    location: "domestic",
    department: "production",
    lineId: "@chula_alumni",
    phone: "02-218-2000",
    email: "alumni@chula.ac.th",
    address: "254 ถนนพญาไท แขวงวังใหม่ เขตปทุมวัน กรุงเทพฯ 10330",
    taxId: "0993000999888",
    orderItems: [
      {
        id: 1,
        name: "โล่สั่งผลิต",
        description: "สินค้าสั่งผลิต - โล่อะคริลิค ขนาด 8x10 นิ้ว พร้อมฐานไม้สักทอง พิมพ์ UV สี่สี",
        quantity: 50,
        currentStatus: "กำลังปรับไฟล์ผลิต",
        statusHistory: [
          { status: "รอจัดซื้อส่งประเมิน", updatedAt: "2025-01-05 09:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "อยู่ระหว่างการประเมินราคา", updatedAt: "2025-01-05 14:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "ได้รับราคา", updatedAt: "2025-01-06 10:00", updatedBy: "วิชัย", department: "จัดซื้อ" },
          { status: "เสนอราคาให้ลูกค้า", updatedAt: "2025-01-06 14:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "ลูกค้าอนุมัติราคา", updatedAt: "2025-01-07 10:00", updatedBy: "สมชาย", department: "เซลล์" },
          { status: "รอกราฟิกปรับไฟล์เพื่อผลิต", updatedAt: "2025-01-07 11:00", updatedBy: "อาร์ต", department: "กราฟิก" },
          { status: "กำลังปรับไฟล์ผลิต", updatedAt: "2025-01-07 14:00", updatedBy: "อาร์ต", department: "กราฟิก" },
        ]
      }
    ]
  }
];

const statusConfig = {
  pending_approval: {
    label: "รออนุมัติ",
    color: "bg-yellow-500",
    textColor: "text-yellow-900",
    icon: Clock
  },
  in_production: {
    label: "กำลังผลิต",
    color: "bg-orange-500",
    textColor: "text-orange-900",
    icon: Package
  },
  ready_to_ship: {
    label: "พร้อมส่ง",
    color: "bg-blue-500",
    textColor: "text-blue-900",
    icon: Truck
  },
  shipped: {
    label: "เสร็จสิ้น",
    color: "bg-green-500",
    textColor: "text-green-900",
    icon: CheckCircle
  },
  urgent: {
    label: "เร่งด่วน",
    color: "bg-red-500",
    textColor: "text-red-900",
    icon: AlertTriangle
  }
};

// Helper function to get status index
const getStatusIndex = (status: string) => {
  return productStatusList.findIndex(s => s.status === status);
};

// Helper to find the slowest item (lowest status index)
const getSlowestItem = (items: OrderItem[]) => {
  let slowestIndex = Infinity;
  let slowestItem: OrderItem | null = null;
  
  items.forEach(item => {
    const index = getStatusIndex(item.currentStatus);
    if (index < slowestIndex && index >= 0) {
      slowestIndex = index;
      slowestItem = item;
    }
  });
  
  return slowestItem;
};

// Helper to count items by status category
const getStatusCounts = (items: OrderItem[]) => {
  const counts: { [key: string]: number } = {};
  items.forEach(item => {
    const status = item.currentStatus;
    counts[status] = (counts[status] || 0) + 1;
  });
  return counts;
};

export default function OrderTracking() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending_approval").length,
    inProduction: orders.filter(o => o.status === "in_production").length,
    readyToShip: orders.filter(o => o.status === "ready_to_ship").length,
    urgent: orders.filter(o => o.status === "urgent").length,
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} ${config.textColor} border-0 flex items-center gap-1.5 px-3 py-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getItemStatusBadge = (status: string) => {
    const index = getStatusIndex(status);
    const total = productStatusList.length;
    const progress = total > 0 ? ((index + 1) / total) * 100 : 0;
    
    let bgColor = "bg-gray-100 text-gray-800";
    if (progress >= 90) bgColor = "bg-green-100 text-green-800";
    else if (progress >= 60) bgColor = "bg-blue-100 text-blue-800";
    else if (progress >= 30) bgColor = "bg-amber-100 text-amber-800";
    else bgColor = "bg-gray-100 text-gray-800";
    
    return (
      <Badge className={`${bgColor} font-medium`}>
        {status}
      </Badge>
    );
  };

  const renderOrdersTable = (ordersToRender: Order[], emptyMessage: string) => {
    if (ordersToRender.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground">รหัสออเดอร์</TableHead>
              <TableHead className="font-semibold text-foreground">ลูกค้า</TableHead>
              <TableHead className="font-semibold text-foreground">วันที่สั่ง</TableHead>
              <TableHead className="font-semibold text-foreground">วันที่จัดส่ง</TableHead>
              <TableHead className="font-semibold text-foreground">สินค้า</TableHead>
              <TableHead className="font-semibold text-foreground text-center">จำนวน</TableHead>
              <TableHead className="font-semibold text-foreground text-center">สถานะความคืบหน้า</TableHead>
              <TableHead className="font-semibold text-foreground text-center">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersToRender.map((order, orderIndex) => {
              const itemCount = order.orderItems.length;
              const isEvenOrder = orderIndex % 2 === 0;
              const orderBgColor = isEvenOrder ? "bg-white" : "bg-slate-50/70";

              return (
                <React.Fragment key={order.id}>
                  {/* Order separator - thicker line between orders */}
                  {orderIndex > 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="p-0 h-1 bg-slate-200" />
                    </TableRow>
                  )}
                  
                  {order.orderItems.map((item, itemIndex) => (
                    <TableRow 
                      key={`${order.id}-${item.id}`} 
                      className={`${orderBgColor} hover:bg-slate-100/50 transition-colors ${itemIndex < itemCount - 1 ? 'border-b border-dashed border-slate-200' : ''}`}
                    >
                      {/* Show order info only on first row - vertically centered */}
                      {itemIndex === 0 ? (
                        <>
                          <TableCell className="font-semibold text-primary align-middle py-4 border-l-4 border-l-primary" rowSpan={itemCount}>
                            {order.id}
                          </TableCell>
                          <TableCell className="font-medium align-middle py-4" rowSpan={itemCount}>
                            {order.customer}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground align-middle py-4" rowSpan={itemCount}>
                            {order.orderDate}
                          </TableCell>
                          <TableCell className={`text-sm align-middle py-4 ${order.status === "urgent" ? "text-red-600 font-semibold" : "text-muted-foreground"}`} rowSpan={itemCount}>
                            {order.dueDate}
                          </TableCell>
                        </>
                      ) : null}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {itemIndex + 1}
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <span className="text-sm font-medium">{item.quantity} ชิ้น</span>
                      </TableCell>
                      <TableCell className="text-center py-3">
                        {getItemStatusBadge(item.currentStatus)}
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/sales/track-orders/${order.id}?item=${item.id}`)}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                        >
                          ดูรายละเอียด
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#F7F7F7] p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">ติดตามคำสั่งซื้อ</h1>
              <p className="text-muted-foreground">ดูสถานะและความคืบหน้าของคำสั่งซื้อทั้งหมด</p>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Orders Card */}
            <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">ออเดอร์ทั้งหมด</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </div>

            {/* Pending Approval Card */}
            <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-yellow-50">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">รออนุมัติ</p>
                  <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
                </div>
              </div>
            </div>

            {/* In Production Card */}
            <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-orange-50">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">กำลังผลิต</p>
                  <p className="text-3xl font-bold text-foreground">{stats.inProduction}</p>
                </div>
              </div>
            </div>

            {/* Ready to Ship Card */}
            <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-50">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">พร้อมส่ง</p>
                  <p className="text-3xl font-bold text-foreground">{stats.readyToShip}</p>
                </div>
              </div>
            </div>

            {/* Urgent Card */}
            <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-red-50">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">เร่งด่วน</p>
                  <p className="text-3xl font-bold text-foreground">{stats.urgent}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="ค้นหาออเดอร์ (รหัส, ลูกค้า, สินค้า)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px] border-border">
                <SelectValue placeholder="กรองตามสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="pending_approval">รออนุมัติ</SelectItem>
                <SelectItem value="in_production">กำลังผลิต</SelectItem>
                <SelectItem value="ready_to_ship">พร้อมส่ง</SelectItem>
                <SelectItem value="shipped">จัดส่งแล้ว</SelectItem>
                <SelectItem value="urgent">เร่งด่วน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main Orders Table */}
          <div className="space-y-4">
            {renderOrdersTable(filteredOrders, "ไม่พบออเดอร์ที่ตรงกับเงื่อนไขการค้นหา")}
          </div>
        </div>
      </div>
    </>
  );
}
