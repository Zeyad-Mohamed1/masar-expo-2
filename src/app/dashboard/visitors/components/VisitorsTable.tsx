"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getVisitors } from "../../actions";

type Visitor = {
  id: string;
  name: string;
  phone: string;
};

export default function VisitorsTable() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVisitors = async () => {
      const visitors = await getVisitors();
      setVisitors(visitors);
    };
    fetchVisitors();
  }, []);

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.includes(searchTerm),
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن زائر..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pr-10 text-right text-gray-900 placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3" scope="col">
                الاسم
              </th>
              <th className="px-6 py-3" scope="col">
                رقم الهاتف
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVisitors.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-10 text-center text-gray-500">
                  لا توجد بيانات للعرض
                </td>
              </tr>
            ) : (
              filteredVisitors.map((visitor) => (
                <tr key={visitor.id} className="bg-white hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                    {visitor.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {visitor.phone}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
