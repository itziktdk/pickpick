'use client';

const steps = [
  { key: 'offered', label: 'הוצע', icon: '📋' },
  { key: 'approved', label: 'אושר', icon: '✅' },
  { key: 'collected', label: 'נאסף', icon: '📦' },
  { key: 'on_way', label: 'בדרך', icon: '🚴' },
  { key: 'delivered', label: 'נמסר', icon: '🎉' },
];

interface DeliveryTrackerProps {
  currentStep: number; // 0-4
  eta?: string;
  delivererName: string;
  delivererPhone?: string;
}

export function DeliveryTracker({ currentStep, eta, delivererName }: DeliveryTrackerProps) {
  return (
    <div dir="rtl" className="bg-gray-800 rounded-2xl p-5 border border-gray-700/50">
      <h3 className="font-bold text-white text-lg mb-5">מעקב משלוח</h3>

      {/* Progress bar */}
      <div className="relative mb-6">
        <div className="absolute top-4 right-4 left-4 h-1 bg-gray-700 rounded-full">
          <div
            className="h-full bg-[#FF6B6B] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="relative flex justify-between">
          {steps.map((step, i) => {
            const done = i <= currentStep;
            const active = i === currentStep;
            return (
              <div key={step.key} className="flex flex-col items-center gap-1.5 z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
                    active
                      ? 'bg-[#FF6B6B] scale-125 shadow-lg shadow-[#FF6B6B]/40'
                      : done
                      ? 'bg-[#FF6B6B]/80'
                      : 'bg-gray-700'
                  }`}
                >
                  {step.icon}
                </div>
                <span className={`text-[10px] font-medium ${done ? 'text-white' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between bg-gray-900/50 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">👤</div>
          <div>
            <p className="text-white text-sm font-semibold">{delivererName}</p>
            <p className="text-gray-500 text-xs">שליח</p>
          </div>
        </div>
        {eta && (
          <div className="text-left">
            <p className="text-[#FF6B6B] font-bold text-sm">{eta}</p>
            <p className="text-gray-500 text-xs">זמן הגעה משוער</p>
          </div>
        )}
      </div>
    </div>
  );
}
