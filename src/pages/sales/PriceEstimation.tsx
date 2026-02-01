import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Eye, Trash2, ShoppingCart, Clock, FileCheck, CheckCircle, Calendar, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { salesApi } from "@/services/salesApi";

interface Estimation {
  id: string;
  date: string;
  lineName: string;
  jobName: string;
  productType: string;
  quantity: number;
  price: number;
  status: string;
}

export default function PriceEstimation() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEstimation, setSelectedEstimation] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [productTypeFilter, setProductTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await salesApi.getPriceEstimations();
        setEstimations(data);
      } catch (error) {
        toast.error("ไม่สามารถดึงข้อมูลรายการประเมินราคาได้");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Product types list
  const productTypesList = [
    "เหรียญสั่งผลิต",
    "โล่สั่งผลิต",
    "หมวก",
    "กระเป๋า",
    "แก้ว",
    "ขวดน้ำ",
    "ตุ๊กตา",
    "สมุด",
    "ปฏิทิน",
    "ลิสแบรนด์",
    "สายคล้อง",
    "แม่เหล็ก",
    "ที่เปิดขวด",
    "พวงกุญแจ",
    "ที่ทับกระดาษ"
  ];

  // Get product types for filter (use the predefined list)
  const productTypes = productTypesList;

  // Status counts for summary cards
  const statusCounts = useMemo(() => {
    return {
      waiting: estimations.filter(e => e.status === "รอจัดซื้อส่งประเมิน").length,
      inProgress: estimations.filter(e => e.status === "อยู่ระหว่างการประเมินราคา").length,
      approved: estimations.filter(e => e.status === "อนุมัติแล้ว").length,
    };
  }, [estimations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "อนุมัติแล้ว":
        return "bg-green-100 text-green-700 border-green-200";
      case "อยู่ระหว่างการประเมินราคา":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "รอจัดซื้อส่งประเมิน":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "ยกเลิก":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredEstimations = useMemo(() => {
    return estimations.filter(estimation => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (estimation.lineName && estimation.lineName.toLowerCase().includes(searchLower)) ||
        (estimation.jobName && estimation.jobName.toLowerCase().includes(searchLower)) ||
        (estimation.productType && estimation.productType.toLowerCase().includes(searchLower));
      
      const estimationDate = new Date(estimation.date);
      const matchesDateRange = 
        (!startDate || estimationDate >= startDate) && 
        (!endDate || estimationDate <= endDate);
      
      const matchesProductType = productTypeFilter === "all" || 
        estimation.productType === productTypeFilter;
      
      const matchesStatus = statusFilter === "all" || 
        estimation.status === statusFilter;

      return matchesSearch && matchesDateRange && matchesProductType && matchesStatus;
    });
  }, [estimations, searchTerm, startDate, endDate, productTypeFilter, statusFilter]);

  const handleDelete = (id: string) => {
    setSelectedEstimation(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEstimation) {
      toast.success("ลบรายการประเมินราคาเรียบร้อยแล้ว");
      setDeleteDialogOpen(false);
      setSelectedEstimation(null);
    }
  };

  const handleCreateOrder = (estimation: Estimation) => {
    navigate("/sales/create-order", { 
      state: { 
        fromEstimation: true,
        estimationId: estimation.id,
        estimationData: estimation 
      } 
    });
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setProductTypeFilter("all");
    setStatusFilter("all");
    setSearchTerm("");
  };

  // Render action buttons based on status
  const renderActionButtons = (estimation: Estimation) => {
    const { status, id } = estimation;

    const ViewButton = () => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/sales/price-estimation/${id}`)}
        className="gap-2 w-[120px] border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
      >
        <Eye className="h-4 w-4" />
        ดูรายละเอียด
      </Button>
    );

    switch (status) {
      case "รอจัดซื้อส่งประเมิน":
        return (
          <div className="flex items-center justify-start gap-3">
            <ViewButton />
          </div>
        );

      case "อยู่ระหว่างการประเมินราคา":
        return (
          <div className="flex items-center justify-start gap-3">
            <ViewButton />
          </div>
        );

      case "อนุมัติแล้ว":
        return (
          <div className="flex items-center justify-start gap-3">
            <ViewButton />
            <Button
              size="sm"
              onClick={() => handleCreateOrder(estimation)}
              className="gap-2 bg-green-600 text-white hover:bg-green-700"
            >
              <ShoppingCart className="h-4 w-4" />
              จัดการคำสั่งซื้อ
            </Button>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-start">
            <ViewButton />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ประเมินราคา</h1>
          <p className="text-muted-foreground">จัดการการประเมินราคาสินค้า</p>
        </div>
        <Button onClick={() => navigate("/sales/price-estimation/add")} className="gap-2">
          <Plus className="h-4 w-4" />
          เพิ่มประเมินราคา
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={cn(
            "cursor-pointer transition-all hover:shadow-md border-l-4 border-l-orange-500",
            statusFilter === "รอจัดซื้อส่งประเมิน" && "ring-2 ring-orange-500"
          )}
          onClick={() => setStatusFilter(statusFilter === "รอจัดซื้อส่งประเมิน" ? "all" : "รอจัดซื้อส่งประเมิน")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">รอจัดซื้อส่งประเมิน</p>
                  <p className="text-2xl font-bold text-orange-600">{statusCounts.waiting}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "cursor-pointer transition-all hover:shadow-md border-l-4 border-l-blue-500",
            statusFilter === "อยู่ระหว่างการประเมินราคา" && "ring-2 ring-blue-500"
          )}
          onClick={() => setStatusFilter(statusFilter === "อยู่ระหว่างการประเมินราคา" ? "all" : "อยู่ระหว่างการประเมินราคา")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FileCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">อยู่ระหว่างการประเมินราคา</p>
                  <p className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "cursor-pointer transition-all hover:shadow-md border-l-4 border-l-green-500",
            statusFilter === "อนุมัติแล้ว" && "ring-2 ring-green-500"
          )}
          onClick={() => setStatusFilter(statusFilter === "อนุมัติแล้ว" ? "all" : "อนุมัติแล้ว")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">อนุมัติแล้ว</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการประเมินราคา</CardTitle>
          <div className="flex flex-col gap-4 pt-2">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ค้นหาตาม LINE, ชื่องาน หรือสินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>ตัวกรอง:</span>
              </div>
              
              {/* Date Range Filter */}
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("gap-2 min-w-[140px]", startDate && "border-primary text-primary")}>
                      <Calendar className="h-4 w-4" />
                      {startDate ? format(startDate, "d MMM yyyy", { locale: th }) : "วันที่เริ่มต้น"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-muted-foreground">-</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("gap-2 min-w-[140px]", endDate && "border-primary text-primary")}>
                      <Calendar className="h-4 w-4" />
                      {endDate ? format(endDate, "d MMM yyyy", { locale: th }) : "วันที่สิ้นสุด"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Product Type Filter */}
              <Select value={productTypeFilter} onValueChange={setProductTypeFilter}>
                <SelectTrigger className={cn("w-[180px] h-9", productTypeFilter !== "all" && "border-primary text-primary")}>
                  <SelectValue placeholder="ประเภทสินค้า" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ประเภทสินค้าทั้งหมด</SelectItem>
                  {productTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className={cn("w-[200px] h-9", statusFilter !== "all" && "border-primary text-primary")}>
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                  <SelectItem value="รอจัดซื้อส่งประเมิน">รอจัดซื้อส่งประเมิน</SelectItem>
                  <SelectItem value="อยู่ระหว่างการประเมินราคา">อยู่ระหว่างการประเมินราคา</SelectItem>
                  <SelectItem value="อนุมัติแล้ว">อนุมัติแล้ว</SelectItem>
                  <SelectItem value="ยกเลิก">ยกเลิก</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(startDate || endDate || productTypeFilter !== "all" || statusFilter !== "all" || searchTerm) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  ล้างตัวกรอง
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่ประเมินราคา</TableHead>
                <TableHead>ชื่อ LINE</TableHead>
                <TableHead>ประเภทสินค้า</TableHead>
                <TableHead className="text-right">จำนวน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    กำลังโหลดข้อมูล...
                  </TableCell>
                </TableRow>
              ) : filteredEstimations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    ไม่พบรายการประเมินราคา
                  </TableCell>
                </TableRow>
              ) : (
                filteredEstimations.map((estimation) => (
                  <TableRow key={estimation.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {format(new Date(estimation.date), "d/M/yyyy", { locale: th })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{estimation.lineName}</span>
                        <span className="text-xs text-muted-foreground">{estimation.jobName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{estimation.productType}</TableCell>
                    <TableCell className="text-right">{estimation.quantity.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium", getStatusColor(estimation.status))}>
                        {estimation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {renderActionButtons(estimation)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบรายการ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบรายการประเมินราคานี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              ลบรายการ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
