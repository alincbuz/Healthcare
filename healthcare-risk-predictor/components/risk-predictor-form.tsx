"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, Search, Brain, Citrus as Virus, Building2 } from "lucide-react"

interface PredictionResults {
  burnout_risk: number
  long_covid_risk: number
  extended_leave_risk: number
}

export function RiskPredictorForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<PredictionResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [age, setAge] = useState(35)
  const [jobRole, setJobRole] = useState("0")
  const [sex, setSex] = useState("0")
  const [smoker, setSmoker] = useState("0")
  const [hta, setHta] = useState("0")
  const [cardiovascular, setCardiovascular] = useState("0")
  const [diabetes, setDiabetes] = useState("0")
  const [spinal, setSpinal] = useState("0")
  const [musculoskeletal, setMusculoskeletal] = useState("0")
  const [thyroid, setThyroid] = useState("0")
  const [pulmonary, setPulmonary] = useState("0")
  const [obesity, setObesity] = useState("0")
  const [cancer, setCancer] = useState("0")
  const [timeInHospital, setTimeInHospital] = useState(0)

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    const features = {
      "Age": age,
      "Job Role": parseInt(jobRole),
      "Sex": parseInt(sex),
      "Smoker": parseInt(smoker),
      "HTA": parseInt(hta),
      "Other Cardiovascular Diseases": parseInt(cardiovascular),
      "Diabetes": parseInt(diabetes),
      "Spinal Conditions": parseInt(spinal),
      "Other Musculoskeletal Conditions": parseInt(musculoskeletal),
      "Thyroid Conditions": parseInt(thyroid),
      "Pulmonary Conditions": parseInt(pulmonary),
      "Obesity": parseInt(obesity),
      "Cancer History": parseInt(cancer),
      "Time in Hospital": timeInHospital,
    }

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features }),
      })

      if (!response.ok) {
        throw new Error("Failed to get predictions")
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">Input Your Information</span>
          </CardTitle>
          <CardDescription>
            Enter your medical and occupational profile to calculate risk scores
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Age Slider */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="age">Age: {age}</Label>
            <Slider
              id="age"
              min={18}
              max={70}
              step={1}
              value={[age]}
              onValueChange={(value) => setAge(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>18</span>
              <span>70</span>
            </div>
          </div>

          {/* Job Role */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="jobRole">Job Role Group (Ordinal 0-5)</Label>
            <Select value={jobRole} onValueChange={setJobRole}>
              <SelectTrigger id="jobRole" className="w-full">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Group 0</SelectItem>
                <SelectItem value="1">Group 1</SelectItem>
                <SelectItem value="2">Group 2</SelectItem>
                <SelectItem value="3">Group 3</SelectItem>
                <SelectItem value="4">Group 4</SelectItem>
                <SelectItem value="5">Group 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sex */}
          <div className="flex flex-col gap-3">
            <Label>Sex</Label>
            <RadioGroup value={sex} onValueChange={setSex} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="0" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="1" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Smoking Status */}
          <div className="flex flex-col gap-3">
            <Label>Smoking Status</Label>
            <RadioGroup value={smoker} onValueChange={setSmoker} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="0" id="nonSmoker" />
                <Label htmlFor="nonSmoker" className="font-normal cursor-pointer">Non smoker</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="1" id="smokerYes" />
                <Label htmlFor="smokerYes" className="font-normal cursor-pointer">Smoker</Label>
              </div>
            </RadioGroup>
          </div>

          {/* HTA */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="hta">HTA (0-3)</Label>
            <Select value={hta} onValueChange={setHta}>
              <SelectTrigger id="hta" className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Level 0</SelectItem>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Other Cardiovascular */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cardiovascular">Other Cardiovascular (0-3)</Label>
            <Select value={cardiovascular} onValueChange={setCardiovascular}>
              <SelectTrigger id="cardiovascular" className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Level 0</SelectItem>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Diabetes Status */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="diabetes">Diabetes Status</Label>
            <Select value={diabetes} onValueChange={setDiabetes}>
              <SelectTrigger id="diabetes" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="1">Prediabetes</SelectItem>
                <SelectItem value="2">Type 2</SelectItem>
                <SelectItem value="3">Type 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Spinal Conditions */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="spinal">Spinal Conditions</Label>
            <Select value={spinal} onValueChange={setSpinal}>
              <SelectTrigger id="spinal" className="w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="1">Moderate</SelectItem>
                <SelectItem value="2">Severe/surgical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Other Musculoskeletal */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="musculoskeletal">Other Musculoskeletal</Label>
            <Select value={musculoskeletal} onValueChange={setMusculoskeletal}>
              <SelectTrigger id="musculoskeletal" className="w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="1">Localized</SelectItem>
                <SelectItem value="2">Systemic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Thyroid Conditions */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="thyroid">Thyroid Conditions</Label>
            <Select value={thyroid} onValueChange={setThyroid}>
              <SelectTrigger id="thyroid" className="w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="1">Functional</SelectItem>
                <SelectItem value="2">Structural/Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pulmonary Conditions */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="pulmonary">Pulmonary Conditions</Label>
            <Select value={pulmonary} onValueChange={setPulmonary}>
              <SelectTrigger id="pulmonary" className="w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="1">Mild-Moderate</SelectItem>
                <SelectItem value="2">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Obesity */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="obesity">Obesity</Label>
            <Select value={obesity} onValueChange={setObesity}>
              <SelectTrigger id="obesity" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Normal</SelectItem>
                <SelectItem value="1">Overweight</SelectItem>
                <SelectItem value="2">Obese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cancer History */}
          <div className="flex flex-col gap-3">
            <Label>Cancer History</Label>
            <RadioGroup value={cancer} onValueChange={setCancer} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="0" id="cancerNo" />
                <Label htmlFor="cancerNo" className="font-normal cursor-pointer">No</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="1" id="cancerYes" />
                <Label htmlFor="cancerYes" className="font-normal cursor-pointer">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Time in Hospital */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="timeInHospital">Time in Hospital (days): {timeInHospital}</Label>
            <Slider
              id="timeInHospital"
              min={0}
              max={60}
              step={1}
              value={[timeInHospital]}
              onValueChange={(value) => setTimeInHospital(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>60</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Button 
        onClick={handleSubmit} 
        disabled={isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculating...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Predict Risk Scores
          </>
        )}
      </Button>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Risk Predictions:</h2>
          
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Burnout Risk - Success/Green */}
            <Card className="border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Brain className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Burnout Risk</p>
                  <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                    {(results.burnout_risk * 100).toFixed(2)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Long COVID Risk - Warning/Amber */}
            <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Virus className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Long COVID Risk</p>
                  <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                    {(results.long_covid_risk * 100).toFixed(2)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Extended Leave Risk - Error/Red */}
            <Card className="border-rose-500 bg-rose-50 dark:bg-rose-950/30">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Building2 className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                  <p className="text-sm font-medium text-rose-700 dark:text-rose-300">Extended Leave Risk</p>
                  <p className="text-2xl font-bold text-rose-800 dark:text-rose-200">
                    {(results.extended_leave_risk * 100).toFixed(2)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-2">
            These scores represent the model-estimated probability of each occupational health outcome.
          </p>
        </div>
      )}
    </div>
  )
}
