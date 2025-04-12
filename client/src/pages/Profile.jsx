import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import apiReq from "@/lib/apiReq";
import toast from "react-hot-toast";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    avatar: null,
  });
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setFormData((prev) => ({
            ...prev,
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
          }));
          setPreviewAvatar(user.avatarUrl || "https://github.com/shadcn.png");
        }
      } catch (error) {
        toast.error("Failed to load user data");
        console.error("Failed to load user data:", error);
      }
    };
    loadUserData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("Image size should be less than 2MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating profile...");

    try {
      const formDataToSend = new FormData();

      // Append only changed fields
      if (formData.name) formDataToSend.append("name", formData.name);
      if (formData.email) formDataToSend.append("email", formData.email);
      if (formData.phone) formDataToSend.append("phone", formData.phone);
      if (formData.password)
        formDataToSend.append("password", formData.password);
      if (formData.avatar) formDataToSend.append("avatar", formData.avatar);

      const response = await apiReq.put(
        "/Auth/profile-update",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local storage with new data
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatarUrl: previewAvatar,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully", { id: toastId });
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Could not update profile", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
          <p className="text-muted-foreground text-sm">
            Manage your personal information and security settings.
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-8 mt-4">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={previewAvatar} />
              <AvatarFallback>
                {formData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("") || "US"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label
                htmlFor="avatar"
                className="block mb-1 text-sm font-medium"
              >
                Update Avatar
              </Label>
              <Input
                type="file"
                id="avatar"
                className="w-72"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG up to 2MB
              </p>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8901"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to keep current password
              </p>
            </div>

            <div className="md:col-span-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
