import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Button } from "@/components/ui/button";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Separator } from "@/components/ui/separator";
  
  const Profile = () => {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
            <p className="text-muted-foreground text-sm">Manage your personal information and security settings.</p>
          </CardHeader>
  
          <Separator />
  
          <CardContent className="space-y-8 mt-4">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>NM</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar" className="block mb-1 text-sm font-medium">
                  Update Avatar
                </Label>
                <Input type="file" id="avatar" className="w-72" />
              </div>
            </div>
  
            <Separator />
  
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input type="email" id="email" placeholder="john@example.com" />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+1 234 567 8901" />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input type="password" id="password" placeholder="••••••••" />
              </div>
            </div>
  
            <div className="pt-4">
              <Button className="w-full md:w-fit">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default Profile;
