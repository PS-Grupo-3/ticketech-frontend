import { useState } from "react";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2CategoryTypeStatus from "./Step2CategoryTypeStatus";
import Step3SelectVenue from "./Step3SelectVenue";
import Step4Review from "./Step4Review";
import Step5ConfigureSectors from "./Step5ConfigureSectors";
import { useNavigate } from "react-router-dom";

const steps = [
  "Información básica",
  "Categoría, tipo y estado",
  "Seleccionar venue",
  "Revisión final",
  "Configurar sectores"
];

export default function CreateEventWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<any>({
    name: "",
    description: "",
    time: "",
    address: "",
    bannerImageUrl: "",
    thumbnailUrl: "",
    themeColor: "",
    categoryId: null,
    typeId: null,
    statusId: 1,
    venueId: null,
  });

  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const goNext = (data: any) => {
    console.log("CreateEventWizard received:", data);
    setForm((prev: any) => {
      const updated = { ...prev, ...data };
      console.log("CreateEventWizard updated form:", updated);
      return updated;
    });
    setStep((prev) => prev + 1);
  };

  const goBack = () => setStep((prev) => prev - 1);

  const goToEventList = () => navigate("/event");

  return (
    <div className="max-w-4xl mx-auto">

      {/* Stepper */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">
          Paso {step} de {steps.length}
        </p>
        <div className="flex items-center gap-2">
          {steps.map((label, index) => {
            const current = index + 1;
            const isActive = current === step;
            const isDone = current < step;

            return (
              <div key={label} className="flex-1 flex items-center gap-2">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    isDone
                      ? "bg-green-600 text-white"
                      : isActive
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-700 text-gray-300",
                  ].join(" ")}
                >
                  {current}
                </div>
                <span className="text-xs text-gray-300 hidden sm:block">
                  {label}
                </span>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-[1px] bg-neutral-700" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
        {step === 1 && (
          <Step1BasicInfo data={form} onNext={goNext} onBack={goToEventList} />
        )}
        {step === 2 && (
          <Step2CategoryTypeStatus data={form} onNext={goNext} onBack={goBack} />
        )}
        {step === 3 && (
          <Step3SelectVenue data={form} onNext={goNext} onBack={goBack} />
        )}
        {step === 4 && (
          <Step4Review
            data={form}
            onBack={goBack}
            onCreated={(id: string) => {
              setCreatedEventId(id);
              setStep(5);
            }}
          />
        )}
        {step === 5 && (
          <Step5ConfigureSectors eventId={createdEventId} onBack={goBack} />
        )}
      </div>
    </div>
  );
}
