import { RiskPredictorForm } from "@/components/risk-predictor-form"
import { Building2 } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Healthcare Worker Risk Predictor
            </h1>
          </div>
          <p className="text-muted-foreground text-pretty max-w-xl mx-auto">
            This app predicts Burnout, Long COVID, and Extended Sick Leave risks 
            based on your medical and occupational profile.
          </p>
        </header>

        <RiskPredictorForm />
      </div>
    </main>
  )
}
