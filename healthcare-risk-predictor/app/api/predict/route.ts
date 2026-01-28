import { NextResponse } from "next/server"

/**
 * Mock prediction API for v0 preview testing.
 * 
 * This generates realistic-looking risk scores based on the input features.
 * When deployed to Vercel with Python runtime, replace this with the 
 * Python API at /api/predict/route.py that loads the actual ML models.
 * 
 * For production: Remove this file and ensure the Python API is properly configured.
 */

interface Features {
  Age?: number
  "Job Role"?: number
  Sex?: number
  Smoker?: number
  HTA?: number
  "Other Cardiovascular Diseases"?: number
  Diabetes?: number
  "Spinal Conditions"?: number
  "Other Musculoskeletal Conditions"?: number
  "Thyroid Conditions"?: number
  "Pulmonary Conditions"?: number
  Obesity?: number
  "Cancer History"?: number
  "Time in Hospital"?: number
}

function calculateMockRisks(features: Features) {
  // Extract features with defaults
  const age = features.Age ?? 35
  const jobRole = features["Job Role"] ?? 0
  const smoker = features.Smoker ?? 0
  const hta = features.HTA ?? 0
  const cardiovascular = features["Other Cardiovascular Diseases"] ?? 0
  const diabetes = features.Diabetes ?? 0
  const spinal = features["Spinal Conditions"] ?? 0
  const musculoskeletal = features["Other Musculoskeletal Conditions"] ?? 0
  const thyroid = features["Thyroid Conditions"] ?? 0
  const pulmonary = features["Pulmonary Conditions"] ?? 0
  const obesity = features.Obesity ?? 0
  const cancer = features["Cancer History"] ?? 0
  const timeInHospital = features["Time in Hospital"] ?? 0

  // Calculate base risks with weighted factors (mock algorithm)
  // These weights are illustrative and don't represent real medical predictions
  
  // Burnout risk: influenced by job stress factors and time
  let burnoutBase = 0.15
  burnoutBase += (age - 35) * 0.003
  burnoutBase += jobRole * 0.04
  burnoutBase += smoker * 0.08
  burnoutBase += timeInHospital * 0.005
  burnoutBase += spinal * 0.05
  burnoutBase += musculoskeletal * 0.04
  
  // Long COVID risk: influenced by respiratory and cardiovascular factors
  let covidBase = 0.10
  covidBase += (age - 35) * 0.004
  covidBase += smoker * 0.12
  covidBase += cardiovascular * 0.08
  covidBase += pulmonary * 0.10
  covidBase += obesity * 0.06
  covidBase += diabetes * 0.05
  
  // Extended leave risk: combination of multiple health factors
  let leaveBase = 0.12
  leaveBase += (age - 35) * 0.005
  leaveBase += hta * 0.06
  leaveBase += cardiovascular * 0.07
  leaveBase += diabetes * 0.06
  leaveBase += spinal * 0.08
  leaveBase += musculoskeletal * 0.06
  leaveBase += thyroid * 0.04
  leaveBase += pulmonary * 0.07
  leaveBase += obesity * 0.05
  leaveBase += cancer * 0.15
  leaveBase += timeInHospital * 0.008

  // Clamp values between 0 and 1
  const clamp = (val: number) => Math.max(0, Math.min(1, val))

  return {
    burnout_risk: clamp(burnoutBase),
    long_covid_risk: clamp(covidBase),
    extended_leave_risk: clamp(leaveBase),
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const features = body.features as Features

    if (!features) {
      return NextResponse.json(
        { error: "Features object is required" },
        { status: 400 }
      )
    }

    const predictions = calculateMockRisks(features)

    return NextResponse.json(predictions)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json(
      { error: "Failed to process prediction request" },
      { status: 500 }
    )
  }
}
