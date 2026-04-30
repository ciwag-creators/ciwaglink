import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

export default function Home() {
  const services = [
    { name: "Airtime", link: "/airtime" },
    { name: "Data", link: "/data" },
    { name: "Cable TV", link: "/cable" },
    { name: "Electricity", link: "/electricity" },
    { name: "Exam Pin", link: "/exam-pin" },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="cards">
        {services.map((s) => (
          <Link key={s.link} href={s.link} className="card">
            {s.name}
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}