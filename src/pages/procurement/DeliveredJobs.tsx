import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Package, Truck, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface DeliveredJob {
  id: string;
  jobName: string;
  customer: string;
  trackingNumber: string;
  arrivalDate: Date | undefined;
  deliveryDate: Date | undefined;
  status: "shipped" | "in_transit" | "arrived_thailand" | "delivered";
  image?: File | null;
}

export default function DeliveredJobs() {
  const [jobs, setJobs] = useState<DeliveredJob[]>([
    {
      id: "1",
      jobName: "วิ่งเลาะเวียง",
      customer: "บริษัท ABC จำกัด",
      trackingNumber: "",
      arrivalDate: undefined,
      deliveryDate: undefined,
      status: "shipped",
      image: null,
    },
  ]);

  const handleTrackingUpdate = (id: string, trackingNumber: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, trackingNumber, status: "in_transit" as const }
          : job
      )
    );
    toast.success("สถานะเปลี่ยนเป็น 'ระหว่างขนส่ง'");
  };

  const handleArrivalDate = (id: string, date: Date | undefined) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, arrivalDate: date, status: "arrived_thailand" as const }
          : job
      )
    );
    toast.success("สถานะเปลี่ยนเป็น 'ถึงโกดังไทย'");
  };

  const handleDeliveryDate = (id: string, date: Date | undefined) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, deliveryDate: date, status: "delivered" as const }
          : job
      )
    );
    toast.success("สถานะเปลี่ยนเป็น 'จัดส่งสำเร็จ'");
  };

  const getStatusBadge = (status: DeliveredJob["status"]) => {
    switch (status) {
      case "shipped":
        return <Badge variant="secondary"><Package className="w-3 h-3 mr-1" />จัดส่งแล้ว</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-600"><Truck className="w-3 h-3 mr-1" />ระหว่างขนส่ง</Badge>;
      case "arrived_thailand":
        return <Badge className="bg-orange-600"><Package className="w-3 h-3 mr-1" />ถึงโกดังไทย</Badge>;
      case "delivered":
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />จัดส่งสำเร็จ</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">งานที่จัดส่งแล้ว</h1>
        <p className="text-muted-foreground mt-2">ติดตามสถานะการจัดส่งและการขนส่ง</p>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{job.jobName}</CardTitle>
                {getStatusBadge(job.status)}
              </div>
              <p className="text-sm text-muted-foreground">ลูกค้า: {job.customer}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tracking Number */}
              <div>
                <Label>เลขติดตามพัสดุ (Tracking Number)</Label>
                <div className="flex gap-2">
                  <Input
                    value={job.trackingNumber}
                    onChange={(e) =>
                      setJobs((prev) =>
                        prev.map((j) =>
                          j.id === job.id ? { ...j, trackingNumber: e.target.value } : j
                        )
                      )
                    }
                    placeholder="ใส่เลขติดตามพัสดุ"
                    disabled={job.status !== "shipped"}
                  />
                  <Button
                    onClick={() => handleTrackingUpdate(job.id, job.trackingNumber)}
                    disabled={!job.trackingNumber || job.status !== "shipped"}
                  >
                    อัพเดต
                  </Button>
                </div>
              </div>

              {/* Arrival Date in Thailand */}
              {job.status === "in_transit" && (
                <div>
                  <Label>วันที่จัดส่งถึงไทย</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !job.arrivalDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {job.arrivalDate ? format(job.arrivalDate, "PPP") : "เลือกวันที่"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={job.arrivalDate}
                          onSelect={(date) => handleArrivalDate(job.id, date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <Input type="file" accept="image/*" className="flex-1" />
                  </div>
                </div>
              )}

              {/* Delivery Date */}
              {job.status === "arrived_thailand" && (
                <div>
                  <Label>วันที่ส่งมอบ</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !job.deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {job.deliveryDate ? format(job.deliveryDate, "PPP") : "เลือกวันที่ส่งมอบ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={job.deliveryDate}
                        onSelect={(date) => handleDeliveryDate(job.id, date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {job.status === "delivered" && (
                <div className="bg-green-50 border border-green-200 p-4 rounded">
                  <p className="text-green-700 font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    งานนี้จัดส่งสำเร็จแล้ว
                  </p>
                  {job.deliveryDate && (
                    <p className="text-sm text-green-600 mt-1">
                      วันที่ส่งมอบ: {format(job.deliveryDate, "PPP")}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
