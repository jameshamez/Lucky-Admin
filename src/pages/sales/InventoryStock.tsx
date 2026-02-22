import { useState, useEffect } from "react";
import { Search, Filter, AlertTriangle, Package, XCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { salesApi, Product } from "@/services/salesApi";

const BASE_IMAGE_URL = "https://finfinphone.com/api-lucky";

/** แปลง path รูปให้เป็น URL เต็ม หรือ fallback ไปหน้า placeholder */
const resolveImage = (path: string) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  // path จาก API จะขึ้นต้นด้วย / เช่น /uploads/products/134/main.jpg
  // ต้อง concat โดยไม่ให้ / ซ้ำกัน
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_IMAGE_URL}${cleanPath}`;
};

/** คืน Badge แสดงสถานะสินค้าตามค่า total_available */
const getStatusBadge = (item: Product) => {
  const qty = item.total_available;
  if (qty <= 0) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        หมด
      </Badge>
    );
  }
  return (
    <Badge className="flex items-center gap-1 bg-green-500 text-white hover:bg-green-600">
      <CheckCircle className="w-3 h-3" />
      มีในสต็อก
    </Badge>
  );
};

/** สรุปขนาดสินค้า (ถ้ามี) เป็น text แสดงใน cell */
const formatSizes = (item: Product) => {
  if (!item.sizes || item.sizes.length === 0) return "-";
  const validSizes = item.sizes.filter((s) => s.size.trim() !== "");
  if (validSizes.length === 0) return "-";
  return validSizes.map((s) => s.size).join(", ");
};

/** สรุปสีสินค้าเป็น text */
const formatColors = (item: Product) => {
  if (!item.colors || item.colors.length === 0) return "-";
  const unique = [...new Set(item.colors.map((c) => c.color))];
  return unique.join(", ");
};

/** ราคาขายปลีกจาก prices array (ถ้ามี) */
const getRetailPrice = (item: Product) => {
  if (item.prices && item.prices.length > 0) {
    return item.prices[0].retail_price;
  }
  return item.price;
};

export default function InventoryStock() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await salesApi.getProducts();
      if (res.status === "success") {
        setProducts(res.data);
      } else {
        setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredData = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    switch (filterStatus) {
      case "in-stock":
        return item.total_available > 0;
      case "out-of-stock":
        return item.total_available <= 0;
      default:
        return true;
    }
  });

  const statsData = {
    totalItems: products.length,
    inStock: products.filter((p) => p.total_available > 0).length,
    outOfStock: products.filter((p) => p.total_available <= 0).length,
    totalInventory: products.reduce((sum, p) => sum + (p.inventory ?? 0), 0),
    totalRequests: products.reduce((sum, p) => sum + (p.request ?? 0), 0),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">สต็อกสินค้า</h1>
          <p className="text-muted-foreground">
            ตรวจสอบข้อมูลสต็อกสินค้าในคลัง (ไม่สามารถแก้ไขข้อมูลได้)
          </p>
        </div>
        <Button variant="outline" onClick={fetchProducts} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          รีเฟรช
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สินค้าทั้งหมด</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalItems}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">มีในสต็อก</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statsData.inStock}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">หมด</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statsData.outOfStock}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คลังรวม</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statsData.totalInventory}</div>
            <p className="text-xs text-muted-foreground">ชิ้น</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คำสั่งซื้อ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statsData.totalRequests}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="ค้นหาชื่อสินค้า, รหัสสินค้า, รุ่น หรือหมวดหมู่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            ทั้งหมด
          </Button>
          <Button
            variant={filterStatus === "in-stock" ? "default" : "outline"}
            onClick={() => setFilterStatus("in-stock")}
          >
            มีในสต็อก
          </Button>
          <Button
            variant={filterStatus === "out-of-stock" ? "default" : "outline"}
            onClick={() => setFilterStatus("out-of-stock")}
          >
            หมด
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการสินค้า</CardTitle>
          <CardDescription>
            แสดงข้อมูลสินค้าทั้งหมดในระบบ (ผลการค้นหา: {filteredData.length} รายการ)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>กำลังโหลดข้อมูลสินค้า...</span>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 text-destructive gap-3">
              <AlertTriangle className="w-8 h-8" />
              <p className="font-medium">{error}</p>
              <Button variant="outline" onClick={fetchProducts}>ลองใหม่</Button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">รูป</TableHead>
                    <TableHead>ชื่อสินค้า</TableHead>
                    <TableHead>รุ่น</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead>สี</TableHead>
                    <TableHead>ขนาด</TableHead>
                    <TableHead className="text-right">คลัง</TableHead>
                    <TableHead className="text-right">คำสั่งซื้อ</TableHead>
                    <TableHead className="text-right">คงเหลือ</TableHead>
                    <TableHead className="text-right">ราคา (บาท)</TableHead>
                    <TableHead>สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        ไม่พบข้อมูลสินค้าที่ค้นหา
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow key={item.id}>
                        {/* รูปสินค้า */}
                        <TableCell>
                          <img
                            src={resolveImage(item.image)}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-md border bg-gray-50"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </TableCell>

                        {/* ชื่อสินค้า + รายละเอียด */}
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">
                              {item.description}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground font-mono">#{item.id}</div>
                        </TableCell>

                        {/* รุ่น */}
                        <TableCell className="text-sm">
                          {item.modelName || "-"}
                        </TableCell>

                        {/* หมวดหมู่ */}
                        <TableCell className="text-sm">
                          {item.category || "-"}
                        </TableCell>

                        {/* สี */}
                        <TableCell className="text-sm">
                          {formatColors(item)}
                        </TableCell>

                        {/* ขนาด */}
                        <TableCell className="text-sm">
                          {formatSizes(item)}
                        </TableCell>

                        {/* คลัง (inventory) */}
                        <TableCell className="text-right font-semibold">
                          {item.inventory.toLocaleString()}
                        </TableCell>

                        {/* คำสั่งซื้อ (request) */}
                        <TableCell className="text-right font-semibold text-orange-600">
                          {item.request.toLocaleString()}
                        </TableCell>

                        {/* คงเหลือ (total_available) */}
                        <TableCell className={`text-right font-semibold ${item.total_available <= 0 ? "text-red-600" : "text-green-600"}`}>
                          {item.total_available.toLocaleString()}
                        </TableCell>

                        {/* ราคา */}
                        <TableCell className="text-right text-sm">
                          {getRetailPrice(item) > 0
                            ? getRetailPrice(item).toLocaleString()
                            : "-"}
                        </TableCell>

                        {/* สถานะ */}
                        <TableCell>
                          {getStatusBadge(item)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}