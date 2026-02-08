"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { Header } from "@/components/landing/header";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface Address {
  _id?: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  state: string;
  country?: string;
  pinCode: string;
  phoneNo: string;
}

const normalizeAddress = (addr: Partial<Address>): Address => ({
  _id: addr._id,
  addressLine1: addr.addressLine1 ?? "",
  addressLine2: addr.addressLine2 ?? "",
  addressLine3: addr.addressLine3 ?? "",
  city: addr.city ?? "",
  state: addr.state ?? "",
  country: addr.country ?? "India",
  pinCode: String(addr.pinCode ?? ""),
  phoneNo: String(addr.phoneNo ?? ""),
});

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileForm, setProfileForm] = useState({ name: "", avatar: "" });
  const [addressForm, setAddressForm] = useState<Address>({
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
    phoneNo: "",
  });
  const [addressBook, setAddressBook] = useState<Address[]>([]);
  const [activeAddressId, setActiveAddressId] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoadingProfile(true);
      setError(null);
      try {
        const res = await api.get<{
          status?: boolean;
          message?: string;
          data?: UserProfile;
        }>("/account/me");
        if (!res?.status || !res.data)
          throw new Error(res?.message || "Failed to fetch profile");
        setUser(res.data);
        setProfileForm({
          name: res.data.name || "",
          avatar: res.data.avatar || "",
        });
      } catch (err: any) {
        setError(err?.message || "Failed to fetch profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileSubmit = async () => {
    setLoadingProfile(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api.patch<{
        status?: boolean;
        message?: string;
        data?: UserProfile;
      }>("/account/edit", {
        name: profileForm.name,
        avatar: profileForm.avatar,
      });
      if (!res?.status || !res.data)
        throw new Error(res?.message || "Failed to update profile");
      setUser(res.data);
      setMessage("Profile updated");
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleAddressSubmit = async () => {
    setLoadingAddress(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        ...addressForm,
        pinCode: Number(addressForm.pinCode),
        phoneNo: Number(addressForm.phoneNo),
      };

      if (activeAddressId) {
        const res = await api.patch<{
          status?: boolean;
          message?: string;
          data?: Address;
        }>(
          `/account/address/edit/${encodeURIComponent(activeAddressId)}`,
          payload,
        );
        if (!res?.status || !res.data)
          throw new Error(res?.message || "Failed to update address");
        const updated = normalizeAddress(res.data);
        setAddressBook((prev) =>
          prev.map((a) => (a._id === activeAddressId ? updated : a)),
        );
        setMessage("Address updated");
      } else {
        const res = await api.post<{
          status?: boolean;
          message?: string;
          data?: Address;
        }>("/account/address/create", payload);
        if (!res?.status || !res.data)
          throw new Error(res?.message || "Failed to create address");
        const created = normalizeAddress(res.data);
        setAddressBook((prev) => [...prev, created]);
        setMessage("Address created");
      }

      setActiveAddressId(null);
      setAddressForm({
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        city: "",
        state: "",
        country: "India",
        pinCode: "",
        phoneNo: "",
      });
    } catch (err: any) {
      setError(err?.message || "Address save failed");
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleEditAddress = (addr: Address) => {
    setActiveAddressId(addr._id ?? null);
    setAddressForm({
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      addressLine3: addr.addressLine3 || "",
      city: addr.city,
      state: addr.state,
      country: addr.country || "India",
      pinCode: String(addr.pinCode ?? ""),
      phoneNo: String(addr.phoneNo ?? ""),
      _id: addr._id,
    });
  };

  const handleDeleteAddress = async (id?: string) => {
    if (!id) return;
    setLoadingAddress(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api.delete<{
        status?: boolean;
        message?: string;
        data?: Address;
      }>(`/account/address/delete/${encodeURIComponent(id)}`);
      if (!res?.status)
        throw new Error(res?.message || "Failed to delete address");
      setAddressBook((prev) => prev.filter((a) => a._id !== id));
      setMessage("Address deleted");
      if (activeAddressId === id) {
        setActiveAddressId(null);
        setAddressForm({
          addressLine1: "",
          addressLine2: "",
          addressLine3: "",
          city: "",
          state: "",
          country: "India",
          pinCode: "",
          phoneNo: "",
        });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to delete address");
    } finally {
      setLoadingAddress(false);
    }
  };

  return (
    <>
      <Header />
      <div className="px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
            <p className="text-sm text-muted-foreground">
              Manage your profile and saved addresses.
            </p>
          </div>

          {(message || error) && (
            <div
              className={`rounded-md border p-3 text-sm ${
                message
                  ? "border-primary/30 text-primary"
                  : "border-destructive/30 text-destructive"
              }`}
            >
              {message || error}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your name and avatar.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={profileForm.avatar}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, avatar: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Email</Label>
                <Input value={user?.email ?? ""} disabled />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={handleProfileSubmit} disabled={loadingProfile}>
                  {loadingProfile ? "Saving..." : "Save profile"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>
                Add up to two addresses. Fields align with backend validation
                (pin code 6 digits, phone 10 digits).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address line 1</Label>
                  <Input
                    id="addressLine1"
                    value={addressForm.addressLine1}
                    onChange={(e) =>
                      setAddressForm((p) => ({
                        ...p,
                        addressLine1: e.target.value,
                      }))
                    }
                    placeholder="Street, house no."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address line 2</Label>
                  <Input
                    id="addressLine2"
                    value={addressForm.addressLine2}
                    onChange={(e) =>
                      setAddressForm((p) => ({
                        ...p,
                        addressLine2: e.target.value,
                      }))
                    }
                    placeholder="Apartment, suite"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine3">Address line 3</Label>
                  <Input
                    id="addressLine3"
                    value={addressForm.addressLine3}
                    onChange={(e) =>
                      setAddressForm((p) => ({
                        ...p,
                        addressLine3: e.target.value,
                      }))
                    }
                    placeholder="Landmark"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, city: e.target.value }))
                    }
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, state: e.target.value }))
                    }
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, country: e.target.value }))
                    }
                    placeholder="Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pinCode">Pin code</Label>
                  <Input
                    id="pinCode"
                    inputMode="numeric"
                    value={addressForm.pinCode}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, pinCode: e.target.value }))
                    }
                    placeholder="6 digit pin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNo">Phone</Label>
                  <Input
                    id="phoneNo"
                    inputMode="tel"
                    value={addressForm.phoneNo}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, phoneNo: e.target.value }))
                    }
                    placeholder="10 digit phone"
                  />
                </div>
              </div>
              <Button onClick={handleAddressSubmit} disabled={loadingAddress}>
                {loadingAddress
                  ? "Saving..."
                  : activeAddressId
                    ? "Update address"
                    : "Save address"}
              </Button>

              {addressBook.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Saved addresses
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {addressBook.map((addr) => (
                        <div
                          key={addr._id || addr.addressLine1}
                          className="rounded-md border p-3 text-sm"
                        >
                          <p className="font-medium">{addr.addressLine1}</p>
                          {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                          {addr.addressLine3 && <p>{addr.addressLine3}</p>}
                          <p>
                            {addr.city}, {addr.state}, {addr.country}
                          </p>
                          <p>Pin: {addr.pinCode}</p>
                          <p>Phone: {addr.phoneNo}</p>
                          <div className="mt-2 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAddress(addr)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteAddress(addr._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
