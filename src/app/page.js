import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <h1>CIWAGLINK</h1>
      <div className="grid">
        <Link href="/airtime">Airtime</Link>
        <Link href="/data">Data</Link>
        <Link href="/cable">Cable</Link>
        <Link href="/electricity">Electricity</Link>
        <Link href="/exam-pin">Exam Pin</Link>
      </div>
    </div>
  );
}