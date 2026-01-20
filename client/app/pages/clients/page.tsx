"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/app/components/dashboard/dashboardlayout/page";
import ButtonPink from "@/app/components/button/pinkbutton/page";
import SearchBar from "@/app/components/searchbar/page";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Ellipsis, ChevronLeft, ChevronRight } from "lucide-react";
import AddClientModal from "../../components/modal/addclientmodal/page";

export type Status = "complete" | "Ongoing" | "Inactive" | "active";

export interface ClientData {
  _id: string;
  name: string;
  email: string;
  project?: string;
  status?: Status;
  lastActivity?: string;
  role?: string;
  createdAt?: string;
}

const ClientPage = () => {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const getStatusColor = (status?: Status) => {
    switch (status) {
      case "complete":
        return "bg-green-500";
      case "Ongoing":
      case "active":
        return "bg-yellow-500";
      case "Inactive":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.project?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClients(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, clients]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", isAddClientModalOpen);
    return () => document.body.classList.remove("modal-open");
  }, [isAddClientModalOpen]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login again.");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getUsers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const users = res.data.users || res.data || [];
      setClients(users);
      setFilteredClients(users);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsAddClientModalOpen(false);
    fetchClients();
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB");
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const max = 5;

    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    return pages;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <DashboardLayout>
        <div className="flex justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Clients</h1>
            <p>Manage your client relationships</p>
          </div>

          <ButtonPink
            buttonname="+ Create Client"
            onClick={() => setIsAddClientModalOpen(true)}
            className="bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded-md text-white text-sm font-semibold"
          />
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={setSearchQuery}
          placeholder="Search clients..."
        />

        <div className="bg-white mt-4 p-4 rounded-md">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-10 w-10 border-b-2 border-pink-600 rounded-full" />
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 ">
                  <tr>
                    <th className="px-4 py-2 text-left">Client</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Joined</th>
                    <th className="px-4 py-2 text-left" />
                  </tr>
                </thead>
                <tbody>
                  {currentClients.map((c) => (
                    <tr key={c._id} className=" hover:bg-gray-50 ">
                      <td className="px-4 py-2 font-medium">{c.name}</td>
                      <td className="px-4 py-2">{c.email}</td>
                      <td className="px-4 py-2 capitalize">
                        {c.role || "User"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(
                            c.status
                          )}`}
                        >
                          {c.status || "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-2">{formatDate(c.createdAt)}</td>
                      <td className="px-4 py-2">
                        <Ellipsis />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-6">
                {/* LEFT SIDE — ALWAYS VISIBLE */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredClients.length)} of{" "}
                    {filteredClients.length}
                  </span>

                  <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="border rounded-md px-2 py-1"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                </div>

                {/* RIGHT SIDE — PAGINATION ONLY IF NEEDED */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {getPageNumbers().map((p, i) => (
                      <button
                        key={i}
                        disabled={p === "..."}
                        onClick={() =>
                          typeof p === "number" && setCurrentPage(p)
                        }
                        className={`px-2 rounded ${
                          p === currentPage
                            ? "bg-pink-600 text-white"
                            : "border"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DashboardLayout>

      {isAddClientModalOpen && <AddClientModal onClose={handleModalClose} />}
    </>
  );
};

export default ClientPage;
