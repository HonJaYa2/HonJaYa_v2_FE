import { useState, useEffect, ChangeEvent, WheelEvent } from 'react';

interface CustomNumberInputProps {
    id: string;
    name: string;
    initialValue: number;
    unit: string;
    value: number;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({ id, name, initialValue, unit, value, onChange }) => {
    const [internalValue, setInternalValue] = useState(initialValue);

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        const newValue = event.deltaY < 0 ? internalValue + 1 : internalValue - 1;
        setInternalValue(newValue);
        const inputEvent = {
            target: {
                name: name,
                value: newValue.toString(),
            }
        } as ChangeEvent<HTMLInputElement>;
        onChange(inputEvent);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        setInternalValue(newValue);
        onChange(event);
    };

    return (
        <div className="relative text-center" onWheel={handleWheel}>
            <div className="flex justify-center items-center top-0 left-0 right-0 h-full">
                <span className="text-gray-300">{internalValue - 1}</span>
            </div>
            <input
                type="number"
                id={id}
                name={name}
                value={internalValue}
                onChange={handleChange}
                className="text-center text-xl w-24 border-b-2 border-black focus:outline-none focus:border-red-400"
            />
            <div className="absolute w-full flex justify-center items-center top-0 left-0 right-0 h-full mt-10">
                <span className="text-gray-300">{internalValue + 1}</span>
            </div>
            <span className="bottom-0 left-0 right-0 text-xl">{unit}</span>
        </div>
    );
};

export default CustomNumberInput;
