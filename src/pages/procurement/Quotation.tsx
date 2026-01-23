import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Calculator, Plus, Trash2, Eye, Clock, FileCheck, CheckCircle2, Search } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const factories = [
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

const factoryFormSchema = z.object({
  factory: z.string().min(1, "กรุณาเลือกโรงงาน"),
  unitCost: z.string().min(1, "กรุณากรอกทุนต่อหน่วย"),
  moldCost: z.string().optional(),
  moldCostAdditional: z.string().optional(),
  shippingCost: z.string().min(1, "กรุณากรอกค่าขนส่ง"),
  exchangeRate: z.string().min(1, "กรุณากรอกอัตราแลกเปลี่ยน"),
  vat: z.string().min(1, "กรุณากรอก VAT"),
  quantity: z.string().min(1, "กรุณากรอกจำนวน"),
  sellingPrice: z.string().min(1, "กรุณากรอกราคาขาย"),
  sellingPriceLanyard: z.string().optional(),
  productColor: z.string().optional(),
  productSize: z.string().optional(),
  thickness: z.string().optional(),
  linesPerThickness: z.string().optional(),
});

type FactoryFormValues = z.infer<typeof factoryFormSchema>;

interface FactoryQuotation extends FactoryFormValues {
  id: string;
  totalCost: number;
  totalSellingPrice: number;
  totalProfit: number;
  uploadedFile: File | null;
}

const Quotation = () => {
  const navigate = useNavigate();
  const [factories, setFactories] = useState<FactoryQuotation[]>([]);
  const [currentFactoryId, setCurrentFactoryId] = useState<string | null>(null);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterFactory, setFilterFactory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Mock data for existing quotations
  const mockQuotations = [
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
      status: "รออนุมัติ"
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
      status: "อนุมัติแล้ว"
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
      status: "รออนุมัติ"
    },
  ];

  const form = useForm<FactoryFormValues>({
    resolver: zodResolver(factoryFormSchema),
    defaultValues: {
      factory: "",
      unitCost: "",
      moldCost: "",
      moldCostAdditional: "",
      shippingCost: "",
      exchangeRate: "5.5",
      vat: "7",
      quantity: "",
      sellingPrice: "",
      sellingPriceLanyard: "",
      productColor: "",
      productSize: "",
      thickness: "",
      linesPerThickness: "",
    },
  });

  const calculateResults = (data: FactoryFormValues) => {
    const unitCost = parseFloat(data.unitCost || "0");
    const moldCost = parseFloat(data.moldCost || "0");
    const moldCostAdditional = parseFloat(data.moldCostAdditional || "0");
    const shippingCost = parseFloat(data.shippingCost || "0");
    const exchangeRate = parseFloat(data.exchangeRate || "5.5");
    const vat = parseFloat(data.vat || "7");
    const quantity = parseFloat(data.quantity || "0");
    const sellingPrice = parseFloat(data.sellingPrice || "0");
    const sellingPriceLanyard = parseFloat(data.sellingPriceLanyard || "0");

    if (quantity > 0) {
      const totalCostPerUnit = 
        ((unitCost + (moldCost / quantity) + (moldCostAdditional / quantity) + (shippingCost / quantity)) * exchangeRate) * 
        (1 + (vat / 100));
      const totalSellingPricePerUnit = sellingPrice + sellingPriceLanyard;
      const totalProfit = (totalSellingPricePerUnit - totalCostPerUnit) * quantity;

      return {
        totalCost: totalCostPerUnit,
        totalSellingPrice: totalSellingPricePerUnit,
        totalProfit: totalProfit,
      };
    }
    return { totalCost: 0, totalSellingPrice: 0, totalProfit: 0 };
  };

  const addFactory = () => {
    const data = form.getValues();
    const results = calculateResults(data);
    
    const newFactory: FactoryQuotation = {
      ...data,
      id: Date.now().toString(),
      ...results,
      uploadedFile: null,
    };
    
    setFactories([...factories, newFactory]);
    form.reset();
    toast.success("เพิ่มโรงงานสำเร็จ");
  };

  const removeFactory = (id: string) => {
    setFactories(factories.filter(f => f.id !== id));
    toast.success("ลบโรงงานสำเร็จ");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, factoryId?: string) => {
    const file = e.target.files?.[0];
    if (file && factoryId) {
      setFactories(factories.map(f => 
        f.id === factoryId ? { ...f, uploadedFile: file } : f
      ));
      toast.success("อัปโหลดไฟล์สำเร็จ");
    }
  };

  const generateJobCode = (factoryValue: string) => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dailyCount = "01";
    const factoryCode = factoryValue?.split("_").pop()?.charAt(0).toUpperCase() || "X";
    
    return `${year}${month}${day}-${dailyCount}-${factoryCode}`;
  };

  const submitAllQuotations = () => {
    if (factories.length === 0) {
      toast.error("กรุณาเพิ่มโรงงานอย่างน้อย 1 โรงงาน");
      return;
    }
    
    console.log("All quotations:", factories);
    toast.success("ส่งใบเสนอราคาทั้งหมดสำเร็จ");
    
    // Save to history
    const history = JSON.parse(localStorage.getItem("quotationHistory") || "[]");
    const newHistory = factories.map(f => ({
      ...f,
      submittedAt: new Date().toISOString(),
      jobCode: generateJobCode(f.factory),
    }));
    localStorage.setItem("quotationHistory", JSON.stringify([...history, ...newHistory]));
    
    navigate("/procurement/estimation/history");
  };

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
      "รออนุมัติ": "outline",
      "อนุมัติแล้ว": "default",
      "ยกเลิก": "destructive"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const handleCreateQuotation = () => {
    setShowQuotationModal(true);
  };

  const handleCloseQuotationModal = () => {
    setShowQuotationModal(false);
    setFactories([]);
    form.reset();
  };

  const filteredQuotations = mockQuotations.filter(quotation => {
    const matchSearch = searchTerm === "" || 
      quotation.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.jobCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFactory = filterFactory === "" || quotation.factory === filterFactory;
    const matchStatus = filterStatus === "" || quotation.status === filterStatus;
    const matchDate = filterDate === "" || quotation.createdDate === filterDate;
    
    return matchSearch && matchFactory && matchStatus && matchDate;
  });

  const stats = {
    waiting: mockQuotations.filter(q => q.status === "รออนุมัติ").length,
    approved: mockQuotations.filter(q => q.status === "อนุมัติแล้ว").length,
    total: mockQuotations.length
  };

  const watchedValues = form.watch();
  const currentResults = calculateResults(watchedValues);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">รายการเสนอราคา</h1>
          <p className="text-muted-foreground">จัดการใบเสนอราคาจากโรงงาน</p>
        </div>
        <Button onClick={handleCreateQuotation}>
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มใบเสนอราคา
        </Button>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="รออนุมัติ"
          value={stats.waiting.toString()}
          change="ใบเสนอราคารออนุมัติ"
          icon={<Clock className="h-4 w-4" />}
          trend="neutral"
        />
        <StatsCard
          title="อนุมัติแล้ว"
          value={stats.approved.toString()}
          change="ใบเสนอราคาอนุมัติแล้ว"
          icon={<CheckCircle2 className="h-4 w-4" />}
          trend="up"
        />
        <StatsCard
          title="ทั้งหมด"
          value={stats.total.toString()}
          change="ใบเสนอราคาทั้งหมด"
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
                <SelectItem value="รออนุมัติ">รออนุมัติ</SelectItem>
                <SelectItem value="อนุมัติแล้ว">อนุมัติแล้ว</SelectItem>
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

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการใบเสนอราคา</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสงาน</TableHead>
                  <TableHead>ชื่องาน</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>โรงงาน</TableHead>
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead className="text-right">จำนวน</TableHead>
                  <TableHead className="text-right">ต้นทุนรวม</TableHead>
                  <TableHead className="text-right">ราคาขาย</TableHead>
                  <TableHead className="text-right">กำไร</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-mono font-medium">{quotation.jobCode}</TableCell>
                    <TableCell>{quotation.jobName}</TableCell>
                    <TableCell>{quotation.customerName}</TableCell>
                    <TableCell>{quotation.factoryLabel}</TableCell>
                    <TableCell>{new Date(quotation.createdDate).toLocaleDateString('th-TH')}</TableCell>
                    <TableCell className="text-right">{quotation.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{quotation.totalCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{quotation.totalSellingPrice.toLocaleString()}</TableCell>
                    <TableCell className={`text-right font-medium ${quotation.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {quotation.profit.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedQuotation(quotation);
                            setShowDetailDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedQuotation(quotation);
                            setShowQuotationModal(true);
                          }}
                        >
                          <Calculator className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredQuotations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                      ไม่พบข้อมูลใบเสนอราคา
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quotation Modal */}
      <Dialog open={showQuotationModal} onOpenChange={setShowQuotationModal}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>เพิ่มใบเสนอราคา</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Added Factories List */}
            {factories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>โรงงานที่เพิ่มแล้ว ({factories.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Supplier</TableHead>
                          <TableHead className="min-w-[100px]">รูปภาพ</TableHead>
                          <TableHead className="min-w-[100px]">สีชุบ</TableHead>
                          <TableHead className="min-w-[120px]">ขนาด cm/inch</TableHead>
                          <TableHead className="min-w-[120px]">ความหนา mm</TableHead>
                          <TableHead className="min-w-[150px]">จำนวนสายกี่แบบ</TableHead>
                          <TableHead className="min-w-[100px]">จำนวน ชิ้น</TableHead>
                          <TableHead className="min-w-[120px]">ทุนรวม THB</TableHead>
                          <TableHead className="min-w-[140px]">ราคาขายรวม THB</TableHead>
                          <TableHead className="min-w-[120px]">กำไร THB</TableHead>
                          <TableHead className="min-w-[120px]">ค่าโมล THB</TableHead>
                          <TableHead className="w-[80px]">ลบ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {factories.map((factory) => {
                          const factoryLabel = factoryOptions.find(f => f.value === factory.factory)?.label || factory.factory;
                          const moldCostTHB = (parseFloat(factory.moldCost || "0") * parseFloat(factory.exchangeRate || "5.5")).toFixed(2);
                          const quantity = parseFloat(factory.quantity || "0");
                          const totalCostAll = (factory.totalCost * quantity).toFixed(2);
                          const totalSellingPriceAll = (factory.totalSellingPrice * quantity).toFixed(2);
                          
                          return (
                            <TableRow key={factory.id}>
                              <TableCell className="font-medium">{factoryLabel}</TableCell>
                              <TableCell>
                                {factory.uploadedFile ? (
                                  <span className="text-xs text-muted-foreground">{factory.uploadedFile.name}</span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>{factory.productColor || "-"}</TableCell>
                              <TableCell>{factory.productSize || "-"}</TableCell>
                              <TableCell>{factory.thickness || "-"}</TableCell>
                              <TableCell className="text-center">{factory.linesPerThickness || "-"}</TableCell>
                              <TableCell className="text-right">{quantity}</TableCell>
                              <TableCell className="text-right">{totalCostAll}</TableCell>
                              <TableCell className="text-right">{totalSellingPriceAll}</TableCell>
                              <TableCell className={`text-right font-medium ${factory.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {factory.totalProfit.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">{moldCostTHB}</TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFactory(factory.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            <Form {...form}>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>เลือกโรงงาน</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="factory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>โรงงานที่รับงาน *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="เลือกโรงงาน" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-popover max-h-[300px]">
                              {factoryOptions.map((factory) => (
                                <SelectItem key={factory.value} value={factory.value}>
                                  {factory.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Product Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>ข้อมูลสินค้า</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="productColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>สีชุบ</FormLabel>
                            <FormControl>
                              <Input placeholder="เช่น ทอง, เงิน" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="productSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ขนาด (cm/inch)</FormLabel>
                            <FormControl>
                              <Input placeholder="เช่น 5x3 cm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="thickness"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ความหนา (mm)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" placeholder="0.0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="linesPerThickness"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>จำนวนสายกี่แบบ</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>ข้อมูลต้นทุน</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="unitCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ชิ้นงาน ทุน/หน่วย (RMB) *</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="moldCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ค่าโมล (RMB)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="moldCostAdditional"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ค่าโมล(เพิ่มเติม) (RMB)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shippingCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ค่าขนส่ง (RMB) *</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="exchangeRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>อัตราแลกเปลี่ยน *</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="5.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>VAT (%)*</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="7" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>จำนวน (ชิ้น) *</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Selling Price */}
                <Card>
                  <CardHeader>
                    <CardTitle>ราคาขาย</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sellingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ชิ้นงาน ราคาขาย/หน่วย (THB) *</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sellingPriceLanyard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>สายห้อย ราคาขาย/หน่วย (THB)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Calculation Results */}
                <Card className="border-primary/50 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      ผลการคำนวณ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-card rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-1">ทุนรวม/หน่วย</p>
                        <p className="text-2xl font-bold text-foreground">
                          {currentResults.totalCost.toFixed(2)} ฿
                        </p>
                      </div>

                      <div className="p-4 bg-card rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-1">ราคาขายรวม/หน่วย</p>
                        <p className="text-2xl font-bold text-foreground">
                          {currentResults.totalSellingPrice.toFixed(2)} ฿
                        </p>
                      </div>

                      <div className="p-4 bg-card rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-1">กำไรรวม</p>
                        <p className={`text-2xl font-bold ${currentResults.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {currentResults.totalProfit.toFixed(2)} ฿
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">รหัสงาน (Auto-generate)</p>
                      <p className="font-mono text-lg font-semibold text-foreground">
                        {form.watch("factory") ? generateJobCode(form.watch("factory")) : "โปรดเลือกโรงงาน"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    className="flex-1"
                  >
                    รีเซ็ตฟอร์ม
                  </Button>
                  <Button
                    type="button"
                    onClick={addFactory}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มโรงงานนี้
                  </Button>
                </div>
              </div>
            </Form>

            {/* Submit All */}
            {factories.length > 0 && (
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">พร้อมส่งใบเสนอราคาทั้งหมด</p>
                      <p className="text-sm text-muted-foreground">มีทั้งหมด {factories.length} โรงงาน</p>
                    </div>
                    <Button onClick={submitAllQuotations} size="lg">
                      บันทึกและส่งอนุมัติทั้งหมด
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดใบเสนอราคา</DialogTitle>
          </DialogHeader>
          
          {selectedQuotation && (
            <div className="space-y-6">
              {/* Section 1: ข้อมูลคนทำงานขาย */}
              <Card>
                <CardHeader>
                  <CardTitle>ส่วนที่ 1: ข้อมูลคนทำงานขาย</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">พนักงานที่รับผิดชอบ</p>
                      <p className="font-medium">พนักงานขายปัจจุบัน</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: ข้อมูลลูกค้า */}
              <Card>
                <CardHeader>
                  <CardTitle>ส่วนที่ 2: ข้อมูลลูกค้า</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">ชื่อลูกค้า</p>
                      <p className="font-medium">{selectedQuotation.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">เบอร์โทร</p>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ไลน์</p>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">อีเมล</p>
                      <p className="font-medium">-</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">ออกใบกำกับภาษี</p>
                      <p className="font-medium">ไม่ระบุ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: ข้อมูลการสั่งงาน */}
              <Card>
                <CardHeader>
                  <CardTitle>ส่วนที่ 3: ข้อมูลการสั่งงาน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">JOB ID</p>
                      <p className="font-medium text-primary">{selectedQuotation.jobCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ใบเสนอราคา</p>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ความเร่งด่วน</p>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ช่องงาน</p>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">สถานที่จัดงาน (จังหวัด)</p>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">วันที่ใช้งาน</p>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">วันที่จัดส่ง</p>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">งบประมาณ</p>
                      <p className="font-medium">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 4: รายละเอียดในการสั่งงาน */}
              <Card>
                <CardHeader>
                  <CardTitle>ส่วนที่ 4: รายละเอียดในการสั่งงาน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">ประเภทสินค้า</p>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">วัสดุ</p>
                      <p className="font-medium">-</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">รายละเอียดเหรียบสั่งผลิต</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">รูปจ้างจากลูกค้า</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ไฟล์ภาพถ่ายบ่ง</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ชื่อไฟล์งาน</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ช่องทางของไฟล์งาน</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ขนาด</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ความหนา</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">จำนวน</p>
                        <p className="font-medium">{selectedQuotation.quantity.toLocaleString()} ชิ้น</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">รูปภาพ</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">สี (เลือกได้มากกว่า 1 รายการ)</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">รายละเอียดด้านหน้า</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">รายละเอียดด้านหลัง</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ขนาดสายคล้อง</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">จำนวนแบบสายคล้อง</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">ค่าโมล เพิ่มเติม</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">หมายเหตุ</p>
                        <p className="font-medium">-</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 5: การจัดส่ง */}
              <Card>
                <CardHeader>
                  <CardTitle>ส่วนที่ 5: การจัดส่ง</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">รูปแบบการรับสินค้า</p>
                    <p className="font-medium">-</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">5.1 ข้อมูลผู้รับสินค้า</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">ชื่อ-นามสกุลผู้รับ</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">เบอร์โทรศัพท์ติดต่อ</p>
                        <p className="font-medium">-</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">5.2 ที่อยู่สำหรับจัดส่ง</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">บ้านเลขที่ / หมู่บ้าน / อาคาร / ห้องเลขที่ ฯลฯ</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">จังหวัด</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">เขต/อำเภอ</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">แขวง/ตำบล</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">รหัสไปรษณีย์</p>
                        <p className="font-medium">-</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">5.3 ตำเลือกการจัดส่ง</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">วิธีการจัดส่ง</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">วันที่/เวลาที่ต้องการให้จัดส่ง</p>
                        <p className="font-medium">-</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">5.4 ช่องทางการชำระเงิน</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">เลือกวิธีชำระเงิน</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">แนบหลักฐานการชำระเงินค่าเงินส่ง</p>
                        <p className="font-medium">-</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">5.5 คำแนะนำเพิ่มเติมในการจัดส่ง</h4>
                    <div>
                      <p className="text-sm text-muted-foreground">คำแนะนำเพิ่มเติม</p>
                      <p className="font-medium">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle>ข้อมูลการเสนอราคา</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">โรงงาน</p>
                      <p className="font-medium">{selectedQuotation.factoryLabel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">วันที่สร้าง</p>
                      <p className="font-medium">{new Date(selectedQuotation.createdDate).toLocaleDateString('th-TH')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">สถานะ</p>
                      {getStatusBadge(selectedQuotation.status)}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ต้นทุนรวม</p>
                      <p className="font-medium">{selectedQuotation.totalCost.toLocaleString()} ฿</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ราคาขายรวม</p>
                      <p className="font-medium">{selectedQuotation.totalSellingPrice.toLocaleString()} ฿</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">กำไร</p>
                      <p className={`font-medium ${selectedQuotation.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {selectedQuotation.profit.toLocaleString()} ฿
                      </p>
                    </div>
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

export default Quotation;
