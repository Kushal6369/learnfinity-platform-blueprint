
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderCircle } from "lucide-react";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  employee_id: string | null;
  created_at: string;
}

interface AdminListTableProps {
  admins: AdminUser[];
  isLoading: boolean;
}

const AdminListTable: React.FC<AdminListTableProps> = ({
  admins,
  isLoading,
}) => (
  <Table>
    <TableCaption>List of admin users</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Employee ID</TableHead>
        <TableHead>Added On</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {isLoading ? (
        <TableRow>
          <TableCell colSpan={4} className="text-center">
            <LoaderCircle className="h-6 w-6 animate-spin mx-auto" />
          </TableCell>
        </TableRow>
      ) : admins.length > 0 ? (
        admins.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell className="font-medium">{admin.name}</TableCell>
            <TableCell>{admin.email}</TableCell>
            <TableCell>{admin.employee_id || "N/A"}</TableCell>
            <TableCell>
              {new Date(admin.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4} className="text-center">
            No administrators found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

export default AdminListTable;
