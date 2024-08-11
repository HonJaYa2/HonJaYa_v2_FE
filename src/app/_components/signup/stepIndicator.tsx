interface StepIndicatorProps {
    currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
    return (
        <div className="flex justify-center py-2 mb-10">
            {[1, 2, 3, 4].map((index) => {
                let borderRadiusClass = "";
                let bgColorClass = index <= currentStep ? 'bg-red-300' : 'bg-gray-300';
                if (index === 1) {
                    borderRadiusClass = "rounded-l";
                } else if (index === 4) {
                    borderRadiusClass = "rounded-r";
                }

                return (
                    <div
                        key={index}
                        className={`h-2 w-8 mx-1 ${borderRadiusClass} ${bgColorClass}`}
                    ></div>
                );
            })}
        </div>
    );
};

export default StepIndicator;
