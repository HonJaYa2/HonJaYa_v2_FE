// src/components/EmojiPicker.tsx
import React from 'react';

interface EmojiPickerProps {
    onSelectEmoji: (emoji: string) => void;
}

const emojis = ["😀", "😂", "😍", "😭", "😡", "👍", "🙏", "💪", "👏", "🎉"];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji }) => {
    return (
        <div className="grid grid-cols-5 gap-2 p-2 border rounded shadow-lg bg-white">
            {emojis.map((emoji) => (
                <button
                    key={emoji}
                    onClick={() => onSelectEmoji(emoji)}
                    className="text-2xl"
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};

export default EmojiPicker;
