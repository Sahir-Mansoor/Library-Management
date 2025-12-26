"use client";

import type React from "react";
import axios from "axios";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

interface CreateUserModalProps {
  user?: any;
  onSave: (user: any) => void;
  onClose: () => void;
}

export function CreateUserModal({
  user,
  onSave,
  onClose,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "MEMBER",
    status: user?.status || "ACTIVE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!user && !formData.password) {
      newErrors.password = "Password is required";
    } else if (!user && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    let payload;

    if (user && user.id) {
      // UPDATE USER
      payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role.toUpperCase(),   // ensure enum format
        status: formData.status.toUpperCase(), // ensure enum format
      };
      console.log("Updating user with payload:", payload);
      const response = await axios.put(
        `http://localhost:5000/users/${user.id}`,
        payload
      );
      onSave(response.data);
    } else {
      // CREATE USER
      payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role.toUpperCase(),   // ensure enum format
        status: formData.status.toUpperCase(), // ensure enum format
      };
      console.log("Creating user with payload:", payload);
      const response = await axios.post("http://localhost:5000/users", payload);
      onSave(response.data);
    }

    onClose();
  } catch (error) {
    console.error("Error saving user:", error);
    alert("Failed to save user. Check console for details.");
  }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Role cannot be changed after creation.
              </p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          {!user && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Password *
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Minimum 6 characters"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password}
                </p>
              )}
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              disabled={!!user}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="MEMBER">Member - View only</option>
              <option value="LIBRARIAN">Librarian</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {user ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
