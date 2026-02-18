import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateBMI, getBMICategory } from "@/lib/bmi";
import { toast } from "sonner";
import { User, LogOut, Scale } from "lucide-react";

const Profile = () => {
  const { profile, isLoading, updateProfile } = useProfile();
  const { signOut, user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    activity_level: "",
    goal: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        age: profile.age?.toString() ?? "",
        gender: profile.gender ?? "",
        height_cm: profile.height_cm?.toString() ?? "",
        weight_kg: profile.weight_kg?.toString() ?? "",
        activity_level: profile.activity_level ?? "",
        goal: profile.goal ?? "",
      });
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile.mutate(
      {
        name: form.name || null,
        age: form.age ? parseInt(form.age) : null,
        gender: form.gender || null,
        height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        activity_level: form.activity_level || null,
        goal: form.goal || null,
      },
      {
        onSuccess: () => toast.success("Profile saved!"),
        onError: () => toast.error("Failed to save profile"),
      }
    );
  };

  const bmi = form.weight_kg && form.height_cm
    ? calculateBMI(parseFloat(form.weight_kg), parseFloat(form.height_cm))
    : null;
  const bmiInfo = bmi ? getBMICategory(bmi) : null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <User className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="mx-auto max-w-md space-y-4 px-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="25" />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input type="number" value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} placeholder="170" />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="number" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} placeholder="70" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select value={form.activity_level} onValueChange={(v) => setForm({ ...form, activity_level: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Goal</Label>
              <Select value={form.goal} onValueChange={(v) => setForm({ ...form, goal: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain</SelectItem>
                  <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleSave} disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* BMI display */}
        {bmi && bmiInfo && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Scale className="h-4 w-4" /> Your BMI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">{bmi.toFixed(1)}</span>
                <span className={`text-sm font-medium ${bmiInfo.color}`}>{bmiInfo.label}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{bmiInfo.message}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
