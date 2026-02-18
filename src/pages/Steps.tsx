import { useState } from "react";
import { useSteps } from "@/hooks/useSteps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Footprints, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { format, parseISO } from "date-fns";

const Steps = () => {
  const { todaySteps, weekSteps, logSteps } = useSteps();
  const [stepInput, setStepInput] = useState("");

  const handleLog = () => {
    const val = parseInt(stepInput);
    if (!val || val < 0) {
      toast.error("Enter a valid number");
      return;
    }
    logSteps.mutate(val, {
      onSuccess: () => {
        toast.success("Steps logged!");
        setStepInput("");
      },
      onError: () => toast.error("Failed to log steps"),
    });
  };

  const weekTotal = weekSteps.reduce((sum, d) => sum + (d.steps ?? 0), 0);

  const chartData = weekSteps.map((d) => ({
    day: format(parseISO(d.date), "EEE"),
    steps: d.steps,
  }));

  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="mx-auto max-w-md space-y-4 px-4">
        <header>
          <h1 className="text-2xl font-bold">Steps</h1>
          <p className="text-sm text-muted-foreground">Track your daily movement</p>
        </header>

        {/* Log Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Footprints className="h-4 w-4 text-primary" /> Log Today's Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              type="number"
              placeholder={todaySteps?.steps ? String(todaySteps.steps) : "e.g. 8000"}
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              min={0}
            />
            <Button onClick={handleLog} disabled={logSteps.isPending}>
              {logSteps.isPending ? "..." : "Log"}
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-primary" /> This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-lg font-semibold">
              {weekTotal.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">total steps</span>
            </p>
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData}>
                  <XAxis dataKey="day" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 16%)", borderRadius: 8, color: "hsl(210 20% 92%)" }}
                  />
                  <Bar dataKey="steps" fill="hsl(160 84% 39%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Steps;
