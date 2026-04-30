"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();

  const menu = [
    { name: "Dashboard", link: "/" },
    { name: "Airtime", link: "/airtime" },
    { name: "Data", link: "/data" },
    { name: "Cable TV", link: "/cable" },
    { name: "Electricity", link: "/electricity" },
    { name: "Exam Pin", link: "/exam-pin" },
  ];

  return (
    <div className="sidebar">
      <h2>CIWAGLINK</h2>

      {menu.map((item) => (
        <Link
          key={item.link}
          href={item.link}
          className={path === item.link ? "active" : ""}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}