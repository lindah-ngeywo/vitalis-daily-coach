import { useProfile } from "@/hooks/useProfile";
import { useSteps } from "@/hooks/useSteps";
import { calculateBMI, getBMICategory } from "@/lib/bmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Footprints, Scale, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const STEP_GOAL = 10000;

const Dashboard = () => {
  const { profile, isLoading: profileLoading } = useProfile();
  const { todaySteps, isLoading: stepsLoading } = useSteps();

  const bmi = profile?.weight_kg && profile?.height_cm
    ? calculateBMI(Number(profile.weight_kg), Number(profile.height_cm))
    : null;
  const bmiInfo = bmi ? getBMICategory(bmi) : null;

  const steps = todaySteps?.steps ?? 0;
  const calories = todaySteps?.calories_burned ?? 0;
  const stepsProgress = Math.min((steps / STEP_GOAL) * 100, 100);

  if (profileLoading || stepsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Activity className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="mx-auto max-w-md px-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">
            Hi, {profile?.name || "there"} 👋
          </h1>
          <p className="text-sm text-muted-foreground">Here's your daily summary</p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {/* BMI Card */}
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Scale className="h-4 w-4" /> BMI
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bmi ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">{bmi.toFixed(1)}</span>
                  <span className={`text-sm font-medium ${bmiInfo?.color}`}>
                    {bmiInfo?.label}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Set your height & weight in Profile to see BMI
                </p>
              )}
              {bmiInfo && (
                <p className="mt-1 text-xs text-muted-foreground">{bmiInfo.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Steps Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Footprints className="h-4 w-4" /> Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{steps.toLocaleString()}</span>
              <Progress value={stepsProgress} className="mt-2 h-1.5" />
              <p className="mt-1 text-xs text-muted-foreground">
                {STEP_GOAL.toLocaleString()} goal
              </p>
            </CardContent>
          </Card>

          {/* Calories Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Flame className="h-4 w-4" /> Burned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{Number(calories).toFixed(0)}</span>
              <p className="mt-1 text-xs text-muted-foreground">kcal from steps</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
