"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/components/dashboard/dashboardlayout/page";
import ButtonPink from "@/app/components/button/pinkbutton/page";
import SearchBar from "@/app/components/searchbar/page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Ellipsis } from "lucide-react";
import AddClientModal from "../../components/modal/addclientmodal/page";

export type Status = "complete" | "Ongoing" | "Inactive";

export interface ClientData {
  id: number;
  name: string;
  email: string;
  project: string;
  status: Status;
  lastActivity: string;
}

const clientData: ClientData[] = [
  {
    id: 1,
    name: "Ali",
    email: "ali@gmail.com",
    project: "Project1",
    status: "complete",
    lastActivity: "12-05-2025",
  },
  {
    id: 2,
    name: "Sara",
    email: "sara@gmail.com",
    project: "Project2",
    status: "Ongoing",
    lastActivity: "11-01-2025",
  },
  {
    id: 3,
    name: "John",
    email: "john@gmail.com",
    project: "Project3",
    status: "Inactive",
    lastActivity: "10-12-2024",
  },
  {
    id: 4,
    name: "Mina",
    email: "mina@gmail.com",
    project: "Project4",
    status: "complete",
    lastActivity: "05-03-2025",
  },
];

const ClientPage = () => {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "complete":
        return "bg-green-500";
      case "Ongoing":
        return "bg-yellow-500";
      case "Inactive":
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    document.body.classList.toggle("modal-open", isAddClientModalOpen);
    return () => document.body.classList.remove("modal-open");
  }, [isAddClientModalOpen]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <DashboardLayout>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Clients</h1>
            <p>Manage your client relationships</p>
          </div>

          <ButtonPink
            buttonname="+ Create Client"
            className="bg-pink-600 hover:bg-pink-700 px-3 py-2 rounded-lg text-white text-sm font-semibold"
            onClick={() => setIsAddClientModalOpen(true)}
          />
        </div>

        <div className="bg-white p-2 rounded-md mb-4">
          <SearchBar onSearch={(value) => console.log(value)} />
        </div>

        <div className="overflow-x-auto bg-white p-2 rounded-md">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2">Client</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Project</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Last Activity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clientData.map((client) => (
                <tr key={client.id} className="bg-white">
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {client.name}
                  </td>
                  <td className="px-4 py-2">{client.email}</td>
                  <td className="px-4 py-2">{client.project}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor(
                        client.status
                      )}`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{client.lastActivity}</td>
                  <td className="px-4 py-2">
                    <Ellipsis className="cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>

      {isAddClientModalOpen && (
        <AddClientModal onClose={() => setIsAddClientModalOpen(false)} />
      )}
    </>
  );
};

export default ClientPage;
