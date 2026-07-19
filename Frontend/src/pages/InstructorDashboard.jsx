import React, { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  HiOutlineAcademicCap,
  HiOutlineBell,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineCog6Tooth,
  HiOutlineDocumentText,
  HiOutlineEllipsisVertical,
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineQuestionMarkCircle,
  HiOutlineUsers,
  HiOutlineXMark,
  HiOutlineBars3,
} from "react-icons/hi2";

const revenueData = [
  { month: "Jan", value: 3400 }, { month: "Feb", value: 4250 },
  { month: "Mar", value: 3800 }, { month: "Apr", value: 5100 },
  { month: "May", value: 4800 }, { month: "Jun", value: 6400 },
  { month: "Jul", value: 7200 },
];

const engagementData = [
  { name: "Mon", learners: 780 }, { name: "Tue", learners: 980 },
  { name: "Wed", learners: 860 }, { name: "Thu", learners: 1220 },
  { name: "Fri", learners: 1100 }, { name: "Sat", learners: 670 },
  { name: "Sun", learners: 540 },
];

const courses = [
  { title: "Complete UI/UX Design Bootcamp", lessons: 42, students: "1,248", rating: "4.9", color: "bg-violet-100", mark: "UI" },
  { title: "Figma for Product Designers", lessons: 28, students: "846", rating: "4.8", color: "bg-amber-100", mark: "F" },
  { title: "Design Systems Masterclass", lessons: 36, students: "614", rating: "4.9", color: "bg-sky-100", mark: "DS" },
];

function NavItem({ icon: Icon, label, active }) {
  return <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}><Icon className="h-5 w-5" />{label}</button>;
}

export default function InstructorDashboard() {
  const [open, setOpen] = useState(false);
  const side = <aside className="flex h-full w-64 flex-col border-r border-slate-100 bg-white px-4 py-6 shadow-sm lg:shadow-none">
    <div className="mb-9 flex items-center gap-2 px-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-lg font-black text-white">s</div><span className="text-xl font-bold tracking-tight text-slate-900">studion</span></div>
    <div className="space-y-1"><p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Workspace</p><NavItem icon={HiOutlineHome} label="Overview" active /><NavItem icon={HiOutlineBookOpen} label="My courses" /><NavItem icon={HiOutlineUsers} label="Students" /><NavItem icon={HiOutlineChartBar} label="Analytics" /></div>
    <div className="mt-8 space-y-1"><p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Manage</p><NavItem icon={HiOutlineDocumentText} label="Assignments" /><NavItem icon={HiOutlineCog6Tooth} label="Settings" /></div>
    <div className="mt-auto rounded-2xl bg-indigo-50 p-4"><HiOutlineQuestionMarkCircle className="mb-2 h-6 w-6 text-indigo-600" /><p className="text-sm font-semibold text-slate-800">Need a hand?</p><p className="mt-1 text-xs leading-5 text-slate-500">Visit our help center for useful resources.</p><button className="mt-3 text-xs font-bold text-indigo-600">Get support <HiOutlineChevronRight className="inline h-3.5 w-3.5" /></button></div>
  </aside>;

  return <div className="min-h-screen bg-[#f8f9fc] font-sans text-slate-900">
    <div className="flex min-h-screen">
      <div className="hidden lg:block">{side}</div>
      {open && <div className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden" onClick={() => setOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}><button onClick={() => setOpen(false)} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600"><HiOutlineXMark /></button>{side}</div>
      <main className="min-w-0 flex-1">
        <header className="flex h-[76px] items-center justify-between border-b border-slate-100 bg-white px-4 sm:px-7">
          <div className="flex items-center gap-3"><button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"><HiOutlineBars3 className="h-6 w-6" /></button><div className="relative hidden sm:block"><HiOutlineMagnifyingGlass className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" /><input aria-label="Search" placeholder="Search courses, students..." className="h-11 w-64 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white md:w-80" /></div></div>
          <div className="flex items-center gap-3 sm:gap-5"><button className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-50"><HiOutlineBell className="h-6 w-6" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" /></button><div className="hidden h-8 w-px bg-slate-200 sm:block" /><button className="flex items-center gap-2 text-left"><div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-300 to-indigo-600 text-sm font-bold text-white">AR</div><div className="hidden md:block"><p className="text-sm font-semibold">Alex Rivera</p><p className="text-xs text-slate-500">Instructor</p></div><HiOutlineChevronDown className="hidden h-4 w-4 text-slate-400 md:block" /></button></div>
        </header>
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 lg:px-10">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-sm font-medium text-indigo-600">Thursday, 18 July</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Good morning, Alex <span aria-hidden="true">👋</span></h1><p className="mt-1 text-sm text-slate-500">Here’s what’s happening with your courses today.</p></div><button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"><HiOutlinePlus className="h-5 w-5" /> Create new course</button></div>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[['Total revenue','$18,482','+12.5%','from last month','bg-indigo-50 text-indigo-600',HiOutlineChartBar],['Total students','3,642','+8.2%','from last month','bg-sky-50 text-sky-600',HiOutlineUsers],['Course completion','78.4%','+4.6%','from last month','bg-amber-50 text-amber-600',HiOutlineAcademicCap],['Active courses','12','2 new','this month','bg-emerald-50 text-emerald-600',HiOutlineBookOpen]].map(([label,value,change,meta,style,Icon]) => <div key={label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><div className="mb-5 flex items-start justify-between"><div className={`grid h-10 w-10 place-items-center rounded-xl ${style}`}><Icon className="h-5 w-5" /></div><span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">{change}</span></div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-400">{meta}</p></div>)}
          </section>
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6"><div className="mb-5 flex items-start justify-between"><div><h2 className="font-bold">Revenue overview</h2><p className="mt-1 text-sm text-slate-500">Your earnings over the last 7 months</p></div><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">This year <HiOutlineChevronDown className="ml-1 inline h-3.5 w-3.5" /></button></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueData} margin={{ top: 10, right: 5, left: -22, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.24}/><stop offset="100%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#eef0f5" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10}/><YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v/1000}k`} /><Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} /><Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fill="url(#revenueFill)" /></AreaChart></ResponsiveContainer></div></div>
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold">Learner engagement</h2><p className="mt-1 text-sm text-slate-500">Active learners this week</p></div><HiOutlineEllipsisVertical className="h-5 w-5 text-slate-400" /></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={engagementData} margin={{ top: 10, right: 0, left: -28, bottom: 0 }}><CartesianGrid vertical={false} stroke="#eef0f5"/><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10}/><YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} /><Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} /><Bar dataKey="learners" fill="#a5b4fc" radius={[6,6,0,0]} barSize={22}/></BarChart></ResponsiveContainer></div></div>
          </section>
          <section className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"><div className="flex items-center justify-between p-5 sm:p-6"><div><h2 className="font-bold">Your courses</h2><p className="mt-1 text-sm text-slate-500">Track the performance of your published courses.</p></div><button className="text-sm font-semibold text-indigo-600">View all</button></div><div className="divide-y divide-slate-100">{courses.map((course) => <div className="flex flex-wrap items-center gap-4 px-5 py-4 sm:flex-nowrap sm:px-6" key={course.title}><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${course.color} text-xs font-bold text-slate-600`}>{course.mark}</div><div className="min-w-[180px] flex-1"><p className="font-semibold text-slate-800">{course.title}</p><p className="mt-1 text-xs text-slate-500">{course.lessons} lessons</p></div><div className="w-24"><p className="text-xs text-slate-400">Students</p><p className="mt-1 text-sm font-semibold">{course.students}</p></div><div className="w-20"><p className="text-xs text-slate-400">Rating</p><p className="mt-1 text-sm font-semibold text-amber-500">★ {course.rating}</p></div><button className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-slate-50"><HiOutlineEllipsisVertical className="h-5 w-5" /></button></div>)}</div></section>
        </div>
      </main>
    </div>
  </div>;
}
