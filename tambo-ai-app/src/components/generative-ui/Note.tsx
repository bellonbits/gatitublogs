import React from 'react';
import { withTamboInteractable, type TamboComponent } from '@tambo-ai/react';
import { z } from 'zod';
import { StickyNote } from 'lucide-react';

interface NoteProps {
    title: string;
    content: string;
    color?: 'white' | 'yellow' | 'blue' | 'green';
}

const Note: React.FC<NoteProps> = ({ title, content, color = 'yellow' }) => {
    const colorClasses = {
        white: 'bg-white text-gray-900',
        yellow: 'bg-yellow-100 text-yellow-900',
        blue: 'bg-blue-100 text-blue-900',
        green: 'bg-green-100 text-green-900',
    };

    return (
        <div className={`p-6 rounded-2xl shadow-xl border border-black/5 max-w-sm mt-4 animate-float ${colorClasses[color]}`}>
            <div className="flex items-center space-x-2 mb-4">
                <StickyNote className="w-5 h-5 opacity-70" />
                <h3 className="font-bold text-lg leading-tight">{title}</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">{content}</p>
        </div>
    );
};

export const InteractableNote = withTamboInteractable(Note, {
    componentName: "Note",
    description: "A persistent note for tracking tasks, ideas, or summaries.",
    propsSchema: z.object({
        title: z.string(),
        content: z.string(),
        color: z.enum(["white", "yellow", "blue", "green"]).optional(),
    }),
});
