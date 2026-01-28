import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import * as AddressService from "@/services/addressService";
import { customerService, CreateCustomerPayload } from "@/services/customerService";
import {
  Search,
  Plus,
  FileText,
  Clock,
  Filter,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  User,
  X,
  Users,
  UserPlus
} from "lucide-react";

// Product tags for multi-select
const productTags = [
  "เหรียญ", "ถ้วยรางวัล", "โล่", "เสื้อ", "สายคล้อง",
  "แก้ว", "หมวก", "กระเป๋า", "ป้ายพรีเมียม", "พวงกุญแจ",
  "ที่เปิดขวด", "แม่เหล็ก", "ที่ทับกระดาษ"
];

// Sales owners list for filter
const salesOwners = ['สมชาย', 'สมหญิง', 'วิภา', 'ธนา', 'กมล'];

interface Customer {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  businessType: string;
  totalOrders: number;
  totalValue: number;
  lastContact: string;
  status: string;
  salesStatus: string;
  nextAction: string;
  nextActionDate: string;
  salesOwner: string;
  interestedProducts: string[];
}

interface RawCustomerData {
  id: string;
  company_name: string;
  contact_name: string;
  phone_numbers: string[];
  emails: string[];
  billing_province: string;
  customer_type: string;
  total_orders: string;
  total_value: string;
  last_contact_date: string;
  customer_status: string;
  presentation_status: string;
  responsible_person: string;
  interested_products: string[];
}

// Phone number formatting helper
const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};

// Tax ID formatting helper
const formatTaxId = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.slice(0, 13);
};

export default function CustomerManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [salesOwnerFilter, setSalesOwnerFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [subdistrictOpen, setSubdistrictOpen] = useState(false);
  const [shippingProvinceOpen, setShippingProvinceOpen] = useState(false);
  const [shippingDistrictOpen, setShippingDistrictOpen] = useState(false);
  const [shippingSubdistrictOpen, setShippingSubdistrictOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sameAddress, setSameAddress] = useState(false);
  const [selectedProductTags, setSelectedProductTags] = useState<string[]>([]);

  // States สำหรับข้อมูลที่อยู่จาก API
  const [provinces, setProvinces] = useState<string[]>([]);
  const [billingDistricts, setBillingDistricts] = useState<string[]>([]);
  const [billingSubdistricts, setBillingSubdistricts] = useState<string[]>([]);
  const [shippingDistricts, setShippingDistricts] = useState<string[]>([]);
  const [shippingSubdistricts, setShippingSubdistricts] = useState<string[]>([]);

  const [newCustomer, setNewCustomer] = useState<CreateCustomerPayload>({
    // ส่วนที่ 1: ข้อมูลบริษัท/องค์กร
    companyName: "",
    customerType: "เจ้าของงาน",
    taxId: "",

    // ที่อยู่ออกใบกำกับภาษี
    billingProvince: "",
    billingDistrict: "",
    billingSubdistrict: "",
    billingPostcode: "",
    billingAddress: "",

    // ที่อยู่จัดส่ง
    shippingProvince: "",
    shippingDistrict: "",
    shippingSubdistrict: "",
    shippingPostcode: "",
    shippingAddress: "",

    // ส่วนที่ 2: ข้อมูลผู้ติดต่อหลัก
    contactName: "",
    phoneNumbers: [""],
    emails: [""],
    lineId: "",

    // ข้อมูลผู้ติดต่อเพิ่มเติม
    additionalContacts: [],

    // ส่วนที่ 3: การนำเสนอ
    presentationStatus: "เสนอขาย",
    // contactCount: 1, // Not in payload
    // lastContactDate: new Date(), // Not in payload
    interestedProducts: [],

    // ส่วนที่ 4: ข้อมูลภายใน
    responsiblePerson: "พนักงานขายปัจจุบัน",
    customerStatus: "ลูกค้าใหม่",
    howFoundUs: "Facebook",
    otherChannel: "",
    notes: ""
  });

  // Local state for UI date picker (not part of payload directly)
  const [lastContactDate, setLastContactDate] = useState<Date>(new Date());

  const { toast } = useToast();

  // โหลดจังหวัดทั้งหมดเมื่อ component mount
  useEffect(() => {
    const loadProvinces = async () => {
      const provinceList = await AddressService.getProvinces();
      setProvinces(provinceList);
    };
    loadProvinces();
  }, []);

  // โหลดอำเภอเมื่อเลือกจังหวัดสำหรับที่อยู่ออกใบกำกับภาษี
  useEffect(() => {
    const loadDistricts = async () => {
      if (newCustomer.billingProvince) {
        try {
          const districtList = await AddressService.getDistricts(newCustomer.billingProvince);
          setBillingDistricts(districtList);
        } catch (error) {
          console.error('❌ [Billing] Error loading districts:', error);
          setBillingDistricts([]);
        }
      } else {
        setBillingDistricts([]);
        setBillingSubdistricts([]);
      }
    };
    loadDistricts();
  }, [newCustomer.billingProvince]);

  // โหลดตำบลเมื่อเลือกอำเภอสำหรับที่อยู่ออกใบกำกับภาษี
  useEffect(() => {
    const loadSubdistricts = async () => {
      if (newCustomer.billingProvince && newCustomer.billingDistrict) {
        const subdistrictList = await AddressService.getSubdistricts(
          newCustomer.billingProvince,
          newCustomer.billingDistrict
        );
        setBillingSubdistricts(subdistrictList);

        // หากเลือกครบ ให้ดึงรหัสไปรษณีย์อัตโนมัติ
        if (newCustomer.billingSubdistrict) {
          const zipCode = await AddressService.getZipCode(
            newCustomer.billingProvince,
            newCustomer.billingDistrict,
            newCustomer.billingSubdistrict
          );
          if (zipCode) {
            setNewCustomer(prev => ({ ...prev, billingPostcode: zipCode }));
          }
        }
      } else {
        setBillingSubdistricts([]);
      }
    };
    loadSubdistricts();
  }, [newCustomer.billingProvince, newCustomer.billingDistrict, newCustomer.billingSubdistrict]);

  // โหลดอำเภอเมื่อเลือกจังหวัดสำหรับที่อยู่จัดส่ง
  useEffect(() => {
    const loadDistricts = async () => {
      if (newCustomer.shippingProvince && !sameAddress) {
        const districtList = await AddressService.getDistricts(newCustomer.shippingProvince);
        setShippingDistricts(districtList);
      } else {
        setShippingDistricts([]);
        setShippingSubdistricts([]);
      }
    };
    loadDistricts();
  }, [newCustomer.shippingProvince, sameAddress]);

  // โหลดตำบลเมื่อเลือกอำเภอสำหรับที่อยู่จัดส่ง
  useEffect(() => {
    const loadSubdistricts = async () => {
      if (newCustomer.shippingProvince && newCustomer.shippingDistrict && !sameAddress) {
        const subdistrictList = await AddressService.getSubdistricts(
          newCustomer.shippingProvince,
          newCustomer.shippingDistrict
        );
        setShippingSubdistricts(subdistrictList);

        // หากเลือกครบ ให้ดึงรหัสไปรษณีย์อัตโนมัติ
        if (newCustomer.shippingSubdistrict) {
          const zipCode = await AddressService.getZipCode(
            newCustomer.shippingProvince,
            newCustomer.shippingDistrict,
            newCustomer.shippingSubdistrict
          );
          if (zipCode) {
            setNewCustomer(prev => ({ ...prev, shippingPostcode: zipCode }));
          }
        }
      } else {
        setShippingSubdistricts([]);
      }
    };
    loadSubdistricts();
  }, [newCustomer.shippingProvince, newCustomer.shippingDistrict, newCustomer.shippingSubdistrict, sameAddress]);

  // Handle same address toggle
  useEffect(() => {
    if (sameAddress) {
      setNewCustomer(prev => ({
        ...prev,
        shippingProvince: prev.billingProvince,
        shippingDistrict: prev.billingDistrict,
        shippingSubdistrict: prev.billingSubdistrict,
        shippingPostcode: prev.billingPostcode,
        shippingAddress: prev.billingAddress
      }));
    }
  }, [sameAddress, newCustomer.billingProvince, newCustomer.billingDistrict, newCustomer.billingSubdistrict, newCustomer.billingPostcode, newCustomer.billingAddress]);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await customerService.getCustomers();

      // แปลงข้อมูลจาก PHP ให้ตรงกับรูปแบบที่ UI ต้องการ (Interface Customer)
      const transformedData = (data as RawCustomerData[]).map((item) => ({
        id: item.id,
        name: item.company_name,
        contact: item.contact_name,
        phone: item.phone_numbers?.[0] || '-',
        email: item.emails?.[0] || '-',
        address: item.billing_province || '-',
        businessType: item.customer_type || 'ไม่ระบุ',
        totalOrders: parseInt(item.total_orders) || 0,
        totalValue: parseFloat(item.total_value) || 0,
        lastContact: item.last_contact_date ? item.last_contact_date.split(' ')[0] : '-',
        status: item.customer_status || 'ลูกค้าใหม่',
        salesStatus: item.presentation_status || 'ใหม่',
        salesOwner: item.responsible_person || 'ไม่ระบุ',
        interestedProducts: item.interested_products || [],
        nextAction: "โทรติดตาม", // Mock data or from API if available
        nextActionDate: new Date().toISOString() // Mock
      }));

      setCustomers(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลลูกค้าได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const addPhoneNumber = () => {
    setNewCustomer(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, ""]
    }));
  };

  const addEmail = () => {
    setNewCustomer(prev => ({
      ...prev,
      emails: [...prev.emails, ""]
    }));
  };

  const updatePhoneNumber = (index: number, value: string) => {
    const formatted = formatPhoneNumber(value);
    setNewCustomer(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) => i === index ? formatted : phone)
    }));
  };

  const updateEmail = (index: number, value: string) => {
    setNewCustomer(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => i === index ? value : email)
    }));
  };

  const removePhoneNumber = (index: number) => {
    if (newCustomer.phoneNumbers.length > 1) {
      setNewCustomer(prev => ({
        ...prev,
        phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index)
      }));
    }
  };

  const removeEmail = (index: number) => {
    if (newCustomer.emails.length > 1) {
      setNewCustomer(prev => ({
        ...prev,
        emails: prev.emails.filter((_, i) => i !== index)
      }));
    }
  };

  // Product tag toggle
  const toggleProductTag = (tag: string) => {
    setNewCustomer(prev => ({
      ...prev,
      interestedProducts: prev.interestedProducts.includes(tag)
        ? prev.interestedProducts.filter(t => t !== tag)
        : [...prev.interestedProducts, tag]
    }));
  };

  // Additional contacts functions
  const addAdditionalContact = () => {
    setNewCustomer(prev => ({
      ...prev,
      additionalContacts: [...prev.additionalContacts, {
        contactName: "",
        lineId: "",
        phoneNumber: "",
        email: ""
      }]
    }));
  };

  const updateAdditionalContact = (index: number, field: keyof typeof newCustomer.additionalContacts[0], value: string) => {
    let formattedValue = value;
    if (field === 'phoneNumber') {
      formattedValue = formatPhoneNumber(value);
    }
    setNewCustomer(prev => ({
      ...prev,
      additionalContacts: prev.additionalContacts.map((contact, i) =>
        i === index ? { ...contact, [field]: formattedValue } : contact
      )
    }));
  };

  const removeAdditionalContact = (index: number) => {
    setNewCustomer(prev => ({
      ...prev,
      additionalContacts: prev.additionalContacts.filter((_, i) => i !== index)
    }));
  };

  const handleAddCustomer = async () => {
    // Basic validation
    if (!newCustomer.companyName || !newCustomer.contactName || !newCustomer.phoneNumbers[0] || newCustomer.interestedProducts.length === 0) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลในช่องที่จำเป็นทั้งหมด",
        variant: "destructive"
      });
      return;
    }

    // Tax ID validation (13 digits)
    if (newCustomer.taxId && newCustomer.taxId.length !== 13) {
      toast({
        title: "เลขผู้เสียภาษีไม่ถูกต้อง",
        description: "กรุณากรอกเลขประจำตัวผู้เสียภาษี 13 หลัก",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await customerService.createCustomer(newCustomer);

      if (result.status === 'success') {
        toast({
          title: "เพิ่มลูกค้าใหม่สำเร็จ!",
          description: result.message || `เพิ่มข้อมูลลูกค้า ${newCustomer.companyName} เรียบร้อยแล้ว`,
        });

        setIsAddCustomerOpen(false);

        // Refresh customer list
        await fetchCustomers();

        // Reset form
        setNewCustomer({
          companyName: "",
          customerType: "เจ้าของงาน",
          taxId: "",
          billingProvince: "",
          billingDistrict: "",
          billingSubdistrict: "",
          billingPostcode: "",
          billingAddress: "",
          shippingProvince: "",
          shippingDistrict: "",
          shippingSubdistrict: "",
          shippingPostcode: "",
          shippingAddress: "",
          contactName: "",
          phoneNumbers: [""],
          emails: [""],
          lineId: "",
          additionalContacts: [],
          presentationStatus: "เสนอขาย",
          interestedProducts: [],
          responsiblePerson: "พนักงานขายปัจจุบัน",
          customerStatus: "ลูกค้าใหม่",
          howFoundUs: "Facebook",
          otherChannel: "",
          notes: ""
        });
        setSameAddress(false);
        setLastContactDate(new Date());
      } else {
        throw new Error(result.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error instanceof Error ? error.message : "ไม่สามารถเพิ่มลูกค้าใหม่ได้",
        variant: "destructive"
      });
    }
  };

  const handleCreateQuotation = () => {
    if (!selectedCustomer) {
      toast({
        title: "กรุณาเลือกลูกค้า",
        description: "โปรดเลือกลูกค้าก่อนสร้างใบเสนอราคา",
        variant: "destructive"
      });
      return;
    }

    console.log("Creating quotation for:", selectedCustomer);
    toast({
      title: "สร้างใบเสนอราคา",
      description: `กำลังสร้างใบเสนอราคาสำหรับ ${selectedCustomer.name}`,
    });
    setIsQuotationOpen(false);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);

    const matchesBusinessType = businessTypeFilter === "all" || customer.businessType === businessTypeFilter;
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    const matchesSalesOwner = salesOwnerFilter === "all" || customer.salesOwner === salesOwnerFilter;
    const matchesProduct = productFilter === "all" || customer.interestedProducts.includes(productFilter);

    // Date range filtering
    let matchesDate = true;
    if (dateRange?.from || dateRange?.to) {
      const customerDate = new Date(customer.lastContact + "T00:00:00");

      if (dateRange.from && dateRange.to) {
        matchesDate = customerDate >= dateRange.from && customerDate <= dateRange.to;
      } else if (dateRange.from) {
        matchesDate = customerDate >= dateRange.from;
      } else if (dateRange.to) {
        matchesDate = customerDate <= dateRange.to;
      }
    }

    return matchesSearch && matchesBusinessType && matchesStatus && matchesSalesOwner && matchesProduct && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ลูกค้า VIP": return "bg-accent text-accent-foreground";
      case "ลูกค้าประจำ": return "bg-primary text-primary-foreground";
      case "ลูกค้าใหม่": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSalesStatusColor = (status: string) => {
    switch (status) {
      case "ใหม่": return "bg-blue-100 text-blue-800 border-blue-200";
      case "เสนอราคา": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ผลิต": return "bg-purple-100 text-purple-800 border-purple-200";
      case "ปิดงาน": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate KPI metrics
  const calculateKPIs = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // New customers this month
    const newCustomersThisMonth = customers.filter(customer => {
      const createdDate = new Date(customer.lastContact);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;

    // Outstanding quotes (customers with presentation status "เสนอขาย")
    const outstandingQuotes = customers.filter(customer =>
      customer.status === "ลูกค้าใหม่" || customer.businessType === "เสนอขาย"
    ).length;

    // Customers not contacted for over 30 days
    const inactiveCustomers = customers.filter(customer => {
      const lastContactDate = new Date(customer.lastContact + "T00:00:00");
      return lastContactDate < thirtyDaysAgo;
    }).length;

    return {
      newCustomersThisMonth,
      outstandingQuotes,
      inactiveCustomers
    };
  };

  const kpis = calculateKPIs();

  const clearAllFilters = () => {
    setBusinessTypeFilter("all");
    setStatusFilter("all");
    setSalesOwnerFilter("all");
    setProductFilter("all");
    setDateRange(undefined);
    setSearchTerm("");
  };

  const hasActiveFilters = businessTypeFilter !== "all" || statusFilter !== "all" || salesOwnerFilter !== "all" || productFilter !== "all" || dateRange;

  // Skeleton loading component
  const TableSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
          <TableCell>
            <div className="space-y-1">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        </TableRow>
      ))}
    </>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">ยังไม่มีข้อมูลลูกค้า</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {hasActiveFilters
          ? "ไม่พบข้อมูลลูกค้าที่ตรงกับเงื่อนไขการค้นหา ลองปรับตัวกรองใหม่"
          : "เริ่มต้นด้วยการเพิ่มลูกค้าใหม่เพื่อจัดการข้อมูลและติดตามการขาย"}
      </p>
      {hasActiveFilters ? (
        <Button variant="outline" onClick={clearAllFilters}>
          ล้างตัวกรองทั้งหมด
        </Button>
      ) : (
        <Button onClick={() => setIsAddCustomerOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มลูกค้าใหม่
        </Button>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center pb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">จัดการลูกค้า</h1>
          <p className="text-muted-foreground">ค้นหาและจัดการข้อมูลลูกค้าทั้งหมด</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มลูกค้าใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>เพิ่มลูกค้าใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลครบถ้วนสำหรับลูกค้าใหม่ พร้อมข้อมูลที่อยู่และสินค้าที่สนใจ
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* ส่วนที่ 1: ข้อมูลบริษัท/องค์กร */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <h3 className="text-lg font-semibold">ข้อมูลบริษัท / องค์กร</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">ชื่อบริษัท <span className="text-red-500">*</span></Label>
                      <Input
                        id="companyName"
                        value={newCustomer.companyName}
                        onChange={(e) => setNewCustomer({ ...newCustomer, companyName: e.target.value })}
                        placeholder="กรอกชื่อบริษัทหรือองค์กร"
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerType">ประเภทลูกค้า</Label>
                      <Select value={newCustomer.customerType} onValueChange={(value) => setNewCustomer({ ...newCustomer, customerType: value })}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="เจ้าของงาน">เจ้าของงาน</SelectItem>
                          <SelectItem value="ตัวแทน">ตัวแทน</SelectItem>
                          <SelectItem value="ออแกนไนเซอร์">ออแกนไนเซอร์</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="taxId">เลขประจำตัวผู้เสียภาษี (13 หลัก)</Label>
                      <Input
                        id="taxId"
                        value={newCustomer.taxId}
                        onChange={(e) => setNewCustomer({ ...newCustomer, taxId: formatTaxId(e.target.value) })}
                        placeholder="X-XXXX-XXXXX-XX-X"
                        maxLength={13}
                        className="bg-background font-mono"
                      />
                      <p className="text-xs text-muted-foreground">กรอกเฉพาะตัวเลข 13 หลัก</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ที่อยู่ออกใบกำกับภาษี */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <h3 className="text-lg font-semibold">ที่อยู่ออกใบกำกับภาษี</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-8">
                    <div className="space-y-2">
                      <Label>จังหวัด</Label>
                      <Popover open={provinceOpen} onOpenChange={setProvinceOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-full justify-between bg-background">
                            {newCustomer.billingProvince || "เลือกจังหวัด..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-background">
                          <Command className="bg-background">
                            <CommandInput placeholder="ค้นหาจังหวัด..." />
                            <CommandEmpty>ไม่พบจังหวัด</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {provinces.map((province) => (
                                <CommandItem
                                  key={province}
                                  value={province}
                                  onSelect={() => {
                                    setNewCustomer({ ...newCustomer, billingProvince: province, billingDistrict: "", billingSubdistrict: "" });
                                    setProvinceOpen(false);
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", newCustomer.billingProvince === province ? "opacity-100" : "opacity-0")} />
                                  {province}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>อำเภอ/เขต</Label>
                      <Popover open={districtOpen} onOpenChange={setDistrictOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-full justify-between bg-background" disabled={!newCustomer.billingProvince}>
                            {newCustomer.billingDistrict || "เลือกอำเภอ/เขต..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-background">
                          <Command className="bg-background">
                            <CommandInput placeholder="ค้นหาอำเภอ/เขต..." />
                            <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {billingDistricts.map((district) => (
                                <CommandItem
                                  key={district}
                                  value={district}
                                  onSelect={() => {
                                    setNewCustomer({ ...newCustomer, billingDistrict: district, billingSubdistrict: "" });
                                    setDistrictOpen(false);
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", newCustomer.billingDistrict === district ? "opacity-100" : "opacity-0")} />
                                  {district}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>ตำบล/แขวง</Label>
                      <Popover open={subdistrictOpen} onOpenChange={setSubdistrictOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-full justify-between bg-background" disabled={!newCustomer.billingDistrict}>
                            {newCustomer.billingSubdistrict || "เลือกตำบล/แขวง..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-background">
                          <Command className="bg-background">
                            <CommandInput placeholder="ค้นหาตำบล/แขวง..." />
                            <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {billingSubdistricts.map((subdistrict) => (
                                <CommandItem
                                  key={subdistrict}
                                  value={subdistrict}
                                  onSelect={() => {
                                    setNewCustomer({ ...newCustomer, billingSubdistrict: subdistrict });
                                    setSubdistrictOpen(false);
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", newCustomer.billingSubdistrict === subdistrict ? "opacity-100" : "opacity-0")} />
                                  {subdistrict}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>รหัสไปรษณีย์</Label>
                      <Input
                        value={newCustomer.billingPostcode}
                        onChange={(e) => setNewCustomer({ ...newCustomer, billingPostcode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                        placeholder="XXXXX"
                        maxLength={5}
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>ที่อยู่ (บ้านเลขที่, ถนน, ซอย)</Label>
                      <Textarea
                        value={newCustomer.billingAddress}
                        onChange={(e) => setNewCustomer({ ...newCustomer, billingAddress: e.target.value })}
                        placeholder="กรอกรายละเอียดที่อยู่..."
                        rows={2}
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ที่อยู่จัดส่ง */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                      <h3 className="text-lg font-semibold">ที่อยู่จัดส่ง</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={sameAddress} onCheckedChange={setSameAddress} />
                      <Label className="text-sm">ใช้ที่อยู่เดียวกัน</Label>
                    </div>
                  </div>

                  {!sameAddress && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-8">
                      <div className="space-y-2">
                        <Label>จังหวัด</Label>
                        <Popover open={shippingProvinceOpen} onOpenChange={setShippingProvinceOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" className="w-full justify-between bg-background">
                              {newCustomer.shippingProvince || "เลือกจังหวัด..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-background">
                            <Command className="bg-background">
                              <CommandInput placeholder="ค้นหาจังหวัด..." />
                              <CommandEmpty>ไม่พบจังหวัด</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-auto">
                                {provinces.map((province) => (
                                  <CommandItem
                                    key={province}
                                    value={province}
                                    onSelect={() => {
                                      setNewCustomer({ ...newCustomer, shippingProvince: province, shippingDistrict: "", shippingSubdistrict: "" });
                                      setShippingProvinceOpen(false);
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", newCustomer.shippingProvince === province ? "opacity-100" : "opacity-0")} />
                                    {province}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>อำเภอ/เขต</Label>
                        <Popover open={shippingDistrictOpen} onOpenChange={setShippingDistrictOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" className="w-full justify-between bg-background" disabled={!newCustomer.shippingProvince}>
                              {newCustomer.shippingDistrict || "เลือกอำเภอ/เขต..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-background">
                            <Command className="bg-background">
                              <CommandInput placeholder="ค้นหาอำเภอ/เขต..." />
                              <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-auto">
                                {shippingDistricts.map((district) => (
                                  <CommandItem
                                    key={district}
                                    value={district}
                                    onSelect={() => {
                                      setNewCustomer({ ...newCustomer, shippingDistrict: district, shippingSubdistrict: "" });
                                      setShippingDistrictOpen(false);
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", newCustomer.shippingDistrict === district ? "opacity-100" : "opacity-0")} />
                                    {district}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>ตำบล/แขวง</Label>
                        <Popover open={shippingSubdistrictOpen} onOpenChange={setShippingSubdistrictOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" className="w-full justify-between bg-background" disabled={!newCustomer.shippingDistrict}>
                              {newCustomer.shippingSubdistrict || "เลือกตำบล/แขวง..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-background">
                            <Command className="bg-background">
                              <CommandInput placeholder="ค้นหาตำบล/แขวง..." />
                              <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-auto">
                                {shippingSubdistricts.map((subdistrict) => (
                                  <CommandItem
                                    key={subdistrict}
                                    value={subdistrict}
                                    onSelect={() => {
                                      setNewCustomer({ ...newCustomer, shippingSubdistrict: subdistrict });
                                      setShippingSubdistrictOpen(false);
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", newCustomer.shippingSubdistrict === subdistrict ? "opacity-100" : "opacity-0")} />
                                    {subdistrict}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>รหัสไปรษณีย์</Label>
                        <Input
                          value={newCustomer.shippingPostcode}
                          onChange={(e) => setNewCustomer({ ...newCustomer, shippingPostcode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                          placeholder="XXXXX"
                          maxLength={5}
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>ที่อยู่ (บ้านเลขที่, ถนน, ซอย)</Label>
                        <Textarea
                          value={newCustomer.shippingAddress}
                          onChange={(e) => setNewCustomer({ ...newCustomer, shippingAddress: e.target.value })}
                          placeholder="กรอกรายละเอียดที่อยู่..."
                          rows={2}
                          className="bg-background"
                        />
                      </div>
                    </div>
                  )}

                  {sameAddress && (
                    <p className="ml-8 text-sm text-muted-foreground">ใช้ที่อยู่ออกใบกำกับภาษีเป็นที่อยู่จัดส่ง</p>
                  )}
                </div>

                <Separator />

                {/* ส่วนที่ 4: ข้อมูลผู้ติดต่อหลัก */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                    <h3 className="text-lg font-semibold">ข้อมูลผู้ติดต่อหลัก</h3>
                  </div>

                  <div className="space-y-4 ml-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">ชื่อ-นามสกุล <span className="text-red-500">*</span></Label>
                        <Input
                          id="contactName"
                          value={newCustomer.contactName}
                          onChange={(e) => setNewCustomer({ ...newCustomer, contactName: e.target.value })}
                          placeholder="กรอกชื่อ-นามสกุลผู้ติดต่อ"
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lineId">ID Line</Label>
                        <Input
                          id="lineId"
                          value={newCustomer.lineId}
                          onChange={(e) => setNewCustomer({ ...newCustomer, lineId: e.target.value })}
                          placeholder="Line ID (ไม่บังคับ)"
                          className="bg-background"
                        />
                      </div>
                    </div>

                    {/* เบอร์โทรศัพท์ (หลายเบอร์) */}
                    <div className="space-y-2">
                      <Label>เบอร์โทรศัพท์ <span className="text-red-500">*</span></Label>
                      {newCustomer.phoneNumbers.map((phone, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={phone}
                            onChange={(e) => updatePhoneNumber(index, e.target.value)}
                            placeholder="0XX-XXX-XXXX"
                            maxLength={12}
                            className="bg-background"
                          />
                          {newCustomer.phoneNumbers.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removePhoneNumber(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPhoneNumber}
                      >
                        + เพิ่มเบอร์โทรศัพท์
                      </Button>
                    </div>

                    {/* อีเมล (หลายอีเมล) */}
                    <div className="space-y-2">
                      <Label>อีเมล</Label>
                      {newCustomer.emails.map((email, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => updateEmail(index, e.target.value)}
                            placeholder="email@example.com"
                            className="bg-background"
                          />
                          {newCustomer.emails.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeEmail(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addEmail}
                      >
                        + เพิ่มอีเมล
                      </Button>
                    </div>

                    {/* ข้อมูลผู้ติดต่อเพิ่มเติม */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>ข้อมูลผู้ติดต่อเพิ่มเติม</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addAdditionalContact}
                        >
                          + เพิ่มผู้ติดต่อ
                        </Button>
                      </div>

                      {newCustomer.additionalContacts.map((contact, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">ผู้ติดต่อที่ {index + 2}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeAdditionalContact(index)}
                            >
                              ลบ
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>ชื่อ-นามสกุล <span className="text-red-500">*</span></Label>
                              <Input
                                value={contact.contactName}
                                onChange={(e) => updateAdditionalContact(index, 'contactName', e.target.value)}
                                placeholder="กรอกชื่อ-นามสกุล"
                                className="bg-background"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>ID Line</Label>
                              <Input
                                value={contact.lineId}
                                onChange={(e) => updateAdditionalContact(index, 'lineId', e.target.value)}
                                placeholder="Line ID (ไม่บังคับ)"
                                className="bg-background"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>เบอร์โทรศัพท์ <span className="text-red-500">*</span></Label>
                              <Input
                                value={contact.phoneNumber}
                                onChange={(e) => updateAdditionalContact(index, 'phoneNumber', e.target.value)}
                                placeholder="0XX-XXX-XXXX"
                                maxLength={12}
                                className="bg-background"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>อีเมล</Label>
                              <Input
                                type="email"
                                value={contact.email}
                                onChange={(e) => updateAdditionalContact(index, 'email', e.target.value)}
                                placeholder="email@example.com"
                                className="bg-background"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ส่วนที่ 5: การนำเสนอ */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">5</div>
                    <h3 className="text-lg font-semibold">การนำเสนอ</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                    <div className="space-y-2">
                      <Label htmlFor="presentationStatus">สถานะการนำเสนอ</Label>
                      <Select value={newCustomer.presentationStatus} onValueChange={(value) => setNewCustomer({ ...newCustomer, presentationStatus: value })}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="เสนอขาย">เสนอขาย</SelectItem>
                          <SelectItem value="นำเสนอแล้ว">นำเสนอแล้ว</SelectItem>
                          <SelectItem value="รอตัดสินใจ">รอตัดสินใจ</SelectItem>
                          <SelectItem value="ปิดการขาย">ปิดการขาย</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastContactDate">วันที่ติดต่อล่าสุด</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background",
                              !lastContactDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {lastContactDate ? format(lastContactDate, "dd/MM/yyyy") : "เลือกวันที่"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={lastContactDate}
                            onSelect={(date) => date && setLastContactDate(date)}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>สินค้าที่สนใจ <span className="text-red-500">*</span></Label>
                      <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-background min-h-[60px]">
                        {productTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={newCustomer.interestedProducts.includes(tag) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-colors",
                              newCustomer.interestedProducts.includes(tag)
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "hover:bg-accent"
                            )}
                            onClick={() => toggleProductTag(tag)}
                          >
                            {tag}
                            {newCustomer.interestedProducts.includes(tag) && (
                              <X className="w-3 h-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">คลิกเพื่อเลือกหลายรายการ (เลือกแล้ว: {newCustomer.interestedProducts.length} รายการ)</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ส่วนที่ 6: ข้อมูลภายใน */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">6</div>
                    <h3 className="text-lg font-semibold">ข้อมูลภายใน</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                    <div className="space-y-2">
                      <Label htmlFor="responsiblePerson">ผู้รับผิดชอบ</Label>
                      <Select value={newCustomer.responsiblePerson} onValueChange={(value) => setNewCustomer({ ...newCustomer, responsiblePerson: value })}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="พนักงานขายปัจจุบัน">พนักงานขายปัจจุบัน</SelectItem>
                          <SelectItem value="สมชาย">สมชาย</SelectItem>
                          <SelectItem value="สมหญิง">สมหญิง</SelectItem>
                          <SelectItem value="วิภา">วิภา</SelectItem>
                          <SelectItem value="ธนา">ธนา</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerStatus">สถานะลูกค้า</Label>
                      <Select value={newCustomer.customerStatus} onValueChange={(value) => setNewCustomer({ ...newCustomer, customerStatus: value })}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="ลูกค้าใหม่">ลูกค้าใหม่</SelectItem>
                          <SelectItem value="ลูกค้าเก่า">ลูกค้าเก่า</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="howFoundUs">ช่องทางที่รู้จักเรา</Label>
                      <Select value={newCustomer.howFoundUs} onValueChange={(value) => setNewCustomer({ ...newCustomer, howFoundUs: value })}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Google">Google</SelectItem>
                          <SelectItem value="ลูกค้าแนะนำ">ลูกค้าแนะนำ</SelectItem>
                          <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newCustomer.howFoundUs === "อื่นๆ" && (
                      <div className="space-y-2">
                        <Label htmlFor="otherChannel">โปรดระบุ</Label>
                        <Input
                          id="otherChannel"
                          value={newCustomer.otherChannel}
                          onChange={(e) => setNewCustomer({ ...newCustomer, otherChannel: e.target.value })}
                          placeholder="ระบุช่องทางอื่นๆ"
                          className="bg-background"
                        />
                      </div>
                    )}

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">หมายเหตุ</Label>
                      <Textarea
                        id="notes"
                        value={newCustomer.notes}
                        onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                        placeholder="บันทึกข้อมูลเพิ่มเติมที่สำคัญ..."
                        rows={3}
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleAddCustomer} className="bg-primary hover:bg-primary/90">
                  บันทึกลูกค้าใหม่
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">สรุปภาพรวม</h2>
          <p className="text-muted-foreground text-sm">ตัวเลขสำคัญของลูกค้าในความดูแล</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-6 w-[60px]" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatsCard
              title="จำนวนลูกค้าใหม่ในเดือนนี้"
              value={kpis.newCustomersThisMonth}
              icon={<UserPlus className="w-4 h-4" />}
              trend="neutral"
              className="bg-card hover:bg-accent/5"
            />

            <StatsCard
              title="ใบเสนอราคาที่ยังไม่ปิดการขาย"
              value={kpis.outstandingQuotes}
              icon={<FileText className="w-4 h-4" />}
              trend="neutral"
              className="bg-card hover:bg-accent/5"
            />

            <StatsCard
              title="ลูกค้าไม่ได้ติดต่อเกิน 30 วัน"
              value={kpis.inactiveCustomers}
              icon={<Clock className="w-4 h-4" />}
              trend={kpis.inactiveCustomers > 0 ? "down" : "neutral"}
              change={kpis.inactiveCustomers > 0 ? "ต้องการติดตาม" : "อัปเดต"}
              className="bg-card hover:bg-accent/5"
            />
          </div>
        )}
      </div>

      {/* Main Content - Use remaining space */}
      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              ค้นหาลูกค้า
            </CardTitle>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ค้นหาลูกค้า (ชื่อ, ผู้ติดต่อ, เบอร์โทร)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Advanced Filters */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span>ตัวกรองขั้นสูง:</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Select value={salesOwnerFilter} onValueChange={setSalesOwnerFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="เซลล์ที่รับผิดชอบ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกเซลล์</SelectItem>
                      {salesOwners.map(owner => (
                        <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={productFilter} onValueChange={setProductFilter}>
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="หมวดหมู่สินค้า" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                      {productTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="ประเภทธุรกิจ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกประเภท</SelectItem>
                      <SelectItem value="องค์กร">องค์กร</SelectItem>
                      <SelectItem value="โรงเรียน">โรงเรียน</SelectItem>
                      <SelectItem value="หน่วยงาน">หน่วยงาน</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="สถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกสถานะ</SelectItem>
                      <SelectItem value="ลูกค้าใหม่">ลูกค้าใหม่</SelectItem>
                      <SelectItem value="ลูกค้าประจำ">ลูกค้าประจำ</SelectItem>
                      <SelectItem value="ลูกค้า VIP">ลูกค้า VIP</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn(
                          "w-56 justify-start text-left font-normal",
                          !dateRange && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                              {format(dateRange.to, "dd/MM/yyyy")}
                            </>
                          ) : (
                            format(dateRange.from, "dd/MM/yyyy")
                          )
                        ) : (
                          <span>ช่วงวันที่ติดต่อล่าสุด</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4 mr-1" />
                      ล้างตัวกรอง
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[250px]">ชื่อลูกค้า/บริษัท</TableHead>
                    <TableHead className="w-[120px]">สถานะการขาย</TableHead>
                    <TableHead className="w-[200px]">Next Action</TableHead>
                    <TableHead className="w-[120px]">เซลล์เจ้าของ</TableHead>
                    <TableHead className="w-[130px]">สถานะลูกค้า</TableHead>
                    <TableHead className="w-[130px]">ติดต่อล่าสุด</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeleton />
                  ) : filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <EmptyState />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        className={`cursor-pointer transition-colors hover:bg-accent/50 ${selectedCustomer?.id === customer.id ? 'bg-accent' : ''
                          }`}
                        onClick={() => navigate(`/sales/customers/${customer.id}`)}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.contact}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSalesStatusColor(customer.salesStatus)}>
                            {customer.salesStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">{customer.nextAction}</div>
                            <div className="text-xs text-muted-foreground">
                              กำหนด: {new Date(customer.nextActionDate).toLocaleDateString('th-TH')}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm">{customer.salesOwner}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(customer.status)}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{customer.lastContact}</div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
