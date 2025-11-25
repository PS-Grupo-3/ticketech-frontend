import { useState } from "react";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2CategoryType from "./Step2CategoryType";
import Step3Review from "./Step3Review";
import { useNavigate } from "react-router-dom";

const steps = [
  "Información básica",
  "Categoría y tipo",
  "Revisión final",
];

export default function UpdateEventWizard({ initialData, eventId }: any) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<any>({
    name: initialData.name,
    description: initialData.description,
    time: initialData.time,
    bannerImageUrl: initialData.bannerImageUrl,
    thumbnailUrl: initialData.thumbnailUrl,
    themeColor: initialData.themeColor,
    categoryId: initialData.categoryId,
    typeId: initialData.typeId,
  });

  const goNext = (data: any) => {
    setForm((prev: any) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const goBack = () => setStep((prev) => prev - 1);

  const goToEventList = () => navigate("/event");

  return (
    <div className="max-w-4xl mx-auto">

      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">
          Paso {step} de {steps.length}
        </p>

        <div className="flex items-center justify-center gap-2">
          {steps.map((label, index) => {
            const current = index + 1;
            const isActive = current === step;
            const isDone = current < step;

            return (
              <div key={label} className="flex items-center gap-2">
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
                  <div className="w-12 h-[1px] bg-neutral-700" />
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
          <Step2CategoryType data={form} onNext={goNext} onBack={goBack} />
        )}

        {step === 3 && (
            <Step3Review
                data={form}
                eventId={eventId}
                onBack={goBack}
                onUpdated={() => {}}
            />
        )}
      </div>
    </div>
  );
}
