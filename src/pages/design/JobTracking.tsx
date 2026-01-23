import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, Eye, Calendar, User, FileText, Upload, Send, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface JobTracking {
  job_id: string;
  client_name: string;
  job_type: string;
  assignee: string;
  assigned_at: string;
  due_date: string;
  status: "รับงานแล้ว" | "กำลังดำเนินการ" | "รอตรวจสอบ" | "ผลิตชิ้นงาน" | "เสร็จสิ้น" | "ล่าช้า";
  progress: number;
  has_artwork: boolean;
}

const workflowSteps = [
  { key: "รับงานแล้ว", label: "รับงาน" },
  { key: "กำลังดำเนินการ", label: "กำลังดำเนินการ" },
  { key: "รอตรวจสอบ", label: "รอตรวจสอบ" },
  { key: "ผลิตชิ้นงาน", label: "ผลิตชิ้นงาน" },
  { key: "เสร็จสิ้น", label: "เสร็จสิ้น" }
];

export default function JobTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs] = useState<JobTracking[]>([
    {
      job_id: "JOB-2024-001",
      client_name: "บริษัท ABC จำกัด",
      job_type: "เหรียญซิงค์อัลลอย",
      assignee: "ดีไซเนอร์ A",
      assigned_at: "2024-01-15",
      due_date: "2024-12-25",
      status: "กำลังดำเนินการ",
      progress: 60,
      has_artwork: true
    },
    {
      job_id: "JOB-2024-002",
      client_name: "ร้าน XYZ",
      job_type: "โล่สั่งผลิต",
      assignee: "ดีไซเนอร์ B",
      assigned_at: "2024-01-10",
      due_date: "2024-12-10",
      status: "รอตรวจสอบ",
      progress: 85,
      has_artwork: true
    },
    {
      job_id: "JOB-2024-003",
      client_name: "บริษัท DEF",
      job_type: "PVC",
      assignee: "ดีไซเนอร์ C",
      assigned_at: "2024-01-05",
      due_date: "2024-12-05",
      status: "เสร็จสิ้น",
      progress: 100,
      has_artwork: true
    },
    {
      job_id: "JOB-2024-004",
      client_name: "องค์กร GHI",
      job_type: "เหรียญอะคริลิก",
      assignee: "ดีไซเนอร์ A",
      assigned_at: "2024-02-01",
      due_date: "2024-11-30",
      status: "ล่าช้า",
      progress: 45,
      has_artwork: false
    },
    {
      job_id: "JOB-2024-005",
      client_name: "สถาบัน JKL",
      job_type: "ป้ายจารึก",
      assignee: "ดีไซเนอร์ B",
      assigned_at: "2024-02-15",
      due_date: "2024-12-20",
      status: "ผลิตชิ้นงาน",
      progress: 90,
      has_artwork: true
    },
    {
      job_id: "JOB-2024-006",
      client_name: "บริษัท MNO",
      job_type: "สติกเกอร์",
      assignee: "ดีไซเนอร์ C",
      assigned_at: "2024-03-01",
      due_date: "2024-12-15",
      status: "รับงานแล้ว",
      progress: 10,
      has_artwork: false
    }
  ]);

  const calculateDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysLeftBadge = (daysLeft: number) => {
    if (daysLeft < 0) {
      return (
        <Badge className="bg-red-500 hover:bg-red-600 text-white">
          เกิน {Math.abs(daysLeft)} วัน
        </Badge>
      );
    } else if (daysLeft >= 0 && daysLeft <= 2) {
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
          เหลือ {daysLeft} วัน
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white">
          เหลือ {daysLeft} วัน
        </Badge>
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "รับงานแล้ว":
        return <Badge className="bg-gray-500 hover:bg-gray-600 text-white">{status}</Badge>;
      case "กำลังดำเนินการ":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">{status}</Badge>;
      case "รอตรวจสอบ":
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">{status}</Badge>;
      case "ผลิตชิ้นงาน":
        return <Badge className="bg-cyan-500 hover:bg-cyan-600 text-white">{status}</Badge>;
      case "เสร็จสิ้น":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">{status}</Badge>;
      case "ล่าช้า":
        return <Badge className="bg-red-500 hover:bg-red-600 text-white">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job =>
      job.job_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  const getTabFilteredJobs = (tabValue: string) => {
    switch (tabValue) {
      case "in-progress":
        return filteredJobs.filter(j => j.status === "กำลังดำเนินการ");
      case "review":
        return filteredJobs.filter(j => j.status === "รอตรวจสอบ");
      case "completed":
        return filteredJobs.filter(j => j.status === "เสร็จสิ้น");
      case "delayed":
        const today = new Date();
        return filteredJobs.filter(j => {
          const dueDate = new Date(j.due_date);
          return dueDate < today && j.status !== "เสร็จสิ้น";
        });
      default:
        return filteredJobs;
    }
  };

  // Statistics
  const totalJobs = jobs.length;
  const inProgressJobs = jobs.filter(j => j.status === "กำลังดำเนินการ").length;
  const reviewJobs = jobs.filter(j => j.status === "รอตรวจสอบ").length;
  const completedJobs = jobs.filter(j => j.status === "เสร็จสิ้น").length;
  const delayedJobs = jobs.filter(j => {
    const today = new Date();
    const dueDate = new Date(j.due_date);
    return dueDate < today && j.status !== "เสร็จสิ้น";
  }).length;

  const renderStepTracker = (currentStatus: string) => {
    const currentIndex = workflowSteps.findIndex(step => step.key === currentStatus);
    
    return (
      <div className="flex items-center justify-between w-full gap-2">
        {workflowSteps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  isActive 
                    ? isCurrent
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                      : "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {isActive ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </div>
                <span className={`text-[10px] mt-1 text-center ${
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className={`h-[2px] flex-1 -mt-6 ${
                  index < currentIndex ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderJobCard = (job: JobTracking) => {
    const daysLeft = calculateDaysLeft(job.due_date);
    
    return (
      <Card key={job.job_id} className="hover:shadow-lg transition-all duration-200 rounded-2xl">
        <CardContent className="p-6 space-y-6">
          {/* Step Tracker */}
          <div className="pb-4 border-b">
            {renderStepTracker(job.status)}
          </div>

          {/* ส่วนที่ 1: ข้อมูลทั่วไป */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">รหัสงาน</span>
                  <Badge variant="outline" className="font-mono">{job.job_id}</Badge>
                </div>
                <h3 className="text-lg font-bold">{job.client_name}</h3>
              </div>
              {getStatusBadge(job.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">ประเภท:</span>
                <span className="font-medium">{job.job_type}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">ผู้รับผิดชอบ:</span>
                <span className="font-medium">{job.assignee}</span>
              </div>
            </div>
          </div>

          {/* ส่วนที่ 2: กำหนดการ */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">วันที่รับงาน:</span>
                <span className="font-medium">{formatThaiDate(job.assigned_at)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">กำหนดส่ง:</span>
                <span className="font-medium">{formatThaiDate(job.due_date)}</span>
              </div>
              {getDaysLeftBadge(daysLeft)}
            </div>
          </div>

          {/* ส่วนที่ 3: สถานะงาน */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">ความคืบหน้า</span>
                <span className="font-bold text-primary">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-2" />
            </div>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    ดูรายละเอียด
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>รายละเอียดงาน {job.job_id}</DialogTitle>
                    <DialogDescription>{job.client_name}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">ประเภทงาน</span>
                        <p className="font-medium">{job.job_type}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">ผู้รับผิดชอบ</span>
                        <p className="font-medium">{job.assignee}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">วันที่รับงาน</span>
                        <p className="font-medium">{formatThaiDate(job.assigned_at)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">กำหนดส่ง</span>
                        <p className="font-medium">{formatThaiDate(job.due_date)}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">สถานะ</span>
                      <div className="mt-2">{getStatusBadge(job.status)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">ความคืบหน้า</span>
                      <div className="mt-2 space-y-2">
                        <Progress value={job.progress} />
                        <p className="text-sm font-medium">{job.progress}%</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {job.status === "กำลังดำเนินการ" && (
                <>
                  <Button variant="outline" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    แนบไฟล์
                  </Button>
                  {job.has_artwork && (
                    <Button className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      ส่งตรวจ
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ดูและติดตามสถานะงาน</h1>
        <p className="text-muted-foreground">ติดตามความคืบหน้าของงานออกแบบทั้งหมด</p>
      </div>

      {/* Mini Dashboard */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatsCard
          title="งานทั้งหมด"
          value={totalJobs}
          icon={<FileText className="h-4 w-4" />}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
        />
        <StatsCard
          title="กำลังทำ"
          value={inProgressJobs}
          icon={<FileText className="h-4 w-4" />}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
        />
        <StatsCard
          title="รอตรวจสอบ"
          value={reviewJobs}
          icon={<FileText className="h-4 w-4" />}
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
        />
        <StatsCard
          title="เสร็จสิ้น"
          value={completedJobs}
          icon={<FileText className="h-4 w-4" />}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
        />
        <StatsCard
          title="ล่าช้า"
          value={delayedJobs}
          icon={<FileText className="h-4 w-4" />}
          className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหารหัสงานหรือชื่อลูกค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
          <TabsTrigger value="in-progress">กำลังทำ</TabsTrigger>
          <TabsTrigger value="review">รอตรวจสอบ</TabsTrigger>
          <TabsTrigger value="completed">เสร็จสิ้น</TabsTrigger>
          <TabsTrigger value="delayed">ล่าช้า</TabsTrigger>
        </TabsList>

        {["all", "in-progress", "review", "completed", "delayed"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4 mt-6">
            <div className="grid gap-4">
              {getTabFilteredJobs(tabValue).length > 0 ? (
                getTabFilteredJobs(tabValue).map((job) => renderJobCard(job))
              ) : (
                <Card className="p-8">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>ไม่พบงานในหมวดนี้</p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
